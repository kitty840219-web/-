import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ClipboardList, RefreshCw, Sparkles, BookOpen, Heart, Trash2, Trophy, Star } from 'lucide-react';
import { WoopResult } from '../types';
import { IMAGES } from '../assets/images';
import { safeStorage } from '../utils/storage';

interface WoopJournalProps {
  activeCharacter: string;
}

interface WoopHistoryItem {
  id: string;
  date: string;
  wish: string;
  outcome: string;
  obstacle: string;
  plan: string;
  feedback: string;
  companionQuote: string;
}

export default function WoopJournal({ activeCharacter }: WoopJournalProps) {
  const [wish, setWish] = useState('');
  const [outcome, setOutcome] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [plan, setPlan] = useState('');

  const getProgress = () => {
    let completed = 0;
    if (wish.trim().length > 0) completed += 25;
    if (outcome.trim().length > 0) completed += 25;
    if (obstacle.trim().length > 0) completed += 25;
    if (plan.trim().length > 0) completed += 25;
    return completed;
  };
  const progress = getProgress();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WoopResult | null>(null);
  
  const [history, setHistory] = useState<WoopHistoryItem[]>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_woop_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!wish || !outcome || !obstacle || !plan || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/woop/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wish, outcome, obstacle, plan })
      });
      const data = await response.json();
      
      setResult(data);

      const newItem: WoopHistoryItem = {
        id: `woop-${Date.now()}`,
        date: new Date().toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        wish,
        outcome,
        obstacle,
        plan,
        feedback: data.feedback,
        companionQuote: data.companionQuote
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      safeStorage.setItem('aifeiler_woop_history', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Error generating WOOP response:', err);
      // Fallback
      const fallbackResult = {
        feedback: `親愛的，你寫下的 WOOP 計畫無比清晰。你的願望是「${wish}」，渴望達成的成果是「${outcome}」。你看到了眼前的障礙「${obstacle}」，並英勇地寫下了應對方案「${plan}」。在面對生活時，看清障礙並不代表退縮，而是你選擇更踏實地擁抱生命。加油，小思、小艾以及所有夥伴們都會是你最溫柔的後盾。`,
        companionQuote: "「看見障礙，是勇氣的起點；寫下計畫，是溫柔的承諾。」"
      };
      setResult(fallbackResult);

      const newItem: WoopHistoryItem = {
        id: `woop-${Date.now()}`,
        date: new Date().toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        wish,
        outcome,
        obstacle,
        plan,
        feedback: fallbackResult.feedback,
        companionQuote: fallbackResult.companionQuote
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      safeStorage.setItem('aifeiler_woop_history', JSON.stringify(updatedHistory));
    } finally {
      setIsLoading(false);
      // Clear inputs
      setWish('');
      setOutcome('');
      setObstacle('');
      setPlan('');
    }
  };

  const handleClearHistory = () => {
    if (confirm('確定要清空所有的 WOOP 成長檔案嗎？此動作將無法復原。')) {
      setHistory([]);
      safeStorage.removeItem('aifeiler_woop_history');
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('確定要刪除這筆成長紀錄嗎？')) {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      safeStorage.setItem('aifeiler_woop_history', JSON.stringify(updated));
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
      
      {/* Center columns */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Banner with custom Cover Illustration */}
        <div 
          style={{ backgroundImage: `url(${IMAGES.illustrationPathway})`, backgroundSize: 'cover', backgroundPosition: 'center 40%' }}
          className="rounded-3xl p-6 md:p-8 border border-purple-100/40 relative overflow-hidden min-h-[220px] flex items-end shadow-xs"
        >
          {/* Glassmorphic overlay to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="relative z-10 max-w-xl text-white">
            <span className="text-[9px] bg-[#7C5B8C] text-white px-2 py-0.5 rounded-full font-bold font-sans uppercase tracking-widest">
              COVER ∙ 成長表單
            </span>
            <h2 className="font-serif text-xl md:text-2xl font-bold mt-2 leading-tight drop-shadow-sm">
              用科學與溫柔，<br />
              量化你的成長軌跡。
            </h2>
            <p className="text-[10px] text-purple-100 leading-relaxed mt-1.5 font-sans font-medium drop-shadow-xs">
              「當別人學會我昨天的祕笈，我早已迭代到下一個版本。」結合 WOOP 模型與療癒解答，讓理想溫柔落地。
            </p>
          </div>
        </div>

        {/* WOOP Form Input Card */}
        <div className="bg-white/80 p-5 rounded-3xl border border-[#7C5B8C]/12 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-purple-50">
            <ClipboardList className="w-4 h-4 text-[#7C5B8C]" />
            <h4 className="font-serif text-xs font-bold text-[#4E4158]">新增 WOOP 成長計畫</h4>
          </div>

          {/* Real-time Progress Bar Component */}
          <div className="bg-[#FAF7F2]/75 p-4 rounded-2xl border border-purple-100/35 flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-[#4E4158] flex items-center gap-1.5">
                <span>📝</span> 今日反思完成進度
              </span>
              <span className={`font-mono font-extrabold px-2 py-0.5 rounded-md text-[11px] transition-all duration-300 ${
                progress === 100 
                  ? 'bg-emerald-100 text-emerald-700 animate-pulse' 
                  : 'bg-purple-100/60 text-[#7C5B8C]'
              }`}>
                {progress}%
              </span>
            </div>
            
            {/* The progress bar track */}
            <div className="w-full bg-purple-100/30 rounded-full h-2 relative overflow-hidden">
              <motion.div 
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  progress === 100 
                    ? 'bg-gradient-to-r from-[#7C5B8C] to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                    : 'bg-[#7C5B8C]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Custom Interactive Step Badges */}
            <div className="grid grid-cols-4 gap-2 mt-1">
              {[
                { name: 'W. 願望', isFilled: wish.trim().length > 0, emoji: '🌟', bg: 'bg-rose-50 border-rose-100 text-rose-500' },
                { name: 'O. 成果', isFilled: outcome.trim().length > 0, emoji: '🍀', bg: 'bg-indigo-50 border-indigo-100 text-indigo-500' },
                { name: 'O. 障礙', isFilled: obstacle.trim().length > 0, emoji: '🏔️', bg: 'bg-amber-50 border-amber-100 text-amber-500' },
                { name: 'P. 計劃', isFilled: plan.trim().length > 0, emoji: '📝', bg: 'bg-emerald-50 border-emerald-100 text-emerald-500' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all duration-500 ${
                    step.isFilled 
                      ? 'bg-emerald-500 border-emerald-600 text-white font-bold scale-110 rotate-360 shadow-xs' 
                      : 'bg-white border-purple-100 text-[#9A8AA6]'
                  }`}>
                    {step.isFilled ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-xs">{step.emoji}</span>}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] transition-colors duration-300 ${
                    step.isFilled ? 'text-emerald-700 font-bold' : 'text-[#9A8AA6] font-medium'
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 100% Completion Celebration Banner */}
          <AnimatePresence>
            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                className="bg-gradient-to-br from-[#FAF5EF] via-emerald-50/20 to-white p-4.5 rounded-2xl border border-emerald-200/90 shadow-md flex flex-col gap-2.5 overflow-hidden relative"
              >
                {/* Decorative glowing backdrops */}
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-amber-200/25 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-emerald-200/20 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center gap-2 text-emerald-700 relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.22, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Trophy className="w-5 h-5 text-amber-500 fill-amber-100" />
                  </motion.div>
                  <span className="font-serif font-extrabold text-[12px] sm:text-xs">✨ 太棒了！今日語錄反思表單已完成 100% ✨</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="ml-auto"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </motion.div>
                </div>
                
                <p className="text-[11px] sm:text-xs text-[#4E4158] leading-relaxed font-sans relative z-10">
                  你寫下的願望與應對方案無比深刻。在這個喧囂的世界裡，給自己留出幾分鐘安靜地觀照內心、思考如何溫柔地應對生命中的阻礙，本身就是一份最棒的禮物。小艾和所有的夥伴都在為你的真誠而鼓掌呢！👏
                </p>
                
                <div className="flex items-center gap-2 mt-0.5 border-t border-emerald-100/30 pt-2.5 text-[10px] text-[#7C5B8C] relative z-10">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100 animate-pulse" />
                  <span className="font-serif italic font-semibold">
                    「看見障礙是理智，寫下應對是溫柔。你今天做得非常完美。」 — {activeCharacter.split(' ')[0]} / 艾飛樂陪伴精靈
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WISH */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4E4158] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center font-bold text-[10px] font-mono">W</span>
                  1. Wish (我的願望與期許)
                </label>
                <input
                  type="text"
                  required
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="例如：建立每天早上冥想深呼吸的習慣"
                  className="w-full text-xs p-3 rounded-xl border border-purple-100 bg-purple-50/10 focus:outline-none focus:border-[#7C5B8C] font-sans"
                />
              </div>

              {/* OUTCOME */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4E4158] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-[10px] font-mono">O</span>
                  2. Outcome (渴望達成的美好成果)
                </label>
                <input
                  type="text"
                  required
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="例如：心情變得更加平靜、工作專注力提升"
                  className="w-full text-xs p-3 rounded-xl border border-purple-100 bg-purple-50/10 focus:outline-none focus:border-[#7C5B8C] font-sans"
                />
              </div>

              {/* OBSTACLE */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4E4158] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-[10px] font-mono">O</span>
                  3. Obstacle (可能遇到的最大內在障礙)
                </label>
                <input
                  type="text"
                  required
                  value={obstacle}
                  onChange={(e) => setObstacle(e.target.value)}
                  placeholder="例如：早上睡過頭、或者手機通知打擾我"
                  className="w-full text-xs p-3 rounded-xl border border-purple-100 bg-purple-50/10 focus:outline-none focus:border-[#7C5B8C] font-sans"
                />
              </div>

              {/* PLAN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4E4158] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-[10px] font-mono">P</span>
                  4. Plan (如果...那麼...的應對方案)
                </label>
                <input
                  type="text"
                  required
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder="例如：如果早上想賴床，我就把冥想墊放在床邊"
                  className="w-full text-xs p-3 rounded-xl border border-purple-100 bg-purple-50/10 focus:outline-none focus:border-[#7C5B8C] font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                id="submit-woop-btn"
                type="submit"
                disabled={isLoading || !wish || !outcome || !obstacle || !plan}
                className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white font-sans text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center gap-1.5 font-bold cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 animate-spin" />
                    正在為你生成陪伴分析...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5" />
                    生成成長解讀
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic AI feedback output */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-gradient-to-br from-[#FAF5EF] to-[#EAF5ED]/50 p-6 rounded-3xl border border-[#7C5B8C]/15 shadow-sm flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="absolute right-[-20px] top-[-20px] w-28 h-28 bg-emerald-200/20 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-2.5 pb-2 border-b border-purple-100/20">
                <span className="text-xl">🎐</span>
                <h5 className="font-serif font-bold text-xs text-[#4E4158]">
                  {activeCharacter.split(' ')[0]} 的溫柔成長解讀：
                </h5>
              </div>

              <p className="font-serif font-semibold text-xs text-[#7C5B8C] leading-relaxed italic">
                {result.companionQuote}
              </p>

              <p className="text-xs text-[#4E4158] leading-relaxed font-sans">
                {result.feedback}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WOOP History List */}
        {history.length > 0 && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-purple-50">
              <h4 className="font-serif text-sm font-semibold text-[#4E4158] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#7C5B8C]" />
                我寫下的 WOOP 成長檔案 ({history.length})
              </h4>
              <button
                id="clear-all-woop"
                onClick={handleClearHistory}
                className="text-[10px] text-rose-500 hover:text-rose-700 font-sans cursor-pointer"
              >
                清空歷史紀錄
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 hover:bg-white p-5 rounded-2xl border border-purple-100/30 shadow-xs flex flex-col justify-between gap-4 transition-colors relative group"
                >
                  <div>
                    <div className="flex justify-between items-start text-[10px] text-[#9A8AA6] font-mono border-b border-purple-50/40 pb-2">
                      <span>📅 {item.date}</span>
                      <button
                        id={`delete-woop-${item.id}`}
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="text-rose-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="刪除紀錄"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] leading-relaxed font-sans text-[#4E4158]">
                      <div>
                        <span className="font-bold text-[#7C5B8C]">Wish: 願望</span>
                        <p className="mt-0.5 line-clamp-2">{item.wish}</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#7C5B8C]">Outcome: 成果</span>
                        <p className="mt-0.5 line-clamp-2">{item.outcome}</p>
                      </div>
                      <div className="mt-1">
                        <span className="font-bold text-[#7C5B8C]">Obstacle: 障礙</span>
                        <p className="mt-0.5 line-clamp-2">{item.obstacle}</p>
                      </div>
                      <div className="mt-1">
                        <span className="font-bold text-[#7C5B8C]">Plan: 計劃</span>
                        <p className="mt-0.5 line-clamp-2">{item.plan}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2]/60 p-3 rounded-xl border border-purple-50/10 text-[10px] leading-relaxed text-[#4E4158]/85 font-sans">
                    <span className="font-bold text-[#7C5B8C] block mb-1">精靈解說：</span>
                    <p className="line-clamp-3">{item.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right Column supportive widgets */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-[90px]">
        
        {/* Widget 1: 我的表單進度 */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-100" />
            <h4 className="font-serif text-xs font-bold text-[#4E4158]">我的表單進度</h4>
          </div>

          <div className="flex flex-col gap-3.5 mt-3.5 text-xs font-sans text-[#4E4158]/90">
            <div>
              <div className="flex justify-between text-[10px] text-[#9A8AA6] mb-1">
                <span>本週目標達成率</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-[#FAF7F2] rounded-full h-1.5 border border-purple-100/10 overflow-hidden">
                <div className="bg-[#7C5B8C] h-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#9A8AA6] mb-1">
                <span>本週心情平穩指數</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-[#FAF7F2] rounded-full h-1.5 border border-purple-100/10 overflow-hidden">
                <div className="bg-rose-400 h-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: 本月成長徽章 */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
            <Star className="w-4 h-4 text-amber-400 fill-amber-100" />
            <h4 className="font-serif text-xs font-bold text-[#4E4158]">本月成長徽章</h4>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center mt-3.5">
            {[
              { id: 'b1', emoji: '🌟', label: '星光探索者' },
              { id: 'b2', emoji: '🧭', label: '理智羅盤' },
              { id: 'b3', emoji: '🌾', label: '溫柔花季' },
              { id: 'b4', emoji: '💌', label: '未來信差' }
            ].map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-amber-100 flex items-center justify-center text-xl shadow-xs">
                  {badge.emoji}
                </div>
                <span className="text-[8px] text-[#9A8AA6] font-semibold leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 3: 艾比想對你說 Notebook sticky note */}
        <div className="bg-[#FAF5EF]/95 p-5 rounded-3xl border border-purple-200/20 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-4 notebook-tape rounded-xs"></div>
          
          <div className="pt-3 pb-1">
            <div className="flex justify-between items-center text-[9px] text-[#9A8AA6] font-serif border-b border-purple-100/30 pb-1">
              <span>艾比想對你說</span>
              <span>1 對 1 叮嚀</span>
            </div>
            
            <p className="mt-4 font-serif text-xs font-semibold text-[#4E4158]/95 leading-relaxed">
              「成長就像一棵松樹，每一條年輪的增加都是需要時間的。寫下這一步，你就已經做得很棒了。」
            </p>
            <span className="text-[10px] text-[#9A8AA6] block mt-4 font-sans text-right">— 艾比 / Ivy ✨</span>
          </div>
        </div>

      </div>

    </div>
  );
}
