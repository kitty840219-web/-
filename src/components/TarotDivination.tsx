import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, RefreshCw } from 'lucide-react';

export default function TarotDivination() {
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isShakingCup, setIsShakingCup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Topic state
  const [activeTopic, setActiveTopic] = useState<string>('reconciliation');
  const [selectedQuestion, setSelectedQuestion] = useState<string>('「我們還有機會復合嗎？對方的真實心聲是什麼？」');
  const [customQuestion, setCustomQuestion] = useState<string>('');

  const QUESTIONS_POOL = [
    { text: "「我們還有機會復合嗎？對方的真實心聲是什麼？」", topic: "reconciliation", label: "💖 復合機會" },
    { text: "「目前處於斷聯狀態，對方會主動聯絡我嗎？預計會在什麼時間？」", topic: "no_contact", label: "📬 斷聯聯絡" },
    { text: "「分手之後，他/她是否也像我一樣在深夜思念、感到後悔呢？」", topic: "breakup", label: "💔 分手回顧" },
    { text: "「未來三個月，我的感情世界會迎來什麼樣的新轉機與真愛？」", topic: "future_love", label: "✨ 感情未來" },
    { text: "「未來三個月，我的工作事業與財富會迎來什麼樣的突破或考驗？」", topic: "future_career", label: "💼 事業未來" }
  ];

  const allTarotCards = [
    {
      id: "tarot-lovers",
      num: "VI",
      name: "戀人 (The Lovers)",
      trait: "選擇與情感羈絆",
      quote: "「愛是鏡子，映照出你最溫柔的渴望與靈魂的完整。」",
      color: "from-rose-500 via-pink-500 to-purple-500",
      svgType: "lovers",
      meanings: {
        reconciliation: "「復合機率：85%」 雙方心中依然存有著強烈的化學反應與情感羈絆。分開這段時間讓彼此深切體會到對方的不可替代性。此時主動釋出不帶壓力的溫馨問候，最容易破冰，感情會迅速重新加溫！",
        no_contact: "「主動聯絡機率：80%」 對方其實常在深夜點開你們的對話框，反覆斟酌。he/she 非常渴望打破目前的斷聯狀態。預計在接下來的 10 天內，對方可能會藉由朋友圈、日常分享或節日話題等自然契機，主動與你建立聯繫。",
        breakup: "分手後的遺憾與不捨一直折磨著他/她。他/她很後悔當初衝動之下說出的傷人言語。雙方的愛意並未真正熄滅，只要有一方願意展現真誠、拋開自尊，關係的重生近在咫尺。",
        future_love: "未來三個月的桃花運勢迎來黃金爆發期！單身的人極易邂逅心意相通、無話不說的靈魂伴侶；戀愛中的情侶彼此承諾將會升級，有望步入同居、求婚或跨越重大現實阻礙的和諧階段。",
        future_career: "事業上將面臨極佳的合作與方向抉擇。你將吸引到極其互補的合夥人或默刻團隊，雙方理念契合、強強聯手。大膽進行跨界或商務合作，能為你帶來翻倍的經濟回報與業界好名聲。"
      }
    },
    {
      id: "tarot-star",
      num: "XVII",
      name: "星星 (The Star)",
      trait: "療癒、希望與指引",
      quote: "「在最深沉的暗夜裡，北極星依然恆常閃爍，引領你走向靈魂的港灣。」",
      color: "from-blue-600 via-indigo-600 to-purple-700",
      svgType: "star",
      meanings: {
        reconciliation: "「復合機率：65%」 復合的契機正如雨後的彩虹，正在安靜滋長。但此時急躁只會將對方推遠，你們都需要先在時光中「療癒傷口」。當你重新找回心靈的和諧與自愛時，命運自會安排你們在對的時空重新相遇。",
        no_contact: "「主動聯絡機率：55%」 對方目前正處於安靜自我修復、沉澱思緒的階段。他/她沒有怨恨，只是想先梳理好生活的混亂。預計在 3 到 4 週後，當對方感受到你的平靜與溫柔時，會主動向你釋放善意訊號。",
        breakup: "這場分手雖然悲傷，但卻是一場必要的「靈魂洗禮」。它指引你洗滌過去不健康的相處模式。對方目前對你抱持著釋懷與祝福的溫和態度，只要你展現出成熟自洽的態度，未來雙方仍能和諧對談。",
        future_love: "你的個人能量磁場正變得清澈而富有吸引力。未來三個月，你會吸引到性格溫和、極具同理心與療癒特質的對象。放心地卸下心防，星光會照亮你的真愛之路。",
        future_career: "未來三個月將擺脫過去長期的迷茫與停滯！雖然不會在一夜之間獲得暴利，但你將明確最契合自己的長遠軌道。創意與寫作運佳，非常適合個人品牌打造、進修或重塑職業方向。"
      }
    },
    {
      id: "tarot-chariot",
      num: "VII",
      name: "戰車 (The Chariot)",
      trait: "意志、勝利與掌控行動",
      quote: "「在冷靜的理智中御風而行，讓自律與堅持成為你披荊斬棘的雙輪。」",
      color: "from-blue-700 via-sky-600 to-indigo-800",
      svgType: "chariot",
      meanings: {
        reconciliation: "「復合機率：60%」 復合需要主動出擊與克服障礙。目前關係中存在不少現實難關或固執偏見，如果你想要重新在一起，就不能被動等待。此時，戰車牌激勵你展現極致的主動與執行力，誠懇且有肩膀地去解決問題，就能破浪前行！",
        no_contact: "「主動聯絡機率：65%」 對方性格比較好強、不願輕易示弱。他/她雖然內心有強烈的衝動想聯絡你，但正在與自己的自尊博弈。這張牌表示，如果他/她克服了面子障礙，或者因外界事情（例如突然需要你的專業協助或共同事務）觸發，他/她會以非常迅速、果斷的方式主動聯絡你！",
        breakup: "這次分手激發了你骨子裡的堅毅。對方雖然表面上看起來很冷酷無情，其實是為了克制自己的軟弱。戰車象徵一場理智與情感的意志對決，與其耽溺於往日的感傷，你更應該奪回人生的方向盤，重新掌控自己的生活步調。",
        future_love: "未來三個月將在感情上迎來重大的突破與進展！你將會遇到性格果斷、具有強烈保護欲、且做事極具魄力的優秀追求者。在關係建立的過程中，你需要更大膽、更具自信地向前推進，幸福是由你親自爭取而來的。",
        future_career: "這是一張象徵「絕對勝利與戰無不勝」的黃金事業牌！未來三個月你將在職場、考試或全新項目中無往不利。雖然過程充滿競爭與高難度的挑戰，但只要你保持極致的自律與戰鬥力，必能擊敗對手，贏得令人矚目的地位、聲望與豐厚回報！"
      }
    },
    {
      id: "tarot-tower",
      num: "XVI",
      name: "高塔 (The Tower)",
      trait: "破壞、重建與新生",
      quote: "「不打破陳舊的牢籠，如何迎來鳳凰涅槃的金色翅膀？」",
      color: "from-slate-800 via-indigo-950 to-purple-950",
      svgType: "tower",
      meanings: {
        reconciliation: "「復合機率：35%」 高塔象徵著「舊有相處模型的崩塌」。如果只是渴望沿用過去任性、猜忌或委曲求全的老方法去復合，只會重演悲劇。唯有將過去的一切自尊、執念完全粉碎，以全新的人格重新交往，才有機會絕處逢生。",
        no_contact: "「主動聯絡機率：40%」 目前對方心緒極度不穩定，正處在情緒風暴的餘震中。短期內（2週內）對方主動的概率較低，因為他/她仍處在防禦或震驚狀態。建議你按兵不動，等風暴徹底平息後，再以極度理智、溫柔的第三方口吻打破沈默。",
        breakup: "雖然分手像雷擊一般震碎了你的生活，但這其實是宇宙在強行幫你拔除不健康的「有毒溫床」。不破不立，舊的痛苦倒塌了，你才不用在不對的人身上繼續虛耗青春，這是一場因禍得福的解脫。",
        future_love: "未來三個月，你的愛情觀將面臨顛覆式的洗禮與清醒！你將突然看穿某些甜言蜜語背後的虛無，主動斬斷低質量桃花。雖然有短暫的陣痛，但這會為你騰出乾淨的空間迎接高質量的靈魂眷侶。",
        future_career: "職場上面臨突如其來的洗牌或轉折（如項目夭折、職務調動、或突然離職）。請千萬不要氣餒，這是推動你跳出舒適圈的宿命推手。新起的高塔將無比堅固，你將迎來薪資和平台的巨大飛躍。"
      }
    },
    {
      id: "tarot-wheel",
      num: "X",
      name: "命運之輪 (The Wheel of Fortune)",
      trait: "機緣逆轉與宿命循環",
      quote: "「命運之輪旋轉不息，低谷已過，你期盼的逆轉之光即將升起。」",
      color: "from-amber-600 via-orange-500 to-yellow-500",
      svgType: "wheel",
      meanings: {
        reconciliation: "「復合機率：75%」 命運之輪正快速朝著重逢的軌道轉動。你們之間存在著極深的宿命因果。在未來的三週內，宇宙會安排一些意想不到的隨機因緣（如不約而同出現在同個場合、共同群組話題、或者偶然的共同事務），推動你們順其自然地言歸於好！",
        no_contact: "「主動聯絡機率：85%」 斷聯的僵局即將被外在命運力量強行打破！對方在接下來的幾天內會遇到一些人事變動或心境起伏，導致他/她無法抗拒地想念你，從而做出出乎意料的主動聯絡舉動。靜待鈴聲響起吧！",
        breakup: "分開是你們生命藍圖中一個必經的轉折點，旨在讓你們各自體驗、成長。如今齒輪再次契合，這段關係正面臨轉機。不論是重新牽手還是各自開啟嶄新、美好的天定情緣，命運都已幫你做好了最豐盛的鋪墊。",
        future_love: "未來三個月桃花運爆棚！極易在旅行、學習、或社交中遇到一位一見如故、宿命感極強的優質伴侶。有伴侶的人關係會跨越陳年宿怨，迎來心有靈犀的和諧新契機。",
        future_career: "事業運勢即將直衝雲霄！過去被埋沒的才華、被拖延的資金或項目將會獲得大逆轉。可能會有出乎意料的優質合約、高升機會、或者行業貴人主動登門拜訪。這是一段順水推舟、大膽突破的黃金爆發期！"
      }
    },
    {
      id: "tarot-priestess",
      num: "II",
      name: "女祭司 (The High Priestess)",
      trait: "直覺、沈靜與精神共鳴",
      quote: "「外在的喧囂不過是幻影，聽從你冷靜的直覺，真相早已在你心中。」",
      color: "from-indigo-800 via-indigo-950 to-blue-900",
      svgType: "priestess",
      meanings: {
        reconciliation: "「復合機率：45%」 目前雙方都在極力克制情感，進行著一場無聲的「心理博弈」。彼此都在默默窺探對方的動向，但面子上誰也不願當先認輸的那一個。此時主動死纏爛打只會激起對方的防禦。建議你保持神祕感與尊嚴，以靜制動，反而能撬開對方的心扉。",
        no_contact: "「主動聯絡機率：45%」 對方目前將自己封閉在冷靜、理智的城堡裡，不願流露脆弱。他/她雖然時常默默想起你，但會用理智說服自己保持克制。你需要給予對方足夠的台階，或者在對方放鬆防備時，用一篇不具壓迫感、溫馨且精神共鳴的文字去觸動他/她。",
        breakup: "分手讓你徹底回歸了自己高貴的獨立靈魂。這張牌顯示對方其實在內心深處非常崇拜並尊重你的內涵與智慧。保持你的高冷與優雅，不需要哀求，你的自愛與進步，就是對關係最好的救贖與重新吸引。",
        future_love: "未來三個月的感情走向趨於精神化、高雅化。比起短暫的激情，你更渴望靈魂層面的深度交流。你會吸引到思想成熟、博學或從事專業研究領域的優秀傾慕者，談一場寧靜、高品質的戀愛。",
        future_career: "事業上進入蓄勢待發的休整與學習期。非常適合規劃長遠戰略、進修充電、考取證照或策劃幕後項目。此時不宜盲目跟風擴張或投機理財。你超凡的直覺能幫你避開所有潛在合同陷阱，穩操勝券。"
      }
    },
    {
      id: "tarot-empress",
      num: "III",
      name: "皇后 (The Empress)",
      trait: "富足、繁榮與豐盛回報",
      quote: "「當你學會無條件地寵愛自己，整座世界的森林與花朵都會為你盛開。」",
      color: "from-emerald-600 via-teal-500 to-amber-500",
      svgType: "empress",
      meanings: {
        reconciliation: "「復合機率：75%」 皇后代表著豐沛的母性、包容與溫暖。只要你在重逢時展現出溫柔體貼、大度不計較的溫暖氣度，復合會像水到渠成般順暢。對方在你身邊能獲得極大的情緒價值與精神依賴，渴望再次被你溫柔抱緊。",
        no_contact: "「主動聯絡機率：70%」 斷聯這段時間讓對方倍感空虛與寒冷。他/她已經習慣了你對他/她的好、以及你無微不至的呵護與溫馨。他/她目前正經歷依賴戒斷反應。只要你適當在社群上展示自己精緻、滋潤且熱愛生活的面貌，對方就會主動尋求回歸。",
        breakup: "這張牌溫柔地告訴你：你是一尊自帶光芒與財富、充滿魅力的高貴皇后，不論身處何境都理應被無條件地呵護、寵愛。不要為了一棵枯木而懷疑自己的價值。保持你的豐盛，你很快就會迎來更懂得珍惜你的優質港灣。",
        future_love: "桃花運勢空前旺盛，堪稱大豐收！你的外在魅力、親和力與品味正在急劇飆升，身邊不乏體貼、大方且經濟條件卓越的優質異性主動追求。有伴侶的人彼此感情甜蜜和諧，極易傳出同居、結婚或懷孕的喜訊。",
        future_career: "未來三個月是你的才華、創意與財富大獲豐收的黃金時期！你主導的項目、設計或創意會獲得廣泛的市場認可與實質回報。非常適合進行美感產業、諮詢、或自媒體開拓，財源廣進，成果喜人。"
      }
    }
  ];

  // Draw 3 random cards for the table
  const [tableCards, setTableCards] = useState<any[]>(() => {
    // Shuffle cards and select 3
    const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const handleShuffle = () => {
    setIsShuffling(true);
    setSelectedCardIdx(null);
    setIsFlipped(false);
    
    setTimeout(() => {
      const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5);
      setTableCards(shuffled.slice(0, 3));
      setIsShuffling(false);
    }, 700);
  };

  const drawRandomQuestion = () => {
    setIsShakingCup(true);
    setTimeout(() => {
      const randomQ = QUESTIONS_POOL[Math.floor(Math.random() * QUESTIONS_POOL.length)];
      setSelectedQuestion(randomQ.text);
      setActiveTopic(randomQ.topic);
      setCustomQuestion('');
      setIsShakingCup(false);
      
      // Auto reshuffle cards when question changes to keep it fresh
      handleShuffle();
    }, 800);
  };

  const handleDraw = (idx: number) => {
    if (selectedCardIdx !== null || isShuffling || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setSelectedCardIdx(idx);
      setIsLoading(false);
      setIsFlipped(true);
    }, 800);
  };

  const renderCardIllustration = (type: string) => {
    switch (type) {
      case 'lovers':
        return (
          <svg viewBox="0 0 100 120" className="w-16 h-20 text-rose-200 fill-none stroke-current stroke-1.5 animate-pulse">
            <path d="M50,35 C35,20 20,35 50,70 C80,35 65,20 50,35 Z" fill="rgba(244,63,94,0.15)" strokeWidth="2" />
            <circle cx="50" cy="45" r="10" strokeDasharray="3,3" />
            <path d="M20,60 C30,75 70,75 80,60" />
            <line x1="50" y1="10" x2="50" y2="110" strokeDasharray="2,4" />
            <polygon points="50,110 47,104 53,104" fill="currentColor" />
            <path d="M15,40 Q25,35 30,50" />
            <path d="M85,40 Q75,35 70,50" />
          </svg>
        );
      case 'star':
        return (
          <svg viewBox="0 0 100 120" className="w-16 h-20 text-yellow-200 fill-none stroke-current stroke-1.5">
            <polygon points="50,15 54,35 72,25 60,42 78,50 58,58 68,76 50,64 32,76 42,58 22,50 40,42 28,25 46,35" fill="rgba(253,224,71,0.2)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="28" strokeDasharray="2,2" />
            <path d="M30,90 Q50,70 70,90" strokeWidth="2" />
            <path d="M35,95 Q50,80 65,95" />
            <circle cx="20" cy="25" r="2" fill="currentColor" />
            <circle cx="80" cy="30" r="3" fill="currentColor" />
            <circle cx="85" cy="80" r="1.5" fill="currentColor" />
          </svg>
        );
      case 'chariot':
        return (
          <svg viewBox="0 0 100 120" className="w-16 h-20 text-sky-200 fill-none stroke-current stroke-1.5">
            <path d="M30,30 L70,30 L70,65 L50,85 L30,65 Z" fill="rgba(14,165,233,0.12)" strokeWidth="1.5" />
            <circle cx="22" cy="85" r="14" fill="rgba(14,165,233,0.08)" strokeWidth="1.5" strokeDasharray="2,2" />
            <circle cx="22" cy="85" r="5" strokeWidth="1" />
            <circle cx="78" cy="85" r="14" fill="rgba(14,165,233,0.08)" strokeWidth="1.5" strokeDasharray="2,2" />
            <circle cx="78" cy="85" r="5" strokeWidth="1" />
            <path d="M42,42 Q50,34 58,42 Q58,54 50,62 Q42,54 42,42 Z" fill="rgba(255,255,255,0.2)" strokeWidth="1.2" />
            <line x1="50" y1="36" x2="50" y2="62" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="10" y1="15" x2="90" y2="15" strokeDasharray="3,3" />
            <path d="M50,15 L45,22 L55,22 Z" fill="currentColor" />
            <circle cx="18" cy="22" r="2.5" fill="currentColor" />
            <circle cx="82" cy="22" r="2.5" fill="currentColor" />
            <circle cx="50" cy="74" r="3" fill="currentColor" />
          </svg>
        );
      case 'tower':
        return (
          <svg viewBox="0 0 100 120" className="w-16 h-20 text-purple-200 fill-none stroke-current stroke-1.5">
            <rect x="38" y="40" width="24" height="60" rx="2" fill="rgba(168,85,247,0.15)" />
            <path d="M35,40 L65,40 L50,25 Z" fill="rgba(168,85,247,0.25)" />
            <path d="M15,15 L45,45 L40,55 L70,20" stroke="gold" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="38" y1="60" x2="62" y2="60" />
            <line x1="38" y1="80" x2="62" y2="80" />
            <circle cx="50" cy="32" r="2" fill="currentColor" />
          </svg>
        );
      case 'wheel':
        return (
          <svg viewBox="0 0 100 120" className="w-16 h-20 text-amber-200 fill-none stroke-current stroke-1.5">
            <circle cx="50" cy="50" r="32" fill="rgba(245,158,11,0.1)" strokeWidth="2" />
            <circle cx="50" cy="50" r="18" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
            <line x1="50" y1="18" x2="50" y2="82" />
            <line x1="18" y1="50" x2="82" y2="50" />
            <line x1="27" y1="27" x2="73" y2="73" />
            <line x1="27" y1="73" x2="73" y2="27" />
            <path d="M12,50 A38,38 0 0,1 88,50" strokeDasharray="2,4" />
          </svg>
        );
      case 'priestess':
        return (
          <svg viewBox="0 0 100 120" className="w-16 h-20 text-indigo-300 fill-none stroke-current stroke-1.5">
            <line x1="25" y1="25" x2="25" y2="95" strokeWidth="3" stroke="currentColor" />
            <line x1="75" y1="25" x2="75" y2="95" strokeWidth="3" stroke="rgba(255,255,255,0.4)" />
            <text x="22" y="60" fill="white" fontSize="8" fontFamily="serif" fontWeight="bold">B</text>
            <text x="72" y="60" fill="currentColor" fontSize="8" fontFamily="serif" fontWeight="bold">J</text>
            <path d="M35,45 A15,15 0 0,0 65,45" strokeWidth="2" />
            <path d="M50,15 A12,12 0 1,1 50,45 A12,12 0 1,0 50,15" fill="rgba(99,102,241,0.2)" />
            <circle cx="50" cy="75" r="8" strokeDasharray="2,2" />
          </svg>
        );
      case 'empress':
        return (
          <svg viewBox="0 0 100 120" className="w-16 h-20 text-emerald-200 fill-none stroke-current stroke-1.5">
            <path d="M25,35 L35,20 L50,30 L65,20 L75,35 L68,55 L32,55 Z" fill="rgba(16,185,129,0.15)" strokeWidth="1.5" />
            <circle cx="50" cy="30" r="3" fill="currentColor" />
            <circle cx="35" cy="20" r="2" fill="currentColor" />
            <circle cx="65" cy="20" r="2" fill="currentColor" />
            <rect x="35" y="65" width="30" height="35" rx="5" fill="rgba(16,185,129,0.1)" />
            <path d="M20,95 Q50,75 80,95" strokeWidth="2" />
            <line x1="25" y1="75" x2="32" y2="65" />
            <line x1="75" y1="75" x2="68" y2="65" />
          </svg>
        );
      default:
        return <Compass className="w-10 h-10 text-purple-200 animate-spin" />;
    }
  };

  return (
    <div id="divination-section-card" className="bg-white/80 p-5 md:p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-6 min-h-[400px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-purple-50">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple-500 fill-purple-100 animate-soft-pulse" />
          <div>
            <h3 className="font-serif font-black text-sm md:text-base text-[#4E4158]">塔羅心靈占卜：命運抉擇解惑房</h3>
            <p className="text-[10px] text-[#9A8AA6] font-sans">
              心中默念你的情感或事業疑問，隨機抽籤獲得啟示。
            </p>
          </div>
        </div>
        <button
          onClick={handleShuffle}
          className="text-purple-600 hover:text-purple-900 border border-purple-200/50 hover:bg-purple-50 px-3.5 py-2 rounded-xl text-xs font-serif font-black transition-all cursor-pointer flex items-center gap-1.5 justify-center shadow-xxs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
          重洗塔羅
        </button>
      </div>

      {/* QUESTION DRAWER & SELECTION WORKSPACE */}
      <div className="bg-gradient-to-r from-purple-50/50 to-rose-50/40 p-4.5 rounded-2xl border border-purple-100/40 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-purple-700 font-bold tracking-wider font-serif flex items-center gap-1">
            <span>🔮</span> 步驟 1：抽取或填寫占卜主題
          </span>
          <button
            onClick={drawRandomQuestion}
            disabled={isShakingCup}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-serif font-black text-xxs py-1.5 px-3 rounded-xl transition-all shadow-xxs hover:scale-102 flex items-center gap-1 cursor-pointer"
          >
            <span>🏮</span> {isShakingCup ? '正在搖晃籤筒...' : '隨機抽籤提問 ➔'}
          </button>
        </div>

        {/* Selected question display with dynamic shaking effect */}
        <motion.div 
          animate={isShakingCup ? { rotate: [0, -3, 3, -3, 3, 0], y: [0, -2, 2, -2, 2, 0] } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white/90 border border-purple-200/50 rounded-xl p-4 flex flex-col gap-2 shadow-xxs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] bg-purple-100 text-[#7C5B8C] font-black px-2 py-0.5 rounded-md uppercase">
              {QUESTIONS_POOL.find(q => q.text === selectedQuestion)?.label || "🔮 自訂心願"}
            </span>
            <span className="text-xxs font-mono text-[#9A8AA6]">TAROT QUESTION</span>
          </div>
          <p className="font-serif font-black text-xs md:text-sm text-[#4E4158] leading-relaxed">
            {selectedQuestion}
          </p>
        </motion.div>

        {/* Manual selection presets */}
        <div className="flex flex-wrap gap-1.5">
          {QUESTIONS_POOL.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedQuestion(q.text);
                setActiveTopic(q.topic);
                setCustomQuestion('');
                handleShuffle(); // reshuffle to make drawing feel reactive
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xxs transition-all cursor-pointer ${
                selectedQuestion === q.text
                  ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
                  : 'bg-white/60 hover:bg-white text-[#9A8AA6] hover:text-[#4E4158] border border-slate-200/60'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="✍️ 或者在這裡輸入你專屬的特定占卜問題..."
            value={customQuestion}
            onChange={(e) => {
              setCustomQuestion(e.target.value);
              setSelectedQuestion(e.target.value || "「我的這段因緣與未來走向如何？」");
              setActiveTopic('reconciliation'); // default to general reconciliation/lovers pattern if custom
            }}
            className="flex-1 bg-white/80 border border-purple-100 rounded-xl px-3 py-2 text-xxs text-[#4E4158] focus:outline-none focus:ring-1 focus:ring-purple-300"
          />
        </div>
      </div>

      {/* CORE TAROT GAMEPLAY STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: 3 Tarot Cards Deck on table */}
        <div className="lg:col-span-5 bg-[#FAF8F5]/50 rounded-2xl p-5 border border-purple-100/30 flex flex-col items-center justify-center gap-5 min-h-[350px]">
          <div className="text-center flex flex-col gap-1">
            <span className="text-[10px] text-purple-500 font-extrabold tracking-widest uppercase block">
              {selectedCardIdx === null ? '🔮 靜心閉眼，點擊下方一張牌進行感應 🔮' : '✨ 命運之牌已在神祕陣中揭曉 ✨'}
            </span>
            {selectedCardIdx === null && (
              <span className="text-[8px] text-[#9A8AA6] font-sans">
                提示：黑白縱橫與塔羅皆是投射，選定後按牌意指引行動。
              </span>
            )}
          </div>

          <div className="flex justify-center gap-3 w-full max-w-sm relative py-4">
            {tableCards.map((card, idx) => {
              const isSelected = selectedCardIdx === idx;
              const isAnySelected = selectedCardIdx !== null;

              return (
                <div
                  key={card.id + '-' + idx}
                  onClick={() => handleDraw(idx)}
                  className={`relative w-24 h-40 md:w-28 md:h-44 cursor-pointer transition-all duration-500 transform-style-3d ${
                    isShuffling ? 'scale-90 rotate-12 translate-y-3' : ''
                  } ${
                    isAnySelected && !isSelected ? 'opacity-20 pointer-events-none scale-90' : ''
                  } ${
                    isSelected ? 'scale-105 shadow-xl border-purple-400 z-10' : 'hover:-translate-y-3 hover:shadow-md'
                  }`}
                >
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                    isSelected && isFlipped ? 'rotate-y-180' : ''
                  }`}>
                    
                    {/* BACK VIEW (Face Down) */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-b from-[#4E4158] to-[#2D2335] border-2 border-purple-300/60 p-1.5 flex flex-col justify-between items-center shadow-md">
                      <div className="w-full h-full border border-purple-200/20 rounded-xl flex flex-col justify-between items-center p-2 bg-purple-950/40 relative overflow-hidden">
                        
                        {/* Sacred geometry lines inside background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none"></div>
                        <div className="absolute w-20 h-20 border border-purple-300/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '20s' }}></div>

                        <span className="text-[9px] font-serif text-purple-300 tracking-wider">Aifeiler</span>
                        <div className="flex flex-col items-center justify-center gap-1 z-10">
                          <div className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                          <div className="w-1.5 h-8 bg-purple-300/40 rounded-full mt-0.5"></div>
                          <div className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)] mt-0.5"></div>
                        </div>
                        <span className="text-[7px] font-sans text-purple-300/70 font-bold uppercase tracking-widest">TAROT CARDS</span>
                      </div>
                    </div>

                    {/* FRONT VIEW (Face Up - TAROT ILLUSTRATION SCREEN) */}
                    <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-b ${card.color} border-2 border-white/95 p-1.5 flex flex-col justify-between items-center shadow-lg`}>
                      <div className="w-full h-full border-2 border-white/20 rounded-xl flex flex-col justify-between items-center p-1.5 bg-black/40 relative overflow-hidden text-white">
                        
                        {/* Card number label */}
                        <span className="text-[9px] font-serif tracking-widest text-slate-200/90 font-black">{card.num}</span>
                        
                        {/* Dynamic SVG illustration representing Tarot artwork */}
                        <div className="my-1.5 flex items-center justify-center w-full z-10">
                          {renderCardIllustration(card.svgType)}
                        </div>

                        {/* Card name tag */}
                        <div className="text-center z-10 mt-auto">
                          <span className="text-[10px] font-serif font-black tracking-wide text-white drop-shadow-md block">
                            {card.name.split(' ')[0]}
                          </span>
                          <span className="text-[7px] font-sans text-slate-300 uppercase tracking-wider block scale-90">
                            {card.name.split(' ')[1]}
                          </span>
                        </div>

                        {/* Aesthetic corners */}
                        <div className="absolute top-1 left-1 text-[6px] text-white/30 font-serif">✦</div>
                        <div className="absolute top-1 right-1 text-[6px] text-white/30 font-serif">✦</div>
                        <div className="absolute bottom-1 left-1 text-[6px] text-white/30 font-serif">✦</div>
                        <div className="absolute bottom-1 right-1 text-[6px] text-white/30 font-serif">✦</div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {isLoading && (
            <div className="text-[10px] text-purple-600 font-sans flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-500" />
              正在調諧你的直覺能譜，對齊卡牌電性...
            </div>
          )}
        </div>

        {/* Right: Dynamic Detailed Interpretation Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {selectedCardIdx !== null && isFlipped ? (
              <motion.div
                key="oracle-result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-4 bg-purple-50/15 p-4 md:p-5 rounded-2xl border border-purple-200/30"
              >
                {/* Title & Category Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-purple-100/30">
                  <div>
                    <span className="text-[8px] text-purple-700 font-bold tracking-widest bg-purple-100/80 px-2 py-0.5 rounded-md border border-purple-200/50">
                      🔮 能量本質：{tableCards[selectedCardIdx].trait}
                    </span>
                    <h4 className="font-serif font-black text-sm md:text-base text-[#4E4158] mt-1.5 flex items-center gap-1.5">
                      塔羅牌牌面：{tableCards[selectedCardIdx].name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-[#9A8AA6] font-mono">DIVINATION INSIGHT</span>
                  </div>
                </div>

                {/* Celestial Quote */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-rose-50 border-l-4 border-purple-400">
                  <p className="font-serif text-xs italic text-purple-950 font-extrabold leading-relaxed text-center">
                    {tableCards[selectedCardIdx].quote}
                  </p>
                </div>

                {/* Specific interpretation display based on active topic */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-purple-600 font-black font-serif flex items-center gap-1">
                    <span>🧭</span> 針對你的提問：{QUESTIONS_POOL.find(q => q.text === selectedQuestion)?.label || "自訂提問"}
                  </span>
                  <div className="text-xs text-[#4E4158]/95 leading-relaxed font-sans bg-white p-4 rounded-xl border border-purple-100/30 text-justify flex flex-col gap-2.5 shadow-xxs">
                    <p className="font-medium text-[#4E4158]">
                      {tableCards[selectedCardIdx].meanings[activeTopic as keyof typeof tableCards[0]['meanings']] || 
                       tableCards[selectedCardIdx].meanings['reconciliation']}
                    </p>
                    <div className="pt-2 border-t border-dashed border-slate-100 text-[10px] text-[#9A8AA6] leading-relaxed">
                      💡 導師心靈悄悄話：塔羅並非一成不變的宿命判決，而是一面引導你內省與理性思考的明鏡。順應這股能量做調整，行動在於你的每一次心念轉換。
                    </div>
                  </div>
                </div>

                {/* Reset or Draw Again */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedCardIdx(null);
                      setIsFlipped(false);
                      handleShuffle();
                    }}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200 font-serif text-xxs font-black py-2 px-5 rounded-xl transition-all cursor-pointer"
                  >
                    閉眼重抽 ➔
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-[#9A8AA6] gap-3 bg-[#FAF8F5]/30 border border-dashed border-purple-200/50 rounded-2xl">
                <span className="text-4xl animate-bounce" style={{ animationDuration: '4s' }}>🕯️</span>
                <p className="font-serif text-xs font-semibold text-[#4E4158]">開啟神祕對局：點亮心靈指路牌</p>
                <p className="text-[10px] max-w-sm leading-relaxed font-sans">
                  你今天面臨的感情（復合、斷聯、分手、走向）或事業突破難題，在此皆有其對應能譜。請在左側的牌堆中選取一張最觸動你的塔羅，點擊翻開，聆聽來自內心的啟示。
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
