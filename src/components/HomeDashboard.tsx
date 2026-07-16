import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, RefreshCw, Copy, Check } from 'lucide-react';
import { IMAGES } from '../assets/images';
import { safeStorage } from '../utils/storage';
import AifeilerVideoCinema from './AifeilerVideoCinema';
import TarotDivination from './TarotDivination';
import AiAssistant from './AiAssistant';

interface HomeDashboardProps {
  setActiveTab: (tab: 'home' | 'quote-map' | 'interactive-games' | 'reflection-lab' | 'growth-journal' | 'character-stories') => void;
  activeCharacter: string;
  onSelectCharacter: (name: string) => void;
}

const DAILY_QUOTES = [
  {
    id: 'dq1',
    text: '「接受自己的脆弱，正是你最強大的溫柔。」',
    author: '小艾',
    role: '🌸 溫柔療癒夥伴',
    avatar: IMAGES.avatarXiaoi,
    energy: '💖 99% 溫柔',
    bg: 'from-[#FFF1F2] to-[#FFF5F6]',
    border: 'border-rose-100/80',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50 text-rose-600'
  },
  {
    id: 'dq2',
    text: '「孤獨不是寂寞，而是靈魂在靜靜打掃落葉，準備迎來春天。」',
    author: '小思',
    role: '🧠 理性思辨導師',
    avatar: IMAGES.avatarXiaosi,
    energy: '✨ 99% 智慧',
    bg: 'from-[#EFF6FF] to-[#F5F8FF]',
    border: 'border-indigo-100/80',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'dq3',
    text: '「你不需要總是完美，才能被這世界溫柔以待。」',
    author: '小艾',
    role: '🌸 溫柔療癒夥伴',
    avatar: IMAGES.avatarXiaoi,
    energy: '💖 95% 療癒',
    bg: 'from-[#FFF1F2] to-[#FFF5F6]',
    border: 'border-rose-100/80',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50 text-rose-600'
  },
  {
    id: 'dq4',
    text: '「在疑問與迷惘中，慢慢把答案活出來，這就是生命的魅力。」',
    author: '小思',
    role: '🧠 理性思辨導師',
    avatar: IMAGES.avatarXiaosi,
    energy: '✨ 98% 深度',
    bg: 'from-[#EFF6FF] to-[#F5F8FF]',
    border: 'border-indigo-100/80',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'dq5',
    text: '「今天辛苦了，接受不完美的自己，本身就是最棒的修剪。」',
    author: '小艾',
    role: '🌸 溫柔療癒夥伴',
    avatar: IMAGES.avatarXiaoi,
    energy: '💖 98% 包容',
    bg: 'from-[#FFF1F2] to-[#FFF5F6]',
    border: 'border-rose-100/80',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50 text-rose-600'
  },
  {
    id: 'dq6',
    text: '「世界走的再快，你也可以擁有屬於自己的慢舞拍子。」',
    author: '小思',
    role: '🧠 理性思辨導師',
    avatar: IMAGES.avatarXiaosi,
    energy: '✨ 95% 定力',
    bg: 'from-[#EFF6FF] to-[#F5F8FF]',
    border: 'border-indigo-100/80',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'dq7',
    text: '「悲傷像一場溫暖的雨，滋潤了乾涸的心靈泥土，讓花兒得以盛開。」',
    author: '小艾',
    role: '🌸 溫柔療癒夥伴',
    avatar: IMAGES.avatarXiaoi,
    energy: '💖 97% 滋養',
    bg: 'from-[#FFF1F2] to-[#FFF5F6]',
    border: 'border-rose-100/80',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50 text-rose-600'
  },
  {
    id: 'dq8',
    text: '「接納自己的低潮，就像接受月亮的陰晴圓缺，那都是你的一部分。」',
    author: '小思',
    role: '🧠 理性思辨導師',
    avatar: IMAGES.avatarXiaosi,
    energy: '✨ 96% 自洽',
    bg: 'from-[#EFF6FF] to-[#F5F8FF]',
    border: 'border-indigo-100/80',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'dq9',
    text: '「慢下來吧，路邊那一朵悄悄綻放的雛菊，也一直在為你鼓掌呢。」',
    author: '小艾',
    role: '🌸 溫柔療癒夥伴',
    avatar: IMAGES.avatarXiaoi,
    energy: '💖 99% 陪伴',
    bg: 'from-[#FFF1F2] to-[#FFF5F6]',
    border: 'border-rose-100/80',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50 text-rose-600'
  },
  {
    id: 'dq10',
    text: '「有時候，沒有標準答案，就是最美麗的答案。」',
    author: '小思',
    role: '🧠 理性思辨導師',
    avatar: IMAGES.avatarXiaosi,
    energy: '✨ 97% 豁達',
    bg: 'from-[#EFF6FF] to-[#F5F8FF]',
    border: 'border-indigo-100/80',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'dq11',
    text: '「允許自己偶爾停滯，冬眠過後的種子，往往能開出最驚艷的花。」',
    author: '小思',
    role: '🧠 理性思辨導師',
    avatar: IMAGES.avatarXiaosi,
    energy: '✨ 98% 潛能',
    bg: 'from-[#EFF6FF] to-[#F5F8FF]',
    border: 'border-indigo-100/80',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'dq12',
    text: '「每一次深深的呼吸，都是在對內心的小孩說：別怕，我在這裡。」',
    author: '小艾',
    role: '🌸 溫柔療癒夥伴',
    avatar: IMAGES.avatarXiaoi,
    energy: '💖 100% 安全感',
    bg: 'from-[#FFF1F2] to-[#FFF5F6]',
    border: 'border-rose-100/80',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50 text-rose-600'
  }
];

// Custom hand-drawn style SVGs for high polish and exact match to the reference illustration style

const MapIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#FAF7F2" />
    <path d="M14 44L24 38L38 43L50 37V18L38 24L24 19L14 25V44Z" fill="#E8E5EC" stroke="#7C5B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 19V38" stroke="#7C5B8C" strokeWidth="1.5" strokeDasharray="3 3"/>
    <path d="M38 24V43" stroke="#7C5B8C" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="31" cy="26" r="4" fill="#7C5B8C"/>
    <path d="M31 30C31 30 28 33 28 35.5C28 37.1569 29.3431 38.5 31 38.5C32.6569 38.5 34 37.1569 34 35.5C34 33 31 30 31 30Z" fill="#9333EA" stroke="#7C5B8C" strokeWidth="1.2"/>
    <circle cx="31" cy="35" r="1" fill="white" />
  </svg>
);

const GameIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#FAF7F2" />
    <rect x="14" y="22" width="36" height="22" rx="11" fill="#E2ECE9" stroke="#5E8375" strokeWidth="2.5"/>
    <path d="M19 33H25" stroke="#5E8375" strokeWidth="3" strokeLinecap="round"/>
    <path d="M22 30V36" stroke="#5E8375" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="37" cy="30" r="2" fill="#7C5B8C"/>
    <circle cx="42" cy="35" r="2" fill="#F43F5E"/>
    {/* Little green organic leaf detail */}
    <path d="M32 22C32 22 30 16 34 16C35 16 36 17 35 19" stroke="#5E8375" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LabIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#FAF7F2" />
    <path d="M27 16H37" stroke="#5B7290" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M30 16V26L18 46C16.5 49 18.5 51 22 51H42C45.5 51 47.5 49 46 46L34 26V16" fill="#EFF6FF" stroke="#5B7290" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M21.5 42C24.5 40 26.5 43 29.5 41C32.5 39 35.5 42 38.5 40C41.5 38 43.5 41 44.5 39.5L45.5 45C46.5 47 45.5 49 43 49H21C18.5 49 17.5 47 18.5 45L21.5 42Z" fill="#D3DCE7" stroke="#5B7290" strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="2" fill="#5B7290" opacity="0.6"/>
    <circle cx="27" cy="38" r="1.5" fill="#5B7290" opacity="0.6"/>
    <circle cx="36" cy="40" r="2.5" fill="#5B7290" opacity="0.6"/>
  </svg>
);

const FormIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#FAF7F2" />
    <rect x="18" y="18" width="28" height="36" rx="4" fill="#FAF5EF" stroke="#68806F" strokeWidth="2.5"/>
    <path d="M27 18C27 15.5 29 14 32 14C35 14 37 15.5 37 18" fill="#F0FDF4" stroke="#68806F" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="24" y1="27" x2="40" y2="27" stroke="#A6BBAA" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="34" x2="36" y2="34" stroke="#A6BBAA" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="41" x2="32" y2="41" stroke="#A6BBAA" strokeWidth="2" strokeLinecap="round"/>
    <path d="M38 38C41.5 35 46 38 46 42C46 45.5 41.5 49 38 51C34.5 49 30 45.5 30 42C30 38 34.5 35 38 38Z" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5"/>
    <path d="M35 42.5L37 44.5L41 40.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StoryIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#FAF7F2" />
    <path d="M32 48C24 43.5 15 45 11 48V19C15 16 24 14.5 32 19C40 14.5 49 16 53 19V48C49 45 40 43.5 32 48Z" fill="#FFFBEB" stroke="#B48D52" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M32 19V48" stroke="#B48D52" strokeWidth="2.5"/>
    <line x1="15" y1="25" x2="27" y2="25" stroke="#DCC097" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="15" y1="31" x2="29" y2="31" stroke="#DCC097" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="15" y1="37" x2="25" y2="37" stroke="#DCC097" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="37" y1="25" x2="49" y2="25" stroke="#DCC097" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="35" y1="31" x2="49" y2="31" stroke="#DCC097" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="37" y1="37" x2="47" y2="37" stroke="#DCC097" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LavenderPots = () => (
  <svg className="w-16 h-16 md:w-20 md:h-20 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 75 L65 75 L70 92 L30 92 Z" fill="#EADBC8" stroke="#7C5B8C" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="71" width="44" height="4" rx="2" fill="#D2B48C" stroke="#7C5B8C" strokeWidth="2" />
    <path d="M50 71 V25" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M42 71 C38 55, 38 40, 38 30" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
    <path d="M58 71 C62 55, 62 40, 62 30" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
    <circle cx="50" cy="22" r="3" fill="#9C27B0" />
    <circle cx="50" cy="27" r="2.5" fill="#BA68C8" />
    <circle cx="48" cy="32" r="2.5" fill="#9C27B0" />
    <circle cx="52" cy="37" r="2.5" fill="#BA68C8" />
    <circle cx="50" cy="42" r="2" fill="#8E24AA" />
    
    <circle cx="38" cy="27" r="3" fill="#9C27B0" />
    <circle cx="36" cy="32" r="2.5" fill="#BA68C8" />
    <circle cx="40" cy="37" r="2.5" fill="#8E24AA" />
    <circle cx="38" cy="42" r="2" fill="#BA68C8" />
    
    <circle cx="62" cy="27" r="3" fill="#9C27B0" />
    <circle cx="64" cy="32" r="2.5" fill="#BA68C8" />
    <circle cx="60" cy="37" r="2.5" fill="#8E24AA" />
    <circle cx="62" cy="42" r="2" fill="#BA68C8" />
    
    <path d="M46 60 Q38 58, 43 53" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M54 62 Q62 60, 57 55" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function HomeDashboard({ setActiveTab, activeCharacter, onSelectCharacter }: HomeDashboardProps) {
  // Daily Quote logic
  const getTodayIndex = () => {
    const today = new Date();
    const dateHash = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return dateHash % DAILY_QUOTES.length;
  };

  const [quoteIndex, setQuoteIndex] = useState(getTodayIndex());
  const [copied, setCopied] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_liked_daily_quotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLike = (id: string) => {
    const isLiked = likedQuotes.includes(id);
    const newLikes = isLiked 
      ? likedQuotes.filter(item => item !== id)
      : [...likedQuotes, id];
    setLikedQuotes(newLikes);
    try {
      safeStorage.setItem('aifeiler_liked_daily_quotes', JSON.stringify(newLikes));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
  };

  const activeQuote = DAILY_QUOTES[quoteIndex];
  const isCurrentQuoteLiked = likedQuotes.includes(activeQuote.id);

  return (
    <div className="w-full flex flex-col gap-8 font-sans">
      
      {/* 艾飛樂心靈放映室 (YouTube 頻道播放器) */}
      <AifeilerVideoCinema />

      {/* 艾飛樂心靈 AI 助理 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <AiAssistant 
          activeCharacter={activeCharacter} 
          onSelectCharacter={onSelectCharacter}
        />
      </motion.div>
      
      {/* 每日一語 | DAILY QUOTE MODULE */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`w-full bg-gradient-to-br ${activeQuote.bg} border-2 ${activeQuote.border} rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_8px_30px_rgba(124,91,140,0.04)] flex flex-col md:flex-row items-center gap-6 md:gap-8`}
      >
        {/* Soft background sparkles vector */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-current" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L55 35 L90 40 L55 45 L50 80 L45 45 L10 40 L45 35 Z" />
          </svg>
        </div>

        {/* Character Illustration Area */}
        <div className="flex flex-col items-center flex-shrink-0 text-center select-none group">
          <div className="relative">
            {/* Soft decorative pulsing ring */}
            <div className={`absolute -inset-1.5 rounded-full opacity-60 blur-xs animate-pulse ${
              activeQuote.author === '小艾' ? 'bg-rose-200' : 'bg-indigo-200'
            }`} />
            
            {/* Avatar frame */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white shadow-md ring-4 ring-white/60">
              <img 
                src={activeQuote.avatar} 
                alt={activeQuote.author} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer" 
              />
            </div>
            
            {/* Duty badge indicator */}
            <span className="absolute -bottom-1 -right-1 bg-white text-[10px] leading-none px-2 py-1 rounded-full shadow-md font-bold text-[#4E4158] border border-purple-100 flex items-center gap-0.5">
              💡 值班中
            </span>
          </div>
          
          <h4 className="mt-3 font-serif font-extrabold text-sm text-[#4E4158] flex items-center gap-1">
            {activeQuote.author}
          </h4>
          <span className="mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white/80 border border-purple-100 text-[#7C5B8C] whitespace-nowrap">
            {activeQuote.role}
          </span>
        </div>

        {/* Quote Content and Speech Bubble Area */}
        <div className="flex-1 flex flex-col justify-between w-full">
          {/* Top Label Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#7C5B8C]/10 pb-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#9A8AA6] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#7C5B8C] animate-spin" style={{ animationDuration: '6s' }} />
              今日一語 ∙ Daily Quote
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${activeQuote.accentBg}`}>
              {activeQuote.energy}
            </span>
          </div>

          {/* Speech Bubble Content */}
          <div className="py-4 md:py-6 relative">
            <span className="absolute -top-1 -left-2 text-3xl font-serif text-[#7C5B8C]/15 select-none">❝</span>
            <blockquote className="font-serif font-extrabold text-base sm:text-lg md:text-xl text-[#4E4158] leading-relaxed tracking-wide italic pl-4">
              {activeQuote.text}
            </blockquote>
            <span className="absolute -bottom-4 right-2 text-3xl font-serif text-[#7C5B8C]/15 select-none">❞</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#7C5B8C]/5">
            <span className="text-[10px] font-sans font-medium text-[#9A8AA6]">
              {quoteIndex === getTodayIndex() ? '📅 依今日日期精選' : '💡 已手動切換'}
            </span>
            
            <div className="flex items-center gap-2">
              {/* Copy Button */}
              <button
                onClick={() => handleCopy(activeQuote.text)}
                className="p-2 bg-white/70 hover:bg-white border border-purple-100/50 rounded-xl text-[#9A8AA6] hover:text-[#7C5B8C] transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold shadow-2xs"
                title="複製此語錄"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                    <span className="text-emerald-600">已複製</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>複製</span>
                  </>
                )}
              </button>

              {/* Heart/Collect Button */}
              <button
                onClick={() => toggleLike(activeQuote.id)}
                className={`p-2 border rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold shadow-2xs ${
                  isCurrentQuoteLiked 
                    ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100' 
                    : 'bg-white/70 hover:bg-white border-purple-100/50 text-[#9A8AA6] hover:text-[#7C5B8C]'
                }`}
                title="收藏語錄"
              >
                <Heart className={`w-3.5 h-3.5 transition-transform ${isCurrentQuoteLiked ? 'fill-rose-500 scale-110' : ''}`} />
                <span>{isCurrentQuoteLiked ? '已收藏' : '收藏'}</span>
              </button>

              {/* Next/Switch Button */}
              <button
                onClick={handleNextQuote}
                className="p-2 bg-white/70 hover:bg-white border border-purple-100/50 rounded-xl text-[#9A8AA6] hover:text-[#7C5B8C] transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold shadow-2xs"
                title="更換下一條"
              >
                <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform duration-500" />
                <span>換一條</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upper Grid Layout: 8 cols main, 4 cols widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content (Left - Spans 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Centered Main Welcome Hero Banner */}
          <div 
            onClick={() => setActiveTab('quote-map')}
            className="rounded-3xl border border-purple-100/40 relative overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group w-full bg-[#FAF8F5] select-none min-h-[340px] sm:min-h-[400px] md:min-h-[460px] flex items-center justify-center text-center p-5 sm:p-8 md:p-10"
          >
            <img 
              src={IMAGES.mainBanner} 
              alt="在溫柔裡思考，在陪伴中成長" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-700 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
            {/* Soft tint overlay to blend well with the design */}
            <div className="absolute inset-0 bg-[#372D3E]/5 group-hover:bg-[#372D3E]/8 transition-all duration-300 pointer-events-none"></div>

            {/* Content overlay wrapped in an elegant glassmorphism card for extreme readability */}
            <div className="relative z-10 max-w-lg bg-white/75 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/50 p-5 sm:p-7 md:p-8 shadow-[0_8px_32px_0_rgba(55,45,62,0.12)] transition-all duration-300 group-hover:bg-white/80 group-hover:shadow-[0_12px_40px_0_rgba(55,45,62,0.16)] flex flex-col items-center justify-center">
              <h1 className="font-serif text-[#372D3E] text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-widest">
                在溫柔裡思考，<br className="sm:hidden" />
                在陪伴中成長。
              </h1>
              
              <p className="mt-3 text-[10px] sm:text-xs md:text-sm text-[#372D3E]/85 font-medium leading-relaxed max-w-sm sm:max-w-md font-sans tracking-wide">
                艾飛樂 Aifeiler 是一個結合語錄、遊戲、思辨與成長紀錄的療癒互動網站，陪你在生活裡，慢慢長出更好的自己。
              </p>

              <div className="mt-5 md:mt-6">
                <span
                  className="bg-[#6D4E7B] hover:bg-[#583D65] text-white font-serif text-[11px] sm:text-xs md:text-sm font-bold py-2 px-5 sm:py-2.5 sm:px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5"
                >
                  開始探索 ➔
                </span>
              </div>
            </div>
          </div>

          {/* 大眾占卜: 塔羅心靈占卜 */}
          <TarotDivination />

          {/* 探索五大功能 Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-sm md:text-base font-bold text-[#4E4158] flex items-center gap-1.5">
              <span className="text-[#7C5B8C] text-sm md:text-base">✦</span> 探索五大功能
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { id: 'quote-map', label: '語錄地圖', desc: '探索療癒語錄，標記屬於你的心靈地圖。', icon: <MapIcon /> },
                { id: 'interactive-games', label: '互動遊戲', desc: '趣味互動小遊戲，在玩樂中學習與成長。', icon: <GameIcon /> },
                { id: 'reflection-lab', label: '思辨實驗', desc: '挑戰思維的各種可能，培養獨立思考力。', icon: <LabIcon /> },
                { id: 'growth-journal', label: '成長表單', desc: '記錄心情與目標，看見自己的進步軌跡。', icon: <FormIcon /> },
                { id: 'character-stories', label: '角色故事', desc: '認識角色們的故事，感受陪伴的力量。', icon: <StoryIcon /> }
              ].map((feat) => (
                <button
                  key={feat.id}
                  onClick={() => setActiveTab(feat.id as any)}
                  className="bg-white hover:bg-[#FAF7F2]/40 border border-purple-100/40 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-between text-center gap-4 group cursor-pointer min-h-[210px]"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 flex-1 justify-center">
                    <span className="font-serif font-bold text-xs md:text-[13px] text-[#4E4158]">{feat.label}</span>
                    <p className="text-[10px] text-[#9A8AA6] leading-relaxed max-w-[120px] mx-auto font-sans font-medium">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-[#FAF7F2] group-hover:bg-[#7C5B8C] text-[#7C5B8C] group-hover:text-white flex items-center justify-center transition-all border border-purple-100/20 shadow-xs">
                    <span className="text-[10px] font-bold">➔</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Widgets Column (Spans 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8 w-full lg:sticky lg:top-[90px]">
          
          {/* Widget 1: 本週熱門推薦 */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50 mb-4">
              <h4 className="font-serif text-xs md:text-sm font-bold text-[#4E4158] flex items-center gap-1.5">
                <span className="text-rose-500">🔥</span> 本週熱門推薦
              </h4>
              <span className="text-[10px] text-[#9A8AA6] font-semibold cursor-pointer hover:text-[#7C5B8C] transition-colors">查看更多</span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Starry moon lit banner item */}
              <div
                onClick={() => setActiveTab('quote-map')}
                className="group cursor-pointer bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#431407] text-white rounded-2xl overflow-hidden shadow-xs relative flex flex-col justify-end p-4 min-h-[125px] border border-purple-500/10"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.25),transparent_70%)]"></div>
                {/* Embedded delicate SVG stars */}
                <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15%" cy="20%" r="1" fill="white" />
                  <circle cx="35%" cy="15%" r="1" fill="white" />
                  <circle cx="70%" cy="30%" r="0.8" fill="white" />
                  <circle cx="85%" cy="10%" r="1.2" fill="white" />
                  <circle cx="50%" cy="40%" r="1" fill="white" />
                </svg>
                <div className="absolute top-3.5 right-4 text-xl filter drop-shadow-[0_0_6px_rgba(253,224,71,0.4)]">🌙</div>
                
                <div className="relative z-10">
                  <span className="text-[9px] font-sans font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs text-white">語錄地圖</span>
                  <h5 className="font-serif text-[13px] font-bold mt-2 text-white tracking-wide">夜裡的星光，照亮前行的路</h5>
                  <div className="flex justify-between items-center text-[10px] text-purple-200/90 mt-1">
                    <span className="font-sans font-medium">最受歡迎的療詢語錄地圖</span>
                    <span className="flex items-center gap-1 text-rose-300 font-sans font-bold">
                      <Heart className="w-2.5 h-2.5 fill-rose-300" /> 2.4K
                    </span>
                  </div>
                </div>
              </div>

              {/* List Item 2 */}
              <div
                onClick={() => setActiveTab('interactive-games')}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF7F2]/50 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-lg shadow-xs">🎮</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-[#9A8AA6] font-bold font-sans tracking-wide">互動遊戲</span>
                  <h5 className="font-serif text-[12px] font-bold text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors mt-0.5 truncate">心靈小遊戲：選擇的力量</h5>
                  <p className="text-[10px] text-[#9A8AA6] font-medium truncate">玩遊戲，認識不一樣的自己</p>
                </div>
                <span className="text-[10px] text-rose-500 flex items-center gap-0.5 font-bold font-sans shrink-0">
                  <Heart className="w-2.5 h-2.5 fill-rose-400" /> 1.8K
                </span>
              </div>

              {/* List Item 3 */}
              <div
                onClick={() => setActiveTab('reflection-lab')}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF7F2]/50 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg shadow-xs">🧪</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-[#9A8AA6] font-bold font-sans tracking-wide">思辨實驗</span>
                  <h5 className="font-serif text-[12px] font-bold text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors mt-0.5 truncate">思辨實驗室：如果可以重來？</h5>
                  <p className="text-[10px] text-[#9A8AA6] font-medium truncate">每週一個思考實驗挑戰</p>
                </div>
                <span className="text-[10px] text-rose-500 flex items-center gap-0.5 font-bold font-sans shrink-0">
                  <Heart className="w-2.5 h-2.5 fill-rose-400" /> 1.2K
                </span>
              </div>
            </div>
          </div>

          {/* Widget 2: 今日暖心語錄 Sticker */}
          <div className="bg-[#FAF5EF]/90 p-6 rounded-3xl border border-purple-200/20 relative shadow-sm overflow-hidden flex flex-col justify-between min-h-[160px]">
            {/* Kraft tape sticker effect */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-[#D2B48C]/35 rounded-xs rotate-[-1deg] border border-[#C5A880]/20 shadow-2xs"></div>
            
            {/* Hand-drawn Lavender absolute stem on right to match sketch */}
            <div className="absolute bottom-1 right-2 opacity-90 pointer-events-none">
              <svg className="w-14 h-24" viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 90 C25 60, 25 30, 25 12" stroke="#68806F" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="25" cy="18" r="2.5" fill="#7C5B8C" />
                <circle cx="22" cy="25" r="2.3" fill="#9333EA" />
                <circle cx="28" cy="25" r="2.3" fill="#7C5B8C" />
                <circle cx="25" cy="32" r="2.3" fill="#A855F7" />
                <circle cx="22" cy="40" r="2.3" fill="#9333EA" />
                <circle cx="28" cy="40" r="2.3" fill="#7C5B8C" />
                <circle cx="25" cy="48" r="2" fill="#A855F7" />
                <circle cx="22" cy="56" r="2" fill="#9333EA" />
                <circle cx="27" cy="56" r="2" fill="#7C5B8C" />
                <circle cx="25" cy="64" r="1.5" fill="#A855F7" />
                {/* Tiny leafy sprig */}
                <path d="M25 68 C20 68, 22 62, 22 62" stroke="#68806F" strokeWidth="1" />
                <path d="M25 72 C30 72, 28 66, 28 66" stroke="#68806F" strokeWidth="1" />
              </svg>
            </div>

            <div className="pt-4 pb-2 text-center relative z-10 flex flex-col justify-between h-full">
              <h5 className="font-serif text-[11px] text-[#9A8AA6] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
                <span>❝</span> 今日暖心語錄 <span>❞</span>
              </h5>
              
              <p className="mt-4 font-serif font-bold text-sm md:text-base text-[#4E4158] leading-relaxed max-w-[190px] mx-auto">
                成長不是變得更完美，<br />
                而是學會溫柔地接納自己。
              </p>
              
              <span className="text-[10px] text-[#9A8AA6] block mt-4 font-sans font-semibold tracking-wide">
                — 艾飛樂 Aifeiler
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Full-bleed/Unified bottom statistics block (stretches to look exactly like reference image) */}
      <div className="bg-white/70 p-6 md:p-8 rounded-3xl border border-purple-100/40 shadow-xs flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center mt-4">
        
        {/* Left Side: Stats (Spans 8 cols) */}
        <div className="lg:col-span-8 w-full flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-purple-50 pb-3">
            <span className="text-xl">🌾</span>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#4E4158] tracking-wide">我們一起走過的成長旅程</h4>
              <p className="text-[10px] text-[#9A8AA6] font-medium font-sans mt-0.5">每一份記錄，都是你努力的證明</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-1">
            {/* Lavender Pots decoration */}
            <LavenderPots />

            {/* Statistics Row Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center flex-1 w-full">
              {[
                { num: '26,842', label: '👤 註冊用戶', desc: '位夥伴加入' },
                { num: '128,569', label: '💜 語錄收藏', desc: '則暖心語錄' },
                { num: '82,142', label: '🎮 遊戲體驗', desc: '次互動挑戰' },
                { num: '34,759', label: '🔬 思辨實驗完成', desc: '次思考實驗' },
                { num: '57,331', label: '📝 成長表單填寫', desc: '份成長紀錄' }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-1.5 p-2 bg-[#FAF7F2]/40 rounded-2xl border border-purple-100/20 shadow-2xs hover:scale-[1.02] transition-transform">
                  <span className="text-sm md:text-base font-serif font-extrabold text-[#7C5B8C]">{stat.num}</span>
                  <div className="text-[10px] text-[#4E4158] font-bold tracking-wide truncate">{stat.label}</div>
                  <div className="text-[9px] text-[#9A8AA6] font-semibold">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Divider + Companion Relationship Diagram (Spans 4 cols) */}
        <div className="lg:col-span-4 w-full flex flex-col gap-3 lg:border-l lg:border-[#7C5B8C]/12 lg:pl-8">
          <div>
            <h4 className="font-serif text-xs md:text-sm font-bold text-[#4E4158] flex items-center gap-1.5">
              <span>✦</span> 艾飛樂的陪伴關係圖
            </h4>
            <p className="text-[10px] text-[#9A8AA6] font-medium font-sans mt-0.5">我們在不同的角色裡，陪你成長每一步</p>
          </div>

          {/* Dotted horizontal relationship graph */}
          <div className="relative h-28 bg-[#FAF7F2]/30 rounded-2xl border border-purple-100/10 overflow-hidden flex items-center justify-center p-3 mt-1">
            {/* Background watercolor glow */}
            <div className="absolute w-20 h-20 rounded-full bg-purple-200/10 blur-xl"></div>
            
            {/* Line connecting characters */}
            <svg className="absolute inset-x-0 w-full h-10 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              <line x1="12%" y1="50%" x2="88%" y2="50%" stroke="rgba(124, 91, 140, 0.25)" strokeWidth="1.5" strokeDasharray="3,3" />
            </svg>

            {/* Horizontal Lineup of companion avatars */}
            <div className="flex items-center justify-between w-full relative z-10 px-2">
              
              {/* 小艾 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#FDF4F5] border border-rose-200/50 flex items-center justify-center overflow-hidden shadow-xs ring-4 ring-white">
                  <img src={IMAGES.avatarXiaoi} alt="小艾" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[9px] font-bold text-[#4E4158] mt-1.5">小艾</span>
              </div>

              {/* 小思 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#EEF1FB] border border-indigo-200/50 flex items-center justify-center overflow-hidden shadow-xs ring-4 ring-white">
                  <img src={IMAGES.avatarXiaosi} alt="小思" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[9px] font-bold text-[#4E4158] mt-1.5">小思</span>
              </div>

              {/* Central Heart Purple overlay */}
              <div className="w-7 h-7 bg-white rounded-full border border-rose-100 flex items-center justify-center shadow-md animate-soft-pulse shrink-0 ring-2 ring-purple-100/40">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </div>

              {/* 艾比 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF4ED] border border-amber-200/50 flex items-center justify-center overflow-hidden shadow-xs ring-4 ring-white">
                  <img src={IMAGES.avatarIvy} alt="艾比" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[9px] font-bold text-[#4E4158] mt-1.5">艾比</span>
              </div>

              {/* 思野 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#EAF5ED] border border-emerald-200/50 flex items-center justify-center overflow-hidden shadow-xs ring-4 ring-white">
                  <img src={IMAGES.avatarSiye} alt="思野" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[9px] font-bold text-[#4E4158] mt-1.5">思野</span>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
