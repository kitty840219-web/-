import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Brain, 
  Check, 
  RefreshCw, 
  Star, 
  ArrowRight,
  Scale,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Heart,
  Trash2,
  Shield,
  Gamepad2,
  X,
  Lock,
  Unlock,
  Users,
  CheckCircle,
  Smile,
  AlertCircle
} from 'lucide-react';
import { IMAGES } from '../assets/images';
import CognitiveLabHub from './CognitiveLabHub';

interface ReflectionLabProps {
  activeCharacter: string;
}

const scenariosList = [
  {
    id: 'sc1',
    title: '心靈電量 10% 的抉擇',
    situation: '深夜裡，一位關係很好的朋友突然發來訊息，語氣極度沮喪，似乎遇到了極大的委屈。然而此時此刻，經過一整天高強度工作的你，心靈電量只剩下 10%，疲憊萬分。這時，你會怎麼選擇？',
    options: [
      {
        id: 'optA',
        title: '選項 A: 溫柔傾聽',
        desc: '強撐起精神立刻聽他訴說，把疲累壓在心底，全心全意陪伴他。',
        feedback: '「愛人之前，也要好好擁抱今天辛苦的自己呀。」',
        character: '小艾',
        advice: '你擁有一顆無比善良與慈悲的心，總是把別人的需要放在第一位。但請記得，空了的杯子是無法倒出溫暖的水的。懂得適時為自己充電，不是冷漠，而是更長遠的體貼。'
      },
      {
        id: 'optB',
        title: '選項 B: 溫柔界線',
        desc: '溫柔但堅定地告訴他：「我很在乎你，但我現在狀態不好。我們約明天午茶，讓我好好聽你說。」',
        feedback: '「健康的界線，不是冷漠的屏障，而是保護愛意自由流動的籬笆。」',
        character: '思野',
        advice: '你展現了極高的關係智慧。健康的關係建立在真實與尊重之上。溫柔地劃定邊界，不僅保護了你，也給了對方學習尊重他人邊界的機會。這樣的關係才能呼吸，才能長久。'
      },
      {
        id: 'optC',
        title: '選項 C: 理智解方',
        desc: '一邊聽，一邊快速幫他分析問題的利弊得失，提供三條實用的解決方案。',
        feedback: '「理智能釐清眼前的迷霧，但有時，對方需要的只是一句溫暖的『我在』。」',
        character: '小思',
        advice: '你是一個出色的問題解決者，邏輯清晰、充滿力量。但有時候，心靈的委屈和情緒需要的是『被看見』與『被接納』，而非迅速的分析與診斷。試著先給一個無聲的擁抱，再亮起智慧的探照燈吧。'
      }
    ]
  },
  {
    id: 'sc2',
    title: '不完美的完美演出',
    situation: '一場準備了三個月的重要成果發表會結束了。雖然整體大獲成功，但你在中途因為緊張，講錯了一個關鍵數據，並卡頓了三秒。回到座位後，你會把焦點放在哪裡？',
    options: [
      {
        id: 'optD',
        title: '選項 A: 自責反省',
        desc: '反覆回想卡頓的三秒鐘，感到萬分自責，甚至覺得之前的努力都白費了。',
        feedback: '「接受不完美的演出，本身就是生命裡最美麗的一場修剪。」',
        character: '小艾',
        advice: '你對自己有很高的期許。但是，完美的藝術在於擁抱瑕疵。那卡頓的三秒鐘，恰恰是你作為一個有血有肉的人最真實、最可愛的瞬間。請感謝自己前行的每一步。'
      },
      {
        id: 'optE',
        title: '選項 B: 理性復盤',
        desc: '冷靜記錄失誤，分析卡頓的原因，寫下改善措施，並將其視為一次絕佳的學習。',
        feedback: '「迷惘與失誤是墨水，而你才是那個握著筆書寫答案的人。」',
        character: '小思',
        advice: '你擁有極佳的成長思維！懂得從失誤中提取養分，這是邁向卓越的核心力量。不過復盤之後，別忘了合上筆記本，溫柔地對鏡子裡的自己說一句「你今天表現得太棒了」。'
      }
    ]
  }
];

const cardsList = [
  { id: 'card-1', category: '道德實驗', question: '如果拯救五個陌生人需要犧牲一個你深愛的人，你會如何抉擇？生命的價值可以用數量來衡量嗎？' },
  { id: 'card-2', category: '價值排序', question: '如果生命只剩下最後三天，自由、名譽、真愛與安寧，你會把哪一項排在最首位？為什麼？' },
  { id: 'card-3', category: '關係邊界', question: '當愛人的期待與你的夢想發生嚴重衝突時，退讓是愛的表現，還是對自我的背叛？邊界在哪裡？' },
  { id: 'card-4', category: '孤獨練習', question: '想像一個完全沒有人認識你的星球，在那裡，你最想做的一件不曾做過的事是什麼？是什麼阻礙了你？' }
];

export default function ReflectionLab({ activeCharacter }: ReflectionLabProps) {
  const [activeSc, setActiveSc] = useState('sc1');
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [journalText, setJournalText] = useState('');
  const [isJournalSaved, setIsJournalSaved] = useState(false);

  // Cognitive Lab Hub Integration
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [hubInitialTab, setHubInitialTab] = useState<'psychology' | 'intelligence' | 'divination' | 'gomoku' | 'biochem'>('psychology');

  // Capsule Navigation Tab
  const [capsuleTab, setCapsuleTab] = useState<'game' | 'writing'>('game');

  // Card 1 States (道德實驗)
  const [moralWeight, setMoralWeight] = useState(50);
  const [moralModifiers, setMoralModifiers] = useState<string[]>([]);

  // Card 2 States (價值排序)
  const [orderedValues, setOrderedValues] = useState<string[]>([
    '自由 🕊️ (擺脫世俗羈絆，靈魂自在飛翔)',
    '真愛 💖 (與所愛相濡以沫，靈魂深切相擁)',
    '安寧 🌾 (回歸內心沉靜，安詳歸於太虛)',
    '名譽 🏆 (留下不滅印記，生命印記永存)'
  ]);
  const [showValueResult, setShowValueResult] = useState(false);

  // Card 3 States (關係邊界)
  const [boundaryQuiz, setBoundaryQuiz] = useState<Record<string, string>>({});
  const [showBoundaryResult, setShowBoundaryResult] = useState(false);

  // Card 4 States (孤獨練習)
  const [planetTheme, setPlanetTheme] = useState<'blue' | 'amber' | 'purple'>('blue');
  const [dreamAction, setDreamAction] = useState('在大雨中裸奔，感受雨滴拍打在肌膚上的絕對自由 🌧️');
  const [customDream, setCustomDream] = useState('');
  const [poppedObstacles, setPoppedObstacles] = useState<string[]>([]);
  const [showPlanetResult, setShowPlanetResult] = useState(false);

  const currentSc = scenariosList.find((s) => s.id === activeSc) || scenariosList[0];
  const activeOptData = currentSc.options.find((o) => o.id === selectedOpt);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
      
      {/* Center columns */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Unified Reflection Lab Navigation Header */}
        <div className="bg-white/95 p-4 rounded-3xl border border-[#7C5B8C]/12 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7C5B8C]/10 flex items-center justify-center text-[#7C5B8C]">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-[#4E4158] text-xs sm:text-sm">思辨探索實驗室</h3>
              <p className="text-[9px] text-[#9A8AA6] font-sans">
                理性與感性的完美交織 ∙ 與內心對話的思維空間
              </p>
            </div>
          </div>

          <div className="flex bg-[#FAF7F2] p-1 rounded-2xl border border-purple-100/50 max-w-xs shrink-0 self-start sm:self-auto">
            <button
              id="subtab-theatre"
              onClick={() => setIsHubOpen(false)}
              className={`px-4 py-2 text-[11px] font-serif font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                !isHubOpen
                  ? 'bg-white text-[#7C5B8C] shadow-2xs border border-[#7C5B8C]/15'
                  : 'text-[#9A8AA6] hover:text-[#4E4158]'
              }`}
            >
              <span>🎭 劇場與思辨卡</span>
            </button>
            <button
              id="subtab-cognitive"
              onClick={() => setIsHubOpen(true)}
              className={`px-4 py-2 text-[11px] font-serif font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                isHubOpen
                  ? 'bg-white text-[#7C5B8C] shadow-2xs border border-[#7C5B8C]/15'
                  : 'text-[#9A8AA6] hover:text-[#4E4158]'
              }`}
            >
              <span>🧠 認知思維房</span>
            </button>
          </div>
        </div>

        {isHubOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4"
          >
            {/* Back button */}
            <div className="flex justify-between items-center px-1">
              <button
                id="back-to-lab-btn"
                onClick={() => setIsHubOpen(false)}
                className="text-xs text-[#9A8AA6] hover:text-[#7C5B8C] font-serif font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                ← 返回 🎭 劇場與思辨卡
              </button>
              <span className="text-xxs font-mono text-[#9A8AA6] bg-[#7C5B8C]/5 px-3 py-1 rounded-full border border-[#7C5B8C]/10 font-bold uppercase tracking-widest">
                Interactive Space
              </span>
            </div>

            <CognitiveLabHub 
              activeCharacter={activeCharacter} 
              initialTab={hubInitialTab} 
              onBackToLab={() => setIsHubOpen(false)} 
            />
          </motion.div>
        ) : (
          <>
            {/* Banner with custom Cover Illustration */}
        <div 
          style={{ backgroundImage: `url(${IMAGES.illustrationSolitude})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
          className="rounded-3xl p-6 md:p-8 border border-purple-100/40 relative overflow-hidden min-h-[220px] flex items-end shadow-xs"
        >
          {/* Glassmorphic overlay to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="relative z-10 max-w-xl text-white">
            <span className="text-[9px] bg-[#7C5B8C] text-white px-2 py-0.5 rounded-full font-bold font-sans uppercase tracking-widest">
              COVER ∙ 思辨實驗
            </span>
            <h2 className="font-serif text-xl md:text-2xl font-bold mt-2 leading-tight drop-shadow-sm">
              開啟思辨實驗，<br />
              鍛鍊心靈的勇氣與理智。
            </h2>
            <p className="text-[10px] text-purple-100 leading-relaxed mt-1.5 font-sans font-medium drop-shadow-xs">
              「喜歡獨處，是我對自己最溫柔的體貼。」在假設的生命劇場裡，看見另一種溫柔且深刻的答案。
            </p>
          </div>
        </div>

        {/* 互動劇場 Interactive choice theater */}
        <div className="bg-white/80 p-5 rounded-3xl border border-[#7C5B8C]/12 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-purple-50">
            <h4 className="font-serif text-xs font-bold text-[#4E4158] flex items-center gap-1.5">
              <span>🎭</span> 心靈互動劇場
            </h4>
            <div className="flex gap-1.5">
              {scenariosList.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setActiveSc(sc.id);
                    setSelectedOpt(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold transition-all ${
                    activeSc === sc.id
                      ? 'bg-[#7C5B8C] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#9A8AA6] hover:bg-purple-50/50'
                  }`}
                >
                  劇場 0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#FAF7F2]/40 p-4 rounded-2xl border border-purple-100/20">
            <span className="text-[10px] text-[#7C5B8C] font-semibold font-mono tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              SITUATION 劇場情境 🌾
            </span>
            <h5 className="font-serif font-bold text-xs text-[#4E4158] mt-2.5 leading-relaxed">
              {currentSc.title}
            </h5>
            <p className="text-xs text-[#4E4158]/90 leading-relaxed mt-2 font-sans">
              {currentSc.situation}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 mt-2">
            {currentSc.options.map((opt) => {
              const isSelected = selectedOpt === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`theatre-option-${opt.id}`}
                  onClick={() => setSelectedOpt(opt.id)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF5EF]/95 border-[#7C5B8C]/40 shadow-sm'
                      : 'bg-white/40 hover:bg-white/70 border-purple-100/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                    isSelected ? 'bg-[#7C5B8C] border-[#7C5B8C] text-white' : 'border-purple-200 text-purple-400 group-hover:border-[#7C5B8C]'
                  }`}>
                    {isSelected ? '✓' : ''}
                  </div>
                  <div>
                    <h6 className="font-serif font-bold text-xs text-[#4E4158]">{opt.title}</h6>
                    <p className="text-xs text-[#9A8AA6] mt-1 font-sans leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Animate-in feedback and advice card */}
          <AnimatePresence mode="wait">
            {selectedOpt && activeOptData && (
              <motion.div
                key={activeOptData.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-br from-[#FAF5EF]/60 to-[#FDF4F5]/40 p-5 rounded-2xl border border-[#7C5B8C]/15 shadow-sm mt-3 relative overflow-hidden"
              >
                <div className="flex items-center gap-2.5 pb-2 border-b border-purple-100/30">
                  <span className="text-xl">🎐</span>
                  <span className="font-serif font-bold text-xs text-[#4E4158]">
                    {activeOptData.character}的療癒解讀：
                  </span>
                </div>
                
                <p className="mt-3 font-serif font-semibold text-xs text-[#7C5B8C] leading-relaxed italic">
                  {activeOptData.feedback}
                </p>

                <p className="mt-3.5 text-xs text-[#4E4158]/90 leading-relaxed font-sans">
                  {activeOptData.advice}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 生命教育思辨卡 drawer card selection */}
        <div>
          <h4 className="font-serif text-xs font-bold text-[#4E4158] mb-4 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#7C5B8C]" />
            生命教育思辨卡
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {cardsList.map((card) => {
              const isSelected = activeCardId === card.id;
              return (
                <button
                  key={card.id}
                  id={`reflection-card-select-${card.id}`}
                  onClick={() => {
                    setActiveCardId(card.id);
                    setIsJournalSaved(false);
                    setJournalText('');
                  }}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[150px] relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#FAF5EF] to-[#FAF6F0] border-[#7C5B8C]/50 shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-purple-50/10 border-purple-100/40 shadow-xs'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-purple-600 bg-purple-50/50 px-2 py-0.5 rounded border border-purple-100/20 font-sans font-medium">
                      #{card.category}
                    </span>
                    <p className="mt-3.5 font-serif font-bold text-[11px] text-[#4E4158] leading-relaxed">
                      {card.question}
                    </p>
                  </div>
                  <span className="text-[9px] text-[#9A8AA6] font-sans block mt-4 flex items-center gap-0.5">
                    展開對話書寫 <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Inline Exploration Capsule for selected question card */}
          <AnimatePresence>
            {activeCardId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/85 border border-[#7C5B8C]/15 rounded-3xl p-6 mt-4 flex flex-col gap-4 shadow-sm overflow-hidden"
              >
                {/* Capsule Header */}
                <div className="flex justify-between items-center pb-3 border-b border-purple-50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🪐</span>
                    <h5 className="font-serif text-xs font-bold text-[#4E4158] flex flex-col">
                      <span>思辨探索實驗艙</span>
                      <span className="text-[9px] text-[#9A8AA6] font-normal font-sans">
                        正在探索：#{cardsList.find(c => c.id === activeCardId)?.category}
                      </span>
                    </h5>
                  </div>
                  <button
                    id="close-reflection-writing"
                    onClick={() => {
                      setActiveCardId(null);
                      setShowValueResult(false);
                      setShowBoundaryResult(false);
                      setShowPlanetResult(false);
                    }}
                    className="text-[10px] text-purple-400 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    <span>關閉</span>
                  </button>
                </div>

                {/* Focus Question Banner */}
                <div className="bg-[#FAF7F2]/60 p-3.5 rounded-2xl border border-purple-100/10 text-xs text-[#4E4158] font-serif leading-relaxed italic relative">
                  <div className="absolute -top-2 left-4 text-[7px] font-sans font-extrabold tracking-widest bg-[#7C5B8C] text-white px-1.5 py-0.5 rounded">CORE QUESTION 核心命題</div>
                  「{cardsList.find(c => c.id === activeCardId)?.question}」
                </div>

                {/* Sub-tabs inside Capsule */}
                <div className="flex border-b border-purple-50/50 p-0.5 bg-[#FAF7F2]/50 rounded-xl max-w-xs">
                  <button
                    onClick={() => setCapsuleTab('game')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      capsuleTab === 'game'
                        ? 'bg-white text-[#7C5B8C] shadow-2xs'
                        : 'text-[#9A8AA6] hover:text-[#4E4158]'
                    }`}
                  >
                    <Gamepad2 className="w-3 h-3" />
                    <span>互動解密/測驗</span>
                  </button>
                  <button
                    onClick={() => setCapsuleTab('writing')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      capsuleTab === 'writing'
                        ? 'bg-white text-[#7C5B8C] shadow-2xs'
                        : 'text-[#9A8AA6] hover:text-[#4E4158]'
                    }`}
                  >
                    <ArrowRight className="w-3 h-3" />
                    <span>心靈自由寫作</span>
                  </button>
                </div>

                {/* TAB CONTENT: 1. INTERACTIVE GAME / QUIZ */}
                {capsuleTab === 'game' && (
                  <div className="flex flex-col gap-3 py-1">
                    
                    {/* Card 1: 道德實驗 (Moral Balance) */}
                    {activeCardId === 'card-1' && (
                      <div className="flex flex-col gap-4">
                        <div className="bg-[#FAF7F2]/60 p-4 rounded-2xl border border-purple-100/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Scale className="w-4 h-4 text-purple-600 animate-pulse" />
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">天平精密校準中</span>
                          </div>
                          <p className="text-xs text-[#4E4158] leading-relaxed">
                            <strong>生命價值探索：</strong>在此實驗中，左端代表「絕對的情感與所愛」，右端代表「純粹的功利與眾人數量」。
                            請拖動滑桿，傾聽你內心的天平會傾斜到何處。
                          </p>
                        </div>

                        {/* Slider Section */}
                        <div className="bg-[#FAF5EF]/40 p-5 rounded-2xl border border-purple-100/30 flex flex-col gap-3">
                          <div className="flex justify-between text-[11px] font-bold text-[#4E4158]">
                            <span className="flex items-center gap-1 text-purple-600">💖 絕對守護摯愛</span>
                            <span className="flex items-center gap-1 text-pink-600">👥 功利救贖五人</span>
                          </div>
                          
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={moralWeight}
                            onChange={(e) => setMoralWeight(Number(e.target.value))}
                            className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#7C5B8C]"
                          />

                          <div className="flex justify-between items-center text-[10px] text-[#9A8AA6] font-mono mt-1">
                            <span>守護值: {100 - moralWeight}%</span>
                            <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                              目前平衡狀態：{
                                moralWeight === 50 ? '⚖️ 極致痛苦的中心點' :
                                moralWeight < 35 ? '💖 心向所愛，重情重義' :
                                moralWeight > 65 ? '👥 大局為重，理智博愛' :
                                '🌀 搖擺於情感與功利之間'
                              }
                            </span>
                            <span>救贖值: {moralWeight}%</span>
                          </div>
                        </div>

                        {/* Modifiers Checkboxes */}
                        <div className="flex flex-col gap-2.5 bg-white/50 p-4 rounded-2xl border border-purple-100/30">
                          <span className="text-[10px] font-bold text-[#9A8AA6] tracking-wider uppercase">🏷️ 載入外部道德微調參數 (複選)</span>
                          
                          {[
                            { id: 'loved-willing', label: '如果摯愛深明大義，在旁懇求你拉下開關犧牲他來救五人...' },
                            { id: 'stranger-kids', label: '如果那五個被困在軌道上的陌生人，全都是稚嫩無辜的小孩...' },
                            { id: 'lever-direct', label: '如果需要你親手手握重錘，一擊致死，而非拉下遠端自動拉桿...' }
                          ].map(mod => {
                            const isChecked = moralModifiers.includes(mod.id);
                            return (
                              <button
                                key={mod.id}
                                onClick={() => {
                                  if (isChecked) {
                                    setMoralModifiers(moralModifiers.filter(id => id !== mod.id));
                                  } else {
                                    setMoralModifiers([...moralModifiers, mod.id]);
                                  }
                                }}
                                className={`text-left p-3 rounded-xl border text-[11px] font-medium leading-relaxed flex items-start gap-2.5 transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-[#FAF5EF] border-[#7C5B8C]/40 text-[#4E4158] font-bold'
                                    : 'bg-[#FAF7F2]/30 border-purple-100/20 text-[#9A8AA6] hover:bg-purple-50/20'
                                }`}
                              >
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5 text-[8px] ${
                                  isChecked ? 'bg-[#7C5B8C] border-[#7C5B8C] text-white' : 'border-purple-200'
                                }`}>
                                  {isChecked ? '✓' : ''}
                                </div>
                                <span>{mod.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Dynamic Analysis Card */}
                        <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-5 rounded-2xl border border-[#7C5B8C]/15 shadow-2xs mt-1">
                          <div className="flex items-center gap-1.5 pb-2 border-b border-purple-100/30 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" style={{ animationDuration: '4s' }} />
                            <h6 className="font-serif font-bold text-xs text-[#4E4158]">天平折射 ∙ 心靈哲學圖譜：</h6>
                          </div>

                          <p className="text-xs text-[#4E4158]/95 font-serif font-medium leading-relaxed italic text-purple-800">
                            {
                              moralWeight < 35 
                                ? '「在你的心靈宇宙中，愛的純度高於一切抽象的數量。你相信，如果連身邊最愛的人都必須被犧牲，那拯救世界的『正義』也將是一片冰冷而空洞的荒原。」'
                                : moralWeight > 65 
                                ? '「你擁有一顆俯瞰人性迷霧的理智靈魂。你選擇忍受極致的個人悲痛與內疚，只為換取更多家庭的完整。這是一條無比沉重，但閃耀著群體功利效益的鐵血道路。」'
                                : '「你正站在靈魂最痛苦、也最美麗的掙扎中。你不願背叛心靈深處最深沉的愛意，也無法冷酷地面對五個鮮活生命在眼前消逝。這種左右搖擺，正是你對生命具有極高敬畏的佐證。」'
                            }
                          </p>

                          {/* Advice from modifiers */}
                          {moralModifiers.length > 0 && (
                            <div className="mt-4 pt-3.5 border-t border-purple-100/30 space-y-2 text-[11px] text-[#4E4158]/80 leading-relaxed font-sans">
                              <div className="font-bold text-[#7C5B8C]">🔍 微調參數疊加干涉分析：</div>
                              {moralModifiers.includes('loved-willing') && (
                                <p>💡 <strong>關於摯愛的求死：</strong>當摯愛主動給予了同意，這場悲劇染上了崇高的犧牲光輝。然而，這也將在你的靈魂深處刻下最難以釋懷的溫柔和懷念，成為你一生的思念之軛。</p>
                              )}
                              {moralModifiers.includes('stranger-kids') && (
                                <p>💡 <strong>關於陌生幼童：</strong>五個幼童的加入，使得生命的「未來長度」在功利天平上產生了極大的傾斜，這極限地挑戰著你純粹守護摯愛的本能。</p>
                              )}
                              {moralModifiers.includes('lever-direct') && (
                                <p>💡 <strong>關於親手動手：</strong>「親自動手」的肉體沉重感，是拉開「紙上哲學討論」與「真實血肉抉擇」最難以逾越的鴻溝。它迫使你直面行為背後的切實因果。</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Card 2: 價值排序 (Value Sorter) */}
                    {activeCardId === 'card-2' && (
                      <div className="flex flex-col gap-4">
                        <div className="bg-[#FAF7F2]/60 p-4 rounded-2xl border border-purple-100/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" style={{ animationDuration: '8s' }} />
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">極簡價值校準</span>
                          </div>
                          <p className="text-xs text-[#4E4158] leading-relaxed">
                            <strong>排序挑戰：</strong>想像生命即將在三天（72小時）後畫下句點。在有限的維度內，以下四種核心價值，你會如何排序？
                            請使用右側的 <span className="font-bold">▲ 上移</span> 與 <span className="font-bold">▼ 下移</span>，將最不願放手的價值排在最上方（第 1 位）。
                          </p>
                        </div>

                        {/* List Sorter Container */}
                        <div className="flex flex-col gap-2 bg-purple-50/10 p-4 rounded-2xl border border-purple-100/20">
                          {orderedValues.map((val, idx) => {
                            const moveItem = (index: number, direction: 'up' | 'down') => {
                              const newIndex = direction === 'up' ? index - 1 : index + 1;
                              if (newIndex < 0 || newIndex >= orderedValues.length) return;
                              const copy = [...orderedValues];
                              const temp = copy[index];
                              copy[index] = copy[newIndex];
                              copy[newIndex] = temp;
                              setOrderedValues(copy);
                              setShowValueResult(false);
                            };

                            return (
                              <div
                                key={val}
                                className="flex items-center justify-between bg-white px-4 py-3.5 rounded-xl border border-purple-100/40 shadow-2xs transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    idx === 0 ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-200' :
                                    idx === 3 ? 'bg-gray-100 text-gray-500' :
                                    'bg-purple-50 text-[#7C5B8C]'
                                  }`}>
                                    {idx + 1}
                                  </span>
                                  <span className="text-xs font-bold text-[#4E4158] font-serif">{val}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => moveItem(idx, 'up')}
                                    className="p-1 text-purple-400 hover:text-purple-700 hover:bg-purple-50 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors cursor-pointer"
                                    title="上移"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    disabled={idx === orderedValues.length - 1}
                                    onClick={() => moveItem(idx, 'down')}
                                    className="p-1 text-purple-400 hover:text-purple-700 hover:bg-purple-50 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors cursor-pointer"
                                    title="下移"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Action and Result Display */}
                        <div className="flex justify-center mt-1">
                          {!showValueResult ? (
                            <button
                              onClick={() => setShowValueResult(true)}
                              className="bg-[#7C5B8C] hover:bg-[#684a75] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>鎖定這份人生價值藍圖</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setShowValueResult(false)}
                              className="bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-[#7C5B8C] text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>重新調整順序</span>
                            </button>
                          )}
                        </div>

                        {showValueResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-amber-50/40 via-purple-50/20 to-transparent p-5 rounded-2xl border border-amber-200/40 shadow-xs"
                          >
                            <div className="flex items-center gap-1.5 pb-2 border-b border-purple-100/30 mb-3">
                              <Brain className="w-4 h-4 text-amber-500" />
                              <h6 className="font-serif font-bold text-xs text-[#4E4158]">價值沙漏 ∙ 靈魂剖析報告：</h6>
                            </div>

                            <div className="space-y-4 text-xs leading-relaxed">
                              <div>
                                <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-100/50">
                                  🌟 靈魂核心之錨：{orderedValues[0].split(' ')[0]}
                                </span>
                                <p className="mt-2 text-[#4E4158] font-serif pl-1">
                                  {orderedValues[0].includes('自由') && '【自由飛翔的羽翼】你是一隻天生不願受任何籠牢與世俗框架束縛的靈鳥。在最後的時光裡，你拒絕所有的道德綁架與情感勒索，只想在無垠的蒼穹下，呼出最後一口乾淨、獨立的氣息。你的存在，即是對生命主權最崇高的宣示。'}
                                  {orderedValues[0].includes('真愛') && '【永恆熾熱的重力】在你的心靈宇宙中，愛是唯一的引力。沒有愛的生命，只是一片失重的太空垃圾。最後的三天，你只想緊緊握住愛人的手，在彼此熟悉的體溫、微笑與注視中，溫柔而毫無遺憾地融化。'}
                                  {orderedValues[0].includes('安寧') && '【回歸太虛的寂靜】你渴望極度的平靜。不要喧囂，不要悲壯，不要繁複的儀式。你只想坐在一棵開滿晚櫻的樹下，看夕陽一點點隱沒在山嵐之中。你的心靈已與自然同頻，這是一種超越生死的安詳。'}
                                  {orderedValues[0].includes('名譽') && '【豐碑與刻痕的追尋】你希望自己活過的證據不被風化，渴望在人類的集體記憶、作品或歷史中留下一道不滅的刻痕。最後的三天，你希望總結一生的奉獻，在眾人的尊崇與注視中，完成最完美的謝幕。'}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-purple-100/20">
                                <span className="font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                  🍂 紅塵放手之物：{orderedValues[3].split(' ')[0]}
                                </span>
                                <p className="mt-2 text-[#9A8AA6] font-sans pl-1">
                                  在你生命的極簡清單中，你率先放下了「{orderedValues[3].split(' ')[0]}」。這代表著你在最後關頭，展現了極致的斷捨離智慧，看透了它的虛浮與對靈魂前行的消耗。
                                </p>
                              </div>

                              <div className="bg-white/60 p-3 rounded-xl border border-[#7C5B8C]/10 text-[#4E4158] font-sans mt-2">
                                💡 <strong>思野的啟示：</strong>「孩子，人生最大的遺憾，莫過於在喧囂時追逐他人眼裡的第 1 順位，卻在落幕時發現那從不是自己靈魂想要的。藉由這份排序，在生活中試著給予 {orderedValues[0].split(' ')[0]} 更多的空間與擁抱吧。」
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Card 3: 關係邊界 (Relationship Quiz) */}
                    {activeCardId === 'card-3' && (
                      <div className="flex flex-col gap-4">
                        <div className="bg-[#FAF7F2]/60 p-4 rounded-2xl border border-purple-100/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">關係彈性光譜檢測</span>
                          </div>
                          <p className="text-xs text-[#4E4158] leading-relaxed">
                            <strong>關係邊界測驗：</strong>當「愛人的期待」與「自我的夢想與需求」發生嚴重碰撞時，你會如何反應？
                            請完成以下 3 題真實情境心理測驗，看看你的邊界是由什麼材質構成的吧！
                          </p>
                        </div>

                        {/* Quiz Questions */}
                        <div className="flex flex-col gap-4">
                          {[
                            {
                              id: 'bq1',
                              q: '1. 當伴侶的工作被調派至國外三年，極度渴望你放棄現有極佳的職業理想，一同前往陪伴他...',
                              opts: [
                                { key: 'A', text: '毫不猶豫放棄現有工作，對我來說，他的夢想就是我們家庭唯一的幸福。' },
                                { key: 'B', text: '堅決拒絕！感情不能以犧牲自我發展為代價，即使因此面臨分手也絕不退讓。' },
                                { key: 'C', text: '深入探討，尋找折衷：如協議遠距離一年，或他在國外幫我尋求相同產業的工作機會。' }
                              ]
                            },
                            {
                              id: 'bq2',
                              q: '2. 經歷一整天高強度工作，你已心力交瘁、只想安靜放空；伴侶卻因為日常摩擦突然大哭，指責你不夠關心他...',
                              opts: [
                                { key: 'A', text: '強壓下自身的疲憊與煩躁，無條件哄抱他，直到他情緒完全恢復。' },
                                { key: 'B', text: '感到窒息與憤怒，冷冷說句「你真的很無理取鬧」然後關門回房上鎖。' },
                                { key: 'C', text: '抱抱他並溫柔地說：「我很在乎你，但我現在真的累到無法思考。給我一個小時安靜，等下好好聽你說。」' }
                              ]
                            },
                            {
                              id: 'bq3',
                              q: '3. 伴侶主動索取你所有的社群密碼，理由是：「真正的恩愛是不該留有一絲絲個人隱私與秘密的」...',
                              opts: [
                                { key: 'A', text: '大方給予，甚至主動打開給他隨時翻閱，認為這是打消他不安最直接的做法。' },
                                { key: 'B', text: '嚴詞拒絕！痛斥對方控制欲太強、不尊重基本的個人隱私，因此大吵一架。' },
                                { key: 'C', text: '同意給密碼展現坦誠，但同時認真約定「在非緊急情況下不隨意翻閱」的互相尊重底線。' }
                              ]
                            }
                          ].map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-purple-100/30 flex flex-col gap-2">
                              <span className="text-xs font-bold text-[#4E4158] font-serif leading-relaxed">{item.q}</span>
                              <div className="flex flex-col gap-2 mt-1.5">
                                {item.opts.map((opt) => {
                                  const isSelected = boundaryQuiz[item.id] === opt.key;
                                  return (
                                    <button
                                      key={opt.key}
                                      onClick={() => {
                                        setBoundaryQuiz({ ...boundaryQuiz, [item.id]: opt.key });
                                        setShowBoundaryResult(false);
                                      }}
                                      className={`text-left p-3 rounded-xl border text-[11px] leading-relaxed transition-all cursor-pointer flex items-start gap-2.5 ${
                                        isSelected
                                          ? 'bg-[#FAF5EF] border-[#7C5B8C]/40 text-[#4E4158] font-bold shadow-2xs'
                                          : 'bg-transparent border-purple-100/20 text-[#9A8AA6] hover:bg-purple-50/10'
                                      }`}
                                    >
                                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[8.5px] font-bold ${
                                        isSelected ? 'bg-[#7C5B8C] border-[#7C5B8C] text-white' : 'border-purple-200'
                                      }`}>
                                        {opt.key}
                                      </span>
                                      <span>{opt.text}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Submit button */}
                        <div className="flex justify-center mt-1">
                          <button
                            disabled={Object.keys(boundaryQuiz).length < 3}
                            onClick={() => setShowBoundaryResult(true)}
                            className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Gamepad2 className="w-3.5 h-3.5" />
                            <span>計算關係彈性報告</span>
                          </button>
                        </div>

                        {showBoundaryResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-5 rounded-2xl border border-[#7C5B8C]/15 shadow-2xs"
                          >
                            <div className="flex items-center gap-1.5 pb-2 border-b border-purple-100/30 mb-3">
                              <CheckCircle className="w-4 h-4 text-purple-600" />
                              <h6 className="font-serif font-bold text-xs text-[#4E4158]">檢測報告 ∙ 關係界線材質剖析：</h6>
                            </div>

                            {/* Compute result type */}
                            {(() => {
                              const counts = { A: 0, B: 0, C: 0 };
                              Object.values(boundaryQuiz).forEach(val => {
                                if (val === 'A' || val === 'B' || val === 'C') {
                                  counts[val]++;
                                }
                              });

                              let resultTitle = '';
                              let resultDesc = '';
                              let resultAdvice = '';

                              if (counts.A >= 2) {
                                resultTitle = '🏺 泥土型邊界 (Clay Boundary) — 犧牲退讓型';
                                resultDesc = '【無條件融化的黏土】你的關係邊界像軟泥一樣，極易為了迎合對方的喜怒哀樂與期待，而被隨意捏塑、擠壓。你常把「無條件的妥協」誤解為偉大的愛，卻在無形中將自我的生命版圖與尊嚴壓縮至窒息點。';
                                resultAdvice = '小艾悄悄對你說：「孩子，愛一盞燈的前提，是別讓燈油被榨乾。沒有真實自我的依附，最終只會孕育出怨懟。學會溫柔地說『不』，才是對愛人最健康、最誠實的陪伴。」';
                              } else if (counts.B >= 2) {
                                resultTitle = '💎 玻璃型邊界 (Glass Boundary) — 硬質防衛型';
                                resultDesc = '【高硬度易碎的玻璃】你的關係邊界堅硬、防護罩極厚。你極易將對方合理的情感索求、示弱與妥協，視為對你個人領域與自由的威脅，進而像刺蝟一樣築起高牆或進行冷酷的反擊。';
                                resultAdvice = '小思理性分析：「這種高硬度的防護雖保護了你的主權，但也容易在情感衝突中，因為缺乏緩衝與彈性，而將關係震得粉碎。試著在堅硬的盔甲上，開一扇溫柔、流動的窗吧。」';
                              } else if (counts.C >= 2) {
                                resultTitle = '☯️ 水流型邊界 (Water Boundary) — 動態彈性型';
                                resultDesc = '【圓融且具彈性的動態水流】你展現了極高的關係智慧！你的界線既不扁塌退讓，也不死板剛直。你懂得在尊重自身夢想與極限的同時，也溫柔地接納對方的脆弱與不安。你像溫暖的水，在「我」與「我們」之間自如流淌。';
                                resultAdvice = '思野微笑點頭：「這是一種極佳的境界。懂得為愛留下邊界，同時又具有可流動的彈性。這樣的關係能自由呼吸，滋養彼此，走得最為長久與幸福。」';
                              } else {
                                resultTitle = '🌀 混合探索型 (Hybrid Boundary) — 動態重構中';
                                resultDesc = '【尋求平衡的靈魂探索者】你在不同的情境下展現出不同的邊界策略。在工作與大局上你可能無奈妥協（泥土），在隱私上卻極度抗拒（玻璃）。這表明你的心靈正在經歷一段「邊界重建與磨合期」。';
                                resultAdvice = '小艾與小思一齊拍拍你的肩膀：「這很正常，我們都在一邊受傷，一邊學習畫界線。在每一次拉扯中，更清晰地認識自我的底線，這就是成長的禮物。」';
                              }

                              return (
                                <div className="space-y-3.5 text-xs leading-relaxed">
                                  <span className="font-bold text-purple-800 bg-purple-100/85 px-2.5 py-1 rounded-lg border border-purple-200">
                                    {resultTitle}
                                  </span>
                                  <p className="text-[#4E4158] font-sans mt-2">
                                    {resultDesc}
                                  </p>
                                  <div className="bg-white/70 p-3 rounded-xl border border-[#7C5B8C]/15 text-[#7C5B8C] font-serif">
                                    {resultAdvice}
                                  </div>
                                </div>
                              );
                            })()}
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Card 4: 孤獨練習 (Space courage bottle) */}
                    {activeCardId === 'card-4' && (
                      <div className="flex flex-col gap-4">
                        <div className="bg-[#FAF7F2]/60 p-4 rounded-2xl border border-purple-100/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" style={{ animationDuration: '6s' }} />
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">靈魂孤獨太空實驗</span>
                          </div>
                          <p className="text-xs text-[#4E4158] leading-relaxed">
                            <strong>太空瓶挑戰：</strong>想像在一個完全無人認識你的遙遠星球上。在那裡，你的世俗身份與他人眼光徹底消失，
                            你最想做什麼？擊碎你現實中的焦慮氣球，讓勇氣漂流向宇宙！
                          </p>
                        </div>

                        {/* Step 1: Select Planet Atmosphere */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-[#9A8AA6] uppercase tracking-wider">🌟 步驟 1：選擇漂流星球大氣</span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'blue', name: '❄️ 冰川深藍', bg: 'bg-blue-900 text-blue-100 border-blue-500' },
                              { id: 'amber', name: '🏜️ 琥珀金沙', bg: 'bg-amber-900 text-amber-100 border-amber-500' },
                              { id: 'purple', name: '🌌 極光紫鏡', bg: 'bg-purple-900 text-purple-100 border-purple-500' }
                            ].map((planet) => {
                              const isSelected = planetTheme === planet.id;
                              return (
                                <button
                                  key={planet.id}
                                  onClick={() => {
                                    setPlanetTheme(planet.id as 'blue' | 'amber' | 'purple');
                                    setShowPlanetResult(false);
                                  }}
                                  className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center border transition-all cursor-pointer ${
                                    isSelected
                                      ? `${planet.bg} shadow-md scale-102 font-extrabold`
                                      : 'bg-white border-purple-100/30 text-[#9A8AA6] hover:bg-purple-50/10'
                                  }`}
                                >
                                  {planet.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Step 2: Choose Crazy Solitude Dream */}
                        <div className="flex flex-col gap-2 mt-1">
                          <span className="text-[10px] font-bold text-[#9A8AA6] uppercase tracking-wider">💃 步驟 2：選擇你想釋放的靈魂冒險</span>
                          <div className="flex flex-col gap-1.5">
                            {[
                              '在大雨中放聲裸奔，感受雨滴拍打在肌膚上的絕對自由 🌧️',
                              '站在深不可測的隕石懸崖邊，對著黑洞撕心裂肺地痛哭與怒吼 🗣️',
                              '在發光的螢光菌林裡，不看手機、不理世事，安靜睡上十天十夜 💤',
                              '親手建造一台收音機，專門收集超新星爆炸與流星落下的哭泣聲 📻',
                              '【自訂我的靈魂冒險...】'
                            ].map((item) => {
                              const isSelected = dreamAction === item;
                              return (
                                <button
                                  key={item}
                                  onClick={() => {
                                    setDreamAction(item);
                                    setShowPlanetResult(false);
                                  }}
                                  className={`text-left p-3 rounded-xl border text-[11px] leading-relaxed transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#FAF5EF] border-[#7C5B8C]/40 text-[#4E4158] font-bold shadow-2xs'
                                      : 'bg-transparent border-purple-100/20 text-[#9A8AA6] hover:bg-purple-50/10'
                                  }`}
                                >
                                  <span>{item}</span>
                                </button>
                              );
                            })}

                            {dreamAction === '【自訂我的靈魂冒險...】' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-1"
                              >
                                <input
                                  type="text"
                                  placeholder="輸入你想在無人星球上做的瘋狂小事..."
                                  value={customDream}
                                  onChange={(e) => {
                                    setCustomDream(e.target.value);
                                    setShowPlanetResult(false);
                                  }}
                                  className="w-full text-xs p-3 bg-white border border-purple-100 rounded-xl focus:outline-none focus:border-[#7C5B8C]"
                                />
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Step 3: Popping obstacles balloon */}
                        <div className="flex flex-col gap-2 mt-1">
                          <span className="text-[10px] font-bold text-[#9A8AA6] uppercase tracking-wider">🎈 步驟 3：親手擊碎束縛靈魂的塵世氣球 (點擊擊碎)</span>
                          
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {[
                              '社會世俗的審判眼光 👁️',
                              '對「不完美與失敗」的極度恐懼 🥺',
                              '無法喘息的現實經濟重擔 💼',
                              '迎合他人期待的迎合傾向 🎭'
                            ].map(ob => {
                              const isPopped = poppedObstacles.includes(ob);
                              return (
                                <button
                                  key={ob}
                                  onClick={() => {
                                    if (isPopped) {
                                      setPoppedObstacles(poppedObstacles.filter(o => o !== ob));
                                    } else {
                                      setPoppedObstacles([...poppedObstacles, ob]);
                                    }
                                    setShowPlanetResult(false);
                                  }}
                                  className={`p-3 rounded-xl border text-[10px] font-bold transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
                                    isPopped
                                      ? 'bg-red-50/30 border-red-200/30 text-red-300 line-through opacity-50 scale-98 shadow-inner'
                                      : 'bg-white hover:bg-purple-50/20 border-purple-100/40 text-[#4E4158] hover:scale-[1.02] active:scale-95 shadow-2xs'
                                  }`}
                                >
                                  <span className="truncate">{ob}</span>
                                  <span className="shrink-0 text-xs">{isPopped ? '💥' : '🎈'}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Step 4: Launch */}
                        <div className="flex justify-center mt-2">
                          <button
                            disabled={poppedObstacles.length === 0 || (dreamAction === '【自訂我的靈魂冒險...】' && !customDream.trim())}
                            onClick={() => setShowPlanetResult(true)}
                            className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Compass className="w-3.5 h-3.5 text-purple-200 animate-spin" style={{ animationDuration: '6s' }} />
                            <span>向星空發射我的勇氣瓶</span>
                          </button>
                        </div>

                        {showPlanetResult && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`rounded-2xl p-5 border text-xs leading-relaxed flex flex-col gap-3 shadow-md ${
                              planetTheme === 'blue' ? 'bg-gradient-to-br from-blue-950 to-indigo-900 border-blue-500/40 text-blue-100' :
                              planetTheme === 'amber' ? 'bg-gradient-to-br from-amber-950 to-orange-900 border-amber-500/40 text-amber-100' :
                              'bg-gradient-to-br from-purple-950 to-fuchsia-900 border-purple-500/40 text-purple-100'
                            }`}
                          >
                            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                              <span className="text-base animate-pulse">☄️</span>
                              <span className="font-serif font-bold text-xs">星空勇氣瓶 ∙ 宇宙發射報告：</span>
                            </div>

                            <div className="space-y-2.5 font-serif font-medium">
                              <p>
                                🛰️ <strong>座標：</strong>{
                                  planetTheme === 'blue' ? '❄️ 湛藍冰川星 — 幽深寒冷，只聽得見冰碎裂的聲音' :
                                  planetTheme === 'amber' ? '🏜️ 琥珀金沙星 — 永恆夕陽，溫暖、寂寥而曠遠' :
                                  '🌌 極光紫鏡星 — 極光垂天，鏡面大地折射奇幻光影'
                                }
                              </p>
                              <p className="text-[13px] text-white font-semibold leading-relaxed italic bg-white/5 py-2.5 px-3 rounded-lg border border-white/5">
                                「在完全無人認識你的世界裡，你決定勇敢去：{dreamAction === '【自訂我的靈魂冒險...】' ? customDream : dreamAction}」
                              </p>
                              <div className="text-[11px] font-sans opacity-85 leading-relaxed border-t border-white/5 pt-2.5">
                                <p className="font-bold text-amber-300">💥 你親手捏碎的塵世重力：</p>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {poppedObstacles.map(o => (
                                    <span key={o} className="bg-white/10 px-2 py-0.5 rounded border border-white/5 text-[9px] font-semibold">{o.replace(' 🎈', '').replace(' 💥', '').split(' ')[0]}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-3.5 bg-black/20 p-3 rounded-xl border border-white/5 text-[11px] font-sans italic opacity-95">
                                🌿 <strong>思野的靈魂寄語：</strong>「當你不再渴望觀眾的掌聲與評判，生命的野生舞蹈才真正開始。把這份在星空下大笑的膽量，像火種一般收進口袋吧。等回到地球的喧囂時，悄悄亮起來溫暖自己。」
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* TAB CONTENT: 2. HEART WRITING JOURNAL */}
                {capsuleTab === 'writing' && (
                  <div className="flex flex-col gap-3 py-1">
                    {isJournalSaved ? (
                      <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-800 rounded-xl p-4 text-xs font-sans leading-relaxed">
                        🌟 你的思辨答案已安全記錄在本地成長資料庫中！在人生的探索旅程裡，答案會隨時間不斷流轉、成熟。感謝你的誠實與智慧。
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={journalText}
                          onChange={(e) => setJournalText(e.target.value)}
                          placeholder="在這裡自由傾訴你內心最真實、最不加修飾的答案..."
                          rows={3}
                          className="w-full text-xs p-3 rounded-xl border border-purple-100 bg-purple-50/10 focus:outline-none focus:border-[#7C5B8C] font-sans"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                          <button
                            id="save-reflection-btn"
                            onClick={() => setIsJournalSaved(true)}
                            disabled={!journalText.trim()}
                            className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white font-sans text-xs py-2 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            記錄答案
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </>
        )}

      </div>

      {/* Right Column supportive widgets */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-[90px]">
        
        {/* Widget 1: 本週熱門實驗 */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50 mb-3 text-xs">
            <h4 className="font-serif font-bold text-[#4E4158] flex items-center gap-1.5">
              <span>📊</span> 本週熱門實驗
            </h4>
            <span className="text-[9px] text-[#9A8AA6]">熱度榜</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { rank: 1, name: '心靈電量 10% 的抉擇', rate: '86% 選擇溫柔界線', count: '14,284 參與', tab: 'psychology' },
              { rank: 2, name: '不完美的完美演出', rate: '52% 選擇自責反省', count: '11,270 參與', tab: 'intelligence' },
              { rank: 3, name: '電車難題的超人解法', rate: '35% 選擇自我犧牲', count: '8,421 參與', tab: 'divination' },
              { rank: 4, name: '當愛人的夢想發生衝突', rate: '71% 選擇溝通平衡', count: '6,315 參與', tab: 'gomoku' },
              { rank: 5, name: '生物化學與身心靈平衡', rate: '92% 選擇自覺鍛鍊', count: '5,108 參與', tab: 'biochem' }
            ].map((item) => (
              <button
                key={item.rank}
                onClick={() => {
                  setHubInitialTab(item.tab as any);
                  setIsHubOpen(true);
                  // Scroll to top to ensure they see the opened experiment instantly!
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left flex flex-col gap-1 text-xs font-sans p-2 -mx-2 hover:bg-[#7C5B8C]/5 rounded-2xl transition-all duration-300 group cursor-pointer relative"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${
                    item.rank <= 2 
                      ? 'bg-[#7C5B8C]/12 text-[#7C5B8C] group-hover:bg-[#7C5B8C] group-hover:text-white' 
                      : 'bg-[#FAF7F2] text-[#9A8AA6] group-hover:bg-[#7C5B8C] group-hover:text-white'
                  }`}>
                    {item.rank}
                  </span>
                  <span className="font-bold text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors line-clamp-1">{item.name}</span>
                  <span className="text-[7px] bg-purple-100 text-[#7C5B8C] px-1 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold absolute right-2">✨ 點擊</span>
                </div>
                <div className="flex justify-between text-[9px] text-[#9A8AA6] pl-6 w-full pr-1">
                  <span>{item.rate}</span>
                  <span>{item.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Widget 2: 今日思辨任務 Notebook tape sticky note */}
        <div className="bg-[#FAF5EF]/95 p-5 rounded-3xl border border-purple-200/20 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-4 notebook-tape rounded-xs"></div>
          
          <div className="pt-3 pb-1">
            <div className="flex justify-between items-center text-[9px] text-[#9A8AA6] font-serif border-b border-purple-100/30 pb-1">
              <span>今日思辨任務</span>
              <span>100 積分</span>
            </div>
            
            <p className="mt-4 font-serif text-xs font-semibold text-[#4E4158]/95 leading-relaxed">
              「如果今天你只能對一個人誠實地表達一次心聲，你會對誰說？說些什麼？」
            </p>
            <span className="text-[10px] text-[#9A8AA6] block mt-4 font-sans text-right">— 小思 💭</span>
          </div>
        </div>

        {/* Widget 3: 爺爺提醒你 / 思野提醒你 */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
            <Star className="w-4 h-4 text-amber-500 fill-amber-100" />
            <h4 className="font-serif text-xs font-bold text-[#4E4158]">思野的森林提醒</h4>
          </div>
          
          <div className="mt-3.5 text-xs text-[#4E4158]/85 leading-relaxed font-sans space-y-2">
            <p>
              「孩子，不要急著給生活下結論。思考，不是為了讓自己顯得比別人高明，而是為了給自己長出足夠溫柔且牢固的根。」
            </p>
            <p>
              「在安靜的樹蔭下，聽聽風吹過枝葉的聲音。你的直覺，往往比邏輯更能告訴你真實的答案。」
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
