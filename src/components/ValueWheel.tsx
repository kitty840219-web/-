import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Compass, Sparkles, CheckCircle } from 'lucide-react';

interface ValueWheelProps {
  activeCharacter: string;
  onBack: () => void;
}

interface ValueSector {
  id: string;
  name: string;
  color: string;
  description: string;
  quote: string;
  reflection: string;
}

const SECTORS: ValueSector[] = [
  { id: 'freedom', name: '自由 (Freedom)', color: '#FDE047', description: '不受拘束地成為自己，在心靈的原野上自在奔跑，保有說「不」與決定方向的權利。', quote: '「自由不是隨心所欲，而是掌握自我內在的清明與定力。」', reflection: '如果你能褪去所有外界的期待與標籤，此時此刻你最想做的一個決定是什麼？' },
  { id: 'growth', name: '成長 (Growth)', color: '#60A5FA', description: '勇敢接受未知的挑戰，將生命的裂縫視為光透進來的入口，在陪伴中修剪多餘的雜枝。', quote: '「每一次溫柔的思辨，都是自我向著暖陽拔節成長的軌跡。」', reflection: '回顧這半年，哪一次經歷讓你覺得自己「又悄悄往前邁進了一步」？' },
  { id: 'peace', name: '平靜 (Peace)', color: '#34D399', description: '在浮躁的世間保有一口深呼吸的空間，安然退居內在核心，學會與孤獨與不完美共處。', quote: '「平靜是看過千山萬水後，依然選擇擁抱一抹素雅與淡然。」', reflection: '此時此刻，有什麼事正悄悄打擾你的心靈？試著深深吸氣，將它輕輕吐出。' },
  { id: 'companionship', name: '陪伴 (Companionship)', color: '#F87171', description: '溫柔地接住他人的脆弱，也在最孤單的黑夜裡，點一盞溫暖的燈火，和夥伴一同前行。', quote: '「在愛飛樂的世界，你從不需要獨自面對生命的風雨。」', reflection: '在你生命最疲憊的時候，是誰的陪伴拉了你一把？你想對他說句什麼悄悄話？' },
  { id: 'wisdom', name: '智慧 (Wisdom)', color: '#C084FC', description: '以清晰理性的眼光，穿透迷霧直抵核心，看透事物兩极的本質，並做出明智優雅的取捨。', quote: '「真正的智慧，是學會溫柔地面對複雜，在簡單中尋找和諧。」', reflection: '面對人生的分岔路口，你倾向用理性的邏輯梳理，還是用直覺的羅盤指路？' },
  { id: 'courage', name: '勇氣 (Courage)', color: '#FB923C', description: '帶著顫抖與不安，依然跨出第一步的力量；是願意對抗大眾偏見、真誠活出真實自我的底氣。', quote: '「勇氣並非毫無恐懼，而是看清恐懼後，依然拍拍肩膀往前走。」', reflection: '有什麼想法或夢想，是你因害怕失敗而一直塵封的？今天願意為它跨出哪怕是一微米的努力嗎？' }
];

export default function ValueWheel({ activeCharacter, onBack }: ValueWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSector, setSelectedSector] = useState<ValueSector | null>(null);
  const [journalText, setJournalText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const playSound = (type: 'tick' | 'done') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'tick') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSector(null);
    setIsSaved(false);
    setJournalText('');

    // Let's decide a random land sector:
    const randSectorIndex = Math.floor(Math.random() * SECTORS.length);
    const sectorAngle = 360 / SECTORS.length;
    // Target angle is calculated such that it lands on the specific sector.
    // Plus we add several full spins (5-8 full rotations) for dynamic feeling.
    // The pointer is at the very top (90 degrees or -90 degrees depending on pointer offset).
    // Let's set rotation to: full cycles + landing offset
    const currentRot = rotation;
    const additionalSpins = 5 * 360; 
    const landAngle = 360 - (randSectorIndex * sectorAngle) - (sectorAngle / 2);
    const finalRot = currentRot + additionalSpins + landAngle - (currentRot % 360);

    setRotation(finalRot);

    // Simulate sound ticks as it spins
    let tickCount = 0;
    const totalTicks = 20;
    const interval = setInterval(() => {
      playSound('tick');
      tickCount++;
      if (tickCount >= totalTicks) clearInterval(interval);
    }, 150);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedSector(SECTORS[randSectorIndex]);
      playSound('done');
    }, 3200);
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
          🎮 第二關：價值選擇轉盤
        </span>
      </div>

      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-purple-100/30">
        <h3 className="font-serif font-extrabold text-[#4E4158] text-base">🎡 價值選擇轉盤</h3>
        <p className="text-xs text-[#9A8AA6] mt-1 leading-relaxed">
          心靈的抉擇，往往透露了我們最珍視的深層渴望。點選「開始旋轉」，看看指針會落在你的哪一個「核心靈魂價值」上，解鎖專屬的溫柔思辨！
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Spinning Wheel Graphics */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4 py-4">
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center select-none">
            {/* Outer pointer needle at top */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30 filter drop-shadow-md">
              <svg className="w-7 h-10 text-rose-500 fill-current" viewBox="0 0 24 36">
                <path d="M12 0 L24 20 L16 20 L12 36 L8 20 L0 20 Z" />
              </svg>
            </div>

            {/* Spinning Circle Wheel with watercolor pie slices */}
            <div
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 3s cubic-bezier(0.1, 0.8, 0.1, 1)',
              }}
              className="w-full h-full rounded-full border-8 border-[#FDF7F0] shadow-md relative overflow-hidden flex items-center justify-center bg-[#FAF4EA]"
            >
              {/* Wheel center decorative watercolor circle */}
              <div className="absolute w-12 h-12 rounded-full bg-white border border-purple-200/50 flex items-center justify-center text-sm z-20 shadow-xs">
                ❤️
              </div>

              {/* Pie sectors using SVGs or polar coordinate lines */}
              <svg className="absolute w-full h-full inset-0 z-10" viewBox="0 0 200 200">
                {SECTORS.map((s, idx) => {
                  const angle = 360 / SECTORS.length;
                  const startAngle = idx * angle;
                  const endAngle = (idx + 1) * angle;
                  
                  // Conversion helper to cartesian
                  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
                    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
                    return {
                      x: centerX + radius * Math.cos(angleInRadians),
                      y: centerY + radius * Math.sin(angleInRadians),
                    };
                  };

                  const start = polarToCartesian(100, 100, 100, startAngle);
                  const end = polarToCartesian(100, 100, 100, endAngle);
                  const largeArcFlag = angle <= 180 ? '0' : '1';

                  const d = [
                    'M', 100, 100,
                    'L', start.x, start.y,
                    'A', 100, 100, 0, largeArcFlag, 1, end.x, end.y,
                    'Z'
                  ].join(' ');

                  // Sector text offset calculation
                  const textAngle = startAngle + angle / 2;
                  const textPos = polarToCartesian(100, 100, 68, textAngle);

                  return (
                    <g key={s.id}>
                      <path d={d} fill={s.color} fillOpacity="0.32" stroke="#FAF4EA" strokeWidth="2" />
                      
                      {/* Text label inside each pie sector */}
                      <text
                        x={textPos.x}
                        y={textPos.y}
                        transform={`rotate(${textAngle}, ${textPos.x}, ${textPos.y})`}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-serif font-extrabold text-[7px] text-[#4E4158] tracking-wider"
                      >
                        {s.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <button
            id="trigger-spin-wheel"
            disabled={isSpinning}
            onClick={handleSpin}
            className="mt-2 bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-300 text-white font-serif font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? '正在旋轉心靈轉盤...' : '開始旋轉轉盤'}
          </button>
        </div>

        {/* Right Side: Description card on Landing */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!selectedSector ? (
              <motion.div
                key="empty-wheel-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/90 rounded-2xl p-6 border border-purple-100/50 shadow-2xs text-center flex flex-col items-center justify-center min-h-[220px] text-slate-400"
              >
                <span className="text-4xl animate-bounce mb-3">🎡</span>
                <p className="font-serif text-xs font-semibold text-[#4E4158]">指針即將指引你在意的生命拼圖</p>
                <p className="text-[10px] text-[#9A8AA6] leading-relaxed max-w-sm mt-1">
                  點選左側「開始旋轉轉盤」，命運的羅盤將為你開啟一扇對話大門。
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="selected-wheel-result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/95 rounded-2xl p-6 border border-purple-100 shadow-2xs flex flex-col gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-2xs border border-purple-100" style={{ backgroundColor: selectedSector.color + '20' }}>
                    ✨
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-[#4E4158] text-sm">
                      落定價值：{selectedSector.name}
                    </h4>
                    <span className="text-[10px] text-purple-400 font-sans tracking-wide block">VALUE ALIGNED</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-purple-50">
                  <p className="text-xs text-[#4E4158] leading-relaxed">
                    {selectedSector.description}
                  </p>
                  <p className="text-xs font-serif font-extrabold text-[#7C5B8C] italic mt-2.5">
                    {selectedSector.quote}
                  </p>
                </div>

                {/* Question Reflections */}
                <div className="border-t border-purple-50 pt-3 flex flex-col gap-2.5">
                  <div className="flex items-start gap-1.5 text-xs font-serif font-semibold text-[#4E4158]">
                    <span className="text-[#7C5B8C] font-bold">【{activeCharacter || '小艾'} 的心靈探問】</span>
                  </div>
                  <p className="text-xs text-[#4E4158] italic leading-relaxed">
                    「{selectedSector.reflection}」
                  </p>

                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="在這裡坦誠地寫下你心中最真實的想法..."
                    className="w-full text-xs p-3 rounded-lg border border-purple-100 bg-white focus:outline-none focus:ring-1 focus:ring-purple-300 mt-1 h-20 placeholder-purple-300"
                  />

                  <div className="flex justify-end gap-2.5 mt-1.5">
                    <button
                      onClick={() => {
                        setIsSaved(true);
                      }}
                      disabled={isSaved || !journalText.trim()}
                      className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-100 text-white font-serif text-xs font-bold py-1.5 px-4 rounded-lg transition-all shadow-2xs cursor-pointer"
                    >
                      {isSaved ? '已保存至心靈日誌' : '保存價值解答'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
