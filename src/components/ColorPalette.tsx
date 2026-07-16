import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, BookOpen, Download, RefreshCw, PenTool } from 'lucide-react';

interface ColorPaletteProps {
  activeCharacter: string;
}

export default function ColorPalette({ activeCharacter }: ColorPaletteProps) {
  const [love, setLove] = useState(50);
  const [wisdom, setWisdom] = useState(50);
  const [strength, setStrength] = useState(50);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [journalText, setJournalText] = useState('');
  const [isJournalSaved, setIsJournalSaved] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Derive watercolor overlay color based on sliders:
  // Love: Soft Rose Red (e.g. RGB 244, 63, 94)
  // Wisdom: Clear Indigo Blue (e.g. RGB 99, 102, 241)
  // Strength: Warm Amber Gold (e.g. RGB 245, 158, 11)
  // We mix them based on slider values normalized
  const total = love + wisdom + strength || 1;
  const loveRatio = love / total;
  const wisdomRatio = wisdom / total;
  const strengthRatio = strength / total;

  const mixedR = Math.round(loveRatio * 244 + wisdomRatio * 99 + strengthRatio * 245);
  const mixedG = Math.round(loveRatio * 63 + wisdomRatio * 102 + strengthRatio * 158);
  const mixedB = Math.round(loveRatio * 94 + wisdomRatio * 241 + strengthRatio * 11);

  const watercolorStyle = {
    background: `radial-gradient(circle, rgba(${mixedR}, ${mixedG}, ${mixedB}, 0.25) 0%, rgba(255, 255, 255, 0.95) 75%)`,
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setPrompt(null);
    setIsJournalSaved(false);
    setJournalText('');

    try {
      const response = await fetch('/api/color-palette/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ love, wisdom, strength }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
      setPrompt(data.prompt);
    } catch (err) {
      console.error('Error analyzing color palette:', err);
      setAnalysis(
        `這是一組和諧而深沉的色彩。你的慈愛值為 ${love}%，智慧值為 ${wisdom}%，勇健值為 ${strength}%。此時此刻，你的心靈正在尋求一種溫柔的平衡：一方面散發出愛與溫暖，另一方面以清澈的理智引導前行，並在背後蘊含強大的自我承諾。這是一個極佳的陪伴與修剪自我的生命狀態。`
      );
      setPrompt(`在當下的色彩氣泡中，請寫下一段話，給予今天辛苦的自己，或是對某個你深深關懷的人。`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!cardRef.current) return;
    
    // We can simulate download by generating a text/html block or simple instruction.
    // For a real client application, we can export metadata or write a custom text card file.
    const title = "🎨 艾飛樂語錄 ｜ 今日心靈色彩卡";
    const date = new Date().toLocaleDateString('zh-TW');
    const content = `
========================================
       ${title}
       日期: ${date}
========================================
【心靈調色盤比例】
- 愛與慈悲: ${love}%
- 智慧思辨: ${wisdom}%
- 勇健前行: ${strength}%

【心靈色彩特質分析】
${analysis || '（尚未進行分析）'}

【我的心靈自由書寫自白】
${journalText || '（尚未書寫自白）'}

----------------------------------------
「在溫柔裡思考，在陪伴中成長。」
Aifeiler 生命教育平台 🎐
========================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aifeiler_Color_Card_${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsJournalSaved(true);
  };

  return (
    <div id="color-palette-module" className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-xl">
            🎨
          </div>
          <div>
            <h2 className="font-sans text-xl font-bold text-purple-900">心靈顏色調色盤</h2>
            <p className="text-xs text-purple-500 mt-0.5">
              調節愛心、智慧與力量的滑桿，感受內心水彩暈染與療癒特質。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Sliders Control Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 bg-purple-50/20 p-5 rounded-2xl border border-purple-100/30">
          <div className="flex flex-col gap-5">
            <h3 className="font-sans font-bold text-sm text-purple-900 flex items-center gap-2">
              <span>🎚️</span> 調整你的心靈能量
            </h3>

            {/* Slider 1: Love */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans font-semibold text-rose-600 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  愛與慈悲 (Love)
                </span>
                <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                  {love}%
                </span>
              </div>
              <input
                id="slider-love"
                type="range"
                min="0"
                max="100"
                value={love}
                onChange={(e) => {
                  setLove(Number(e.target.value));
                  if (analysis) setAnalysis(null);
                }}
                className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
              />
              <p className="text-xxs text-rose-500 font-sans leading-relaxed">
                代表同理、體貼、關懷，接納並擁抱生命的每一份殘缺與美好。
              </p>
            </div>

            {/* Slider 2: Wisdom */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans font-semibold text-indigo-600 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  智慧思辨 (Wisdom)
                </span>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {wisdom}%
                </span>
              </div>
              <input
                id="slider-wisdom"
                type="range"
                min="0"
                max="100"
                value={wisdom}
                onChange={(e) => {
                  setWisdom(Number(e.target.value));
                  if (analysis) setAnalysis(null);
                }}
                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
              />
              <p className="text-xxs text-indigo-500 font-sans leading-relaxed">
                代表理性、覺察、反思，在複雜的事物中保有一顆清澈見底的心。
              </p>
            </div>

            {/* Slider 3: Strength */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans font-semibold text-amber-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  勇健前行 (Strength)
                </span>
                <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  {strength}%
                </span>
              </div>
              <input
                id="slider-strength"
                type="range"
                min="0"
                max="100"
                value={strength}
                onChange={(e) => {
                  setStrength(Number(e.target.value));
                  if (analysis) setAnalysis(null);
                }}
                className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
              <p className="text-xxs text-amber-500 font-sans leading-relaxed">
                代表勇氣、抗逆力、行動，是帶著顫抖依然願意邁出第一步的力量。
              </p>
            </div>
          </div>

          <button
            id="analyze-palette-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-sans text-sm py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-medium"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                正在調配心靈色彩...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                確認調配 ｜ 心靈光暈分析
              </>
            )}
          </button>
        </div>

        {/* Live Preview & Analysis Result Card */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            ref={cardRef}
            id="watercolor-color-card"
            style={watercolorStyle}
            className="flex-1 rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col justify-between min-h-[320px] transition-all duration-500 relative overflow-hidden"
          >
            {/* Soft decorative floaters */}
            <div
              className="absolute rounded-full blur-2xl animate-pulse"
              style={{
                width: '120px',
                height: '120px',
                top: '20%',
                left: '25%',
                backgroundColor: `rgba(${mixedR}, ${mixedG}, ${mixedB}, 0.22)`,
                animationDuration: '6s',
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xxs font-sans font-semibold text-purple-700 bg-white/80 px-2.5 py-1 rounded-full border border-purple-100/50">
                  🎨 今日心靈色彩氣泡
                </span>
                <span className="text-xxs font-mono text-purple-400 bg-white/40 px-2 py-0.5 rounded">
                  RGB: {mixedR}, {mixedG}, {mixedB}
                </span>
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {!analysis ? (
                    <motion.div
                      key="empty-palette-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-purple-400 text-center"
                    >
                      <span className="text-4xl mb-3 animate-pulse">🔮</span>
                      <p className="font-sans text-sm">
                        拖動左側滑桿，然後點擊「確認調配」
                      </p>
                      <p className="font-sans text-xxs mt-1 text-purple-400/80 max-w-xs leading-relaxed">
                        我們將透過 AI 智能讀取你的能量，為你撰寫客製化的水彩畫境與自我書寫題。
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="analysis-palette-result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <div>
                        <h4 className="text-xs font-sans font-bold text-purple-900 mb-1 flex items-center gap-1">
                          ✨ 心靈色彩特質分析
                        </h4>
                        <p className="text-xs font-sans text-purple-950/80 leading-relaxed bg-white/50 p-3.5 rounded-2xl border border-white/60 shadow-xs">
                          {analysis}
                        </p>
                      </div>

                      {prompt && (
                        <div className="border-t border-purple-100/40 pt-3">
                          <h4 className="text-xs font-sans font-bold text-rose-800 mb-1 flex items-center gap-1.5">
                            <PenTool className="w-3.5 h-3.5" />
                            自由書寫反思：
                          </h4>
                          <p className="text-xxs font-sans text-rose-950/80 italic leading-relaxed mb-2.5">
                            {prompt}
                          </p>
                          <textarea
                            id="color-palette-journal"
                            value={journalText}
                            onChange={(e) => setJournalText(e.target.value)}
                            rows={3}
                            placeholder="在這裡寫下你心靈的聲音，完成後可點擊右下角下載今日色彩卡..."
                            className="w-full text-xs font-sans p-3 rounded-xl border border-purple-100 bg-white/70 focus:outline-none focus:ring-1 focus:ring-purple-300 placeholder-purple-300"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {analysis && (
              <div className="mt-4 border-t border-purple-100/40 pt-3 flex justify-end relative z-10">
                <button
                  id="download-color-card-btn"
                  onClick={handleDownload}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-sans text-xs py-2 px-3.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isJournalSaved ? '已保存並下載卡片' : '下載今日心靈色彩卡'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
