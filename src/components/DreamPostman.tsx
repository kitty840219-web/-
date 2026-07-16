import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Sparkles, RefreshCw, Check, Calendar, Mail } from 'lucide-react';

interface DreamPostmanProps {
  activeCharacter: string;
  onBack: () => void;
}

interface WaxSeal {
  id: string;
  name: string;
  color: string;
  bgClass: string;
  meaning: string;
}

const SEALS: WaxSeal[] = [
  { id: 'cherry', name: '🌸 溫柔櫻花', color: '#FB7185', bgClass: 'bg-rose-50 border-rose-200 text-rose-600', meaning: '給予自己無限的接納與溫存' },
  { id: 'ivy', name: '🍃 成長常春藤', color: '#34D399', bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-600', meaning: '承諾堅韌不拔的默默累積與成長' },
  { id: 'sunflower', name: '🌻 希望向日葵', color: '#FBBF24', bgClass: 'bg-amber-50 border-amber-200 text-amber-600', meaning: '面向陽光，帶著明朗的熱忱前行' },
  { id: 'lavender', name: '💜 療癒薰衣草', color: '#A78BFA', bgClass: 'bg-purple-50 border-purple-200 text-purple-600', meaning: '釋放生活的疲憊，安住內心的寧靜' }
];

export default function DreamPostman({ activeCharacter, onBack }: DreamPostmanProps) {
  const [letterContent, setLetterContent] = useState('');
  const [selectedSeal, setSelectedSeal] = useState<WaxSeal>(SEALS[0]);
  const [deliveryDays, setDeliveryDays] = useState('30'); // default 1 month
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [receiptCode, setReceiptCode] = useState('');

  const playSound = (type: 'stamp' | 'send' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'stamp') {
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      } else if (type === 'send') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      } else {
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const handleSendLetter = () => {
    if (!letterContent.trim() || isSending) return;
    
    setIsSending(true);
    playSound('stamp');

    setTimeout(() => {
      playSound('send');
      const code = 'AF-' + Math.floor(100000 + Math.random() * 900000);
      setReceiptCode(code);
      setIsSending(false);
      setIsSent(true);
    }, 1800);
  };

  const handleReset = () => {
    playSound('click');
    setLetterContent('');
    setSelectedSeal(SEALS[0]);
    setDeliveryDays('30');
    setIsSent(false);
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
          🎮 第五關：夢想郵差任務
        </span>
      </div>

      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-purple-100/30">
        <h3 className="font-serif font-extrabold text-[#4E4158] text-base">📮 夢想郵差任務 (Time Capsule)</h3>
        <p className="text-xs text-[#9A8AA6] mt-1 leading-relaxed">
          「寄一封信給未來的自己，那是你與歲月最浪漫的盟約。」寫下你當前的夢想、期待或對明天的寄語。選擇火漆印章，封存此時此刻的溫度，夢想郵局將按時送達！
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.div
            key="dream-editor-state"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Letter Writing Paper */}
            <div className="lg:col-span-7 bg-white/95 border border-purple-100/40 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col gap-4">
              {/* Notebook / Writing lines pattern overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#7C5B8C]/40" />

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7C5B8C]" />
                <span className="font-serif font-bold text-xs text-[#4E4158]">
                  📝 寫給未來自己的信：
                </span>
              </div>

              <textarea
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                rows={10}
                placeholder="親愛的自己：

當你收到這封信時，希望你已經渡過了當前的某些小難關... 
在這裡寫下你的夢想、感謝，或是今天發生的一件微小但幸福的事..."
                className="w-full text-xs font-serif p-4 rounded-xl border border-purple-50 bg-[#FDFBF7] focus:outline-none focus:ring-1 focus:ring-purple-300 placeholder-purple-300 leading-relaxed shadow-inner"
              />

              <div className="flex flex-wrap items-center justify-between gap-4 mt-1">
                {/* Stamp Seal selection */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-[#9A8AA6] font-bold block">選擇信封火漆印章：</span>
                  <div className="flex items-center gap-2">
                    {SEALS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { playSound('click'); setSelectedSeal(s); }}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition-all cursor-pointer ${
                          selectedSeal.id === s.id
                            ? 'ring-2 ring-purple-400 scale-105 shadow-sm'
                            : 'opacity-50 hover:opacity-100'
                        }`}
                        title={`${s.name} - ${s.meaning}`}
                        style={{ backgroundColor: s.color + '25', borderColor: s.color }}
                      >
                        {s.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wax seal summary explanation */}
                <span className="text-[10px] text-[#7C5B8C] italic bg-[#FAF8F5] px-2.5 py-1 rounded border border-purple-50">
                  意涵：{selectedSeal.meaning}
                </span>
              </div>
            </div>

            {/* Right Column: Post Office Options */}
            <div className="lg:col-span-5 bg-white/95 border border-purple-100/40 rounded-3xl p-6 shadow-xs flex flex-col gap-5">
              <h4 className="font-serif font-bold text-xs text-[#4E4158] border-b border-purple-50 pb-2">
                📦 設置夢想投遞參數
              </h4>

              {/* Delivery Duration dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-serif font-bold text-[#4E4158] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#7C5B8C]" />
                  預計投遞寄達時間：
                </label>
                
                <div className="grid grid-cols-3 gap-2 text-xs font-sans">
                  {[
                    { label: '3天後', val: '3' },
                    { label: '1個月後', val: '30' },
                    { label: '1年後', val: '365' }
                  ].map((time) => (
                    <button
                      key={time.val}
                      onClick={() => { playSound('click'); setDeliveryDays(time.val); }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-center font-semibold ${
                        deliveryDays === time.val
                          ? 'bg-[#7C5B8C] border-[#7C5B8C] text-white shadow-2xs'
                          : 'bg-white hover:bg-purple-50/10 border-purple-100 text-slate-600'
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#9A8AA6] leading-relaxed mt-1">
                  我們將在此天數過後，在你的【成長表單】與【系統信箱】中亮起這封信。
                </p>
              </div>

              {/* Decorative Envelope mockup with the seal stamp */}
              <div className="relative border border-dashed border-purple-200/60 p-5 rounded-2xl bg-amber-50/15 flex flex-col items-center justify-center min-h-[140px] overflow-hidden">
                <div className="w-24 h-16 bg-[#FDFBF7] border border-purple-100 rounded shadow-2xs relative flex items-center justify-center">
                  {/* Envelope triangular flap line */}
                  <div className="absolute top-0 left-0 right-0 h-8 border-b border-purple-200/40 rounded-b-lg pointer-events-none" />
                  
                  {/* Seal Stamp centered */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs relative z-10 animate-pulse border"
                    style={{ backgroundColor: selectedSeal.color, borderColor: '#FFFFFF', color: '#FFFFFF' }}
                  >
                    {selectedSeal.name.split(' ')[0]}
                  </div>
                </div>
                <span className="text-[10px] text-[#9A8AA6] mt-3 font-serif">封妥的夢想密封包</span>
              </div>

              {/* Submit letter button */}
              <button
                id="submit-dream-letter"
                disabled={!letterContent.trim() || isSending}
                onClick={handleSendLetter}
                className="w-full bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-300 text-white font-serif font-bold text-xs py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    火漆熔解中，正在密封投遞...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    蓋上火漆印章並正式寄出！
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Sent State: Receipt Card */
          <motion.div
            key="dream-receipt-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#FAF5EF] to-purple-50/20 p-6 rounded-3xl border border-purple-100/40 text-center flex flex-col items-center gap-5 shadow-xs"
          >
            <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center text-4xl shadow-sm border border-purple-100 animate-bounce">
              📮
            </div>

            <div>
              <h4 className="font-serif font-extrabold text-[#4E4158] text-base">
                信件密封投遞成功！
              </h4>
              <p className="text-xs text-[#9A8AA6] leading-relaxed mt-1.5 max-w-sm mx-auto">
                你的夢想信件已被熔上的 {selectedSeal.name} 火漆封存，並鎖入時空郵箱。郵局將於 {deliveryDays} 天後為你送達。
              </p>
            </div>

            {/* Receipt detail block */}
            <div className="w-full max-w-sm bg-white border border-purple-100 p-5 rounded-2xl text-left relative overflow-hidden flex flex-col gap-3 font-mono text-xs">
              <div className="absolute top-0 right-0 bg-[#7C5B8C] text-white text-[8px] font-sans font-extrabold px-3 py-1 rounded-bl">
                OFFICIAL RECEIPT
              </div>
              <h5 className="font-serif font-bold text-sm text-[#4E4158] border-b border-purple-50 pb-2">
                🎐 Aifeiler 夢想郵政收執聯
              </h5>
              
              <div className="flex justify-between">
                <span className="text-slate-400">時空單號：</span>
                <span className="font-bold text-[#4E4158]">{receiptCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">火漆蓋戳：</span>
                <span className="font-semibold text-rose-500">{selectedSeal.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">保管週期：</span>
                <span className="font-semibold text-[#7C5B8C]">{deliveryDays} 天時光穿梭</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">投遞狀態：</span>
                <span className="font-semibold text-emerald-500 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 已安全密封
                </span>
              </div>

              {/* Automatic encouragement letter response */}
              <div className="mt-2.5 pt-3 border-t border-purple-50 font-serif text-xs text-[#4E4158]/95 leading-relaxed bg-[#FAF8F5] p-3 rounded-lg">
                <span className="font-sans font-extrabold text-[8px] tracking-widest text-[#7C5B8C] block mb-1">
                  POSTMAN ENCOURAGEMENT ∙ 郵差溫馨小卡
                </span>
                「夢想是給未來的地圖。恭喜你跨出了誠實對話的一步。在這段等待的路上，{activeCharacter || '小艾'} 與你同在。累的時候隨時來喝口花茶、調個顏色吧。」
              </div>
            </div>

            <button
              onClick={handleReset}
              className="bg-white hover:bg-purple-50 text-[#7C5B8C] border border-purple-100/60 font-serif font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              寄送另一封夢想信
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
