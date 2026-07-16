import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, PenTool, Sparkles, Smile, ArrowRight } from 'lucide-react';

interface FlipCardsProps {
  activeCharacter: string;
  onBack: () => void;
}

interface TarotCard {
  id: string;
  title: string;
  subtitle: string;
  backColor: string;
  icon: string;
  insight: string;
  reflection: string;
}

const CARDS: TarotCard[] = [
  {
    id: 'inner-child',
    title: '👶 內在小孩 (Inner Child)',
    subtitle: '遇見最初的純真與脆弱',
    backColor: 'bg-gradient-to-br from-[#FCD34D] to-[#F59E0B]',
    icon: '🧸',
    insight: '在你堅強的大人外殼下，依然住著一個需要被安撫、拍拍肩膀的孩子。他害怕被拋棄，但也充滿了對世界最初的熱情。',
    reflection: '閉上眼睛，試著對心裡那個拉著你衣角的小孩說一句話。你想對他說什麼呢？'
  },
  {
    id: 'shadow-self',
    title: '👺 暗影夥伴 (Shadow Self)',
    subtitle: '接納被你隱藏的陰暗面',
    backColor: 'bg-gradient-to-br from-[#C084FC] to-[#8B5CF6]',
    icon: '🎭',
    insight: '嫉妒、脆弱、不甘、憤怒... 這些被你貼上「壞」標籤的情緒，其實是心靈最忠誠的衛兵，默默守護著你傷痕纍纍的底線。',
    reflection: '最近有哪一刻讓你感到了強烈的嫉妒或委屈？如果這是心靈在保護你，它想提醒你什麼？'
  },
  {
    id: 'future-vow',
    title: '🔮 未來誓言 (Future Vow)',
    subtitle: '寫一封給時間的信物',
    backColor: 'bg-gradient-to-br from-[#38BDF8] to-[#0284C7]',
    icon: '✉️',
    insight: '未來是由無數個「此時此刻」疊加而成的。與其為明天焦慮，不如在當下對自己立下一個無條件溫柔陪伴的承諾。',
    reflection: '想像五年後的自己。若想給那時的他一個不變的誓言，你會寫下什麼？'
  },
  {
    id: 'present-being',
    title: '🍃 當下自我 (Present Being)',
    subtitle: '此時此刻的安住與呼吸',
    backColor: 'bg-gradient-to-br from-[#34D399] to-[#059669]',
    icon: '🕯️',
    insight: '過去已成灰燼，未來尚未到來。唯有你現在吸入的這一口氣、聽見的這一段音樂、敲擊的這一個按鍵，是唯一真實的幸福。',
    reflection: '試著深呼吸三次。感受空氣在鼻尖的微涼與溫熱。用三個詞描繪你此刻最真實的心境。'
  }
];

export default function FlipCards({ activeCharacter, onBack }: FlipCardsProps) {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({});

  const playSound = (type: 'flip' | 'click' | 'save') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'flip') {
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      } else if (type === 'save') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const handleFlipCard = (cardId: string) => {
    playSound('flip');
    if (flippedCardId === cardId) {
      setFlippedCardId(null);
    } else {
      setFlippedCardId(cardId);
    }
  };

  const activeCard = CARDS.find((c) => c.id === flippedCardId);

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
          🎮 第四關：自我探索翻翻卡
        </span>
      </div>

      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-purple-100/30">
        <h3 className="font-serif font-extrabold text-[#4E4158] text-base">🎴 自我探索翻翻卡</h3>
        <p className="text-xs text-[#9A8AA6] mt-1 leading-relaxed">
          桌面上面朝下放置了四張代表不同自我側面的「靈魂密語卡」。點選一張卡片翻面，揭開精緻的水彩圖騰，並隨手記錄下這場心靈冒險的發現。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card Deck Selector */}
        <div className="md:col-span-5 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-2 gap-4">
            {CARDS.map((c) => {
              const isSelected = flippedCardId === c.id;
              
              return (
                <button
                  key={c.id}
                  onClick={() => handleFlipCard(c.id)}
                  className={`group relative h-48 rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center ${
                    isSelected
                      ? 'bg-[#7C5B8C]/5 border-[#7C5B8C] ring-2 ring-[#7C5B8C]/20 shadow-sm scale-[1.02]'
                      : 'bg-white hover:bg-purple-50/10 border-purple-100'
                  }`}
                >
                  {/* Glowing light overlay */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  
                  {/* Watercolor styled back cover */}
                  <div className={`w-12 h-12 rounded-full ${c.backColor} flex items-center justify-center text-xl shadow-sm mb-3 group-hover:scale-110 transition-transform relative overflow-hidden`}>
                    <span className="relative z-10">✨</span>
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xs" />
                  </div>

                  <span className="font-serif font-bold text-xs text-[#4E4158] block group-hover:text-[#7C5B8C] transition-colors">
                    {c.title.split(' ')[1]}
                  </span>
                  <span className="text-[9px] text-[#9A8AA6] block mt-1">
                    {isSelected ? '已翻開' : '點選翻牌'}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              playSound('click');
              setFlippedCardId(null);
            }}
            className="w-full bg-[#FAF7F2] hover:bg-purple-50 text-[#7C5B8C] border border-purple-100 text-xs font-serif font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            重置桌面
          </button>
        </div>

        {/* Right Active Card Details and Reflective Input */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!activeCard ? (
              <motion.div
                key="empty-cards-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/90 rounded-2xl p-6 border border-purple-100/50 shadow-2xs text-center flex flex-col items-center justify-center min-h-[300px] text-slate-400"
              >
                <span className="text-4xl animate-pulse mb-3">🔮</span>
                <p className="font-serif text-xs font-semibold text-[#4E4158]">牌面安靜地躺在桌上...</p>
                <p className="text-[10px] text-[#9A8AA6] leading-relaxed max-w-sm mt-1">
                  請點選左側任意一張「密語卡」進行心靈翻牌。
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeCard.id}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/95 rounded-2xl p-6 border border-purple-100 shadow-2xs flex flex-col justify-between min-h-[300px]"
              >
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{activeCard.icon}</span>
                    <div>
                      <h4 className="font-serif font-extrabold text-[#4E4158] text-sm leading-tight">
                        {activeCard.title}
                      </h4>
                      <span className="text-[9px] text-[#9A8AA6] tracking-wide block uppercase mt-0.5">
                        {activeCard.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-purple-50">
                    <span className="text-[8px] font-sans font-extrabold tracking-widest bg-purple-100 text-[#7C5B8C] px-1.5 py-0.5 rounded uppercase block w-max mb-2">
                      INSIGHT 密語
                    </span>
                    <p className="text-xs text-[#4E4158] leading-relaxed">
                      {activeCard.insight}
                    </p>
                  </div>

                  {/* Journal Input for card reflection */}
                  <div className="border-t border-purple-50 pt-3 flex flex-col gap-2">
                    <label className="text-xs font-serif font-extrabold text-[#7C5B8C] flex items-center gap-1">
                      <PenTool className="w-3.5 h-3.5 text-rose-400" />
                      {activeCharacter || '小艾'} 的探索探問：
                    </label>
                    <p className="text-xs text-[#4E4158] italic leading-relaxed">
                      「{activeCard.reflection}」
                    </p>

                    <textarea
                      value={reflectionAnswers[activeCard.id] || ''}
                      onChange={(e) => {
                        setReflectionAnswers({
                          ...reflectionAnswers,
                          [activeCard.id]: e.target.value
                        });
                        setIsSaved({ ...isSaved, [activeCard.id]: false });
                      }}
                      placeholder="寫下浮現於你腦海的第一個想法..."
                      className="w-full text-xs p-3 rounded-lg border border-purple-100 bg-white focus:outline-none focus:ring-1 focus:ring-purple-300 mt-1 h-20 placeholder-purple-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-2 border-t border-purple-50">
                  <button
                    onClick={() => {
                      playSound('save');
                      setIsSaved({ ...isSaved, [activeCard.id]: true });
                    }}
                    disabled={isSaved[activeCard.id] || !(reflectionAnswers[activeCard.id] || '').trim()}
                    className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white font-serif text-xs font-bold py-1.5 px-4 rounded-lg transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    {isSaved[activeCard.id] ? '已保存發現' : '保存探索發現'}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
