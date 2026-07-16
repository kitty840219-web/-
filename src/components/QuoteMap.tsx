import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, BookOpen, Heart, Bookmark, Check, RefreshCw, Search, BookmarkCheck, TrendingUp, Trophy } from 'lucide-react';
import { Quote } from '../types';
import { IMAGES } from '../assets/images';
import { safeStorage } from '../utils/storage';
import {
  GardenIllustration,
  SolitudeIllustration,
  ChessIllustration,
  EmotionsIllustration,
  RelationshipIllustration,
  DreamsIllustration
} from './JourneyIllustrations';

interface QuoteMapProps {
  activeCharacter: string;
}

const mapNodes = [
  {
    id: 'garden',
    num: 1,
    title: '療癒花園',
    x: '15%',
    y: '70%',
    color: 'bg-rose-400 shadow-rose-200',
    borderColor: 'border-rose-100',
    bgLight: 'bg-[#FDF4F5] text-[#7C5B8C]',
    cardDesc: '在柔軟的文字裡，慢慢養回自己。',
    thumbnail: IMAGES.illustrationFlower,
    description: '在溫柔的文字裡，擁抱自己的疲憊與脆弱，慢慢養回最真實、最溫柔的自己。'
  },
  {
    id: 'study',
    num: 2,
    title: '獨處書房',
    x: '32%',
    y: '35%',
    color: 'bg-indigo-400 shadow-indigo-200',
    borderColor: 'border-indigo-100',
    bgLight: 'bg-[#EEF1FB] text-indigo-800',
    cardDesc: '與自己對話，從獨處中長出力量。',
    thumbnail: IMAGES.illustrationSolitude,
    description: '在安靜的一角與自己對話。從閱讀、沉澱與思索中，看見迷惘，並長出獨立的內在力量。'
  },
  {
    id: 'career',
    num: 3,
    title: '職場棋局',
    x: '50%',
    y: '65%',
    color: 'bg-slate-400 shadow-slate-200',
    borderColor: 'border-slate-100',
    bgLight: 'bg-slate-50 text-slate-800',
    cardDesc: '在工作與選擇之間，找到你的節奏與價值。',
    thumbnail: IMAGES.illustrationChess,
    description: '在工作、任務與繁雜的選擇中，不迷失方向。在權衡中對齊價值，找到自己前行的獨特節奏。'
  },
  {
    id: 'emotions',
    num: 4,
    title: '情緒星夜',
    x: '66%',
    y: '28%',
    color: 'bg-purple-400 shadow-purple-200',
    borderColor: 'border-purple-100',
    bgLight: 'bg-purple-50 text-purple-800',
    cardDesc: '按住每一種情緒，讓夜晚也能閃閃發光。',
    thumbnail: IMAGES.mainBanner,
    description: '悲喜皆是生命的恩賜。用溫柔的夜空接住每一絲焦慮、疲累或喜悅，讓情緒在黑夜中閃爍。'
  },
  {
    id: 'relationship',
    num: 5,
    title: '關係小徑',
    x: '81%',
    y: '60%',
    color: 'bg-emerald-400 shadow-emerald-200',
    borderColor: 'border-emerald-100',
    bgLight: 'bg-[#EAF5ED] text-emerald-800',
    cardDesc: '在相遇與陪伴裡，學會理解與靠近。',
    thumbnail: IMAGES.illustrationPathway,
    description: '在相遇、連結與陪伴中，學會傾聽、表達邊界，以及如何溫柔地愛與被愛。'
  },
  {
    id: 'dreams',
    num: 6,
    title: '夢想郵局',
    x: '93%',
    y: '30%',
    color: 'bg-amber-400 shadow-amber-200',
    borderColor: 'border-amber-100',
    bgLight: 'bg-[#FAF4ED] text-amber-800',
    cardDesc: '把夢想寄出去，讓未來的自己收到回信。',
    thumbnail: IMAGES.illustrationPathway,
    description: '寫下心底深處對明天的期待，寄給未來的自己。讓承諾與嚮往，照亮未來的道路。'
  }
];

const presetQuotes: Record<string, Quote[]> = {
  'garden': [
    { id: 'q1', text: '「接受自己的脆弱，正是你最強大的溫柔。」', author: '小艾', category: '自我療癒' },
    { id: 'q2', text: '「你不需要總是完美，才能被這世界溫柔以待。」', author: '小艾', category: '自我療癒' },
    { id: 'q3', text: '「今天辛苦了，接受不完美的自己，本身就是最棒的修剪。」', author: '小艾', category: '自我療癒' }
  ],
  'study': [
    { id: 'q4', text: '「孤獨不是寂寞，而是靈魂在靜靜打掃落葉，準備迎來春天。」', author: '小思', category: '成長反思' },
    { id: 'q5', text: '「在疑問與迷惘中，慢慢把答案活出來，這就是生命的魅力。」', author: '小思', category: '成長反思' },
    { id: 'q6', text: '「有時候，沒有標準答案，就是最美麗的答案。」', author: '小思', category: '成長反思' }
  ],
  'career': [
    { id: 'q7', text: '「世界走的再快，你也可以擁有屬於自己的慢舞拍子。」', author: '思野', category: '生涯選擇' },
    { id: 'q8', text: '「每一顆落下的棋子，都是你在向內在價值做出誠實的宣誓。」', author: '思野', category: '生涯選擇' },
    { id: 'q9', text: '「在繁瑣的工作中，找到那個能帶給你溫度的微小價值。」', author: '思野', category: '生涯選擇' }
  ],
  'emotions': [
    { id: 'q10', text: '「悲傷像一場溫暖的雨，滋潤了乾涸的心靈泥土，讓花兒得以盛開。」', author: '小艾', category: '情緒接納' },
    { id: 'q11', text: '「接納自己的低潮，就像接受月亮的陰晴圓缺，那都是你的一部分。」', author: '思野', category: '情緒接納' },
    { id: 'q12', text: '「讓每一種情緒都擁有自己的席位，它們都是生命最真實的溫度。」', author: '小艾', category: '情緒接納' }
  ],
  'relationship': [
    { id: 'q13', text: '「最溫柔的愛，是給彼此足夠伸展枝葉的空間，既同行又獨立。」', author: '小艾', category: '關係連結' },
    { id: 'q14', text: '「伸出雙手，用靈魂的溫度溫暖另一個靈魂。這份溫柔也會流回你心裡。」', author: '艾比', category: '關係連結' },
    { id: 'q15', text: '「健康的邊界，不是冷漠的屏障，而是保護愛意自由流淌的籬笆。」', author: '思野', category: '關係連結' }
  ],
  'dreams': [
    { id: 'q16', text: '「帶著顫抖的雙手，依然跨出了通通向未來的步伐，這就是最真實的魔法。」', author: '艾比', category: '夢想期許' },
    { id: 'q17', text: '「寫下對未來的憧憬吧，因為每一句真誠的期待，都會是召喚勇氣的咒語。」', author: '艾比', category: '夢想期許' },
    { id: 'q18', text: '「夢想不需要宏大，只要它能點亮你今晚入眠時的心房，那就是好夢想。」', author: '艾比', category: '夢想期許' }
  ]
};

export default function QuoteMap({ activeCharacter }: QuoteMapProps) {
  const [activeNode, setActiveNode] = useState('garden');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_saved_quotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('全部');
  const [customQuote, setCustomQuote] = useState<Quote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);



  useEffect(() => {
    const quotes = presetQuotes[activeNode];
    if (quotes && quotes.length > 0) {
      setSelectedQuote(quotes[0]);
    }
    setCustomQuote(null);
  }, [activeNode]);

  const handleSaveQuote = (quote: Quote) => {
    if (savedQuotes.some((q) => q.id === quote.id)) {
      const filtered = savedQuotes.filter((q) => q.id !== quote.id);
      setSavedQuotes(filtered);
      safeStorage.setItem('aifeiler_saved_quotes', JSON.stringify(filtered));
    } else {
      const updated = [...savedQuotes, quote];
      setSavedQuotes(updated);
      safeStorage.setItem('aifeiler_saved_quotes', JSON.stringify(updated));
    }
  };

  const handleGenerateQuote = async () => {
    setIsGenerating(true);
    setCustomQuote(null);
    try {
      const node = mapNodes.find((n) => n.id === activeNode);
      const stageName = node ? node.title : '生命主題';
      const response = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: activeCharacter.split(' ')[0],
          message: `請針對「${stageName}」這個生命主題，為我量身打造一句極具詩意、溫柔與療癒的生命語錄。格式要像金句一樣深刻。`
        })
      });
      const data = await response.json();
      
      const newQuote: Quote = {
        id: `custom-${Date.now()}`,
        text: `「${data.text.replace(/^[「『"\s]+|[」整』"\s]+$/g, '')}」`,
        author: activeCharacter.split(' ')[0],
        category: stageName
      };
      
      setCustomQuote(newQuote);
      setSelectedQuote(newQuote);
    } catch (err) {
      console.error('Error generating custom quote:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getQuoteStageId = (quoteId: string): string => {
    for (const [nodeId, quotes] of Object.entries(presetQuotes)) {
      if (quotes.some((q) => q.id === quoteId)) {
        return nodeId;
      }
    }
    return activeNode;
  };

  const filteredQuotes = (() => {
    const isFiltering = activeTag !== '全部' || searchQuery.trim() !== '';
    
    let pool: Quote[] = [];
    if (isFiltering) {
      pool = Object.values(presetQuotes).flat();
    } else {
      pool = presetQuotes[activeNode] || [];
    }

    return pool.filter((q) => {
      if (activeTag !== '全部') {
        const matchesTag = q.category.includes(activeTag) || q.text.includes(activeTag);
        if (!matchesTag) return false;
      }
      
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          q.text.toLowerCase().includes(query) || 
          q.author.toLowerCase().includes(query) || 
          q.category.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      
      return true;
    });
  })();

  const currentNode = mapNodes.find((n) => n.id === activeNode);

  // Filter quotes globally if search query or tags are active
  const filterTags = ['全部', '療癒', '成長', '獨處', '關係', '職場', '夢想', '情緒'];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Center Left column: Main Map & Core Quote Content */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Banner with custom Cover Illustration */}
        <div className="rounded-3xl border border-purple-100/40 relative overflow-hidden min-h-[180px] sm:min-h-[220px] md:min-h-[240px] flex items-center justify-center shadow-xs bg-[#FAF7F2]">
          {/* Background illustration using object-contain to avoid any cropping of the characters */}
          <img 
            src={IMAGES.homeHeroBgPlain} 
            alt="在溫柔裡尋路" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none opacity-90"
            referrerPolicy="no-referrer"
          />
          
          {/* Text content centered in the middle space of the illustration */}
          <div className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center justify-center px-4 text-center">
            <h2 className="font-serif text-[#4E4158] text-base sm:text-xl md:text-2xl lg:text-3xl font-bold leading-snug tracking-wide drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)]">
              在溫柔裡尋路，
              <span className="block sm:inline">收藏讓你有共鳴的語錄。</span>
            </h2>
            <p className="text-[10px] sm:text-[11px] md:text-xs text-[#9A8AA6] font-semibold font-serif leading-relaxed mt-2 sm:mt-3.5 tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
              每一句話，都是一盞微光，照亮你前行的方向。
            </p>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#7C5B8C]/12 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="搜尋語錄、主題或關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-10 py-2.5 text-xs rounded-full border border-purple-100/60 bg-[#FAF7F2]/40 focus:outline-none focus:border-[#7C5B8C] font-sans"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium font-sans border transition-all cursor-pointer ${
                  activeTag === tag
                    ? 'bg-[#7C5B8C] border-[#7C5B8C] text-white shadow-xs'
                    : 'bg-white/50 border-purple-100/50 text-[#9A8AA6] hover:bg-white hover:text-purple-900'
                }`}
              >
                {tag}
              </button>
            ))}
            {/* Settings / Filter slider icon on the far right */}
            <button className="p-1.5 rounded-full bg-white/50 border border-purple-100/50 text-[#9A8AA6] hover:bg-white hover:text-[#7C5B8C] transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="2" y1="14" x2="6" y2="14" />
                <line x1="10" y1="8" x2="14" y2="8" />
                <line x1="18" y1="16" x2="22" y2="16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Watercolor Path Map Container */}
        <div className="bg-white/80 rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-[#7C5B8C]" />
            </div>
            <h3 className="font-serif text-xs md:text-sm font-bold text-[#4E4158] flex items-center gap-1">
              語錄地圖
            </h3>
            <span className="text-[10px] text-[#9A8AA6] font-sans">點擊任一站點，探索更多觸動心靈的語錄。</span>
          </div>

          <div className="relative w-full rounded-2xl border border-purple-100/30 overflow-hidden shadow-inner bg-[#FAF7F2] min-h-[360px] md:min-h-[440px] flex items-center justify-center p-4">
            {/* Map Background Image with object-contain to avoid any cropping of the beautiful pathway */}
            <img 
              src={IMAGES.illustrationPathway} 
              alt="語錄地圖背景" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none opacity-80"
              referrerPolicy="no-referrer"
            />
            
            {/* Soft watercolor path overlay */}
            <div className="absolute inset-0 bg-[#FAF7F2]/10 pointer-events-none"></div>

            {/* Connecting paths and locator pins overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* SVG for connecting roads */}
              <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
                <path
                  d="M 120 280 C 200 140, 240 180, 280 140 C 320 100, 410 260, 455 190 C 500 120, 580 80, 620 120 C 660 160, 710 280, 750 200 C 780 140, 800 110, 840 90"
                  fill="none"
                  stroke="rgba(124, 91, 140, 0.22)"
                  strokeWidth="3"
                  strokeDasharray="6,6"
                />
              </svg>

              {/* Absolute Pin markers on the pathway matching mapNodes */}
              {mapNodes.map((node) => {
                const isActive = activeNode === node.id;
                return (
                  <div
                    key={`pin-${node.id}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300"
                    style={{ left: node.x, top: node.y }}
                  >
                    {/* Pulsing ring */}
                    <div className={`absolute w-7 h-7 rounded-full bg-purple-200/40 border border-[#7C5B8C]/40 ${
                      isActive ? 'scale-125 opacity-100 animate-ping' : 'scale-75 opacity-0'
                    } transition-all duration-500`} />

                    {/* Small pointer dot */}
                    <button
                      onClick={() => setActiveNode(node.id)}
                      className={`pointer-events-auto w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#7C5B8C] scale-125 ring-2 ring-purple-200' 
                          : 'bg-purple-400 hover:bg-[#7C5B8C] hover:scale-110'
                      }`}
                      title={node.title}
                    />
                  </div>
                );
              })}
            </div>

            {/* Grid of 6 Cards */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {mapNodes.map((node) => {
                const isActive = activeNode === node.id;
                return (
                  <button
                    key={node.id}
                    id={`map-node-card-${node.id}`}
                    onClick={() => setActiveNode(node.id)}
                    className={`group relative flex items-start gap-3 p-3.5 bg-white/90 backdrop-blur-md hover:bg-white rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                      isActive 
                        ? 'border-2 border-[#7C5B8C] ring-4 ring-purple-100/40 translate-y-[-2px] shadow-md' 
                        : 'border-purple-100/50 hover:border-purple-200 shadow-xs hover:translate-y-[-1px] hover:shadow-sm'
                    }`}
                  >
                    {/* Floating badge with stage number on top-left */}
                    <div className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-[#7C5B8C] text-white flex items-center justify-center text-[10px] font-sans font-extrabold shadow-sm border border-white">
                      {node.num}
                    </div>

                    {/* Small Watercolor Thumbnail Box using object-contain to avoid any cropping */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-purple-100/30 shadow-xs bg-[#FAF7F2] relative flex items-center justify-center p-1">
                      {node.id === 'garden' && <GardenIllustration />}
                      {node.id === 'study' && <SolitudeIllustration />}
                      {node.id === 'career' && <ChessIllustration />}
                      {node.id === 'emotions' && <EmotionsIllustration />}
                      {node.id === 'relationship' && <RelationshipIllustration />}
                      {node.id === 'dreams' && <DreamsIllustration />}
                    </div>

                    {/* Text block */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full pt-0.5">
                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#4E4158] leading-none flex items-center gap-1">
                          {node.num} {node.title}
                        </h4>
                        <p className="text-[10px] text-[#9A8AA6] leading-relaxed font-sans mt-1.5 line-clamp-2">
                          {node.cardDesc}
                        </p>
                      </div>
                      <span className="text-[9px] text-[#7C5B8C] font-bold font-sans flex items-center gap-0.5 mt-2 group-hover:translate-x-0.5 transition-transform">
                        探索語錄 <span className="text-[8px]">→</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node description and selected quotes detail */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Active node description (left-ish) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className={`p-5 rounded-2xl border border-purple-100/20 ${currentNode?.bgLight} transition-all duration-300 shadow-xs`}>
              <h4 className="font-serif font-bold text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#7C5B8C]" />
                {currentNode?.title}
              </h4>
              <p className="mt-2.5 text-xs leading-relaxed text-[#4E4158]/90 font-sans">
                {currentNode?.description}
              </p>
            </div>



            {/* Quote list for selected stage */}
            <div className="bg-white/75 p-4 rounded-2xl border border-[#7C5B8C]/12 shadow-xs">
              <h5 className="font-serif text-xs font-bold text-[#4E4158] mb-3">
                {activeTag !== '全部' || searchQuery.trim() !== '' ? '搜尋與篩選語錄結果' : '精選階段語錄'}
              </h5>
              <div className="flex flex-col gap-2">
                {filteredQuotes.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#9A8AA6] font-sans">
                    沒有找到符合條件的語錄，試試其他關鍵字吧！
                  </div>
                ) : (
                  filteredQuotes.map((q) => (
                    <button
                      key={q.id}
                      id={`preset-quote-select-${q.id}`}
                      onClick={() => {
                        setSelectedQuote(q);
                        setCustomQuote(null);
                        const quoteStageId = getQuoteStageId(q.id);
                        if (quoteStageId && quoteStageId !== activeNode) {
                          setActiveNode(quoteStageId);
                        }
                      }}
                      className={`text-left p-2.5 rounded-xl border text-[11px] transition-all flex items-center justify-between gap-3 ${
                        selectedQuote?.id === q.id && !customQuote
                          ? 'bg-purple-50/50 border-[#7C5B8C]/30 text-purple-900 font-medium'
                          : 'bg-white/40 border-transparent text-[#9A8AA6] hover:bg-purple-50/30'
                      }`}
                    >
                      <span className="truncate">{q.text}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white border border-purple-100 text-purple-600 shrink-0 font-sans">
                        {q.author}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Core Display Card (right-ish) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {selectedQuote && (
                <motion.div
                  key={selectedQuote.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="bg-gradient-to-br from-[#FAF5EF]/40 to-[#FDF4F5]/30 p-6 rounded-3xl border border-[#7C5B8C]/12 shadow-sm min-h-[180px] flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-3 right-4 text-purple-200/30 text-6xl font-serif select-none pointer-events-none">
                    ”
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full font-sans font-medium">
                      #{selectedQuote.category}
                    </span>
                    <p className="mt-5 font-serif font-medium text-[#4E4158] text-sm leading-relaxed">
                      {selectedQuote.text}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-purple-100/30 pt-3 text-xs">
                    <span className="text-[#9A8AA6] font-medium font-sans">
                      🌱 陪伴語錄 ｜ {selectedQuote.author}
                    </span>
                    <button
                      id={`save-quote-${selectedQuote.id}`}
                      onClick={() => handleSaveQuote(selectedQuote)}
                      className={`p-1.5 rounded-full border transition-all ${
                        savedQuotes.some((q) => q.id === selectedQuote.id)
                          ? 'bg-[#7C5B8C] border-[#7C5B8C] text-white shadow-xs'
                          : 'bg-white text-purple-400 hover:text-[#7C5B8C] border-purple-100'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Companion AI Gold Quote Generator */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100/30 flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎐</span>
                <div>
                  <h5 className="text-xs font-serif font-bold text-[#4E4158]">
                    讓 <strong>{activeCharacter.split(' ')[0]}</strong> 寫一句專屬語錄
                  </h5>
                  <p className="text-[10px] text-[#9A8AA6] font-sans mt-0.5">
                    結合目前的生命主題，為你進行療癒解讀
                  </p>
                </div>
              </div>
              <button
                id="ai-generate-quote-btn"
                onClick={handleGenerateQuote}
                disabled={isGenerating}
                className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white px-3.5 py-2 rounded-xl text-xs font-sans font-medium transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3 animate-spin" />
                    調配中
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3" />
                    溫柔撰寫
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Favorite Lists */}
        {savedQuotes.length > 0 && (
          <div className="mt-4 border-t border-[#7C5B8C]/8 pt-5">
            <h4 className="font-serif text-sm font-semibold text-[#4E4158] flex items-center gap-1.5 mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-soft-pulse" />
              我收藏的心靈金句 ({savedQuotes.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedQuotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-white/60 hover:bg-white/95 p-4 rounded-2xl border border-purple-100/30 flex flex-col justify-between gap-3 transition-colors relative shadow-xs"
                >
                  <p className="text-xs font-serif font-medium text-[#4E4158] leading-relaxed">
                    {q.text}
                  </p>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-purple-100/10 text-[10px] text-[#9A8AA6] font-sans">
                    <span>#{q.category} ｜ {q.author}</span>
                    <button
                      id={`remove-fav-${q.id}`}
                      onClick={() => handleSaveQuote(q)}
                      className="text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      取消收藏
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right Column: Supportive Bento Widgets (Mockup 2 styled) */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-[90px]">
        


        {/* Widget 1: 熱門語錄主題 */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
            <TrendingUp className="w-4 h-4 text-[#7C5B8C]" />
            <h4 className="font-serif text-xs font-bold text-[#4E4158]">熱門語錄主題</h4>
          </div>
          <div className="flex flex-col gap-2.5 mt-3">
            {[
              { rank: 1, tag: '自我療癒', count: '12,584' },
              { rank: 2, tag: '成長蛻變', count: '9,276' },
              { rank: 3, tag: '勇敢前行', count: '7,842' },
              { rank: 4, tag: '人際關係', count: '6,315' },
              { rank: 5, tag: '接納自己', count: '5,489' }
            ].map((item) => (
              <div key={item.rank} className="flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    item.rank <= 2 ? 'bg-[#7C5B8C]/12 text-[#7C5B8C]' : 'bg-[#FAF7F2] text-[#9A8AA6]'
                  }`}>
                    {item.rank}
                  </span>
                  <span className="font-semibold text-[#4E4158]">{item.tag}</span>
                </div>
                <span className="text-[10px] text-[#9A8AA6]">{item.count} 句語錄</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: 今日語錄 Notebook Tape Note */}
        <div className="bg-[#FAF5EF]/90 p-5 rounded-3xl border border-purple-200/20 relative shadow-sm overflow-hidden flex flex-col justify-between">
          {/* Note Tape decoration */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-4 notebook-tape rounded-xs"></div>
          
          <div className="pt-3 pb-2 text-center">
            <h5 className="font-serif text-xs text-[#9A8AA6] font-bold">今日語錄</h5>
            <p className="mt-4 font-serif font-semibold text-sm text-[#4E4158] leading-relaxed italic">
              「你已經在努力成為，你想成為的那個生命了。」
            </p>
            <span className="text-[10px] text-[#9A8AA6] block mt-4 font-sans">— 艾飛樂 Aifeiler</span>
          </div>
        </div>

        {/* Widget 3: 我的語錄軌跡 Achievements */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-100" />
            <h4 className="font-serif text-xs font-bold text-[#4E4158]">我的語錄軌跡</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center mt-3.5">
            <div className="bg-[#FAF7F2]/60 p-2 rounded-xl border border-purple-50/20">
              <span className="text-xs font-serif font-bold text-[#4E4158] block">{savedQuotes.length} 句</span>
              <span className="text-[9px] text-[#9A8AA6] block mt-0.5">已收藏語錄</span>
            </div>
            <div className="bg-[#FAF7F2]/60 p-2 rounded-xl border border-purple-50/20">
              <span className="text-xs font-serif font-bold text-[#4E4158] block">24 條</span>
              <span className="text-[9px] text-[#9A8AA6] block mt-0.5">探索路徑</span>
            </div>
            <div className="bg-[#FAF7F2]/60 p-2 rounded-xl border border-purple-50/20">
              <span className="text-xs font-serif font-bold text-[#4E4158] block">86 分</span>
              <span className="text-[9px] text-[#9A8AA6] block mt-0.5">共鳴指數</span>
            </div>
          </div>

          <div className="mt-4 pt-1">
            <div className="flex justify-between text-[9px] text-[#9A8AA6] mb-1 font-sans">
              <span>再收集 22 句，解鎖「星光收藏家」成就</span>
              <span>128 / 150 句</span>
            </div>
            <div className="w-full bg-[#FAF7F2] rounded-full h-1.5 overflow-hidden border border-purple-100/20">
              <div className="bg-[#7C5B8C] h-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
