import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Layers, Smile, Heart, Star } from 'lucide-react';

interface PuzzleHouseProps {
  activeCharacter: string;
  onBack: () => void;
}

interface PuzzlePiece {
  id: string;
  title: string;
  relationType: string;
  icon: string;
  color: string;
  question: string;
  options: string[];
}

const PUZZLE_PIECES: PuzzlePiece[] = [
  {
    id: 'foundation',
    title: '🧱 基礎基石 (家族關係)',
    relationType: '原生家庭',
    icon: '🏠',
    color: 'bg-amber-100 border-amber-300 text-amber-700',
    question: '在與家人的互動中，哪一種感覺是你最常體驗到的，且深刻形塑了你當前的邊界感？',
    options: [
      '無條件的溫暖支持，讓我可以安心做自己',
      '過度的關心與期待，有時感覺有些沉重窒礙',
      '獨立自理的氛圍，雖然自由卻偶然感到寂寞',
      '在碰撞與修剪中學習，正試圖建立健康的界限'
    ]
  },
  {
    id: 'pillars',
    title: '🏛️ 支持之柱 (友誼夥伴)',
    relationType: '社會連結',
    icon: '🫂',
    color: 'bg-sky-100 border-sky-300 text-sky-700',
    question: '你最珍視的朋友，通常在你生命中扮演著什麼樣的溫柔陪伴角色？',
    options: [
      '傾聽樹洞：接住我所有無法對他人訴說的脆弱',
      '鏡子夥伴：指出我的盲點，陪伴我一起反思成長',
      '玩樂戰友：分享生活中的喜悅與幽默，緩解焦慮',
      '靜默支持：不需要多言，只要在同一個空間就感到安心'
    ]
  },
  {
    id: 'windows',
    title: '🪟 暖心之窗 (親密伴侶)',
    relationType: '愛戀探索',
    icon: '💖',
    color: 'bg-rose-100 border-rose-300 text-rose-700',
    question: '在親密關係（或你理想的親密狀態）中，你覺得最和諧的「距離與溫度」是？',
    options: [
      '相互依偎：隨時分享生活的點滴，幾乎沒有秘密',
      '拉開距離的透光：保有各自獨立的星空，相互欣賞',
      '成長共振：朝著共同的價值前行，互相激勵',
      '靜靜守護：尊重彼此的不完美，在陪伴中療癒創傷'
    ]
  },
  {
    id: 'roof',
    title: '⛺ 靈魂之頂 (自我關係)',
    relationType: '獨處對話',
    icon: '🧘',
    color: 'bg-purple-100 border-purple-300 text-purple-700',
    question: '當世界安靜下來，你獨自一人待在「靈魂頂樓」時，你如何與自己的不完美相處？',
    options: [
      '溫柔擁抱：告訴自己已經做得很好了，接納所有脆弱',
      '理智反思：檢視今天的得失，為明天制定更好的計劃',
      '寫字排毒：用手帳、繪畫或音樂將情緒化作藝術',
      '放空休眠：什麼都不去想，給自己一個純粹乾淨的空白'
    ]
  }
];

export default function PuzzleHouse({ activeCharacter, onBack }: PuzzleHouseProps) {
  const [assembled, setAssembled] = useState<Record<string, string>>({});
  const [activePiece, setActivePiece] = useState<PuzzlePiece | null>(PUZZLE_PIECES[0]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [completed, setCompleted] = useState(false);

  const playSound = (type: 'lock' | 'complete' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'lock') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      } else if (type === 'complete') {
        osc.type = 'sine';
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
        notes.forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
          g.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.5);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.08);
          o.stop(ctx.currentTime + i * 0.08 + 0.5);
        });
        return;
      } else {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const handlePlacePiece = () => {
    if (!activePiece || !selectedOption) return;
    
    playSound('lock');
    const newAssembled = { ...assembled, [activePiece.id]: selectedOption };
    setAssembled(newAssembled);
    setSelectedOption('');

    // Check next piece to solve
    const nextIndex = PUZZLE_PIECES.findIndex(p => p.id === activePiece.id) + 1;
    if (nextIndex < PUZZLE_PIECES.length) {
      setActivePiece(PUZZLE_PIECES[nextIndex]);
    } else {
      setActivePiece(null);
      setCompleted(true);
      playSound('complete');
    }
  };

  const handleReset = () => {
    playSound('click');
    setAssembled({});
    setActivePiece(PUZZLE_PIECES[0]);
    setSelectedOption('');
    setCompleted(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex items-center justify-between border-b border-purple-100 pb-3">
        <button
          onClick={onBack}
          className="text-[#9A8AA6] hover:text-[#4E4158] text-xs font-bold font-serif flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          返回遊戲選單
        </button>
        <span className="text-[10px] text-[#7C5B8C] font-serif bg-purple-50 px-2 py-1 rounded">
          🎮 第三關：關係拼圖小屋
        </span>
      </div>

      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-purple-100/30">
        <h3 className="font-serif font-extrabold text-[#4E4158] text-base">🧩 關係拼圖小屋</h3>
        <p className="text-xs text-[#9A8AA6] mt-1 leading-relaxed">
          每段人際關係都是一片不可或缺的拼圖。回答關於家人、朋友、伴侶與自我相處的核心問題，將四片水彩拼圖滑入正確位置，親手建立一棟充滿光芒的和諧小屋吧！
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Visual House Assembly */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/60 p-6 rounded-2xl border border-purple-100/30 min-h-[350px]">
          <span className="text-[9px] font-sans font-extrabold text-purple-400 block mb-4 tracking-widest uppercase">
            HOUSE ASSEMBLY AREA ∙ 拼圖組裝區
          </span>

          <div className="relative w-56 h-64 border-2 border-dashed border-purple-200 rounded-3xl p-4 flex flex-col justify-between items-center bg-[#FDFBF7]">
            {/* 4 Puzzle Parts Visual Representation */}
            {/* Part 1: Roof (Self) - Top triangle */}
            <div className="w-full flex justify-center h-20 relative z-10">
              {assembled.roof ? (
                <motion.div
                  initial={{ y: -40, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  className="w-0 h-0 border-l-[90px] border-l-transparent border-r-[90px] border-r-transparent border-b-[75px] border-b-purple-400 relative flex justify-center items-end"
                >
                  <span className="absolute bottom-[-65px] text-white text-xs font-serif font-bold">🧘 靈魂頂樓</span>
                </motion.div>
              ) : (
                <div className="w-0 h-0 border-l-[90px] border-l-transparent border-r-[90px] border-r-transparent border-b-[75px] border-b-purple-100/30 relative flex justify-center items-end">
                  <span className="absolute bottom-[-55px] text-purple-300 text-[10px] font-serif font-bold">🔒 頂樓未拼</span>
                </div>
              )}
            </div>

            {/* Middle row: Windows & Pillars */}
            <div className="w-full flex justify-between h-20 items-center gap-2 mt-4 relative z-10">
              {/* Left Pillar: Friends */}
              <div className="w-[45%] h-full flex items-center justify-center">
                {assembled.pillars ? (
                  <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full h-full bg-sky-400 rounded-lg flex flex-col justify-center items-center text-white border border-sky-300 text-center p-1"
                  >
                    <span className="text-sm">🫂</span>
                    <span className="text-[9px] font-bold block">友誼夥伴</span>
                  </motion.div>
                ) : (
                  <div className="w-full h-full bg-sky-100/10 border border-dashed border-sky-200/50 rounded-lg flex items-center justify-center text-[9px] text-sky-300 font-bold">
                    🔒 友誼未拼
                  </div>
                )}
              </div>

              {/* Right Windows: Love */}
              <div className="w-[45%] h-full flex items-center justify-center">
                {assembled.windows ? (
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full h-full bg-rose-400 rounded-lg flex flex-col justify-center items-center text-white border border-rose-300 text-center p-1"
                  >
                    <span className="text-sm">🪟</span>
                    <span className="text-[9px] font-bold block">伴侶愛戀</span>
                  </motion.div>
                ) : (
                  <div className="w-full h-full bg-rose-100/10 border border-dashed border-rose-200/50 rounded-lg flex items-center justify-center text-[9px] text-rose-300 font-bold">
                    🔒 伴侶未拼
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Foundation (Family) */}
            <div className="w-full h-14 mt-3 relative z-10">
              {assembled.foundation ? (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-full h-full bg-amber-400 rounded-lg flex items-center justify-center text-white border border-amber-300 gap-1.5"
                >
                  <span className="text-sm">🏠</span>
                  <span className="text-xs font-serif font-bold">🧱 家族根基已置入</span>
                </motion.div>
              ) : (
                <div className="w-full h-full bg-amber-100/10 border border-dashed border-amber-200/50 rounded-lg flex items-center justify-center text-[10px] text-amber-300 font-serif font-bold">
                  🔒 原生家庭底層未拼
                </div>
              )}
            </div>

            {/* Golden glowing stars around when completely assembled */}
            {completed && (
              <div className="absolute inset-0 bg-[#FFFBEB]/40 rounded-3xl z-0 pointer-events-none flex items-center justify-center animate-pulse border-2 border-yellow-400">
                <span className="absolute top-4 left-6 text-yellow-500 text-lg">⭐</span>
                <span className="absolute top-12 right-6 text-yellow-500 text-lg">✨</span>
                <span className="absolute bottom-8 left-8 text-yellow-500 text-base">⭐</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Question Panel to click and solve */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!completed && activePiece ? (
              <motion.div
                key={activePiece.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="bg-white/95 rounded-2xl p-6 border border-purple-100/60 shadow-xs flex flex-col gap-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm px-2.5 py-0.5 rounded bg-purple-100 text-[#7C5B8C] font-serif font-bold">
                    {activePiece.relationType}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#4E4158]">
                    {activePiece.title}
                  </h4>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-purple-50">
                  <p className="text-xs font-serif text-[#4E4158] leading-relaxed font-bold">
                    {activePiece.question}
                  </p>
                </div>

                {/* Multiple choice options */}
                <div className="flex flex-col gap-2">
                  {activePiece.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => { playSound('click'); setSelectedOption(opt); }}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C5B8C]/10 border-[#7C5B8C] text-[#4E4158] font-semibold'
                            : 'bg-white hover:bg-purple-50/10 border-purple-100 text-[#4E4158]/90'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={!selectedOption}
                  onClick={handlePlacePiece}
                  className="w-full bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white font-serif font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
                >
                  置入拼圖零件 ➔
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="completed-puzzle-house"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-yellow-50/20 to-purple-50/20 rounded-2xl p-6 border border-yellow-200 shadow-sm text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-4xl shadow-sm border border-yellow-200 animate-bounce">
                  🏡
                </div>

                <div>
                  <h4 className="font-serif font-extrabold text-[#4E4158] text-base">
                    恭喜！關係拼圖小屋組裝完成！
                  </h4>
                  <p className="text-xs text-[#9A8AA6] leading-relaxed mt-1.5 max-w-sm mx-auto">
                    你成功為生命中的原生家庭、友誼、親密、自我四根柱石找到了平衡。有光的小屋正是你溫柔心靈的象徵。
                  </p>
                </div>

                {/* Show summary of choices */}
                <div className="w-full text-left bg-white p-4 rounded-xl border border-purple-100 flex flex-col gap-3">
                  <span className="text-[8px] font-sans font-extrabold tracking-widest bg-[#7C5B8C] text-white px-2 py-0.5 rounded uppercase block w-max">
                    YOUR HOUSE BLUEPRINT ∙ 心靈小屋藍圖
                  </span>
                  
                  {PUZZLE_PIECES.map((p) => (
                    <div key={p.id} className="text-xs font-sans">
                      <span className="font-serif font-bold text-[#7C5B8C] block">{p.title}：</span>
                      <p className="text-slate-600 pl-4 mt-0.5">「{assembled[p.id]}」</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleReset}
                  className="bg-[#FAF7F2] hover:bg-purple-50 text-purple-700 border border-purple-200 font-serif font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  重新組建小屋
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
