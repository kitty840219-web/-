import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, PenTool, Check, Compass, Eye } from 'lucide-react';
import { TarotCard, DivinationResult } from '../types';
import { safeStorage } from '../utils/storage';

interface DivinationProps {
  activeCharacter: string;
}

const cardsList: TarotCard[] = [
  { id: 'card-1', trait: '責任', title: '責任之杯' },
  { id: 'card-2', trait: '勇氣', title: '勇氣之刃' },
  { id: 'card-3', trait: '愛', title: '慈愛之冠' },
  { id: 'card-4', trait: '利他', title: '利他之羽' }
];

export default function Divination({ activeCharacter }: DivinationProps) {
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [journalText, setJournalText] = useState('');
  const [savedLogs, setSavedLogs] = useState<{ date: string; trait: string; quote: string; journal?: string }[]>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_divination_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleShuffleAndReset = () => {
    setIsShuffling(true);
    setSelectedCardIdx(null);
    setIsFlipped(false);
    setResult(null);
    setJournalText('');
    
    // Simulate cards shuffle
    setTimeout(() => {
      setIsShuffling(false);
    }, 800);
  };

  const handleCardClick = async (idx: number) => {
    if (selectedCardIdx !== null || isShuffling || isLoading) return;

    setSelectedCardIdx(idx);
    setIsLoading(true);
    const trait = cardsList[idx].trait;

    try {
      const response = await fetch('/api/divination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trait })
      });
      const data = await response.json();
      setResult(data);
      setIsFlipped(true);
    } catch (err) {
      console.error('Error drawing divination card:', err);
      // Fallback
      const fallbacks = {
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
      };
      setResult(fallbacks[trait]);
      setIsFlipped(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJournal = () => {
    if (!result || !result.title) return;
    const traitName = cardsList[selectedCardIdx ?? 0].trait;
    const newLog = {
      date: new Date().toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      trait: traitName,
      quote: result.quote,
      journal: journalText.trim()
    };
    const updated = [newLog, ...savedLogs];
    setSavedLogs(updated);
    safeStorage.setItem('aifeiler_divination_logs', JSON.stringify(updated));
    setJournalText('');
    alert('心靈隨筆已成功記錄在你的本子中！');
  };

  return (
    <div id="divination-module" className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-xl">
            🔮
          </div>
          <div>
            <h2 className="font-sans text-xl font-bold text-purple-900">大眾占卜：今日靈魂指引</h2>
            <p className="text-xs text-purple-500 mt-0.5">
              沉澱內心、閉上眼睛，在薰衣草的祝福卡中，抽出一張今日的正面生命特質。
            </p>
          </div>
        </div>
        <button
          id="divination-reshuffle-btn"
          onClick={handleShuffleAndReset}
          className="text-purple-500 hover:text-purple-800 p-2 rounded-xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100/40 transition-all flex items-center gap-1.5 text-xs font-sans font-medium cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
          重洗卡牌
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card Deck Column */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6 py-4">
          <p className="text-xxs font-sans text-purple-400 text-center uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-100/40">
            {selectedCardIdx === null ? '✨ 請閉上雙眼，感應一張卡牌 ✨' : '✨ 這是今日為你翻開的心靈卡牌 ✨'}
          </p>

          <div className="flex flex-wrap justify-center gap-4 py-2 w-full max-w-sm">
            {cardsList.map((card, idx) => {
              const isSelected = selectedCardIdx === idx;
              const isAnySelected = selectedCardIdx !== null;

              return (
                <div
                  key={card.id}
                  id={`divination-card-item-${idx}`}
                  onClick={() => handleCardClick(idx)}
                  className={`relative w-[110px] h-[170px] cursor-pointer perspective-1000 transition-all duration-500 ${
                    isShuffling ? 'scale-95 translate-y-1 rotate-1' : ''
                  } ${
                    isAnySelected && !isSelected ? 'opacity-30 pointer-events-none scale-90' : ''
                  } ${
                    isSelected ? 'scale-105 z-20 shadow-lg' : 'hover:-translate-y-2 hover:shadow-md'
                  }`}
                >
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                    isSelected && isFlipped ? 'rotate-y-180' : ''
                  }`}>
                    {/* CARD BACK (Lavender Illustration) */}
                    <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl bg-gradient-to-b from-purple-100 to-purple-50 border-2 border-purple-200/60 p-2.5 flex flex-col justify-between items-center shadow-inner">
                      {/* Lavender border pattern */}
                      <div className="w-full h-full border border-purple-200/30 rounded-xl flex flex-col justify-between items-center p-2 relative overflow-hidden bg-white/40">
                        {/* Soft Lavender Background Grid */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        
                        <span className="text-xs font-serif text-purple-300">Aifeiler</span>
                        
                        {/* CSS Lavender Flower stalks */}
                        <div className="flex flex-col items-center justify-center gap-1 my-3 relative">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <div className="w-1 h-8 bg-emerald-300/80 rounded-full mt-1"></div>
                        </div>

                        <div className="flex items-center gap-1 text-xxs text-purple-400 font-sans font-medium">
                          <Eye className="w-3 h-3 text-purple-300" />
                          <span>翻牌</span>
                        </div>
                      </div>
                    </div>

                    {/* CARD FRONT (Revealed Trait) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-2xl bg-gradient-to-b from-white to-purple-50 border-2 border-purple-300 p-2.5 flex flex-col justify-between items-center shadow-md">
                      <div className="w-full h-full border border-purple-100 rounded-xl flex flex-col justify-between items-center p-2 relative overflow-hidden bg-white">
                        {/* Water color glow corresponding to trait */}
                        <div className={`absolute -bottom-10 w-24 h-24 rounded-full blur-xl opacity-30 ${
                          card.trait === '責任' ? 'bg-emerald-300' :
                          card.trait === '勇氣' ? 'bg-amber-300' :
                          card.trait === '愛' ? 'bg-rose-300' : 'bg-indigo-300'
                        }`}></div>

                        <span className="text-xxs font-sans text-purple-400 font-semibold tracking-wider">今日能量</span>
                        
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">
                            {card.trait === '責任' ? '🥛' :
                             card.trait === '勇氣' ? '🦁' :
                             card.trait === '愛' ? '💖' : '🕊️'}
                          </span>
                          <span className="font-sans font-bold text-sm text-purple-900 tracking-wide">
                            {card.trait}
                          </span>
                        </div>

                        <span className="text-xxs font-sans text-purple-500/80 font-medium bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100/50">
                          {card.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-500 font-sans">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              正在感知你的靈魂特質...
            </div>
          )}
        </div>

        {/* Right Guidance Details Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="divination-guidance-result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4 bg-purple-50/10 p-5 rounded-2xl border border-purple-100/30"
              >
                <div>
                  <h3 className="font-sans font-bold text-purple-900 text-base mb-1.5">
                    {result.title}
                  </h3>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-rose-50 border-l-4 border-purple-500 text-purple-900 font-sans text-sm font-medium leading-relaxed italic mb-4 shadow-xs">
                    {result.quote}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-sans font-semibold text-purple-500 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" /> 今日靈魂指引
                  </h4>
                  <p className="text-xs text-purple-950/80 font-sans leading-relaxed bg-white/70 p-3.5 rounded-xl border border-purple-100/30">
                    {result.guidance}
                  </p>
                </div>

                <div className="border-t border-purple-50 pt-4 mt-1">
                  <h4 className="text-xs font-sans font-semibold text-rose-800 flex items-center gap-1.5 mb-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    自我反思與探問
                  </h4>
                  <p className="text-xxs font-sans text-rose-950/70 leading-relaxed mb-3 italic">
                    {result.question}
                  </p>

                  <textarea
                    id="divination-journal"
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    rows={3}
                    placeholder="在這裡靜靜寫下你的回答與感受..."
                    className="w-full text-xs font-sans p-3 rounded-xl border border-purple-100 bg-white focus:outline-none focus:ring-1 focus:ring-purple-300 placeholder-purple-300/75"
                  />

                  <div className="flex justify-end mt-3">
                    <button
                      id="save-divination-journal-btn"
                      onClick={handleSaveJournal}
                      disabled={!journalText.trim()}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-200 text-white font-sans text-xs py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <Check className="w-3.5 h-3.5" />
                      保存心靈隨筆
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-24 text-purple-400">
                <span className="text-4xl mb-3">🕯️</span>
                <p className="font-sans text-sm">今日的解答，藏在某片薰衣草花瓣中</p>
                <p className="font-sans text-xxs mt-1 text-purple-400/80 max-w-sm leading-relaxed">
                  點擊左側任意一張卡牌，我們將隨機調用 <strong>{activeCharacter}</strong> 的生命視角，為你探尋與反思今日的靈魂功課。
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* History logs footer */}
      {savedLogs.length > 0 && (
        <div className="mt-4 border-t border-purple-50 pt-5">
          <h4 className="font-sans font-bold text-sm text-purple-900 mb-3 flex items-center gap-1.5">
            📝 過去的心靈翻牌記錄 ({savedLogs.length})
          </h4>
          <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1">
            {savedLogs.map((log, idx) => (
              <div key={idx} className="bg-purple-50/20 p-3.5 rounded-xl border border-purple-100/30 flex justify-between items-start gap-4 text-xs font-sans">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-900 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md text-xxs">
                      {log.trait}
                    </span>
                    <span className="text-xxs text-purple-400 font-mono">
                      {log.date}
                    </span>
                  </div>
                  <p className="text-purple-800 italic mt-1.5 text-xxs">
                    {log.quote}
                  </p>
                  {log.journal && (
                    <p className="mt-1.5 text-purple-950 font-medium pl-3 border-l-2 border-purple-300/40 text-xxs bg-white/40 p-2 rounded">
                      我的自白：{log.journal}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
