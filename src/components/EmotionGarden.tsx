import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';

interface EmotionGardenProps {
  activeCharacter: string;
  onBack: () => void;
}

interface Flower {
  id: string;
  name: string;
  emotion: string;
  color: string;
  emoji: string;
  face: string;
  insight: string;
}

const FLOWERS_DATA: Flower[] = [
  { id: 'happy', name: '喜悅之花', emotion: '溫暖、開朗、感恩', color: 'from-[#FDE047] to-[#F59E0B]', emoji: '🌸', face: '😊', insight: '喜悅不是因為擁有一切，而是珍惜眼前的每一個小確幸。當你微笑時，世界正溫柔地回應你。' },
  { id: 'sad', name: '憂傷之花', emotion: '脆弱、釋懷、接納', color: 'from-[#60A5FA] to-[#3B82F6]', emoji: '💧', face: '😢', insight: '淚水是心靈的雨季，幫你清洗靈魂的積塵。允許自己難過，是走向溫柔自癒的第一步。' },
  { id: 'angry', name: '憤怒之花', emotion: '邊界、主權、勇氣', color: 'from-[#F87171] to-[#EF4444]', emoji: '🔥', face: '😠', insight: '憤怒是一團有溫度的火，提醒你底線被觸碰了。用溫和但堅定的方式表達它，這就是自愛。' },
  { id: 'anxious', name: '焦慮之花', emotion: '在乎、期待、專注', color: 'from-[#C084FC] to-[#8B5CF6]', emoji: '🌀', face: '😰', insight: '焦慮是因為你對未來充滿在乎與責任。試著深呼吸，將視線移回當下，此時此刻你很安全。' },
  { id: 'calm', name: '平靜之花', emotion: '自在、內省、和諧', color: 'from-[#34D399] to-[#10B981]', emoji: '🍃', face: '😌', insight: '平靜是狂風中的定音鼓，是安住於當下的智慧。在安靜中，你才能聽見內心深處最真實的聲音。' }
];

export default function EmotionGarden({ activeCharacter, onBack }: EmotionGardenProps) {
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [matches, setMatches] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Sound generator
  const playSound = (type: 'match' | 'click' | 'complete') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'match') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      } else if (type === 'complete') {
        osc.type = 'triangle';
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
          g.gain.setValueAtTime(0.03, ctx.currentTime + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.1);
          o.stop(ctx.currentTime + i * 0.1 + 0.4);
        });
        return;
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      }
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const handleSelectFlower = (flower: Flower) => {
    playSound('click');
    if (selectedFlower?.id === flower.id) {
      setSelectedFlower(null);
    } else {
      setSelectedFlower(flower);
    }
  };

  const handleMatchInsight = (flowerId: string) => {
    if (!selectedFlower) return;
    
    if (selectedFlower.id === flowerId) {
      playSound('match');
      const newMatches = { ...matches, [flowerId]: true };
      setMatches(newMatches);
      setSelectedFlower(null);

      // Check if all matched
      if (Object.keys(newMatches).length === FLOWERS_DATA.length) {
        setGameCompleted(true);
        playSound('complete');
      }
    } else {
      // Wrong match vibration cue
      setActiveItem(flowerId);
      setTimeout(() => setActiveItem(null), 500);
    }
  };

  const handleReset = () => {
    playSound('click');
    setMatches({});
    setSelectedFlower(null);
    setGameCompleted(false);
    setReflectionText('');
    setIsSaved(false);
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
          🎮 第一關：情緒配對花園
        </span>
      </div>

      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-purple-100/30">
        <h3 className="font-serif font-extrabold text-[#4E4158] text-base">🌸 歡迎來到「情緒配對花園」</h3>
        <p className="text-xs text-[#9A8AA6] mt-1 leading-relaxed">
          請先點選下方「花朵朋友」，再配對上方對應的「心靈花語解讀」。讓每一朵代表不同情緒的花朵在溫柔中燦然綻放！
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Garden: Flowers */}
        <div className="md:col-span-6 bg-white/95 rounded-2xl p-5 border border-purple-100/40 shadow-xs flex flex-col gap-4">
          <h4 className="font-serif font-bold text-xs text-[#4E4158] border-b border-purple-50 pb-2">
            🌱 花卉溫室 (請選取一株花卉)
          </h4>
          
          <div className="grid grid-cols-2 gap-3.5">
            {FLOWERS_DATA.map((f) => {
              const isMatched = matches[f.id];
              const isSelected = selectedFlower?.id === f.id;
              
              return (
                <button
                  key={f.id}
                  disabled={isMatched}
                  onClick={() => handleSelectFlower(f)}
                  className={`relative p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-400 opacity-60'
                      : isSelected
                        ? 'bg-[#7C5B8C]/10 border-[#7C5B8C] ring-2 ring-[#7C5B8C]/20 scale-[1.02]'
                        : 'bg-white hover:bg-purple-50/20 border-purple-100'
                  }`}
                >
                  {isMatched && (
                    <span className="absolute top-2 right-2 text-emerald-500">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  )}
                  
                  {/* Watercolor Flower SVG Shape */}
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${f.color} flex items-center justify-center text-2xl shadow-sm relative overflow-hidden transition-transform group-hover:scale-105`}>
                    <span className="relative z-10">{f.face}</span>
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xs" />
                  </div>
                  
                  <div className="text-center">
                    <span className="font-serif font-bold text-xs text-[#4E4158] block">{f.name}</span>
                    <span className="text-[9px] text-[#9A8AA6] font-mono block mt-0.5">{f.emotion}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Garden: Matching Cards */}
        <div className="md:col-span-6 bg-white/95 rounded-2xl p-5 border border-purple-100/40 shadow-xs flex flex-col gap-3">
          <h4 className="font-serif font-bold text-xs text-[#4E4158] border-b border-purple-50 pb-2">
            🎐 尋找對應的心靈花語 (請點選解讀來配對)
          </h4>

          <div className="flex flex-col gap-2.5">
            {FLOWERS_DATA.map((f) => {
              const isMatched = matches[f.id];
              const isShaking = activeItem === f.id;
              
              return (
                <div
                  key={f.id}
                  onClick={() => !isMatched && handleMatchInsight(f.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer select-none ${
                    isMatched
                      ? 'bg-emerald-50/40 border-emerald-100/50 opacity-80'
                      : selectedFlower
                        ? 'bg-purple-50/20 hover:bg-[#7C5B8C]/5 border-[#7C5B8C]/20 hover:border-[#7C5B8C]/40'
                        : 'bg-slate-50 border-slate-100'
                  } ${isShaking ? 'animate-bounce border-red-400 bg-red-50' : ''}`}
                >
                  {isMatched ? (
                    <div className="flex items-start gap-2">
                      <span className="text-sm bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-bold font-serif shrink-0">
                        {f.name}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        「{f.insight}」
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-[#9A8AA6] font-mono uppercase tracking-widest">Insight 解讀</span>
                      <p className="text-xs text-[#4E4158] leading-relaxed">
                        {f.insight}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Completion Section */}
      <AnimatePresence>
        {gameCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50/30 to-emerald-50/30 p-6 rounded-2xl border border-purple-100/50 text-center flex flex-col items-center gap-4 shadow-sm"
          >
            <div className="w-16 h-16 bg-[#F5FBF6] rounded-full flex items-center justify-center text-4xl shadow-sm border border-emerald-100 animate-pulse">
              🎉
            </div>
            <div>
              <h4 className="font-serif font-extrabold text-[#4E4158] text-base">
                恭喜！配對完成，心靈花園已然絢爛綻放
              </h4>
              <p className="text-xs text-[#9A8AA6] leading-relaxed mt-1.5 max-w-md mx-auto">
                你成功解讀了五種核心心靈情緒的密語。不論是喜悅、憂傷、憤怒、焦慮還是平靜，每一份情感都是你寶貴的生命養份。
              </p>
            </div>

            <div className="w-full max-w-md bg-white/80 p-4 rounded-xl border border-purple-100 text-left mt-2">
              <span className="text-[8px] font-sans font-extrabold tracking-widest bg-[#7C5B8C] text-white px-2 py-0.5 rounded uppercase block w-max">
                REFLECTION 自由對話反思
              </span>
              <p className="text-xs font-serif font-bold text-[#4E4158] mt-2.5">
                {activeCharacter || '小艾'} 捎來的反思問題：<br />
                「回顧今天，你感到最顯著的是哪一種情緒呢？它是如何像花朵般在你的日常生活裡呼吸的？」
              </p>
              
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="在這裡寫下你的體會，這段回答將寫入你的個人成長日誌..."
                className="w-full text-xs p-3 rounded-lg border border-purple-100 bg-white/50 focus:outline-none focus:ring-1 focus:ring-purple-300 mt-3 h-20 placeholder-purple-300"
              />

              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={handleReset}
                  className="text-[#9A8AA6] hover:text-[#4E4158] text-xs font-bold font-serif flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  重新配對
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    setIsSaved(true);
                  }}
                  disabled={isSaved || !reflectionText.trim()}
                  className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white font-serif text-xs font-bold py-1.5 px-4 rounded-lg transition-all shadow-2xs cursor-pointer"
                >
                  {isSaved ? '已記錄至成長日誌' : '保存心情紀錄'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
