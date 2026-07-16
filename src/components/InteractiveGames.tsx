import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles, Award, X, ChevronRight, RotateCw, HelpCircle, MessageSquare, Heart, Compass } from 'lucide-react';
import EmotionGarden from './EmotionGarden';
import ValueWheel from './ValueWheel';
import PuzzleHouse from './PuzzleHouse';
import FlipCards from './FlipCards';
import DreamPostman from './DreamPostman';
import ColorPalette from './ColorPalette';
import VRElectroGame from './VRElectroGame';
import { IMAGES } from '../assets/images';

interface InteractiveGamesProps {
  activeCharacter: string;
}

type GameType = 'menu' | 'emotion-garden' | 'value-wheel' | 'puzzle-house' | 'flip-cards' | 'dream-postman' | 'color-palette' | 'vr-game';

export default function InteractiveGames({ activeCharacter }: InteractiveGamesProps) {
  const [activeGame, setActiveGame] = useState<GameType>('menu');
  const [activeAchievementModal, setActiveAchievementModal] = useState<'color' | 'debate' | null>(null);
  
  // Color achievement states
  const [breathAuraColor, setBreathAuraColor] = useState('rgba(124, 91, 140, 0.45)');
  const [breathingText, setBreathingText] = useState('點擊下方色彩或隨心深呼吸，感受流動...');
  
  // Debate achievement states
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Fated questions for the innovative Debate achievement card
  const FATED_QUESTIONS = [
    {
      q: "如果可以重來，你還會選擇成為今天的自己嗎？為什麼呢？",
      tip: "思野說：『過去的每一步都是一滴墨水，繪製成了你現在的樣子。』"
    },
    {
      q: "生活中的那些不完美，是否也是組成你獨特生命拼圖不可或缺的一部分？",
      tip: "小思說：『完美是終點，但不完美卻是沿途看見彩虹的奇妙過程。』"
    },
    {
      q: "如果能給三年前正處於迷惘中的自己寫一封簡短的信，你會寫下哪句話？",
      tip: "艾比說：『告訴她：不要害怕，前方的星光其實非常溫暖。』"
    },
    {
      q: "在今天或這週的所有遇見中，有沒有哪一刻，你真正對自己說了聲：辛苦了？",
      tip: "小艾說：『接納自己的疲倦，也是一種前行的勇氣。』"
    },
    {
      q: "對你而言，什麼是真正的『自由』？是能隨心所欲，還是能溫柔而堅定地拒絕？",
      tip: "Ivy 說：『自由是，不管你走到哪裡，你的靈魂都擁有溫柔呼吸的權力。』"
    }
  ];

  const drawNewQuestion = () => {
    setIsSpinning(true);
    setIsCardFlipped(false);
    setTimeout(() => {
      setSelectedQuestionIndex((prev) => (prev + 1) % FATED_QUESTIONS.length);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <div id="interactive-games-root" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
      
      {/* Main Center Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        <AnimatePresence mode="wait">
          {activeGame === 'menu' ? (
            <motion.div
              key="games-menu-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              {/* Premium Top Watercolor Banner exactly like screenshot */}
              <div 
                style={{ 
                  backgroundImage: `linear-gradient(to right, rgba(254, 252, 247, 0.95), rgba(254, 252, 247, 0.7)), url(${IMAGES.homeHeroBgPlain})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'right center' 
                }}
                className="rounded-3xl p-6 md:p-8 border border-purple-200/40 relative overflow-hidden min-h-[220px] flex flex-col justify-center shadow-xs"
              >
                {/* Overlay vignette */}
                <div className="absolute inset-0 bg-[#FAF7F2]/20 mix-blend-multiply pointer-events-none" />

                <div className="relative z-10 max-w-lg">
                  <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#4E4158] leading-tight tracking-wide">
                    在遊戲裡練習感受，<br />
                    在互動中認識自己。
                  </h2>
                  <p className="text-xs text-[#9A8AA6] font-medium leading-relaxed mt-3 max-w-md">
                    每一場遊戲，都是一段與自己的對話，也是一次溫柔的成長練習。
                  </p>
                  
                  <button
                    id="choose-game-scroll-btn"
                    onClick={() => {
                      const el = document.getElementById('games-grid-layout');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-6 bg-[#7C5B8C] hover:bg-[#684a75] text-white font-serif text-xs font-bold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    選擇遊戲開始吧！ →
                  </button>
                </div>
              </div>

              {/* 3x2 Grid of 6 Games with exquisite SVGs resembling the watercolor artwork */}
              <div id="games-grid-layout" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Card 1: 情緒配對花園 */}
                <div className="bg-white/95 border border-[#E9E1F0] rounded-3xl p-5 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[270px] relative group">
                  <div className="flex flex-col gap-3">
                    {/* Badge number */}
                    <span className="w-5 h-5 rounded-full bg-[#8E79A1] text-white text-[10px] font-bold flex items-center justify-center font-serif">
                      1
                    </span>
                    <h4 className="font-serif font-extrabold text-sm text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors">
                      情緒配對花園
                    </h4>

                    {/* Exquisite SVG Illustration matching the screenshot */}
                    <div className="w-full h-24 bg-[#FAF8F5] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-purple-50/50">
                      <svg className="w-28 h-20" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Pot / Garden crate */}
                        <path d="M15 65 L105 65 L95 72 L25 72 Z" fill="#D2B48C" fillOpacity="0.7" />
                        <line x1="20" y1="65" x2="100" y2="65" stroke="#A0522D" strokeWidth="1.5" />
                        
                        {/* Stems */}
                        <path d="M35 65 Q30 45 32 35" stroke="#8FBC8F" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M55 65 Q55 40 50 28" stroke="#8FBC8F" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M75 65 Q80 45 78 32" stroke="#8FBC8F" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M95 65 Q90 50 92 42" stroke="#8FBC8F" strokeWidth="1.8" strokeLinecap="round" />

                        {/* Flower 1 (Happy - Yellow) */}
                        <circle cx="32" cy="35" r="10" fill="#FEE2E2" fillOpacity="0.8" />
                        <circle cx="32" cy="35" r="7" fill="#FDE047" />
                        <circle cx="30" cy="33" r="1" fill="#333" />
                        <circle cx="34" cy="33" r="1" fill="#333" />
                        <path d="M30 37 Q32 39 34 37" stroke="#333" strokeWidth="0.8" fill="none" />

                        {/* Flower 2 (Sad - Blue) */}
                        <circle cx="50" cy="28" r="9" fill="#DBEAFE" fillOpacity="0.8" />
                        <circle cx="50" cy="28" r="6" fill="#60A5FA" />
                        <circle cx="48" cy="27" r="1" fill="#333" />
                        <circle cx="52" cy="27" r="1" fill="#333" />
                        <path d="M48 30 Q50 29 52 30" stroke="#333" strokeWidth="0.8" fill="none" />

                        {/* Flower 3 (Angry - Red) */}
                        <circle cx="78" cy="32" r="9" fill="#FEE2E2" fillOpacity="0.8" />
                        <circle cx="78" cy="32" r="6" fill="#F87171" />
                        <circle cx="76" cy="31" r="1" fill="#333" />
                        <circle cx="80" cy="31" r="1" fill="#333" />
                        <path d="M76 34 Q78 33 80 34" stroke="#333" strokeWidth="0.8" fill="none" />

                        {/* Ground flowers detail */}
                        <circle cx="92" cy="42" r="5" fill="#DDD" />
                        <circle cx="92" cy="42" r="3" fill="#A78BFA" />
                      </svg>
                    </div>

                    <p className="text-[11px] text-[#9A8AA6] leading-relaxed">
                      認識各種情緒，找到與感受對應的花朵朋友。
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveGame('emotion-garden')}
                    className="mt-4 w-full bg-[#FAF7F2] hover:bg-[#7C5B8C] hover:text-white border border-[#7C5B8C]/12 text-[#7C5B8C] font-serif text-xs font-bold py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    開始遊戲
                  </button>
                </div>

                {/* Card 2: 價值選擇轉盤 */}
                <div className="bg-white/95 border border-[#E9E1F0] rounded-3xl p-5 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[270px] relative group">
                  <div className="flex flex-col gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#8E79A1] text-white text-[10px] font-bold flex items-center justify-center font-serif">
                      2
                    </span>
                    <h4 className="font-serif font-extrabold text-sm text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors">
                      價值選擇轉盤
                    </h4>

                    {/* Exquisite SVG Illustration matching the screenshot */}
                    <div className="w-full h-24 bg-[#FAF8F5] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-purple-50/50">
                      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Wheel Stand */}
                        <path d="M50 50 L35 90 L65 90 Z" stroke="#CD7F32" strokeWidth="2.5" strokeLinejoin="round" />
                        <rect x="25" y="88" width="50" height="4" rx="2" fill="#8B4513" />

                        {/* Circular wheel */}
                        <circle cx="50" cy="50" r="34" fill="#FDF6EC" stroke="#CD7F32" strokeWidth="2" />
                        
                        {/* Slices decoration */}
                        <path d="M50 16 L50 84" stroke="#CD7F32" strokeWidth="1" strokeDasharray="2 1" />
                        <path d="M16 50 L84 50" stroke="#CD7F32" strokeWidth="1" strokeDasharray="2 1" />
                        <path d="M26 26 L74 74" stroke="#CD7F32" strokeWidth="1" strokeDasharray="2 1" />
                        <path d="M26 74 L74 26" stroke="#CD7F32" strokeWidth="1" strokeDasharray="2 1" />

                        {/* Center Pin */}
                        <circle cx="50" cy="50" r="5" fill="#EF4444" />
                        
                        {/* Decorative watercolor-like pastel blobs in wedges */}
                        <circle cx="50" cy="28" r="4" fill="#FDE047" fillOpacity="0.8" />
                        <circle cx="70" cy="38" r="4" fill="#60A5FA" fillOpacity="0.8" />
                        <circle cx="68" cy="64" r="4" fill="#34D399" fillOpacity="0.8" />
                        <circle cx="32" cy="64" r="4" fill="#F87171" fillOpacity="0.8" />
                        <circle cx="30" cy="38" r="4" fill="#C084FC" fillOpacity="0.8" />
                      </svg>
                    </div>

                    <p className="text-[11px] text-[#9A8AA6] leading-relaxed">
                      探索你在意的價值，做出最靠近自己的選擇。
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveGame('value-wheel')}
                    className="mt-4 w-full bg-[#FAF7F2] hover:bg-[#7C5B8C] hover:text-white border border-[#7C5B8C]/12 text-[#7C5B8C] font-serif text-xs font-bold py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    開始遊戲
                  </button>
                </div>

                {/* Card 3: 關係拼圖小屋 */}
                <div className="bg-white/95 border border-[#E9E1F0] rounded-3xl p-5 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[270px] relative group">
                  <div className="flex flex-col gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#8E79A1] text-white text-[10px] font-bold flex items-center justify-center font-serif">
                      3
                    </span>
                    <h4 className="font-serif font-extrabold text-sm text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors">
                      關係拼圖小屋
                    </h4>

                    {/* Exquisite SVG Illustration matching the screenshot */}
                    <div className="w-full h-24 bg-[#FAF8F5] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-purple-50/50">
                      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* House Base */}
                        <rect x="25" y="45" width="50" height="40" rx="3" fill="#EBF3FE" stroke="#7C5B8C" strokeWidth="1.8" />
                        {/* Roof */}
                        <path d="M20 45 L50 18 L80 45 Z" fill="#E8DDF0" stroke="#7C5B8C" strokeWidth="1.8" strokeLinejoin="round" />
                        {/* Puzzle dividing lines overlay */}
                        <path d="M50 18 L50 85" stroke="#7C5B8C" strokeWidth="1" strokeDasharray="3 3" />
                        <path d="M25 58 L75 58" stroke="#7C5B8C" strokeWidth="1" strokeDasharray="3 3" />
                        
                        {/* Little Window inside */}
                        <rect x="33" y="64" width="10" height="10" rx="1" fill="#FEF08A" stroke="#7C5B8C" strokeWidth="1" />
                        {/* Heart decoration */}
                        <path d="M50 48 C50 48 48 44 45 44 C42 44 40 46 40 49 C40 54 50 58 50 58 C50 58 60 54 60 49 C60 46 58 44 55 44 C52 44 50 48 50 48 Z" fill="#F87171" fillOpacity="0.7" />
                      </svg>
                    </div>

                    <p className="text-[11px] text-[#9A8AA6] leading-relaxed">
                      拼出你與他人的關係樣貌，看見彼此的連結與影響。
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveGame('puzzle-house')}
                    className="mt-4 w-full bg-[#FAF7F2] hover:bg-[#7C5B8C] hover:text-white border border-[#7C5B8C]/12 text-[#7C5B8C] font-serif text-xs font-bold py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    開始遊戲
                  </button>
                </div>

                {/* Card 4: 自我探索翻翻卡 */}
                <div className="bg-white/95 border border-[#E9E1F0] rounded-3xl p-5 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[270px] relative group">
                  <div className="flex flex-col gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#8E79A1] text-white text-[10px] font-bold flex items-center justify-center font-serif">
                      4
                    </span>
                    <h4 className="font-serif font-extrabold text-sm text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors">
                      自我探索翻翻卡
                    </h4>

                    {/* Exquisite SVG Illustration matching the screenshot */}
                    <div className="w-full h-24 bg-[#FAF8F5] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-purple-50/50">
                      <svg className="w-28 h-20" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Card 1 (with Mirror) */}
                        <g transform="translate(15, 10) rotate(-10)">
                          <rect x="0" y="0" width="34" height="52" rx="4" fill="#FDFBF7" stroke="#C084FC" strokeWidth="1.5" />
                          <circle cx="17" cy="20" r="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
                          <path d="M17 28 L17 38 M13 34 L21 34" stroke="#0284C7" strokeWidth="1" />
                        </g>

                        {/* Card 2 (with Heart) */}
                        <g transform="translate(62, 12) rotate(12)">
                          <rect x="0" y="0" width="34" height="52" rx="4" fill="#FDFBF7" stroke="#FB7185" strokeWidth="1.5" />
                          {/* Heart */}
                          <path d="M17 18 C17 18 15 14 12 14 C9 14 7 16 7 20 C7 25 17 32 17 32 C17 32 27 25 27 20 C27 16 25 14 22 14 C19 14 17 18 17 18 Z" fill="#FB7185" fillOpacity="0.7" />
                        </g>
                      </svg>
                    </div>

                    <p className="text-[11px] text-[#9A8AA6] leading-relaxed">
                      翻開卡片，遇見不同的自己，寫下專屬於你的發現。
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveGame('flip-cards')}
                    className="mt-4 w-full bg-[#FAF7F2] hover:bg-[#7C5B8C] hover:text-white border border-[#7C5B8C]/12 text-[#7C5B8C] font-serif text-xs font-bold py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    開始遊戲
                  </button>
                </div>

                {/* Card 5: 夢想郵差任務 */}
                <div className="bg-white/95 border border-[#E9E1F0] rounded-3xl p-5 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[270px] relative group">
                  <div className="flex flex-col gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#8E79A1] text-white text-[10px] font-bold flex items-center justify-center font-serif">
                      5
                    </span>
                    <h4 className="font-serif font-extrabold text-sm text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors">
                      夢想郵差任務
                    </h4>

                    {/* Exquisite SVG Illustration matching the screenshot */}
                    <div className="w-full h-24 bg-[#FAF8F5] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-purple-50/50">
                      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Mailbox body */}
                        <path d="M30 40 L70 40 L70 80 L30 80 Z" fill="#E8DDF0" stroke="#7C5B8C" strokeWidth="1.8" />
                        <path d="M30 40 C30 20 70 20 70 40 Z" fill="#8E79A1" stroke="#7C5B8C" strokeWidth="1.8" />
                        
                        {/* Mailbox stand pole */}
                        <rect x="47" y="80" width="6" height="15" fill="#CD7F32" />
                        
                        {/* Slot opening */}
                        <rect x="38" y="46" width="24" height="4" rx="1" fill="#333" />
                        
                        {/* Little Letter sliding in */}
                        <g transform="translate(42, 36) rotate(-15)">
                          <rect x="0" y="0" width="18" height="11" rx="1" fill="#FFF" stroke="#FB7185" strokeWidth="1" />
                          <path d="M0 0 L9 6 L18 0" stroke="#FB7185" strokeWidth="0.8" />
                        </g>
                      </svg>
                    </div>

                    <p className="text-[11px] text-[#9A8AA6] leading-relaxed">
                      寫下夢想，寄給未來的自己，完成任務獲得成長回信！
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveGame('dream-postman')}
                    className="mt-4 w-full bg-[#FAF7F2] hover:bg-[#7C5B8C] hover:text-white border border-[#7C5B8C]/12 text-[#7C5B8C] font-serif text-xs font-bold py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    開始遊戲
                  </button>
                </div>

                {/* Card 6: 心情顏色調盤 */}
                <div className="bg-white/95 border border-[#E9E1F0] rounded-3xl p-5 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[270px] relative group">
                  <div className="flex flex-col gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#8E79A1] text-white text-[10px] font-bold flex items-center justify-center font-serif">
                      6
                    </span>
                    <h4 className="font-serif font-extrabold text-sm text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors">
                      心情顏色調盤
                    </h4>

                    {/* Exquisite SVG Illustration matching the screenshot */}
                    <div className="w-full h-24 bg-[#FAF8F5] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-purple-50/50">
                      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Painter palette bean shape */}
                        <path d="M25 65 C20 45, 30 25, 60 25 C80 25, 90 45, 80 65 C72 75, 55 75, 48 65 C43 58, 32 58, 30 65 Z" fill="#EFE8D3" stroke="#8B4513" strokeWidth="1.8" />
                        
                        {/* Paint blobs */}
                        <circle cx="38" cy="38" r="5" fill="#FB7185" />
                        <circle cx="52" cy="32" r="5" fill="#FBBF24" />
                        <circle cx="68" cy="38" r="5" fill="#34D399" />
                        <circle cx="74" cy="52" r="5" fill="#60A5FA" />
                        <circle cx="62" cy="62" r="5" fill="#C084FC" />
                        
                        {/* Thumb hole */}
                        <ellipse cx="34" cy="50" rx="3" ry="5" fill="#FFF" stroke="#8B4513" strokeWidth="1" />

                        {/* Paint brush lying across */}
                        <g transform="translate(10, -5)">
                          <path d="M30 80 L70 40" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />
                          {/* Tip */}
                          <path d="M70 40 L75 35 L72 38 Z" fill="#333" />
                        </g>
                      </svg>
                    </div>

                    <p className="text-[11px] text-[#9A8AA6] leading-relaxed">
                      用顏色調出今天的心情，看見情緒的美麗與多元。
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveGame('color-palette')}
                    className="mt-4 w-full bg-[#FAF7F2] hover:bg-[#7C5B8C] hover:text-white border border-[#7C5B8C]/12 text-[#7C5B8C] font-serif text-xs font-bold py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    開始遊戲
                  </button>
                </div>

                {/* Card 7: 腦電波智能遊戲 */}
                <div className="bg-white/95 border border-[#E9E1F0] rounded-3xl p-5 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[270px] relative group">
                  <div className="flex flex-col gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#8E79A1] text-white text-[10px] font-bold flex items-center justify-center font-serif">
                      7
                    </span>
                    <h4 className="font-serif font-extrabold text-sm text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors">
                      腦電波智能遊戲
                    </h4>

                    <div className="w-full h-24 bg-[#FAF8F5] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-purple-50/50">
                      <svg className="w-28 h-20" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 35 C40 25, 55 25, 60 30 C65 25, 80 25, 80 35 C80 45, 75 55, 60 62 C45 55, 40 45, 40 35 Z" fill="#FCE7F3" stroke="#EC4899" strokeWidth="1" strokeDasharray="2,2" />
                        <circle cx="60" cy="45" r="12" fill="#FAF5FF" stroke="#7C5B8C" strokeWidth="1.5" />
                        <path d="M15 45 L35 45 L40 35 L45 55 L50 40 L55 45 L105 45" stroke="#7C5B8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="35" cy="45" r="2" fill="#7C5B8C" />
                        <circle cx="55" cy="45" r="2" fill="#7C5B8C" />
                        <circle cx="45" cy="55" r="3" fill="#EC4899" />
                      </svg>
                    </div>

                    <p className="text-[11px] text-[#9A8AA6] leading-relaxed">
                      連結你的植物腦波與溫柔意識，挑戰經典神經記憶與植物共鳴！
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveGame('vr-game')}
                    className="mt-4 w-full bg-[#FAF7F2] hover:bg-[#7C5B8C] hover:text-white border border-[#7C5B8C]/12 text-[#7C5B8C] font-serif text-xs font-bold py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    開始遊戲
                  </button>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-game-viewport"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white/80 p-6 rounded-3xl border border-[#7C5B8C]/12 shadow-sm min-h-[400px]"
            >
              {activeGame === 'emotion-garden' && (
                <EmotionGarden activeCharacter={activeCharacter} onBack={() => setActiveGame('menu')} />
              )}
              {activeGame === 'value-wheel' && (
                <ValueWheel activeCharacter={activeCharacter} onBack={() => setActiveGame('menu')} />
              )}
              {activeGame === 'puzzle-house' && (
                <PuzzleHouse activeCharacter={activeCharacter} onBack={() => setActiveGame('menu')} />
              )}
              {activeGame === 'flip-cards' && (
                <FlipCards activeCharacter={activeCharacter} onBack={() => setActiveGame('menu')} />
              )}
              {activeGame === 'dream-postman' && (
                <DreamPostman activeCharacter={activeCharacter} onBack={() => setActiveGame('menu')} />
              )}
              {activeGame === 'color-palette' && (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setActiveGame('menu')}
                    className="text-[#9A8AA6] hover:text-[#4E4158] text-xs font-bold font-serif flex items-center gap-1.5 cursor-pointer border-b border-purple-50 pb-2 mb-2"
                  >
                    ← 返回遊戲選單
                  </button>
                  <ColorPalette activeCharacter={activeCharacter} />
                </div>
              )}
              {activeGame === 'vr-game' && (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setActiveGame('menu')}
                    className="text-[#9A8AA6] hover:text-[#4E4158] text-xs font-bold font-serif flex items-center gap-1.5 cursor-pointer border-b border-purple-50 pb-2 mb-2"
                  >
                    ← 返回遊戲選單
                  </button>
                  <VRElectroGame activeCharacter={activeCharacter} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Right Column supportive widgets */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-[90px]">
        
        {/* Widget 1: 本週熱門遊戲 */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50 mb-3 text-xs">
            <h4 className="font-serif font-bold text-[#4E4158] flex items-center gap-1.5">
              <span>🎮</span> 本週熱門遊戲
            </h4>
            <span className="text-[9px] text-[#9A8AA6]">排行榜</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { rank: 1, name: '心情顏色調盤', count: '18,594 次遊玩', rate: '98% 好評' },
              { rank: 2, name: '自我探索翻翻卡', count: '14,215 次遊玩', rate: '96% 好評' },
              { rank: 3, name: '情緒配對花園', count: '8,482 次遊玩', rate: '92% 好評' }
            ].map((item) => (
              <div key={item.rank} className="flex flex-col gap-1 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    item.rank <= 2 ? 'bg-[#7C5B8C]/12 text-[#7C5B8C]' : 'bg-[#FAF7F2] text-[#9A8AA6]'
                  }`}>
                    {item.rank}
                  </span>
                  <span className="font-bold text-[#4E4158]">{item.name}</span>
                </div>
                <div className="flex justify-between text-[9px] text-[#9A8AA6] pl-6">
                  <span>{item.count}</span>
                  <span>{item.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: 小艾的溫柔提醒 Notebook sticky note */}
        <div className="bg-[#FAF5EF]/95 p-5 rounded-3xl border border-purple-200/20 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-4 notebook-tape rounded-xs"></div>
          
          <div className="pt-3 pb-1">
            <div className="flex justify-between items-center text-[9px] text-[#9A8AA6] font-serif border-b border-purple-100/30 pb-1">
              <span>小艾的溫柔提醒</span>
              <span>貼心叮嚀</span>
            </div>
            
            <p className="mt-4 font-serif text-xs font-semibold text-[#4E4158]/95 leading-relaxed">
              「不要給自己太大壓力喔。今天調色盤出來的顏色，不論是深邃還是明亮，都是你心靈最真實、最美麗的舞曲。」
            </p>
            <span className="text-[10px] text-[#9A8AA6] block mt-4 font-sans text-right">— 小艾 🌸</span>
          </div>
        </div>

        {/* Widget 3: 已解鎖遊戲成就 */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-100 animate-pulse" />
            <h4 className="font-serif text-xs font-bold text-[#4E4158]">已解鎖遊戲成就</h4>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 text-xs font-sans">
            {/* Achievement 1 */}
            <button
              onClick={() => {
                setActiveAchievementModal('color');
                setBreathAuraColor('rgba(124, 91, 140, 0.45)');
                setBreathingText('點擊下方色彩或隨心深呼吸，感受流動...');
              }}
              className="w-full text-left flex items-center justify-between p-2.5 hover:bg-[#7C5B8C]/5 rounded-xl border border-transparent hover:border-[#7C5B8C]/10 transition-all duration-300 group cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl bg-[#FAF7F2] p-1.5 rounded-lg border border-purple-50/50 group-hover:scale-110 transition-transform duration-300">🎨</span>
                <div>
                  <span className="font-bold text-[#4E4158] block group-hover:text-[#7C5B8C] transition-colors">初試調色</span>
                  <span className="text-[9px] text-[#9A8AA6]">點擊啟動心靈色彩共鳴 ➜</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9A8AA6] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
            </button>

            {/* Achievement 2 */}
            <button
              onClick={() => {
                setActiveAchievementModal('debate');
                setIsCardFlipped(false);
              }}
              className="w-full text-left flex items-center justify-between p-2.5 hover:bg-[#7C5B8C]/5 rounded-xl border border-transparent hover:border-[#7C5B8C]/10 transition-all duration-300 group cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl bg-[#FAF7F2] p-1.5 rounded-lg border border-purple-50/50 group-hover:scale-110 transition-transform duration-300">🔮</span>
                <div>
                  <span className="font-bold text-[#4E4158] block group-hover:text-[#7C5B8C] transition-colors">命運對決</span>
                  <span className="text-[9px] text-[#9A8AA6]">點擊抽取今日思辨啟示 ➜</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9A8AA6] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
            </button>
          </div>
        </div>

      </div>

      {/* Dynamic Interactive Achievement Modals */}
      <AnimatePresence>
        {activeAchievementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#4E4158]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setActiveAchievementModal(null)}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="bg-[#FAF7F2] rounded-3xl border border-[#7C5B8C]/15 shadow-2xl w-full max-w-sm overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveAchievementModal(null)}
                className="absolute top-4 right-4 text-[#9A8AA6] hover:text-[#4E4158] bg-white/60 hover:bg-white p-1.5 rounded-full transition-all cursor-pointer z-10 border border-purple-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {activeAchievementModal === 'color' && (
                <div className="p-6 md:p-7 flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-[#7C5B8C]/10 flex items-center justify-center mb-3">
                    <Award className="w-5.5 h-5.5 text-[#7C5B8C]" />
                  </div>
                  
                  <h3 className="font-serif text-base font-extrabold text-[#4E4158]">🏆 成就解鎖：初試調色</h3>
                  <p className="text-[10px] text-[#9A8AA6] font-sans mt-0.5">艾飛樂心靈色譜官方認證徽章</p>

                  {/* Breathing Light Aura Interaction */}
                  <div className="my-5 flex flex-col items-center w-full bg-white/70 border border-purple-100/40 rounded-2xl p-5 relative overflow-hidden">
                    <p className="text-[11px] text-[#4E4158]/90 font-medium mb-3 text-center z-10 font-serif leading-relaxed px-1">
                      「每一種心情，都有一種色彩。放慢呼吸，感受色彩的跳躍與流動。」
                    </p>

                    {/* Glowing Breathing Sphere */}
                    <div className="relative w-24 h-24 flex items-center justify-center my-1">
                      <motion.div
                        animate={{
                          scale: [1, 1.25, 1],
                          opacity: [0.7, 0.95, 0.7],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          background: `radial-gradient(circle, ${breathAuraColor} 0%, rgba(255,255,255,0) 70%)`,
                          filter: 'blur(3px)'
                        }}
                        className="absolute inset-0 rounded-full"
                      />
                      <div className="w-14 h-14 rounded-full bg-white shadow-xs border border-purple-100/50 flex items-center justify-center z-10">
                        <span className="text-xl animate-bounce">🎨</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#7C5B8C] font-bold text-center mt-3.5 z-10 font-sans transition-all duration-300 min-h-[15px]">
                      {breathingText}
                    </p>

                    {/* Clickable color chips to dynamically play with color blending aura */}
                    <div className="flex gap-3 mt-4.5 z-10">
                      {[
                        { name: '溫柔粉', rgb: 'rgba(244, 143, 177, 0.55)', text: '這是一股慈愛溫柔的粉，為你撫平疲憊。' },
                        { name: '寧靜藍', rgb: 'rgba(129, 212, 250, 0.55)', text: '沉穩寧靜的湛藍，陪伴你理性思辨。' },
                        { name: '希望黃', rgb: 'rgba(255, 241, 118, 0.55)', text: '明亮溫暖的鵝黃，帶給你前進的喜悅。' },
                        { name: '森意綠', rgb: 'rgba(165, 214, 167, 0.55)', text: '平和療癒的青綠，注入充沛生機。' }
                      ].map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setBreathAuraColor(c.rgb);
                            setBreathingText(c.text);
                          }}
                          style={{ backgroundColor: c.rgb.replace('0.55', '1') }}
                          className="w-4.5 h-4.5 rounded-full border-2 border-white hover:scale-125 transition-all shadow-xs cursor-pointer focus:outline-hidden"
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 w-full mt-1">
                    <button
                      onClick={() => {
                        setActiveGame('color-palette');
                        setActiveAchievementModal(null);
                      }}
                      className="w-full bg-[#7C5B8C] hover:bg-[#684a75] text-white font-serif text-xs font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>進入心靈顏色調色盤</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveAchievementModal(null);
                        // Open the sidebar companion chat
                        const chatBtn = document.getElementById('sidebar-companion-toggle');
                        if (chatBtn) {
                          chatBtn.click();
                        } else {
                          const altBtn = document.querySelector('[class*="chat-trigger"]');
                          if (altBtn) (altBtn as HTMLElement).click();
                        }
                      }}
                      className="w-full bg-white hover:bg-[#7C5B8C]/5 border border-[#7C5B8C]/15 text-[#7C5B8C] font-serif text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>分享成就給小艾 💬</span>
                    </button>
                  </div>
                </div>
              )}

              {activeAchievementModal === 'debate' && (
                <div className="p-6 md:p-7 flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-purple-950/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-5.5 h-5.5 text-[#7C5B8C]" />
                  </div>
                  
                  <h3 className="font-serif text-base font-extrabold text-[#4E4158]">🔮 成就解鎖：命運對決</h3>
                  <p className="text-[10px] text-[#9A8AA6] font-sans mt-0.5">抽取屬於你當下的生命解答</p>

                  {/* Tarot Card Spread container */}
                  <div className="my-5 w-full flex flex-col items-center">
                    
                    {/* Floating card wrapper */}
                    <div className="w-40 h-56 relative flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: isSpinning ? 0.92 : 1,
                          rotateY: isCardFlipped ? 180 : 0,
                          y: [0, -3, 0]
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        transition={{ 
                          rotateY: { type: 'spring', damping: 15, stiffness: 100 },
                          y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                        }}
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                        className="w-36 h-48 rounded-xl cursor-pointer relative shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        {/* Render card side conditionally to be 100% stable in all sandboxed iframe environments */}
                        {!isCardFlipped ? (
                          /* Card Front (Unflipped - Mystic Purple Pattern) */
                          <div 
                            className="w-full h-full rounded-xl bg-gradient-to-br from-[#2E1F38] to-[#1E1128] border-2 border-[#D4AF37]/50 flex flex-col items-center justify-between p-3.5 shadow-inner"
                          >
                            <div className="w-full flex justify-between items-center">
                              <span className="text-[8px] text-[#D4AF37]/80 font-serif">AIFEILER</span>
                              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                            </div>
                            
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-white/[0.03]">
                                <span className="text-lg">🔮</span>
                              </div>
                              <span className="text-[#D4AF37] font-serif text-[10px] font-bold tracking-widest block mt-1">思辨啟示卡</span>
                            </div>

                            <span className="text-[7.5px] text-[#9A8AA6] font-sans text-center">點擊翻開獲得啟示</span>
                          </div>
                        ) : (
                          /* Card Back (Flipped - Glowing Gold & White) */
                          <div 
                            style={{ transform: 'rotateY(180deg)' }}
                            className="w-full h-full rounded-xl bg-white border-2 border-[#D4AF37]/80 flex flex-col justify-between p-3.5 shadow-inner"
                          >
                            <div className="w-full flex justify-between items-center text-[#7C5B8C]">
                              <span className="text-[8px] font-serif font-bold">FATE</span>
                              <Award className="w-3 h-3" />
                            </div>

                            <div className="flex flex-col items-center text-center my-auto">
                              <span className="text-[10px] text-[#7C5B8C] font-bold mb-1.5 block border-b border-purple-50 pb-0.5">今日思辨考驗</span>
                              <p className="text-[10.5px] text-[#4E4158] font-bold font-serif leading-relaxed px-1">
                                {FATED_QUESTIONS[selectedQuestionIndex].q}
                              </p>
                            </div>

                            <div className="text-[8px] text-[#9A8AA6] font-sans text-center leading-tight">
                              {FATED_QUESTIONS[selectedQuestionIndex].tip}
                            </div>
                          </div>
                        )}

                      </motion.div>
                    </div>

                    {/* Shuffle / Draw New button */}
                    <button
                      onClick={drawNewQuestion}
                      disabled={isSpinning}
                      className="mt-4 flex items-center gap-1 text-[10px] font-bold font-serif text-[#7C5B8C] hover:text-[#684a75] cursor-pointer bg-white border border-[#7C5B8C]/10 px-3.5 py-1 rounded-full shadow-xs hover:shadow-xs transition-all"
                    >
                      <RotateCw className={`w-2.5 h-2.5 ${isSpinning ? 'animate-spin' : ''}`} />
                      <span>{isCardFlipped ? '點選卡片查看背面 ➜' : '點選卡片翻面，或重抽啟示'}</span>
                    </button>

                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => {
                        setActiveAchievementModal(null);
                        window.dispatchEvent(new CustomEvent('aifeiler-change-tab', { detail: 'reflection-lab' }));
                      }}
                      className="w-full bg-[#7C5B8C] hover:bg-[#684a75] text-white font-serif text-xs font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>前往思辨實驗室發表看法</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveAchievementModal(null)}
                      className="w-full bg-white hover:bg-[#7C5B8C]/5 border border-[#7C5B8C]/15 text-[#7C5B8C] font-serif text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>返回遊戲大廳</span>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>

    );
  }
