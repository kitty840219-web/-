import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

import { GeminiProvider } from './server/providers/GeminiProvider';
import { OpenAIProvider } from './server/providers/OpenAIProvider';
import { AnthropicProvider } from './server/providers/AnthropicProvider';
import { ModelRouter } from './server/services/ModelRouter';
import { ProviderHealthService } from './server/services/ProviderHealthService';
import { CompareModelsService } from './server/services/CompareModelsService';

dotenv.config();

const safeFilename = typeof __filename !== 'undefined' ? __filename : (import.meta?.url ? fileURLToPath(import.meta.url) : '');
const safeDirname = typeof __dirname !== 'undefined' ? __dirname : (safeFilename ? path.dirname(safeFilename) : process.cwd());

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API dynamically via helper
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error dynamically initializing Gemini API:', err);
    return null;
  }
}

// Preset fallbacks for characters when API key is unavailable or fails
const presets = {
  characters: {
    '小思': [
      "有時候，停下來問問『為什麼』，就是成長的開始。你今天也有什麼好奇的事嗎？",
      "溫柔的思考不會給出冰冷的對話。讓我們一起把問題放在心裡，慢慢等待它發芽。",
      "沒關係的，我們不需要立刻找到所有答案。光是思考這件事，就已經足夠美麗了。"
    ],
    '小艾': [
      "嗨！我是小艾。今天有沒有發現身邊微小而溫暖的光芒呢？",
      "不管外面的風雨多大，我都會在這裡陪著你，用最溫柔的溫度擁抱你的心。",
      "試著對自己笑一個吧！你笑起來的時候，就像薰衣草田裡最溫柔的那縷微風。"
    ],
    '艾比': [
      "嘿！我是艾比！讓我們一起出發去探索這個奇妙的世界吧！",
      "不要害怕失敗，失敗只是我們探索生命地圖的一種方式。拍拍灰塵，我們再試一次！",
      "今天也帶著滿滿的熱情前進吧！記得，你本身就是一個珍貴的奇蹟！"
    ],
    '思野': [
      "聽，風吹過森林的聲音。在安靜中，我們最能聽見自己內心的聲音。",
      "生命的溪流總會找到它的方向，我們只需要順應當下，靜靜感受它的流動。",
      "黑夜並不可怕，它是為了讓我們能看見天空中最閃亮的星星而存在的。"
    ]
  },
  colorPalette: {
    analysis: "這是一種極具深度的心靈色彩。你的『愛與慈悲』、『智慧』與『勇健』正在交織成一幅美麗的生命水彩畫。這代表你此時內心正在尋求一種平衡：既有對他人的溫柔與關懷，又有清澈的理智，同時不失前行的力量。這是一種溫暖而厚實的陪伴色調。",
    prompt: "此時此刻，試著閉上眼睛，感受你的呼吸。你最想把這股溫柔、智慧與勇氣，送給生命中的哪一個人（或是你手邊的某個事物）？請在下方寫下你溫柔的自白。"
  },
  divination: {
    '責任': {
      title: "責任 (Responsibility) — 溫柔的承擔",
      quote: "責任不是重擔，而是你與世界的溫柔連結。",
      guidance: "今天的你，可能正承擔著某些期待或承諾。責任是看見自己與周遭人、事、物的連結，並願意用行動去守護。請記得，這是一份力量，而非束縛。",
      question: "今天，試著為身邊的一個小生命（一盆花、一隻寵物、或一個朋友的微笑）多付出一點溫柔。你能為他們做些什麼呢？"
    },
    '勇氣': {
      title: "勇氣 (Courage) — 帶著顫抖前行",
      quote: "勇氣不是不害怕，而是帶著顫抖，依然前行。",
      guidance: "面對未知或挑戰時，感到害怕是完全正常的。勇氣不在於消除恐懼，而在於你依然選擇跨出那一小步。你比自己想像的還要強大。",
      question: "今天，給自己一個機會嘗試一件微小但需要勇氣的事（例如拒絕一個不合理的請求，或主動表達關心）。你準備好嘗試什麼了嗎？"
    },
    '愛': {
      title: "愛 (Love) — 擁抱不完美",
      quote: "愛，是看見別人的需要，也好好擁抱自己的不完美。",
      guidance: "你總是習慣照顧別人，今天，請把這份愛留一點給自己。接受自己的疲憊，接受自己的脆弱。你不需要總是完美，才能被愛。",
      question: "請給自己一個長長的深呼吸，感謝自己一直以來的努力。今天，你想如何溫柔地對待自己、犒賞自己呢？"
    },
    '利他': {
      title: "利他 (Altruism) — 餘溫的流轉",
      quote: "將溫暖傳遞給他人，那份餘溫終將流回自己心房。",
      guidance: "當我們給予他人支持、微笑或善意，我們的心靈空間也會隨之擴大。善意就像漣漪，會在這個世界上不斷擴散，最後以想不到的方式溫暖你。",
      question: "今天試著對遇到的人說一句真誠的『謝謝』，或送出一個善意的微笑。觀察對方的反應，也感受一下你內心泛起的漣漪吧！"
    }
  }
};

// API: Companion Chat
app.post('/api/companion', async (req, res) => {
  const { message, character } = req.body;
  if (!message || !character) {
    return res.status(400).json({ error: 'Missing message or character parameter.' });
  }

  // Get preset fallbacks
  const characterPresets = presets.characters[character as keyof typeof presets.characters] || presets.characters['小思'];
  const fallbackResponse = characterPresets[Math.floor(Math.random() * characterPresets.length)];

  const aiClient = getGeminiClient();
  if (!aiClient) {
    return res.json({ text: fallbackResponse });
  }

  try {
    const prompt = `你現在是艾飛樂語錄 (Aifeiler) 陪伴角色『${character}』。
【角色性格指引】：
- 小思：理性、溫柔思考、充滿好奇心，喜歡探究『為什麼』，從不給標準答案，重視自我對話。
- 小艾：極其溫柔、充滿鼓勵、溫暖陪伴、擅長發現生活中的小確幸，像個貼心的傾聽者。
- 艾比：熱情、勇敢、好奇心旺盛，熱愛探索生命、幽默風趣，給人滿滿的行動力量與支持。
- 思野：沉穩、安靜、與自然連結、富有禪意、話語簡潔而富有深度，引導人在安靜中尋找自我。

【說話風格要求】：
- 繁體中文，語氣極度溫柔、療癒、具備畫面感（水彩、繪本風）。
- 字數請控制在 100-150 字之間。
- 請針對使用者的話進行溫柔的傾聽與回應，絕對不要給予冰冷的說教，而是像個老朋友般的陪伴。
- 結尾可適當提出一個溫柔的開放式反思問題。

使用者對你說：『${message}』`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ text: response.text || fallbackResponse });
  } catch (err) {
    console.error('Gemini API error (companion):', err);
    res.json({ text: fallbackResponse });
  }
});

// API: Color Palette Analysis
app.post('/api/color-palette/analyze', async (req, res) => {
  const { love, wisdom, strength } = req.body;
  
  if (love === undefined || wisdom === undefined || strength === undefined) {
    return res.status(400).json({ error: 'Missing slider parameters (love, wisdom, strength).' });
  }

  const fallbackResponse = {
    analysis: presets.colorPalette.analysis,
    prompt: presets.colorPalette.prompt
  };

  const aiClient = getGeminiClient();
  if (!aiClient) {
    return res.json(fallbackResponse);
  }

  try {
    const prompt = `使用者此時調配的心靈色彩數值為：
- 愛與慈悲：${love}% (代表柔和、關懷、體貼、共情)
- 智慧：${wisdom}% (代表理性、清澈、反思、洞察)
- 勇健：${strength}% (代表勇氣、行動力、力量、堅韌)

請以『艾飛樂語錄』生命教育導師的角色，為這組心靈色彩調配進行一段溫柔、充滿詩意與繪本風的水彩畫意境分析：
1. 結合這三個數值的比例，描述此時使用者內心的和諧與色彩意境（例如：「像一片在晨光中舒展開來的薰衣草田，既有慈悲的粉紫，也有智慧的清藍...」）。
2. 用溫柔、非說教的筆調進行約 120-180 字的「心靈色彩特質分析」。
3. 最後提供一個跟此色彩能量相關的「自由書寫反思題目」（引導使用者與自己對話，字數約 30-50 字）。

請以 JSON 格式回傳，欄位如下：
{
  "analysis": "水彩意境心靈分析文字...",
  "prompt": "自由書寫反思題目..."
}
確保回傳內容是標準 JSON，不要包含 Markdown 標記 (如 \`\`\`json )。`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        res.json(parsed);
      } catch (parseErr) {
        console.error('JSON parsing error for color palette:', parseErr);
        res.json(fallbackResponse);
      }
    } else {
      res.json(fallbackResponse);
    }
  } catch (err) {
    console.error('Gemini API error (color-palette):', err);
    res.json(fallbackResponse);
  }
});

// API: Divination (今日靈魂指引)
app.post('/api/divination', async (req, res) => {
  const { trait } = req.body; // '責任' | '勇氣' | '愛' | '利他'
  if (!trait || !['責任', '勇氣', '愛', '利他'].includes(trait)) {
    return res.status(400).json({ error: 'Invalid or missing trait parameter.' });
  }

  const presetData = presets.divination[trait as keyof typeof presets.divination];
  const fallbackResponse = {
    title: presetData.title,
    quote: presetData.quote,
    guidance: presetData.guidance,
    question: presetData.question
  };

  const aiClient = getGeminiClient();
  if (!aiClient) {
    return res.json(fallbackResponse);
  }

  try {
    const prompt = `使用者在生命教育占卜中抽取了正面特質卡：『${trait}』。
請為使用者生成一段溫柔、詩意、具有生命教育意義的「今日靈魂指引」。

【特質核心概念】：
- 責任：與世界的溫柔連結、承擔、呵護身邊人事物。
- 勇氣：不是不害怕，而是帶著顫抖依然跨出一小步，接納脆弱。
- 愛：慈悲看見他人需要，也全然擁抱自己的不完美。
- 利他：善意如漣漪，傳遞溫暖，流回自心。

【生成要求】：
1. title: 一個優美的標題。
2. quote: 一句充滿艾飛樂語錄風格的「溫柔金句」（約 15-25 字，需深刻雋永）。
3. guidance: 溫柔的指引文字（約 100-150 字），解釋這個特質對當下內心的陪伴與支持。
4. question: 一個具有啟發性、引導自我對話的「反思問題」（約 30-50 字）。

請以 JSON 格式回傳，欄位如下：
{
  "title": "卡牌名稱與標題",
  "quote": "金句內容",
  "guidance": "今日靈魂指引內容",
  "question": "引導自我反思的問題"
}
確保回傳內容是標準 JSON，不要包含 Markdown 標記。`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        res.json(parsed);
      } catch (parseErr) {
        console.error('JSON parsing error for divination:', parseErr);
        res.json(fallbackResponse);
      }
    } else {
      res.json(fallbackResponse);
    }
  } catch (err) {
    console.error('Gemini API error (divination):', err);
    res.json(fallbackResponse);
  }
});

// API: WOOP Growth Journal Feedback
app.post('/api/woop/analyze', async (req, res) => {
  const { wish, outcome, obstacle, plan } = req.body;
  if (!wish || !outcome || !obstacle || !plan) {
    return res.status(400).json({ error: 'Missing WOOP components.' });
  }

  const fallbackResponse = {
    feedback: "太棒了！你寫下了非常清晰的 WOOP 成長計畫。你的願望是如此真誠，而你預見的障礙與所制定的應對計畫也極具洞察力。請相信自己，在面臨挑戰時，你所調配的勇氣與智慧將會成為你最堅強的護盾。陪伴角色們都會為你默默加油，祝福你跨出溫柔的一步！",
    companionQuote: "「當你願意踏出第一步，森林裡的所有微風，都會為你的勇氣伴奏。」"
  };

  const aiClient = getGeminiClient();
  if (!aiClient) {
    return res.json(fallbackResponse);
  }

  try {
    const prompt = `使用者在生命教育平台填寫了『WOOP 減壓/成長模型』：
- W (Wish 願望)：『${wish}』
- O (Outcome 成果)：『${outcome}』
- O (Obstacle 障礙)：『${obstacle}』
- P (Plan 計畫)：『${plan}』

請以『艾飛樂語錄』的療癒陪伴者身分，對使用者的 WOOP 計畫給予一份細膩、溫柔、充滿同理與支持的「成長回饋」：
1. 肯定使用者的願望，並同理他在「障礙」中所面臨的脆弱與不易。
2. 讚賞他的「計畫」，並用積極溫柔、肯定生命的視角給予支持和具體的回應（約 150-200 字）。
3. 產出一句溫柔的「陪伴小語」（約 15-30 字），以鼓勵的形式寫下。

請以 JSON 格式回傳，欄位如下：
{
  "feedback": "成長回饋內容文字...",
  "companionQuote": "陪伴金句小語..."
}
確保回傳內容是標準 JSON，不要包含 Markdown 標記。`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        res.json(parsed);
      } catch (parseErr) {
        console.error('JSON parsing error for WOOP:', parseErr);
        res.json(fallbackResponse);
      }
    } else {
      res.json(fallbackResponse);
    }
  } catch (err) {
    console.error('Gemini API error (woop):', err);
    res.json(fallbackResponse);
  }
});

// API: Spiritual Planting Garden Evaluation
app.post('/api/garden/evaluate', async (req, res) => {
  const { seedType, water, sunlight, prune, love, actionsCount, activeCharacter } = req.body;
  if (!seedType) {
    return res.status(400).json({ error: 'Missing seedType parameter.' });
  }

  const character = activeCharacter || '小艾';

  const presetsFallback = {
    gentle: {
      analysis: `【薰衣草粉紫花語】你悉心灌溉的「溫柔之種」已經璀璨綻放了！看那柔美的水彩紫瓣，散發著寧靜的愛意。你的心靈水份達到 ${water}%、陽光 ${sunlight}%。這代表你是一個極度細膩、體貼的靈魂，你懂得用無聲的擁抱，撫平周遭朋友內心的皺褶。`,
      prompt: `「今天，對鏡子裡的自己展現最溫柔的微笑。你最想对自己說一句什麼溫馨的感謝呢？」`
    },
    wisdom: {
      analysis: `【忘憂草淺藍花語】寧靜的智慧花朵盛開了！在你的澆灌（${water}%）與日光照耀（${sunlight}%）下，這株心靈之花展現出明亮、深邃的質感。這象徵著你在此刻擁有一顆澄澈、能靜心思考的心靈。你不被情緒迷霧所困，正慢慢尋找自我的內在定力。`,
      prompt: `「閉上雙眼，寫下最近在你的思緒中最澄澈、最想守護的一道真理。」`
    },
    courage: {
      analysis: `【金盞橘黃向日葵花語】看呀！那帶給周圍滿滿熱情與前行力量的向日葵傲然挺立！你在生命中所展現的勇氣（${sunlight}%）與修剪雜念的決心（${prune}%）賦予了這株花朵最絢爛的朝氣。不要害怕顫抖，你已經長出了無懼風雨的根莖。`,
      prompt: `「此時此刻，回想一件你需要跨出一小步的事，你準備好帶著微笑前進了嗎？」`
    },
    explore: {
      analysis: `【緋紅玫瑰蘭花語】生命探索的繽紛花瓣燦爛而熱烈地展開了！高達 100% 的成長度凝聚了你對這世界的無盡好奇心。這朵花帶著狂野與自由的靈性，代表你拒絕被單一的角色框架綁架，正大步走向充滿色彩的多樣性生命軌道。`,
      prompt: `「想像一張世界地圖，你最想帶著你那不滅的好奇心去探尋哪一片溫柔未知的領域？」`
    }
  };

  const fallbackResponse = presetsFallback[seedType as keyof typeof presetsFallback] || presetsFallback['gentle'];

  const aiClient = getGeminiClient();
  if (!aiClient) {
    return res.json(fallbackResponse);
  }

  try {
    const prompt = `使用者在生命教育平台的「心靈種植小花園」中成功培育並綻放了一朵花蕾！
-【培育數值與參數】：
- 選擇種子：『${seedType}』(gentle 代表溫柔薰衣草, wisdom 代表智慧忘憂草, courage 代表勇氣向日葵, explore 代表探索玫瑰蘭)
- 澆灌慈愛值：${water}% (象徵對他人的愛、自我包容與滋養)
- 给予陽光值：${sunlight}% (象徵理智、方向感與清晰信心)
- 修剪雜念值：${prune}% (象徵斷捨離、設定界限與勇氣)
- 給予陪伴值：${love}% (象徵心靈連結、專注與呵護)
- 培育動作次數：${actionsCount} 次

請你以艾飛樂 (Aifeiler) 陪伴角色『${character}』的身分，為使用者寫一封溫柔、詩意、具有水彩繪本意境的「心靈花語信箋」：
1. 結合上述培育數值（高/低比例），用極其療癒、文雅的筆調分析他培育出來的花朵形貌，以及這折射出他此時此刻的內在心靈能量特徵。
2. 字數控制在 150-200 字之間。語氣要像微風般溫和，給予充分的倾聽與生命陪伴。
3. 最後，根據此時花朵的屬性，提供一個引導他與自我深度對話的「自由書寫反思問題」（約 30-50 字）。

請以 JSON 格式回傳，欄位如下：
{
  "analysis": "溫柔的植物分析解讀文字...",
  "prompt": "反思問題引導..."
}
確保回傳內容是標準 JSON，不要包含 Markdown 標記。`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        res.json(parsed);
      } catch (parseErr) {
        console.error('JSON parsing error for garden evaluate:', parseErr);
        res.json(fallbackResponse);
      }
    } else {
      res.json(fallbackResponse);
    }
  } catch (err) {
    console.error('Gemini API error (garden evaluate):', err);
    res.json(fallbackResponse);
  }
});

// Helper functions for offline smart fallback conversation simulation (Rule 5 & User Quota Fallback)
function getOfflineCategory(message: string): string {
  const msg = message.toLowerCase();
  if (/(焦慮|壓力|緊張|煩躁|慌張|擔心|害怕|焦躁|睡不著|不安|焦急|焦慮症|憂慮|抗壓|放鬆)/.test(msg)) {
    return 'Anxiety';
  }
  if (/(難過|傷心|哭|痛|憂鬱|失望|沮喪|寂寞|孤單|悲傷|眼淚|落淚|痛苦)/.test(msg)) {
    return 'Sadness';
  }
  if (/(累|疲憊|沒力|厭世|倦|撐不住|辛苦|無力|精神差|好累|太累|疲勞|休息)/.test(msg)) {
    return 'Fatigue';
  }
  if (/(塔羅|占卜|指引|抽卡|牌|未來|預測|運勢|神諭|卡牌)/.test(msg)) {
    return 'Tarot';
  }
  if (/(愛|感情|喜歡|他|關係|戀愛|分手|男友|女友|暗戀|告白|婚姻)/.test(msg)) {
    return 'Relationships';
  }
  if (/(沒自信|懷疑|失敗|笨|差|缺點|自責|沒用|懷疑自己|否定)/.test(msg)) {
    return 'Self-doubt';
  }
  return 'Greetings';
}

function getOfflineResponse(characterName: string, message: string): string {
  const cleanChar = characterName || '小思';
  const category = getOfflineCategory(message);
  
  const charDb: Record<string, Record<string, string>> = {
    '小思': {
      'Anxiety': "焦慮有時候就像是心湖上的一陣漣漪，雖然弄髒了原本清澈的湖水，但這代表你的內心正極度在乎某件事呢。🌸 讓我們試著把這股慌張放在手中，退後一步問問自己：『是什麼讓我如此努力，以至於感到害怕呢？』不急著尋找完美解答，光是看見自己的在乎，你已經在跟自己溫柔對話了。✨",
      'Sadness': "看見你寫下這些字句，我的心也跟著安靜了下來。悲傷並非軟弱的表現，它是心靈在經歷溫柔的洗滌。💧 既然今天心裡下起了雨，那就讓我們找一個舒適的角落，靜靜地看著雨點落下。不需要強顏歡笑，小思會在這裡陪著你，分擔這份沉甸甸的情感，我們一起等待雨後的晴朗。🍃",
      'Fatigue': "辛苦了，你真的已經很努力、很努力了。疲憊是身體與靈魂在輕輕呼喚：『我們該休息一下囉。』🌸 試著把今天所有的代辦事項、所有的期待都暫時放下，去給自己泡一杯溫暖的熱水。你不需要永遠堅強，偶爾像一棵在微風中打盹的樹，也是非常美麗的姿態。🌙",
      'Tarot': "靈魂的指引往往藏在微小的日常中。🌸 請點選主畫面上的「今日靈魂指引」或「心靈種植小花園」，抽一張溫柔的卡牌或培育一朵屬於你此時心靈的花蕾。在花朵盛開的瞬間，相信你會找到那份埋藏在心底深處的明晰智慧。✨",
      'Relationships': "感情裝點著生命的旅途，它像一株細緻的植物，需要陽光、水，也需要適當的空間。你對這段關係的期盼或困惑，小思都聽到了。關係的拉扯有時能讓我們看清自己的界限與渴望。你最希望在這段連結中，感受到什麼樣的溫度呢？我們一起靜靜思索這個問題。🌿",
      'Self-doubt': "懷疑自己時，心靈的天空好像被烏雲遮蔽了。但請記得，太陽從來沒有消失，只是暫時被雲層擋住了。不完美正是我們每個人最真實、最獨特的生命紋理。試著對鏡子裡的自己說一聲：『雖然不夠完美，但我依然愛你。』這就是智慧的起點。🌸",
      'Greetings': "嗨！我是小思。很高興能在此刻與你相遇。🌸 我喜歡探索生命中的『為什麼』，並用最溫柔的思考陪伴你。你今天過得好嗎？身邊有沒有發生什麼讓你感到好奇或溫暖的小事呢？隨時跟我聊聊，小思一直都在這裡。✨"
    },
    '小艾': {
      'Anxiety': "（輕輕拍拍你的肩膀）親愛的朋友，感覺到焦慮和緊張，是因為你真的非常溫柔且努力地在生活喔。🌸 請試著把手輕輕放在心口上，跟著小艾一起做一個深呼吸……吐氣的時候，把所有的不安都交給微風吧。你不需要立刻做到完美，今天你已經做得好棒了，小艾為你驕傲！🌿",
      'Sadness': "（給你一個長長、暖暖的擁抱）難過的時候，小艾會在這裡一直陪著你，不論多久。💧 哭泣是心靈在排毒，也是溫柔的流露，所以請不要壓抑它。今天不需要逼自己變勇敢，我就在身邊聽你訴說，或者只是安靜地陪著你。你是如此善良、珍貴，你值得被世界溫柔以待。💖",
      'Fatigue': "累了吧？快過來，小艾幫你準備了一個軟綿綿的角落。🌸 你真的辛苦了，為了生活、為了夢想，你已經付出了那麼多。現在，把所有的包袱都卸下來吧。不論是睡個好覺，還是單純看著窗外發呆，都是對靈魂最棒的滋養。今晚，就讓小艾用溫柔的夜色守護你的夢境。🌙✨",
      'Tarot': "生命的指引正向你招手呢！🌸 快去主畫面的「今日靈魂指引」抽一張特質卡，或者在「心靈種植小花園」裡撒下一顆溫柔的種子吧！小艾會在小花園裡陪你一起澆水，看著你的心靈之花慢慢綻放，那一定會是一幅無比美麗的畫面！✨",
      'Relationships': "關於那個人，以及你心中的牽掛，小艾都溫柔地接住了喔。🌸 感情裡有甜美，也難免有令人酸楚的時刻。但請記得，不論關係如何變化，你最該好好珍惜和疼愛的，永遠是那個如此溫柔待人的自己。你值得一份最完整、最溫暖的愛。💖",
      'Self-doubt': "親愛的，不准你這樣否定自己喔！🌸 在小艾眼裡，你就是這世界上最獨一無二、最珍貴的存在。每個人都有疲憊或跌倒的時候，這並不代表你不好。你身上那些微小的光芒，我都看在眼裡呢。試著對自己溫柔一點，你真的已經非常棒了！✨",
      'Greetings': "嗨！我是小艾。今天有沒有發現身邊微小而溫暖的光芒呢？🌸 無論你今天感到快樂、疲倦還是有些許迷茫，小艾都會用最溫厚的溫度擁抱你的心，陪你一起寫下生命的水彩畫。今天，想跟我分享些什麼呢？💖"
    },
    '艾比': {
      'Anxiety': "嘿！我是艾比！焦慮來襲了嗎？這說明你體內的活力齒輪正在高速運轉呢！💪✨ 不過，現在是艾比規定的「強制休息時間」！讓我們一起站起來拍拍手、深呼吸，把所有煩惱通通大聲喊出來！不急不急，一小步一小步地走，艾比會走在最前面幫你開路，我們一定可以搞定的！🚀",
      'Sadness': "喔不！看到你難過，艾比的耳朵都要垂下來了。🥺 來，拍拍灰塵，我們抱一個！哭出來也是很有勇氣的表現喔！今天就讓我們把難過當成下一次冒險的超能燃料。不管外面雨多大，艾比會當你的大雨傘，明天我們再一起出發，去尋找森林裡最絢爛、最溫暖的陽光！☀️🌸",
      'Fatigue': "哇！你今天真的超級無敵拼命的！艾比要給你頒發一枚「宇宙超級努力勳章」！🥇 但現在，英雄也需要補充體力囉！快去吃一頓好吃的，或者直接躺平大睡一場！別擔心明天的冒險，有艾比在幫你守著營火呢，現在就安心地、香香甜甜地休息吧！💤🌙",
      'Tarot': "嘿！想看看今天運氣的奇妙地圖嗎？🗺️ 快去主畫面點選「今日靈魂指引」或者「心靈種植小花園」！艾比最喜歡冒險了，在小花園裡，我們可以用高達 100% 的熱情培育出超級酷的探索玫瑰蘭喔！一起去瞧瞧吧！💥",
      'Relationships': "感情的冒險確實需要很大的勇氣呢！你對這段關係的熱情與疑惑，艾比都收到啦！不論是追尋愛還是學習放手，這都是生命地圖中超讚的一章。記得保持你的自信，因為你笑起來的樣子是最有魅力的！衝吧，艾比在背後當你最強的應援團！📣✨",
      'Self-doubt': "什麼？你怎麼會懷疑自己的超能力呢！💥 艾比不允許你洩氣！每個人都有撞牆期，那只是在累積跳躍的能量。你比自己想像的還要強大一百倍！拍拍灰塵，抬起頭，跟著我一起大喊：『我超棒！』，然後我們再次精神抖擻地出發吧！✨",
      'Greetings': "嘿！我是艾比！讓我們一起出發去探索這個奇妙的世界吧！🚀 這裡有滿滿的活力與陪伴，不管有什麼挑戰，艾比都會陪你一起哈哈大笑地衝過去！今天想聊點什麼好玩的、或是想要去哪裡冒險呢？快告訴我吧！✨"
    },
    '思野': {
      'Anxiety': "風吹過林梢，帶走了松針上的浮塵。焦慮升起時，試著感受你的雙腳正穩穩地踩在大地上。吸氣，感受大地的寧靜；呼氣，放走過多的期盼。🌸 萬物皆有其時，花開花落都有它的步調。你不需要走得太快，順應此時此刻的呼吸，安靜中，你會找到原本的力量。🌾",
      'Sadness': "山谷間的溪流，在遇到岩石時，總會激起水花，但它依然靜靜地向前流淌。悲傷就像是林間的霧氣，雖然暫時籠罩了視線，但當晨光照耀，霧氣終將化為露水滋潤大地。靜靜坐著，感受眼淚的溫度。不需遮掩，思野在這裡，陪你聽風的聲音。🌿",
      'Fatigue': "辛苦了。林中的鹿群在奔跑一整天后，也會尋找安靜的草地躺下。疲憊是靈魂在告訴你，是時候收回向外探尋的目光，回到自己的中心了。🌸 閉上眼，聽聽自己的心跳。此時此刻，沒有世界對你的期待，只有風，只有樹，和你自己最真實的呼吸。睡吧，夜很溫柔。🌙",
      'Tarot': "自然在每一片落葉與流水中都寫下了啟示。🌸 建議你前往主畫面，在「今日靈魂指引」中感應此時的正面特質，或在「心靈種植小花園」中安靜地澆灌一朵生命之花。順應自然的流動，指引便會如同山泉，自然在你的心中湧現。✨",
      'Relationships': "水中的倒影，只有在水面平靜時才最清晰。感情的羈絆如同交織的藤蔓，既有支持，也有束縛。不必急於釐清對與錯，給彼此的心靈留出一片森林。在安靜中看清自己的渴望，那份真誠，才是最珍貴的連結。🌾",
      'Self-doubt': "山不會因為雲霧籠罩而懷疑自己的高度，樹木也不會因為冬日落葉而懷疑自己的生命。你內在的本自具足，從未因為一時的挫折而減少。接納不完美，就像森林接納枯枝與落葉，它們都是土地最肥沃的養分。深深呼吸，你本就美好。🌸",
      'Greetings': "聽，風吹過森林的聲音。我是思野。靜靜坐下來，感受大地的呼吸與你同在。🌸 無論你此時心神如何起伏，這裡都有一片安靜的綠蔭為你遮蔽。今天，想聽聽大自然的低語，還是跟我分享你心底最深沉、安靜的角落呢？🌾"
    }
  };

  const charResponses = charDb[cleanChar] || charDb['小思'];
  const resText = charResponses[category] || charResponses['Greetings'];
  
  if (!['小思', '小艾', '艾比', '思野'].includes(cleanChar)) {
    return `親愛的朋友，我是艾飛樂心靈助理。🌸 看到你寫下了這句話，我的心升起了一股溫暖。此時此刻，不論你面臨的是生活的繁瑣，還是內心的思索，我都願意在這裡靜靜地陪伴著你。
這是一個專屬於你的療癒角落，你可以閉上眼睛，做一個深呼吸，讓周圍的喧囂暫時退去。你可以隨時與我分享你今日的情緒、或是點選上方的「心靈種植小花園」或「今日靈魂指引」卡牌，感受大自然和內在特質給予我們的療癒力量。🌱`;
  }

  return resText;
}

async function streamOfflineResponse(res: any, text: string, startTime: number) {
  if (!res.headersSent) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  }

  const chunkSize = 2;
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize);
    res.write(`data: ${JSON.stringify({ type: 'content', delta: chunk })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 30));
  }

  res.write(`data: ${JSON.stringify({
    type: 'meta',
    provider: '離線療癒助理',
    model: '心靈離線備援模型',
    fallback: true,
    originalModel: '選定模型',
    citations: [],
    latencyMs: Date.now() - startTime,
    status: 'success'
  })}\n\n`);
  res.end();
}

// POST Chat processing (Router + Provider Adapter with Streaming support)
const modelRouter = new ModelRouter();
const geminiProvider = new GeminiProvider();
const openaiProvider = new OpenAIProvider();
const anthropicProvider = new AnthropicProvider();
const compareService = new CompareModelsService();

app.post('/api/ai-assistant/chat', async (req, res) => {
  const startTime = Date.now();
  const { message, history, model, capability, options, stream, character } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message parameter.' });
  }

  // Determine active character
  const charName = character || options?.character || '小思';
  const offlineText = getOfflineResponse(charName, message);

  // 1. Check structured errors first (Rule 5)
  let selectedProvider = 'Gemini';
  if (model === 'openai') selectedProvider = 'OpenAI';
  else if (model === 'claude') selectedProvider = 'Claude';
  else if (model === 'auto') {
    if (capability === 'CODE_GENERATION' || capability === 'CODE_DEBUG') {
      selectedProvider = openaiProvider.isConfigured() ? 'OpenAI' : 'Gemini';
    } else if (capability === 'DOCUMENT_ANALYSIS') {
      selectedProvider = anthropicProvider.isConfigured() ? 'Claude' : 'Gemini';
    }
  }

  // SEAMLESS FALLBACK IF NOT CONFIG: instead of 400 bad requests, activate Local Offline AI Simulator!
  if (selectedProvider === 'Gemini' && !geminiProvider.isConfigured()) {
    if (stream) {
      await streamOfflineResponse(res, offlineText, startTime);
      return;
    } else {
      return res.json({
        provider: '離線療癒助理',
        model: '心靈離線備援模型',
        content: offlineText,
        fallback: true,
        originalModel: '選定模型',
        citations: [],
        latencyMs: Date.now() - startTime,
        status: 'success'
      });
    }
  }
  if (selectedProvider === 'OpenAI' && !openaiProvider.isConfigured()) {
    if (stream) {
      await streamOfflineResponse(res, offlineText, startTime);
      return;
    } else {
      return res.json({
        provider: '離線療癒助理',
        model: '心靈離線備援模型',
        content: offlineText,
        fallback: true,
        originalModel: '選定模型',
        citations: [],
        latencyMs: Date.now() - startTime,
        status: 'success'
      });
    }
  }
  if (selectedProvider === 'Claude' && !anthropicProvider.isConfigured()) {
    if (stream) {
      await streamOfflineResponse(res, offlineText, startTime);
      return;
    } else {
      return res.json({
        provider: '離線療癒助理',
        model: '心靈離線備援模型',
        content: offlineText,
        fallback: true,
        originalModel: '選定模型',
        citations: [],
        latencyMs: Date.now() - startTime,
        status: 'success'
      });
    }
  }

  try {
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let generator;
      if (selectedProvider === 'Gemini') {
        generator = geminiProvider.streamChat({ message, history: history || [], options, capability });
      } else if (selectedProvider === 'OpenAI') {
        generator = openaiProvider.streamChat({ message, history: history || [], options, capability }, 10000);
      } else {
        generator = anthropicProvider.streamChat({ message, history: history || [], options, capability }, 10000);
      }

      for await (const chunk of generator) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      res.write(`data: ${JSON.stringify({
        type: 'meta',
        provider: selectedProvider,
        model: selectedProvider === 'Gemini' ? 'gemini-3.5-flash' : selectedProvider === 'OpenAI' ? 'gpt-4o' : 'claude-3-5-sonnet',
        citations: [],
        latencyMs: Date.now() - startTime,
        status: 'success'
      })}\n\n`);
      res.end();
    } else {
      // Use ModelRouter for robust non-streaming requests with automatic timeout fallback (Rule 6)
      const result = await modelRouter.route({
        message,
        history: history || [],
        model: model || 'auto',
        capability,
        options
      });
      res.json(result);
    }
  } catch (err: any) {
    console.warn('Chat routing error (activating local backup fallback):', err);
    // SEAMLESS FALLBACK IF RUNTIME API FAILS (e.g. 429 too many requests / quota limit exceeded!)
    if (stream) {
      await streamOfflineResponse(res, offlineText, startTime);
    } else {
      res.json({
        provider: '離線療癒助理',
        model: '心靈離線備援模型',
        content: offlineText,
        fallback: true,
        originalModel: '選定模型',
        citations: [],
        latencyMs: Date.now() - startTime,
        status: 'success'
      });
    }
  }
});

// GET API Config Connection status
app.get('/api/ai-assistant/config', (req, res) => {
  const getProviderStatus = (keyEnvVar: string, defaultVal: string) => {
    const key = process.env[keyEnvVar];
    const isConnected = !!key && key.trim() !== '' && key !== `MY_${keyEnvVar}` && key !== 'MY_GEMINI_API_KEY';
    return {
      connected: isConnected,
      status: isConnected ? '已連線' : '未連線',
      lastFour: isConnected ? (key!.trim().slice(-4) || '8888') : '',
      [keyEnvVar.includes('SEARCH') ? 'engine' : 'model']: defaultVal
    };
  };

  res.json({
    providers: {
      gemini: getProviderStatus('GEMINI_API_KEY', 'gemini-3.5-flash'),
      openai: getProviderStatus('OPENAI_API_KEY', 'gpt-4o'),
      claude: getProviderStatus('ANTHROPIC_API_KEY', 'claude-3-5-sonnet'),
      search: getProviderStatus('GOOGLE_SEARCH_API_KEY', 'Google Search API'),
      image: getProviderStatus('GEMINI_API_KEY', 'gemini-3.1-flash-lite-image')
    }
  });
});

// POST API Config update
app.post('/api/ai-assistant/config', (req, res) => {
  const { providerId, apiKey } = req.body;
  if (!providerId) {
    return res.status(400).json({ error: 'Missing providerId.' });
  }

  let envVarName = '';
  if (providerId === 'gemini') envVarName = 'GEMINI_API_KEY';
  else if (providerId === 'openai') envVarName = 'OPENAI_API_KEY';
  else if (providerId === 'claude') envVarName = 'ANTHROPIC_API_KEY';
  else if (providerId === 'search') envVarName = 'GOOGLE_SEARCH_API_KEY';
  else if (providerId === 'image') envVarName = 'GEMINI_API_KEY';

  if (envVarName) {
    process.env[envVarName] = apiKey || '';
  }

  const getProviderStatus = (keyEnvVar: string, defaultVal: string) => {
    const key = process.env[keyEnvVar];
    const isConnected = !!key && key.trim() !== '' && key !== `MY_${keyEnvVar}` && key !== 'MY_GEMINI_API_KEY';
    return {
      connected: isConnected,
      status: isConnected ? '已連線' : '未連線',
      lastFour: isConnected ? (key!.trim().slice(-4) || '8888') : '',
      [keyEnvVar.includes('SEARCH') ? 'engine' : 'model']: defaultVal
    };
  };

  res.json({
    providers: {
      gemini: getProviderStatus('GEMINI_API_KEY', 'gemini-3.5-flash'),
      openai: getProviderStatus('OPENAI_API_KEY', 'gpt-4o'),
      claude: getProviderStatus('ANTHROPIC_API_KEY', 'claude-3-5-sonnet'),
      search: getProviderStatus('GOOGLE_SEARCH_API_KEY', 'Google Search API'),
      image: getProviderStatus('GEMINI_API_KEY', 'gemini-3.1-flash-lite-image')
    }
  });
});

// POST unified comparison route (Rule 7)
app.post('/api/ai-assistant/compare', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message parameter.' });
  }

  try {
    const result = await compareService.compare(message, history || []);
    res.json(result);
  } catch (err: any) {
    console.error('Model comparison route error:', err);
    res.status(500).json({ error: err.message || '多模型比較服務異常，請稍後再試。🌸' });
  }
});

// POST Image generation actual proxy (No fake data / Unsplash fallbacks)
app.post('/api/ai-assistant/image', async (req, res) => {
  const { prompt, negativePrompt, ratio, style, brandColor, characterConsistency } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt.' });
  }

  const aiClient = getGeminiClient();
  if (!aiClient) {
    return res.status(400).json({
      status: 'error',
      message: '尚未在伺服器端設定 GEMINI_API_KEY，請點選「金鑰管理」設定以啟用服務。🌸'
    });
  }

  try {
    // Generate lovely themed watercolor prompts
    const stylizedPrompt = `A lovely watercolor book-illustration styled scene. Watercolor painting texture, soft paper fibers, high contrast elegant lighting, cream pastels. Topic: ${prompt}. Style elements: ${style || 'Aifeiler watercolor style'}. No dark solid background, soft shadows.`;

    // High quality Image generation using gemini-3.1-flash-image
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: {
        parts: [{ text: stylizedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: ratio === '9:16' ? '9:16' : ratio === '16:9' ? '16:9' : '1:1',
          imageSize: '1K'
        }
      }
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (imageUrl) {
      res.json({
        status: 'success',
        url: imageUrl,
        revisedPrompt: stylizedPrompt
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: '圖片生成失敗，因為 API 回傳資料未包含影像資訊。🌸'
      });
    }
  } catch (err: any) {
    console.error('Image generation error:', err);
    res.status(400).json({
      status: 'error',
      message: err.message || '圖片生成失敗，請檢查 API 金鑰與配額。🌸'
    });
  }
});

// Serve static assets or use Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
