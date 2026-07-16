import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Youtube, Link2, Check, RotateCcw, Sparkles, Play, Video } from 'lucide-react';
import { safeStorage } from '../utils/storage';

export default function AifeilerVideoCinema() {
  // Default relaxing Aifeiler-themed healing video ID
  const DEFAULT_VIDEO_ID = 'iYy-q9ywHaA'; 
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoId, setVideoId] = useState(DEFAULT_VIDEO_ID);
  const [isSaved, setIsSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load custom video ID from localStorage on mount
  useEffect(() => {
    try {
      const storedId = safeStorage.getItem('aifeiler_youtube_video_id');
      if (storedId) {
        setVideoId(storedId);
        // Pre-fill input if it was stored as a full link, otherwise just show ID
        setVideoUrlInput(storedId);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Helper to extract YouTube video ID from various formats
  const extractYouTubeId = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    // If it's already just an 11-char ID
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('?')) {
      return trimmed;
    }
    
    // Regular expression to parse different YouTube URL formats, including Shorts
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    return (match && match[2].length === 11) ? match[2] : trimmed;
  };

  const handleSave = () => {
    const parsedId = extractYouTubeId(videoUrlInput);
    if (parsedId) {
      setVideoId(parsedId);
      try {
        safeStorage.setItem('aifeiler_youtube_video_id', parsedId);
      } catch (e) {
        console.error(e);
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      setShowSettings(false);
    }
  };

  const handleReset = () => {
    setVideoId(DEFAULT_VIDEO_ID);
    setVideoUrlInput('');
    try {
      safeStorage.removeItem('aifeiler_youtube_video_id');
    } catch (e) {
      console.error(e);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    setShowSettings(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      className="w-full bg-white/85 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-[#7C5B8C]/15 shadow-[0_8px_30px_rgba(124,91,140,0.04)] flex flex-col gap-4"
    >
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-2xs">
            <Youtube className="w-5.5 h-5.5 fill-rose-50 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-sm md:text-base font-extrabold text-[#4E4158] flex items-center gap-1.5">
              <span>艾飛樂影音頻道 ∙ Aifeiler Channel</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
            </h3>
            <p className="text-[10px] md:text-xs text-[#9A8AA6] font-sans font-medium mt-0.5">
              「在療癒的影片中，看見溫柔的力量。直接播放官方或您自訂的 YouTube 影片！」
            </p>
          </div>
        </div>

        {/* Toggle Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="self-end sm:self-center px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#7C5B8C]/5 border border-[#7C5B8C]/15 rounded-xl text-xs font-bold text-[#7C5B8C] hover:text-[#684a75] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{showSettings ? '關閉設定' : '連線我的影片 🔗'}</span>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-[#FAF7F2]/80 border border-[#7C5B8C]/10 rounded-2xl p-4 flex flex-col gap-3.5"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#4E4158] flex items-center gap-1">
              <span>🔗</span> 貼上您的 YouTube 影片連結或 ID
            </span>
            <span className="text-[9.5px] text-[#9A8AA6]">
              支援各種格式（例如：https://www.youtube.com/watch?v=xxx 或手機分享網址）。將自動同步保存在您的瀏覽器中。
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="貼上 YouTube 影片網址或 11 位字元影片 ID"
              className="flex-1 bg-white border border-[#7C5B8C]/15 rounded-xl px-3 py-2 text-xs text-[#4E4158] placeholder-[#9A8AA6]/70 focus:outline-hidden focus:border-[#7C5B8C]/40 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-initial bg-[#7C5B8C] hover:bg-[#684a75] text-white font-serif text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>儲存並更換</span>
              </button>
              <button
                onClick={handleReset}
                className="bg-white hover:bg-[#7C5B8C]/5 border border-purple-100 text-[#7C5B8C] font-serif text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                title="恢復預設影片"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>恢復預設</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Real-time feedback toast */}
      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-2.5 flex items-center gap-2 text-emerald-700 text-[11px] font-bold animate-pulse">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>影片已成功同步！隨時可在下方播放。</span>
        </div>
      )}

      {/* YouTube Embed Player Stage */}
      <div className="w-full relative rounded-2xl overflow-hidden border border-purple-100/30 bg-[#4E4158]/5 aspect-video shadow-inner">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`}
          title="Aifeiler YouTube Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-2xl pointer-events-auto"
        />
      </div>

      {/* Decorative Brand footer */}
      <div className="flex items-center justify-between text-[9px] text-[#9A8AA6] font-sans border-t border-purple-50/50 pt-2.5">
        <span className="flex items-center gap-1">
          <Play className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
          <span>正在播放影片 ID: <strong className="font-mono text-[#7C5B8C]">{videoId}</strong></span>
        </span>
        <span className="font-serif italic">「用影片記錄溫柔，用呼吸安頓生活。」 — 艾飛樂陪伴空間</span>
      </div>
    </motion.div>
  );
}
