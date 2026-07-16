import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Compass,
  MessageSquare,
  HelpCircle,
  Sparkles,
  BookOpen,
  Map,
  Palette,
  Eye,
  Instagram,
  Youtube,
  MessageCircle,
  Menu,
  X,
  Brain,
  ClipboardList,
  Search,
  Bell,
  User
} from 'lucide-react';

import SidebarCompanion from './components/SidebarCompanion';
import HomeDashboard from './components/HomeDashboard';
import QuoteMap from './components/QuoteMap';
import InteractiveGames from './components/InteractiveGames';
import ReflectionLab from './components/ReflectionLab';
import WoopJournal from './components/WoopJournal';
import CharacterStories from './components/CharacterStories';
import Portfolio from './components/Portfolio';
import AiAssistant from './components/AiAssistant';
import { IMAGES } from './assets/images';
import { safeStorage } from './utils/storage';

type TabType = 'home' | 'quote-map' | 'interactive-games' | 'reflection-lab' | 'growth-journal' | 'character-stories' | 'portfolio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeCharacter, setActiveCharacter] = useState('小艾');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompanionChatOpen, setIsCompanionChatOpen] = useState(false);

  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<TabType>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('aifeiler-change-tab', handleTabChange);
    return () => window.removeEventListener('aifeiler-change-tab', handleTabChange);
  }, []);

  const [coverIndex, setCoverIndex] = useState(0);
  const [imageFit, setImageFit] = useState<'contain' | 'cover'>('contain');

  const [customCovers, setCustomCovers] = useState<Record<string, string>>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_custom_covers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleCoverUpload = (coverId: string, base64: string) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxWidth = 800;
      const maxHeight = 500;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/png');
        const updated = { ...customCovers, [coverId]: compressed };
        setCustomCovers(updated);
        safeStorage.setItem('aifeiler_custom_covers', JSON.stringify(updated));
      }
    };
    img.src = base64;
  };

  const handleCoverDelete = (coverId: string) => {
    const updated = { ...customCovers };
    delete updated[coverId];
    setCustomCovers(updated);
    safeStorage.setItem('aifeiler_custom_covers', JSON.stringify(updated));
  };

  const COVERS = [
    {
      id: 'main',
      name: '艾飛樂經典封底',
      url: IMAGES.mainBanner,
      tag: 'AIFEILER BACK COVER ∙ 封底',
      title: '艾飛樂 Aifeiler 語錄品牌',
      desc: '「天空越黑，星星越亮，寫出我們的共鳴。」這是我們的初衷。歡迎追蹤我們的官方社群帳號，在文字中相遇，一起成為更溫柔的自己。'
    },
    {
      id: 'games',
      name: '互動遊戲插畫',
      url: IMAGES.illustrationChess,
      tag: 'AIFEILER ART ∙ 互動遊戲',
      title: '心靈互動遊戲・棋子與棋手',
      desc: '「在職場與心靈的賽局裡，我既是棋子，也是棋手。」在遊戲中練習與自己對話，解讀你隱藏的情感色彩與溫柔力量。'
    },
    {
      id: 'reflection',
      name: '思辨實驗插畫',
      url: IMAGES.illustrationSolitude,
      tag: 'AIFEILER ART ∙ 思辨實驗',
      title: '思辨實驗室・擁抱獨處與內省',
      desc: '「喜歡獨處，是我對自己最溫柔的體貼。」開啟心靈假設劇場，用理智與勇氣看見更寬廣的生命視野。'
    },
    {
      id: 'hero',
      name: '溫柔成長插畫',
      url: IMAGES.homeHeroBg,
      tag: 'AIFEILER ART ∙ 溫柔成長',
      title: '在溫柔裡思考，在陪伴中成長',
      desc: '「成長不是變得更完美，而是學會溫柔地接納自己。」與小艾、小思、思野等角色攜手漫步，長出最好的自己。'
    },
    {
      id: 'pathway',
      name: '語錄地圖插畫',
      url: IMAGES.illustrationPathway,
      tag: 'AIFEILER ART ∙ 語錄地圖',
      title: '漫步語錄地圖・心靈的溫柔尋路',
      desc: '「每一句共鳴，都是夜空中的一盞微光。」在地圖中收集、標記屬於你的溫馨字句，帶給生活滿滿的暖心力量。'
    },
    {
      id: 'flower',
      name: '心情調色盤插畫',
      url: IMAGES.illustrationFlower,
      tag: 'AIFEILER ART ∙ 心情花園',
      title: '心靈調色盤・綻放溫暖花卉',
      desc: '「調配屬於你今天的慈愛、智慧與勇健。」為內心的花園灌溉、修剪，看見你每一天真實而絢爛的心靈氣泡。'
    }
  ];

  const nextCover = () => {
    setCoverIndex((prev) => (prev + 1) % COVERS.length);
  };

  const prevCover = () => {
    setCoverIndex((prev) => (prev - 1 + COVERS.length) % COVERS.length);
  };

  const selectedCoverData = COVERS[coverIndex];

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'quote-map':
        return <QuoteMap activeCharacter={activeCharacter} />;
      case 'interactive-games':
        return <InteractiveGames activeCharacter={activeCharacter} />;
      case 'reflection-lab':
        return <ReflectionLab activeCharacter={activeCharacter} />;
      case 'growth-journal':
        return <WoopJournal activeCharacter={activeCharacter} />;
      case 'character-stories':
        return <CharacterStories activeCharacter={activeCharacter} />;
      case 'portfolio':
        return <Portfolio />;
      case 'home':
      default:
        return (
          <HomeDashboard 
            setActiveTab={(tab) => setActiveTab(tab)} 
            activeCharacter={activeCharacter} 
            onSelectCharacter={(name) => setActiveCharacter(name)} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#372D3E] flex flex-col relative selection:bg-[#6D4E7B]/15 selection:text-[#372D3E] font-sans antialiased">
      {/* Background soft pastel watercolor glows */}
      <div className="absolute top-0 left-0 right-0 h-[500px] watercolor-glow pointer-events-none z-0" />
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#6D4E7B]/10 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo and Titles */}
          <div className="flex items-center gap-3">
            {/* Elegant Lavender Branch Logo */}
            <svg className="w-5 h-8 md:w-6 md:h-10 shrink-0 text-[#6D4E7B]" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 36C12 24, 12 12, 12 4" stroke="#4A6050" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="7" r="2.5" fill="#6D4E7B" />
              <circle cx="9.5" cy="13" r="2.3" fill="#8B5F9E" />
              <circle cx="14.5" cy="13" r="2.3" fill="#6D4E7B" />
              <circle cx="12" cy="19" r="2.3" fill="#A47EB3" />
              <circle cx="9.5" cy="25" r="2" fill="#8B5F9E" />
              <circle cx="14.5" cy="25" r="2" fill="#6D4E7B" />
              <circle cx="12" cy="30" r="1.5" fill="#A47EB3" />
            </svg>
            <div>
              <span className="font-serif font-extrabold text-[#372D3E] text-sm md:text-base tracking-wide flex items-baseline gap-1 leading-none">
                艾飛樂 <span className="font-serif text-[#6D4E7B] font-normal text-xs md:text-sm tracking-wider">Aifeiler</span>
              </span>
              <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-widest text-[#9A8AA6] block mt-1 leading-none">
                在溫柔裡思考，在陪伴中成長。
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { id: 'home', label: '首頁' },
              { id: 'quote-map', label: '語錄地圖' },
              { id: 'interactive-games', label: '互動遊戲' },
              { id: 'reflection-lab', label: '思辨實驗' },
              { id: 'growth-journal', label: '成長表單' },
              { id: 'character-stories', label: '角色故事' },
              { id: 'portfolio', label: '作品集' }
            ].map((navItem) => (
              <button
                key={navItem.id}
                id={`nav-tab-v2-${navItem.id}`}
                onClick={() => setActiveTab(navItem.id as TabType)}
                className={`relative py-1.5 text-xs font-serif font-bold transition-all cursor-pointer ${
                  activeTab === navItem.id
                    ? 'text-[#7C5B8C]'
                    : 'text-[#9A8AA6] hover:text-[#4E4158]'
                }`}
              >
                <span>{navItem.label}</span>
                {activeTab === navItem.id && (
                  <motion.div
                    layoutId="active-nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7C5B8C] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Side Utility Icons (Search, Notification, Profile) */}
          <div className="flex items-center gap-1 md:gap-2">
            <button className="text-purple-400 hover:text-[#7C5B8C] transition-colors p-1.5 cursor-pointer hidden md:block">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button className="text-purple-400 hover:text-[#7C5B8C] transition-colors p-1.5 cursor-pointer hidden md:block relative">
              <Bell className="w-4 h-4 stroke-[2.5]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>
            <button className="text-purple-400 hover:text-[#7C5B8C] transition-colors p-1.5 cursor-pointer hidden md:block">
              <User className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle-v2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-purple-600 hover:text-purple-900 bg-white border border-purple-100 rounded-xl cursor-pointer ml-1"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE NAV MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-[69px] inset-x-0 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-purple-100 z-30 p-4 flex flex-col gap-2 shadow-lg font-serif"
          >
            {[
              { id: 'home', label: '🌾 首頁故事' },
              { id: 'quote-map', label: '🗺️ 語錄地圖' },
              { id: 'interactive-games', label: '🎮 互動遊戲' },
              { id: 'reflection-lab', label: '🧪 思辨實驗' },
              { id: 'growth-journal', label: '📝 成長表單' },
              { id: 'character-stories', label: '📚 角色故事' },
              { id: 'portfolio', label: '📷 作品集展示' }
            ].map((navItem) => (
              <button
                key={navItem.id}
                id={`mobile-nav-v2-${navItem.id}`}
                onClick={() => {
                  setActiveTab(navItem.id as TabType);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 text-left rounded-xl text-xs font-bold transition-all ${
                  activeTab === navItem.id
                    ? 'bg-[#7C5B8C] text-white'
                    : 'text-[#9A8AA6] hover:bg-purple-50/50'
                }`}
              >
                {navItem.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEWPORT LAYOUT - 3 Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8 relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Left Companion Cards (Spans 3 cols on desktop) */}
        {activeTab !== 'character-stories' && activeTab !== 'portfolio' && (
          <div className={`w-full lg:col-span-3 lg:sticky lg:top-[90px] max-lg:order-2 ${isCompanionChatOpen ? 'z-50' : 'z-30'}`}>
            <SidebarCompanion
              onSelectCharacter={(name) => setActiveCharacter(name)}
              activeCharacter={activeCharacter}
              activeTab={activeTab}
              onChatOpenChange={setIsCompanionChatOpen}
            />
          </div>
        )}

        {/* Column 2 & 3: Interactive Module (Spans 9 cols on desktop or 12 cols on character-stories or portfolio) */}
        <div className={`w-full ${(activeTab === 'character-stories' || activeTab === 'portfolio') ? 'lg:col-span-12' : 'lg:col-span-9'} flex flex-col gap-6 max-lg:order-1`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              {renderActiveModule()}
            </motion.div>
          </AnimatePresence>

          {/* Central column back-cover banner (rendered at the bottom of the main content column on every page) */}
          {activeTab !== 'character-stories' && activeTab !== 'portfolio' && (
            <div className="mt-6 border-t border-purple-100/40 pt-6">
              <div className="bg-white/80 rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-xs overflow-hidden relative flex flex-col md:flex-row items-center gap-6">
                
                {/* Cover Art Box */}
                <div className="w-full md:w-2/5 shrink-0 min-h-[14rem] rounded-2xl overflow-hidden shadow-xs border border-purple-100/30 bg-[#FAF7F2]/50 flex flex-col justify-between p-2 relative group">
                  <div className={`w-full h-32 rounded-xl overflow-hidden relative flex items-center justify-center ${customCovers[selectedCoverData.id] ? 'bg-transparent' : 'bg-[#FAF7F2]'}`}>
                    <img 
                      src={customCovers[selectedCoverData.id] || selectedCoverData.url} 
                      alt={selectedCoverData.title} 
                      className={`w-full h-full transition-all duration-500 group-hover:scale-[1.02] ${
                        imageFit === 'contain' ? 'object-contain' : 'object-cover object-top'
                      }`}
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  
                  {/* Control bar inside image box */}
                  <div className="flex flex-col gap-1.5 mt-2 px-1">
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => setImageFit(imageFit === 'cover' ? 'contain' : 'cover')}
                        className="px-2 py-0.5 bg-white hover:bg-[#FAF7F2] border border-purple-100/50 rounded-lg text-[9px] font-bold text-purple-600 transition-all cursor-pointer shadow-xs flex items-center gap-1 select-none animate-fade-in"
                        title={imageFit === 'cover' ? '切換為 完整縮放' : '切換為 填滿畫面'}
                      >
                        {imageFit === 'cover' ? '🔍 完整比例' : '🖼️ 填滿格子'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={prevCover}
                          className="w-5 h-5 rounded-full bg-white hover:bg-[#FAF7F2] border border-purple-100/50 flex items-center justify-center text-[10px] font-bold text-[#7C5B8C] transition-colors cursor-pointer shadow-xs select-none"
                        >
                          ◀
                        </button>
                        <span className="text-[9px] text-[#9A8AA6] font-bold font-sans select-none min-w-[24px] text-center">
                          {coverIndex + 1} / {COVERS.length}
                        </span>
                        <button
                          onClick={nextCover}
                          className="w-5 h-5 rounded-full bg-white hover:bg-[#FAF7F2] border border-purple-100/50 flex items-center justify-center text-[10px] font-bold text-[#7C5B8C] transition-colors cursor-pointer shadow-xs select-none"
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    
                    {/* Upload feature removed per user request */}
                  </div>
                </div>

                {/* Cover Art metadata & Social Follows */}
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold font-sans">
                        {selectedCoverData.tag}
                      </span>
                      <span className="text-[8px] bg-[#6D4E7B]/10 text-[#6D4E7B] border border-[#6D4E7B]/20 px-1.5 py-0.5 rounded-md font-sans font-bold">
                        🎨 點擊下方插圖可快速更換封面
                      </span>
                    </div>
                    
                    <h4 className="font-serif text-sm font-bold text-[#372D3E] mt-2.5">
                      {selectedCoverData.title}
                    </h4>
                    <p className="text-[11px] text-[#372D3E]/80 leading-relaxed font-sans mt-1.5 mb-4">
                      {selectedCoverData.desc}
                    </p>

                    {/* SELECTABLE MINI THUMBNAIL TRACK */}
                    <div className="flex flex-col gap-2 mt-3 p-2 bg-[#FAF8F5]/60 rounded-xl border border-[#6D4E7B]/5">
                      <span className="text-[10px] font-bold text-[#6D4E7B] flex items-center gap-1">
                        🖼️ 更換插圖選項：
                      </span>
                      <div className="grid grid-cols-6 gap-1.5">
                        {COVERS.map((cov, idx) => {
                          const isSel = coverIndex === idx;
                          return (
                            <button
                              key={cov.id}
                              onClick={() => setCoverIndex(idx)}
                              className={`aspect-video rounded-md overflow-hidden relative border transition-all duration-300 cursor-pointer ${
                                isSel 
                                  ? 'border-2 border-[#6D4E7B] ring-2 ring-purple-100 scale-102 shadow-xs' 
                                  : 'border-purple-100/60 hover:border-purple-300 opacity-60 hover:opacity-100'
                              }`}
                              title={cov.name}
                            >
                              <img 
                                src={cov.url} 
                                alt={cov.name} 
                                className="w-full h-full object-cover object-top"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-purple-50/50 flex flex-wrap gap-x-4 gap-y-1.5 items-center text-[10px] text-[#9A8AA6] font-sans">
                    <span className="font-bold text-purple-600">關注我們：</span>
                    <span>IG: <strong className="text-[#4E4158] hover:text-[#7C5B8C] transition-colors">aibi_0219</strong></span>
                    <span>YT: <strong className="text-[#4E4158] hover:text-rose-600 transition-colors">aibi_0219</strong></span>
                    <span>Line ID: <strong className="text-[#4E4158] hover:text-emerald-600 transition-colors">@153yhemn</strong></span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="w-full bg-[#856D93] text-white px-4 py-5 md:px-8 mt-12 relative z-10 shadow-xs border-t border-purple-900/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs">
          
          {/* Left: Starry Brand Moto with Botanical leaf stem */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center gap-1.5 text-white">
              {/* Botanical Leaf Stem SVG */}
              <svg className="w-5 h-8 shrink-0 text-white/95" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 36C12 24, 12 12, 12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="7" r="2.2" fill="currentColor" />
                <circle cx="9.5" cy="13" r="2" fill="currentColor" />
                <circle cx="14.5" cy="13" r="2" fill="currentColor" />
                <circle cx="12" cy="19" r="2" fill="currentColor" />
                <circle cx="9.5" cy="25" r="1.8" fill="currentColor" />
                <circle cx="14.5" cy="25" r="1.8" fill="currentColor" />
                <circle cx="12" cy="30" r="1.5" fill="currentColor" />
              </svg>
              
              {/* Decorative Stars around */}
              <span className="absolute -top-1 -right-2 text-[8px] animate-pulse">⭐</span>
              <span className="absolute -bottom-1 -left-1 text-[7px] animate-pulse delay-200">✨</span>
            </div>

            <span className="font-serif font-bold text-xs md:text-sm tracking-widest text-white/95 pl-1">
              在溫柔裡思考，在陪伴中成長。
            </span>
          </div>

          {/* Center/Right: Copyright, links & Social media icons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[11px] text-white/85">
            <span>© 2024 艾飛樂 Aifeiler. All rights reserved.</span>
            
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/20 pt-2 sm:pt-0 sm:pl-4">
              <span className="hover:text-white transition-colors cursor-pointer font-medium">關於艾飛樂</span>
              <span className="text-white/30">•</span>
              <span className="hover:text-white transition-colors cursor-pointer font-medium">使用條款</span>
              <span className="text-white/30">•</span>
              <span className="hover:text-white transition-colors cursor-pointer font-medium">隱私政策</span>
              <span className="text-white/30">•</span>
              <span className="hover:text-white transition-colors cursor-pointer font-medium">聯絡我們</span>
            </div>

            {/* Social media circle outline links */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://instagram.com/aibi_0219"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/25 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-white" />
              </a>
              <a
                href="https://youtube.com/@aibi_0219"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/25 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5 text-white" />
              </a>
              <a
                href="https://line.me"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/25 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all"
                title="Line"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
