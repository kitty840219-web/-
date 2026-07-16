import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TarotDivination from './TarotDivination';
import { IMAGES } from '../assets/images';
import { 
  Brain, 
  Sparkles, 
  Compass, 
  HelpCircle, 
  ChevronRight, 
  Activity, 
  Award, 
  RefreshCw, 
  CheckCircle, 
  Flame, 
  Heart, 
  AlertCircle, 
  ChevronLeft, 
  BookOpen, 
  Smile, 
  TrendingUp, 
  Zap,
  Bot
} from 'lucide-react';

interface CognitiveLabHubProps {
  activeCharacter: string;
  initialTab?: 'psychology' | 'intelligence' | 'divination' | 'gomoku' | 'biochem';
  onBackToLab?: () => void;
}

export default function CognitiveLabHub({ activeCharacter, initialTab = 'psychology', onBackToLab }: CognitiveLabHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<'psychology' | 'intelligence' | 'divination' | 'gomoku' | 'biochem'>(initialTab);

  useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  return (
    <div id="cognitive-lab-hub-wrapper" className="w-full flex flex-col gap-6">
      
      {/* Tab Header Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-[#7C5B8C]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7C5B8C]/12 flex items-center justify-center text-[#7C5B8C]">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-black text-[#4E4158] text-sm md:text-base">身心靈思辨與思維房</h2>
            <p className="text-[10px] text-[#9A8AA6] font-sans mt-0.5">
              結合心理、智能、大眾占卜、和諧五子棋與生物化學知識的整合探索。
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-2xl border border-purple-100/40">
          {[
            { id: 'psychology', label: '🧠 心理測驗', color: 'text-rose-700 bg-rose-50 border-rose-100' },
            { id: 'intelligence', label: '🧩 智能挑戰', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
            { id: 'divination', label: '🔮 大眾占卜', color: 'text-purple-700 bg-purple-50 border-purple-100' },
            { id: 'gomoku', label: '⚪ 禪意五子棋', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
            { id: 'biochem', label: '🧪 生物化學知識', color: 'text-amber-700 bg-amber-50 border-amber-100' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-black transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-white text-[#7C5B8C] shadow-xs scale-102 border border-[#7C5B8C]/15'
                  : 'text-[#9A8AA6] hover:text-[#4E4158] hover:bg-white/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeSubTab === 'psychology' && <PsychologySection />}
            {activeSubTab === 'intelligence' && <IntelligenceSection />}
            {activeSubTab === 'divination' && <TarotDivination />}
            {activeSubTab === 'gomoku' && <GomokuSection />}
            {activeSubTab === 'biochem' && <BiochemSection />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

/* ==========================================================================
   1. PSYCHOLOGY SECTION (心理測驗)
   ========================================================================== */
function PsychologySection() {
  const [step, setStep] = useState<number>(0); // 0: intro, 1-3: questions, 4: result
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);

  const quizQuestions = [
    {
      q: "當你在專注前行或處理事情時，突然有一個突發事件打亂了你原有的完美計劃，你的直覺反應通常是？",
      options: [
        { text: "立刻感到焦慮與自責，反覆思考自己是不是哪裡沒安排周全（自省感性）", val: 5 },
        { text: "迅速冷靜，開始拿出紙筆列出替代方案與應變 SOP（理性分析）", val: 10 },
        { text: "深呼吸，順應變化，告訴自己『這也是最好的安排』，安然處之（禪修豁達）", val: 15 }
      ]
    },
    {
      q: "在人際關係中，當你感到精疲力竭、心靈電量僅剩 10%，卻有親近的人向你強烈尋求情感傾聽與心理安慰時？",
      options: [
        { text: "不忍拒絕，強撐著疲憊的身心去全意傾聽並給予溫暖（慈悲守護）", val: 5 },
        { text: "一邊聆聽一邊試圖理智地剖析對方的困境，提供解決方案好儘快結束（效率理智）", val: 10 },
        { text: "溫柔而堅定地告知目前狀態不佳，婉約延期，拉起健康的邊界保護自己（界線智慧）", val: 15 }
      ]
    },
    {
      q: "當你需要為自己的未來做出重大抉擇，但前方充滿著重重迷霧與不確定性時，你最信賴的導航工具是？",
      options: [
        { text: "內心的感性渴望與直覺，傾聽靈魂深處對愛與溫度的共鳴（靈魂直覺）", val: 5 },
        { text: "客觀的利弊數據分析，通過邏輯推理來評估勝率與最佳解（理性大腦）", val: 10 },
        { text: "自然規律與內心的寧靜，不急不躁，相信萬物皆有其演進的節奏（順應自然）", val: 15 }
      ]
    }
  ];

  const handleAnswer = (val: number) => {
    setAnswers([...answers, quizQuestions[step - 1].options.find(o => o.val === val)?.text || '']);
    setScore(score + val);
    setStep(step + 1);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers([]);
    setScore(0);
  };

  const getArchetype = () => {
    if (score <= 18) {
      return {
        title: "🌸 溫柔守護型 (Heart-Centered Guardian)",
        desc: "你擁有一顆無比溫柔與慈悲的心，總是能敏銳地感知周遭他人的痛苦與需要。在人際賽局中，你寧願燃燒自己也想照亮他人。但請記住，空了的杯子無法倒出溫馨的水。適度立下溫柔的界線，是你對自己最深的體貼。",
        quote: "「愛人之前，也要好好擁抱今天辛苦的自己呀。」"
      };
    } else if (score <= 32) {
      return {
        title: "🧠 理性智多星 (Logic-Driven Thinker)",
        desc: "你是個思維無比清晰、充滿力量的問題解決者。任何混亂的局面在你眼中都可以被歸納與剖析。然而，心靈的委屈與疲憊，有時需要的是「被看見」與「被接納」，而非迅速的理智診斷。在分析之前，先給予一個無聲的擁抱吧。",
        quote: "「理智能釐清眼前的迷霧，但溫暖才能照亮前行的路。」"
      };
    } else {
      return {
        title: "🧘 禪意自洽者 (Zen-Mind Harmonizer)",
        desc: "你擁有著超凡的內在定力與和諧智慧。你懂得物隨心轉、順應自然的道理，不容易被外界的波濤所動搖。你在喧囂的世界裡擁有一座寧靜的花園。繼續保持這份定力，並用你的安詳去溫暖周遭焦慮的人們。",
        quote: "「心若安定，世界便無處不平靜；心若浮躁，哪怕深山亦是塵囂。」"
      };
    }
  };

  return (
    <div className="bg-white/80 p-6 rounded-3xl border border-rose-100 shadow-sm flex flex-col gap-5 min-h-[400px]">
      <div className="flex items-center gap-2 pb-3 border-b border-rose-50">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-100 animate-pulse" />
        <h3 className="font-serif font-black text-sm text-[#4E4158]">心靈電量與性格界線：深度心理測驗</h3>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center gap-4 py-8"
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="max-w-md">
              <h4 className="font-serif font-black text-sm text-[#4E4158]">探索你的「心靈邊界原型」</h4>
              <p className="text-xs text-[#9A8AA6] leading-relaxed mt-2 font-sans">
                這是一份溫柔而深刻的心靈投射問卷。通過 3 道精心設計的情境選擇題，
                分析出你隱藏在社交、壓力和未來抉擇之下的真實思維模型，尋找重獲心靈能量的良方。
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="bg-rose-500 hover:bg-rose-600 text-white font-serif font-black text-xs py-2.5 px-8 rounded-full shadow-md transition-all cursor-pointer hover:scale-102"
            >
              開始探索內心 ➔
            </button>
          </motion.div>
        )}

        {step >= 1 && step <= 3 && (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 py-3"
          >
            <div className="flex justify-between items-center text-[10px] text-[#9A8AA6] font-bold font-sans">
              <span>探索進度：第 {step} / 3 題</span>
              <span className="text-rose-600">CHARACTER TEST</span>
            </div>
            
            <div className="bg-rose-50/30 p-4 rounded-2xl border border-rose-100/40">
              <p className="font-serif font-extrabold text-xs md:text-sm text-[#4E4158] leading-relaxed">
                {quizQuestions[step - 1].q}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {quizQuestions[step - 1].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.val)}
                  className="w-full text-left p-4 rounded-xl border border-rose-100 bg-white hover:bg-rose-50/40 hover:border-rose-300 text-xs font-serif text-[#4E4158] transition-all cursor-pointer shadow-xs active:scale-99"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-5 py-2"
          >
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 bg-rose-100 border border-rose-200 rounded-full flex items-center justify-center text-rose-600">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-rose-500 font-bold tracking-widest uppercase">TEST RESULT</span>
              <h4 className="font-serif font-black text-[#4E4158] text-sm md:text-base">你的心靈思考原型</h4>
            </div>

            <div className="bg-gradient-to-r from-rose-50/40 to-purple-50/30 border border-rose-100/50 rounded-2xl p-5 shadow-xs">
              <h5 className="font-serif font-black text-sm text-rose-800 text-center mb-3">
                {getArchetype().title}
              </h5>
              <p className="text-xs text-[#4E4158]/95 leading-relaxed font-sans text-justify bg-white/80 p-4 rounded-xl border border-rose-100/30">
                {getArchetype().desc}
              </p>

              <div className="mt-4 p-3.5 rounded-xl bg-rose-50/40 border-l-4 border-rose-400 text-center">
                <p className="font-serif text-xs italic text-rose-900 font-extrabold">
                  {getArchetype().quote}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={resetQuiz}
                className="bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200 font-serif text-xs font-bold py-2 px-6 rounded-full transition-all cursor-pointer"
              >
                重新施測
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   2. INTELLIGENCE SECTION (智能測驗)
   ========================================================================== */
function IntelligenceSection() {
  const [activeTask, setActiveTask] = useState<number>(0); // 0: intro, 1: math logic, 2: space logic, 3: word logic, 4: score
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isVerified, setIsVerified] = useState<Record<number, boolean>>({});
  const [wrongAttempts, setWrongAttempts] = useState<Record<number, number>>({});
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const puzzles = [
    {
      id: 1,
      title: "🧩 謎題 01：數值傳遞規律 (Number Sequence)",
      desc: "觀察以下數值遞進公式：[ 3 ➔ 7 ➔ 15 ➔ 31 ➔ 63 ➔ ? ]。請推導出下一個蘊含著無限生命幾何遞增規律的數值是什麼？",
      placeholder: "請輸入阿拉伯數字",
      correct: "127",
      tip: "提示：前一個數乘以 2 再加 1 (X * 2 + 1)。小思在一旁推了推眼鏡說：『這是典型的 2^n - 1 級數呢！』",
      explain: "公式是：3*2+1=7, 7*2+1=15, ..., 63*2+1=127。思維在規律中找到了秩序的平靜。"
    },
    {
      id: 2,
      title: "🧩 謎題 02：天平的平衡重量 (Logic Scale)",
      desc: "在一座心靈天平上，[ 2 朵小艾薰衣草 ] 與 [ 3 顆小思智慧石 ] 重量相同；[ 1 顆小思智慧石 ] 與 [ 4 片思野落葉 ] 重量也相同。請問，[ 1 朵小艾薰衣草 ] 重量相當於多少片 [ 思野落葉 ]？",
      placeholder: "請輸入阿拉伯數字",
      correct: "6",
      tip: "提示：用代數換算。2 朵 = 3 智慧石。1 智慧石 = 4 落葉。所以 2 朵 = 3 * 4 = 12 落葉。那 1 朵等於幾片？",
      explain: "1 朵 = 6 片落葉。萬物皆有重量，理智的換算帶給我們確定的安穩。"
    },
    {
      id: 3,
      title: "🧩 謎題 03：空間幾何立方體 (Spatial Vision)",
      desc: "若一個立方體紙盒有六個面，分別標記為 A, B, C, D, E, F。已知：A 與 B 相鄰，C 與 D 相鄰，E 與 F 相鄰。且 E 的對立面是 A。請問 B 的對立面一定是哪一個字母？",
      placeholder: "請輸入大寫英文字母",
      correct: "F",
      tip: "提示：因為 A 對立面是 E。立方體對立面共有三對。如果 C 與 D 相鄰，表示 C 與 D 不是對立面。那誰和誰對立呢？",
      explain: "B 的對立面是 F。空間立體感是一面理性的明鏡，能幫我們跳脫平面思維的局限。"
    }
  ];

  const handleVerify = (id: number, ans: string) => {
    const cleaned = ans.trim();
    const puzzle = puzzles.find(p => p.id === id);
    if (!puzzle) return;

    if (cleaned.toUpperCase() === puzzle.correct.toUpperCase()) {
      setIsVerified({ ...isVerified, [id]: true });
      setFeedbackMsg("🌸 小艾拍手驚呼：『天啊！你太聰明了！智慧光芒照亮了整個房間！』");
    } else {
      const attempts = (wrongAttempts[id] || 0) + 1;
      setWrongAttempts({ ...wrongAttempts, [id]: attempts });
      if (attempts >= 2) {
        setFeedbackMsg(`💡 小思溫柔提醒：『差一點點！不妨看看下方的提示條，再靜心算算看喔。』`);
      } else {
        setFeedbackMsg("🧠 小思蹙眉沉思：『答案好像不太對喔，再檢查一下推理過程吧。』");
      }
    }
  };

  const currentPuzzle = puzzles[activeTask - 1];

  return (
    <div className="bg-white/80 p-6 rounded-3xl border border-indigo-100 shadow-sm flex flex-col gap-5 min-h-[400px]">
      <div className="flex items-center gap-2 pb-3 border-b border-indigo-50">
        <Brain className="w-5 h-5 text-indigo-500 fill-indigo-100" />
        <h3 className="font-serif font-black text-sm text-[#4E4158]">理智與邏輯：思維智能挑戰挑戰</h3>
      </div>

      <AnimatePresence mode="wait">
        {activeTask === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center gap-4 py-8"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
              <Bot className="w-8 h-8 animate-bounce" />
            </div>
            <div className="max-w-md">
              <h4 className="font-serif font-black text-sm text-[#4E4158]">鍛鍊理性核心：小思的思維工坊</h4>
              <p className="text-xs text-[#9A8AA6] leading-relaxed mt-2 font-sans">
                這裡有 3 個涵蓋數值邏輯、代數轉換與空間幾何的智能思維挑戰。
                在縝密的推導與解答過程中，你能舒緩日常焦慮，重拾專注力與理性邏輯。
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTask(1);
                setFeedbackMsg('');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-serif font-black text-xs py-2.5 px-8 rounded-full shadow-md transition-all cursor-pointer hover:scale-102"
            >
              進入思維挑戰 ➔
            </button>
          </motion.div>
        )}

        {activeTask >= 1 && activeTask <= 3 && (
          <motion.div
            key={`p-${activeTask}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 py-1"
          >
            <div className="flex justify-between items-center text-[10px] text-[#9A8AA6] font-bold font-sans">
              <span>進度：第 {activeTask} / 3 題</span>
              <span className="text-indigo-600">INTELLIGENCE CHALLENGE</span>
            </div>

            <div className="bg-indigo-50/20 p-4 rounded-2xl border border-indigo-100/40 flex flex-col gap-2">
              <h5 className="font-serif font-black text-xs text-indigo-900">{currentPuzzle.title}</h5>
              <p className="text-xs text-[#4E4158]/95 leading-relaxed font-sans mt-1">
                {currentPuzzle.desc}
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder={currentPuzzle.placeholder}
                value={answers[activeTask] || ''}
                onChange={(e) => setAnswers({ ...answers, [activeTask]: e.target.value })}
                disabled={isVerified[activeTask]}
                className="flex-1 bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-xs text-[#4E4158] focus:outline-none focus:ring-1 focus:ring-indigo-300 disabled:bg-slate-50 disabled:text-slate-400"
              />
              <button
                onClick={() => handleVerify(currentPuzzle.id, answers[activeTask] || '')}
                disabled={isVerified[activeTask] || !(answers[activeTask] || '').trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white font-serif font-bold text-xs px-5 rounded-xl transition-all cursor-pointer"
              >
                驗證解答
              </button>
            </div>

            {/* Feedback Message */}
            {feedbackMsg && (
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/40 text-[11px] text-[#4E4158] font-sans">
                {feedbackMsg}
              </div>
            )}

            {/* Tip section if failed or wanted */}
            <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100/30 text-[10px] text-amber-800 leading-relaxed font-sans">
              {currentPuzzle.tip}
            </div>

            {isVerified[activeTask] && (
              <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl flex flex-col gap-1.5 mt-1">
                <span className="text-[10px] text-emerald-700 font-bold font-serif flex items-center gap-1">
                  <span>✅ 智慧解析：</span>答對了！
                </span>
                <p className="text-xxs text-emerald-800/90 leading-relaxed font-sans">
                  {currentPuzzle.explain}
                </p>
                
                <button
                  onClick={() => {
                    setFeedbackMsg('');
                    if (activeTask < 3) {
                      setActiveTask(activeTask + 1);
                    } else {
                      setActiveTask(4); // Finished
                    }
                  }}
                  className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-serif text-xs py-1.5 rounded-lg font-black transition-all"
                >
                  {activeTask < 3 ? "前往下一道謎題 ➔" : "檢視挑戰成果 🏆"}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTask === 4 && (
          <motion.div
            key="finish"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-6 gap-4"
          >
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-serif font-black text-sm text-[#4E4158]">恭喜完成思維挑戰！</h4>
              <p className="text-xs text-[#9A8AA6] leading-relaxed max-w-sm mt-1.5 font-sans font-medium">
                太棒了！你用理智拆解了所有謎題。在尋求規律、轉換邏輯與立體構建的思考中，你的靈魂變得更加清晰且有力。
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTask(0);
                setAnswers({});
                setIsVerified({});
                setWrongAttempts({});
                setFeedbackMsg('');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-serif font-black text-xs py-2.5 px-8 rounded-full shadow-md transition-all cursor-pointer hover:scale-102"
            >
              再次挑戰 ➔
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   3. DIVINATION SECTION (大眾占卜) - MOVED TO TarotDivination.tsx
   ========================================================================== */


/* ==========================================================================
   4. GOMOKU SECTION (五子棋)
   ========================================================================== */
function GomokuSection() {
  const BOARD_SIZE = 9; // 9x9 is perfect for visual layout and neat playing
  const [board, setBoard] = useState<(string | null)[][]>(() => 
    Array(9).fill(null).map(() => Array(9).fill(null))
  );
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true); // Player = 'black' (🔴), AI = 'white' (⚪)
  const [winner, setWinner] = useState<string | null>(null);
  const [aiSpeech, setAiSpeech] = useState<string>("「來一盤平靜的落子修行吧。在黑白對弈間，思索生命起落的和諧。」");

  const restartGame = () => {
    setBoard(Array(9).fill(null).map(() => Array(9).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setAiSpeech("「局由棋開，子落無悔。請你先行，我會隨後跟上。🧘」");
  };

  const checkWin = (b: (string | null)[][], row: number, col: number, color: string) => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1]   // diagonal down-left
    ];

    for (const [dr, dc] of directions) {
      let count = 1;

      // Positive direction
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && b[r][c] === color) {
        count++;
        r += dr;
        c += dc;
      }

      // Negative direction
      r = row - dr;
      c = col - dc;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && b[r][c] === color) {
        count++;
        r -= dr;
        c -= dc;
      }

      if (count >= 5) return true;
    }
    return false;
  };

  // AI Move logic
  const makeAIMove = (currentBoard: (string | null)[][]) => {
    // 1. Check if AI can win immediately (4 stones of white)
    // 2. Block player's immediate win (4 stones of black)
    // 3. Otherwise, select random spot or closest spot to center/player
    const freeCells: [number, number][] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!currentBoard[r][c]) freeCells.push([r, c]);
      }
    }

    if (freeCells.length === 0) return;

    // A simple evaluation function to block or score
    let bestMove: [number, number] = freeCells[0];
    let maxScore = -1;

    for (const [r, c] of freeCells) {
      let score = 0;
      // Evaluate AI win
      const tempBoardAI = currentBoard.map(row => [...row]);
      tempBoardAI[r][c] = 'white';
      if (checkWin(tempBoardAI, r, c, 'white')) {
        score += 10000;
      }

      // Evaluate block Player win
      const tempBoardPlayer = currentBoard.map(row => [...row]);
      tempBoardPlayer[r][c] = 'black';
      if (checkWin(tempBoardPlayer, r, c, 'black')) {
        score += 5000;
      }

      // Proximity to center
      const distToCenter = Math.abs(r - 4) + Math.abs(c - 4);
      score += (10 - distToCenter);

      if (score > maxScore) {
        maxScore = score;
        bestMove = [r, c];
      }
    }

    const [aiRow, aiCol] = bestMove;
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[aiRow][aiCol] = 'white';
    setBoard(newBoard);

    const speeches = [
      "「落子，在於平衡。當局勢看似混亂，退一步海闊天空。」",
      "「每一步棋都是一道選擇題，有時進攻不如守護來得溫柔。」",
      "「你看，黑白縱橫，如同我們心中不斷交織的理智與情感。」",
      "「在局促的棋盤上，亦能施展最寬廣的包容與大智慧。🧘」",
      "「不必急著贏，好好享受每一次指尖與落木的輕輕觸碰。」"
    ];
    setAiSpeech(speeches[Math.floor(Math.random() * speeches.length)]);

    if (checkWin(newBoard, aiRow, aiCol, 'white')) {
      setWinner('white');
      setAiSpeech("「棋局已定。這是一場美妙的和諧共舞，你表現得太棒了。🌿」");
    } else {
      setIsPlayerTurn(true);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || !isPlayerTurn || winner) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = 'black';
    setBoard(newBoard);

    if (checkWin(newBoard, row, col, 'black')) {
      setWinner('black');
      setAiSpeech("「精彩絕倫！你的智慧棋路深不可測，我由衷為你的勝利感到歡喜。✨」");
      return;
    }

    setIsPlayerTurn(false);
    setTimeout(() => {
      makeAIMove(newBoard);
    }, 600);
  };

  return (
    <div className="bg-white/80 p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col gap-5 min-h-[400px]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚪</span>
          <h3 className="font-serif font-black text-sm text-[#4E4158]">思野的和諧五子棋 (Gomoku Zen)</h3>
        </div>
        <button
          onClick={restartGame}
          className="text-emerald-700 hover:text-emerald-900 border border-emerald-200/50 hover:bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-serif font-black transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重開棋局
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Interactive Game Board */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-[#FAF7F2] border border-emerald-100/40 rounded-2xl relative">
          
          <div className="grid grid-cols-9 gap-[3px] bg-amber-50/70 p-4 rounded-xl border-2 border-amber-900/15 shadow-inner relative max-w-[280px] w-full">
            {/* Wooden grid line pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,90,43,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(139,90,43,0.06)_1px,transparent_1px)] [background-size:30px_30px] rounded-xl pointer-events-none"></div>

            {board.map((row, rIdx) => 
              row.map((cell, cIdx) => (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  disabled={!!cell || !isPlayerTurn || !!winner}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#FAF5EF] hover:bg-amber-100/60 border border-amber-900/10 flex items-center justify-center relative transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  {/* Grid intersection point */}
                  <div className="absolute w-1.5 h-1.5 bg-amber-800/10 rounded-full"></div>
                  
                  {cell === 'black' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-800 border border-slate-900 shadow-md flex items-center justify-center"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40 absolute top-1 left-1"></div>
                    </motion.div>
                  )}
                  {cell === 'white' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-50 border border-slate-300 shadow-md flex items-center justify-center"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5"></div>
                    </motion.div>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-between items-center w-full max-w-[280px] text-[10px] text-[#9A8AA6] font-sans font-bold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
              我的落子 (黑)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-50 border border-slate-300"></span>
              思野 AI (白)
            </span>
          </div>
        </div>

        {/* Right: AI Conversation & Game Info */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          <div className="bg-emerald-50/20 border border-emerald-100/30 rounded-2xl p-4.5 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-emerald-100/30 pb-2">
              <img
                src={IMAGES.avatarSiye}
                alt="思野"
                className="w-10 h-10 rounded-full object-cover border border-emerald-100"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-serif font-black text-xs text-[#4E4158]">禪修自然導師：思野 🧘</h4>
                <span className="text-[9px] text-[#9A8AA6] font-sans">和你進行一場溫和、安靜的五子棋和諧修行</span>
              </div>
            </div>

            {/* AI Speech Bubble */}
            <div className="bg-white border border-emerald-100/40 rounded-xl p-4 relative min-h-[90px] flex items-center justify-center shadow-xs">
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-emerald-100/40 rotate-45 hidden md:block"></div>
              <p className="font-serif text-xs leading-relaxed text-[#4E4158] italic text-center">
                {aiSpeech}
              </p>
            </div>
          </div>

          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-center flex flex-col gap-2 shadow-xs ${
                winner === 'black'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <h5 className="font-serif font-black text-xs">
                {winner === 'black' ? '🏆 棋局圓滿，你獲勝了！' : '🌿 棋局圓滿，思野獲勝。'}
              </h5>
              <p className="text-[10px] leading-relaxed max-w-xs mx-auto font-sans">
                {winner === 'black' 
                  ? '落子沉穩，攻守有度。黑子的軌跡連成完美的和諧線，恭喜你解鎖了專注大智慧！'
                  : '白子輕輕連成五星，棋局雖完，修行不止。喝口茶，重新出發吧。'}
              </p>
              <button
                onClick={restartGame}
                className="mt-1 bg-[#7C5B8C] hover:bg-[#684a75] text-white font-serif text-xs font-black py-1.5 px-4 rounded-lg cursor-pointer transition-all active:scale-98"
              >
                再來一局 ➔
              </button>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   5. BIOCHEMISTRY SECTION (生物化學、醫療與身心靈知識篇)
   ========================================================================== */
interface BiochemCompound {
  name: string;
  chemical: string;
  icon: string;
  bg: string;
  border: string;
  text: string;
  desc: string;
  role: string;
  medicalTip: string;
  spiritualQuote: string;
  checklist: string[];
}

function BiochemSection() {
  const [activeComp, setActiveComp] = useState<string>('dopamine');
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  const compounds: Record<string, BiochemCompound> = {
    dopamine: {
      name: "Dopamine 多巴胺 🧬",
      chemical: "C₈H₁₁NO₂",
      icon: "⚡",
      bg: "bg-amber-50 text-amber-800 border-amber-100",
      border: "border-amber-200",
      text: "text-amber-700",
      role: "🏆 動力與賞賜系統 (Motivation & Pleasure)",
      desc: "多巴胺是由大腦分泌的傳導物質，是維持我們日常「積極前行、追求目標、體驗成就感」的核心化學燃料。當你完成一項微小的清單、收穫新知時，多巴胺便會分泌，帶給你充沛的喜悅與熱情。",
      medicalTip: "💡 醫學平衡建議：每天曬太陽 15 分鐘，能天然促成多巴胺合成前體。此外，避免成溺於「短影音、高糖飲食」的低廉多巴胺衝擊，應多建立 WOOP 目標或思維推理，以此培養持久、健康的深層多巴胺。",
      spiritualQuote: "「天空越黑，星星越亮。每一步微小的成就，都是夜空裡閃耀的一瓣星光。」",
      checklist: [
        "今天有完成 1 個微小但重要的待辦任務嗎？",
        "有主動學習到任何新鮮、有趣的科學或人文知識嗎？",
        "今天有曬太陽 10-15 分鐘來充電嗎？"
      ]
    },
    serotonin: {
      name: "Serotonin 血清素 🌾",
      chemical: "C₁₀H₁₂N₂O",
      icon: "🧘",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-100",
      border: "border-emerald-200",
      text: "text-emerald-700",
      role: "🌾 平靜與情緒穩定 (Mood Stabilizer & Peace)",
      desc: "血清素是人體自然的「情緒剎車器」與「幸福感穩定劑」。體內血清素充足時，我們的心情會感到踏實、沉靜而愉悅；一旦匱乏，就容易陷入焦慮、易怒、暴飲暴食甚至失眠的循環。",
      medicalTip: "💡 醫學平衡建議：大腦 90% 的血清素是在腸道合成的，多補充含有色胺酸（Tryptophan）的食物如香蕉、鮮乳、堅果、燕麥。搭配規律的有氧慢跑或深慢呼吸，能極大促成大腦血清素水平上升。",
      spiritualQuote: "「喜歡獨處，是我對自己最溫柔的體貼。讓靈魂靜靜打掃落葉，迎來平靜的春天。」",
      checklist: [
        "今天飲食中是否有攝取到牛奶、香蕉或堅果等色胺酸食物？",
        "今天有進行 3 分鐘以上的腹式深慢呼吸嗎？",
        "今天是否有留給自己一段完全安靜、沒有干擾的獨處時光？"
      ]
    },
    oxytocin: {
      name: "Oxytocin 催產素 💞",
      chemical: "C₄₃H₆₆N₁₂O₁₂S₂",
      icon: "🌸",
      bg: "bg-rose-50 text-rose-800 border-rose-100",
      border: "border-rose-200",
      text: "text-rose-700",
      role: "💖 信任、溫暖與親密連結 (Bonding & Love)",
      desc: "催產素被稱為「擁抱荷爾蒙」，是我們體驗到「愛、安全感、信任與社會親密歸屬」時分泌的生物信號。它能天然降低大腦杏仁核的警覺度，消除恐懼、拉近人與人之間的心靈籬笆。",
      medicalTip: "💡 醫學平衡建議：與親人、寵物進行輕柔擁抱、撫摸，或寫下一篇真誠的感謝信，甚至只是看著小艾的溫柔語錄，大腦都會天然釋放催產素。這是對抗社交焦慮與孤獨感的生理良藥。",
      spiritualQuote: "「接受自己的脆弱，正是你最強大的溫柔。在陪伴中，我們長出了最堅固的根。」",
      checklist: [
        "今天有給予家人、摯友或愛寵一個溫柔的擁抱或撫摸嗎？",
        "今天有對任何陪伴你的人真誠地表達過『謝謝』嗎？",
        "有讀到或寫下任何帶給你心靈共鳴的溫暖文字嗎？"
      ]
    },
    cortisol: {
      name: "Cortisol 皮質醇 🛡️",
      chemical: "C₂₁H₃₀O₅",
      icon: "🛡️",
      bg: "bg-indigo-50 text-indigo-800 border-indigo-100",
      border: "border-indigo-200",
      text: "text-indigo-700",
      role: "🚨 壓力、警覺與晝夜規律 (Stress & Circadian Rhythm)",
      desc: "皮質醇是人體的「壓力荷爾蒙」。在清晨，皮質醇濃度達到頂峰來喚醒大腦與肌肉；在面對危機時，它會大量釋放，動用全身資源進行應戰。然而長期高壓、熬夜會使皮質醇過度累積，導致焦慮疲憊、免疫力下降。",
      medicalTip: "💡 醫學平衡建議：皮質醇的分泌高度依赖光照與睡眠晝夜節律。晚上避免觀看藍光，保持黑暗睡眠。下午進行溫和的靜心瑜伽或拉伸，能加速皮質醇在體內的代謝，保護心臟血管健康。",
      spiritualQuote: "「允許自己偶爾停滯，冬眠過後的種子，往往能開出最驚艷的花。」",
      checklist: [
        "昨晚是否有在 11 點以前入睡，並獲得優質充足的深層睡眠？",
        "今天面對壓力時，有意識到自己身體的緊繃，並進行肩頸拉伸嗎？",
        "今天下午有避免攝入過量的咖啡因，給腎上腺適度放假嗎？"
      ]
    }
  };

  const currentComp = compounds[activeComp];

  const handleToggleCheck = (key: string) => {
    setChecklistState({ ...checklistState, [key]: !checklistState[key] });
  };

  const activeCheckedCount = currentComp.checklist.filter(item => checklistState[item]).length;

  return (
    <div className="bg-white/80 p-6 rounded-3xl border border-amber-100 shadow-sm flex flex-col gap-5 min-h-[400px]">
      <div className="flex items-center gap-2 pb-3 border-b border-amber-50">
        <Activity className="w-5 h-5 text-amber-500 fill-amber-100 animate-pulse" />
        <h3 className="font-serif font-black text-sm text-[#4E4158]">生物化學、醫療與身心靈平衡大百科</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Substance Tabs selector */}
        <div className="lg:col-span-4 flex flex-col gap-2 bg-[#FAF8F5]/50 p-3 rounded-2xl border border-amber-50/50">
          <span className="text-[9px] text-amber-600 font-bold tracking-widest uppercase mb-1.5 px-1 block">
            🧪 點擊分子探尋情緒起源
          </span>
          {Object.entries(compounds).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveComp(key)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                activeComp === key
                  ? 'bg-white border-amber-300 shadow-xs font-black'
                  : 'bg-[#FAF8F5]/30 hover:bg-white border-transparent text-[#9A8AA6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{data.icon}</span>
                <div className="text-left">
                  <span className="text-xs font-serif text-[#4E4158] block leading-none">{data.name.split(' ')[1]}</span>
                  <span className="text-[8px] text-[#9A8AA6] font-mono mt-1 block leading-none">{data.chemical}</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9A8AA6]" />
            </button>
          ))}
        </div>

        {/* Right Side: Info Panel details */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4">
          
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2 border-b border-amber-50/40 pb-2">
              <h4 className="font-serif font-black text-sm text-[#4E4158]">{currentComp.name}</h4>
              <span className="text-[10px] text-amber-600 font-mono tracking-wider font-semibold">
                {currentComp.role}
              </span>
            </div>

            <p className="text-xs text-[#4E4158]/95 leading-relaxed font-sans text-justify bg-white/40 p-3.5 rounded-xl border border-amber-100/10 shadow-xxs">
              {currentComp.desc}
            </p>

            <div className="p-3.5 rounded-xl bg-amber-50/30 border border-amber-100/50 text-xxs text-amber-900 font-sans leading-relaxed">
              {currentComp.medicalTip}
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-50/50 to-amber-50/50 border-l-4 border-amber-400">
              <p className="font-serif text-xs italic text-amber-950 font-extrabold text-center">
                {currentComp.spiritualQuote}
              </p>
            </div>
          </div>

          {/* Interactive Chemical Balance Calculator */}
          <div className="bg-white p-4 rounded-xl border border-amber-100/40 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-amber-50/50 pb-1.5">
              <h5 className="font-serif font-black text-xs text-[#4E4158] flex items-center gap-1.5">
                <span>📊</span> 物質平衡自我檢測表
              </h5>
              <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200/50">
                滿意度：{activeCheckedCount} / 3
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {currentComp.checklist.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleCheck(item)}
                  className={`p-2.5 rounded-lg border text-left text-xxs font-serif flex items-center gap-2.5 cursor-pointer transition-all ${
                    checklistState[item]
                      ? 'bg-amber-50/40 border-amber-200 text-amber-900 font-extrabold'
                      : 'bg-[#FAF8F5]/30 border-transparent hover:bg-white text-slate-500'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 ${
                    checklistState[item] ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {checklistState[item] && <span className="text-[10px] leading-none">✓</span>}
                  </div>
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
