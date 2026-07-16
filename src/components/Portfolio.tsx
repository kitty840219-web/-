import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Plus, 
  Image as ImageIcon, 
  Tag, 
  User, 
  Calendar, 
  X, 
  ThumbsUp, 
  Filter, 
  BookOpen, 
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';
import { IMAGES } from '../assets/images';
import { safeStorage } from '../utils/storage';

// Define Interface for Portfolio Work
interface PortfolioItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  creator: string;
  category: string;
  date: string;
  likes: number;
  photoStyle: 'polaroid' | 'classic' | 'retro' | 'tape';
  isCustom?: boolean;
}

export default function Portfolio() {
  // Available categories
  const categories = ['全部作品', '語錄圖文', '品牌網站', '互動遊戲', '角色故事', '平面設計', '影音剪輯'];

  // Default Mock Items
  const defaultItems: PortfolioItem[] = [
    {
      id: 'p1',
      title: '療癒日常語錄系列',
      desc: '「接受自己的脆弱，正是你最強大的溫柔。」在字句與溫暖的花卉圖文中，找到心靈沉靜的療癒力量。',
      image: IMAGES.illustrationFlower,
      creator: '小艾',
      category: '語錄圖文',
      date: '2026-07-01',
      likes: 128,
      photoStyle: 'polaroid'
    },
    {
      id: 'p2',
      title: 'Aifeiler 品牌形象頁面',
      desc: '為 Aifeiler 打造全新溫暖的品牌首頁與導覽設計，結合柔和的粉紫色調與溫馨的水彩質感，提升整體閱讀體驗。',
      image: IMAGES.mainBanner,
      creator: 'Ivy / 艾比',
      category: '品牌網站',
      date: '2026-06-25',
      likes: 184,
      photoStyle: 'classic'
    },
    {
      id: 'p3',
      title: '心靈互動教學設計',
      desc: '設計「心情調色盤」與「互動棋子賽局」，讓使用者在有趣的指尖對話中，解讀心靈底層的智慧與力量。',
      image: IMAGES.illustrationChess,
      creator: '小思',
      category: '互動遊戲',
      date: '2026-06-18',
      likes: 95,
      photoStyle: 'tape'
    },
    {
      id: 'p4',
      title: '漫步語錄尋路地圖',
      desc: '以「地圖漫步」為視覺引導，將生活中的點滴靈感與暖心詞句具象化，陪你在迷惘的夜空中尋找微光。',
      image: IMAGES.illustrationPathway,
      creator: 'Ivy / 艾比',
      category: '語錄圖文',
      date: '2026-06-10',
      likes: 112,
      photoStyle: 'retro'
    },
    {
      id: 'p5',
      title: '擁抱獨處的故事繪本',
      desc: '「喜歡獨處，是我對自己最溫柔的體貼。」書寫角色在深夜樹林裡的安靜獨白，搭配粉彩手繪插圖。',
      image: IMAGES.illustrationSolitude,
      creator: '思野',
      category: '角色故事',
      date: '2026-06-04',
      likes: 156,
      photoStyle: 'polaroid'
    },
    {
      id: 'p6',
      title: '暖心角色明信片組',
      desc: '精選小艾、小思與思野的經典對白，製作成可直接書寫的溫暖手感明信片，把思念與溫柔傳遞給遠方的朋友。',
      image: IMAGES.homeHeroBgPlain,
      creator: 'Ivy / 艾比',
      category: '平面設計',
      date: '2026-05-28',
      likes: 74,
      photoStyle: 'classic'
    }
  ];

  // State
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_portfolio_items');
      if (saved) {
        // Merge saved items (which have custom items) with defaults to ensure latest assets
        const parsed = JSON.parse(saved) as PortfolioItem[];
        // Filter out default items from parsed to avoid duplicates and update assets
        const customs = parsed.filter(i => i.isCustom);
        return [...defaultItems, ...customs];
      }
    } catch (e) {
      console.error(e);
    }
    return defaultItems;
  });

  const [activeCategory, setActiveCategory] = useState<string>('全部作品');
  const [selectedCreator, setSelectedCreator] = useState<string>('全部');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_portfolio_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('語錄圖文');
  const [newCreator, setNewCreator] = useState('Ivy / 艾比');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newStyle, setNewStyle] = useState<'polaroid' | 'classic' | 'retro' | 'tape'>('polaroid');
  const [uploadError, setUploadError] = useState('');

  // Persist items
  useEffect(() => {
    try {
      safeStorage.setItem('aifeiler_portfolio_items', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  // Persist likes
  useEffect(() => {
    try {
      safeStorage.setItem('aifeiler_portfolio_likes', JSON.stringify(likedItems));
    } catch (e) {
      console.error(e);
    }
  }, [likedItems]);

  // Handle Like
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = !!likedItems[id];
    setLikedItems(prev => ({ ...prev, [id]: !isLiked }));
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          return { ...item, likes: item.likes + (isLiked ? -1 : 1) };
        }
        return item;
      })
    );
  };

  // Handle delete custom item
  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('確定要刪除這件自訂作品嗎？')) {
      setItems(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  // Handle Submit Form
  const handleAddCreation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setUploadError('請輸入作品名稱');
      return;
    }
    if (!newDesc.trim()) {
      setUploadError('請輸入作品描述');
      return;
    }

    // Default illustration if image URL is empty
    const finalImage = newImageUrl.trim() || IMAGES.illustrationFlower;

    const newItem: PortfolioItem = {
      id: 'custom_' + Date.now(),
      title: newTitle,
      desc: newDesc,
      image: finalImage,
      creator: newCreator,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      photoStyle: newStyle,
      isCustom: true
    };

    setItems(prev => [newItem, ...prev]);
    setIsUploadOpen(false);
    
    // Reset states
    setNewTitle('');
    setNewDesc('');
    setNewImageUrl('');
    setNewStyle('polaroid');
    setUploadError('');
  };

  // Creators metadata
  const creators = [
    {
      name: '艾飛樂',
      avatar: IMAGES.homeHeroBg,
      desc: '感性與理性的陪伴者，在創意與思考中守候。'
    },
    {
      name: 'Ivy / 艾比',
      avatar: IMAGES.avatarIvy,
      desc: '溫柔又力量的品牌代言人，與你一起好好生活。'
    },
    {
      name: '小思',
      avatar: IMAGES.avatarXiaosi,
      desc: '好奇又愛思考的小男孩，陪你一起發現世界的美好。'
    },
    {
      name: '小艾',
      avatar: IMAGES.avatarXiaoi,
      desc: '溫柔貼心的小女孩，陪你一起感受與表達心情。'
    }
  ];

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === '全部作品' || item.category === activeCategory;
    const matchesCreator = selectedCreator === '全部' || item.creator.includes(selectedCreator) || selectedCreator.includes(item.creator);
    return matchesCategory && matchesCreator;
  });

  // Style-specific classes for the "Photo Feel"
  const getPhotoStyleClasses = (style: 'polaroid' | 'classic' | 'retro' | 'tape', index: number) => {
    // Add subtle unique rotation angles based on index to create a natural scattered photo tabletop feel
    const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', '-rotate-1.5', 'rotate-1.5'];
    const rotation = rotations[index % rotations.length];

    switch (style) {
      case 'polaroid':
        return `bg-white p-3.5 pb-6 shadow-[0_12px_24px_-4px_rgba(109,78,123,0.08),0_1px_3px_rgba(109,78,123,0.04)] border border-[#6D4E7B]/5 rounded-sm hover:-translate-y-2 hover:scale-101 hover:shadow-[0_20px_35px_-8px_rgba(109,78,123,0.14)] transition-all duration-300 ${rotation}`;
      case 'retro':
        return `bg-[#FDF9F3] p-4 rounded-xl border border-amber-200/40 shadow-[0_10px_20px_-3px_rgba(180,120,60,0.06)] hover:-translate-y-2 hover:scale-101 hover:shadow-[0_18px_30px_-6px_rgba(180,120,60,0.1)] transition-all duration-300 ${rotation}`;
      case 'tape':
        return `bg-white p-4 pt-8 rounded-lg border border-[#6D4E7B]/5 shadow-[0_10px_22px_-4px_rgba(109,78,123,0.06)] relative hover:-translate-y-2 hover:scale-101 transition-all duration-300 ${rotation}`;
      case 'classic':
      default:
        return `bg-[#FCFBFA] p-3 rounded-2xl border border-[#6D4E7B]/8 shadow-[0_15px_30px_-5px_rgba(109,78,123,0.1),0_2px_4px_rgba(109,78,123,0.03)] hover:-translate-y-2 hover:scale-101 hover:shadow-[0_22px_40px_-10px_rgba(109,78,123,0.15)] transition-all duration-300 ${rotation}`;
    }
  };

  // Local preset options for photos
  const photoPresets = [
    { name: '溫馨花園', url: IMAGES.illustrationFlower },
    { name: '思緒漫步', url: IMAGES.illustrationPathway },
    { name: '星空獨處', url: IMAGES.illustrationSolitude },
    { name: '品牌星海', url: IMAGES.mainBanner },
    { name: '心靈賽局', url: IMAGES.illustrationChess },
    { name: '晨曦丘陵', url: IMAGES.homeHeroBg }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-8 relative select-none">
      
      {/* 1. Header Banner Box */}
      <div className="w-full rounded-3xl overflow-hidden border border-[#6D4E7B]/10 relative min-h-[220px] md:min-h-[280px] flex items-center bg-[#FAF8F5] p-6 md:p-10 shadow-sm">
        {/* Panoramic Background Illustration with Soft Blur */}
        <img 
          src={IMAGES.mainBanner} 
          alt="Aifeiler illustration" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85 pointer-events-none"
          referrerPolicy="no-referrer"
        />
        {/* Soft Watercolor Tints Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent pointer-events-none" />

        {/* Header Text Content */}
        <div className="relative z-10 max-w-xl flex flex-col gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6D4E7B]/10 border border-[#6D4E7B]/15 text-[#6D4E7B] text-[10px] font-bold tracking-wider w-fit">
            <Sparkles className="w-3 h-3 text-[#6D4E7B] animate-pulse" />
            <span>AIFEILER PORTFOLIO ∙ 療癒作品集</span>
          </div>
          <h2 className="font-serif text-[#372D3E] text-2xl md:text-3.5xl font-extrabold tracking-widest leading-tight">
            把溫柔與創意，<br />
            收進作品裡。
          </h2>
          <p className="text-[11px] md:text-xs text-[#372D3E]/80 leading-relaxed font-sans max-w-md mt-1 tracking-wide">
            收集每一份創作與靈感，轉化為療癒的視覺設計、品牌體驗與故事內容，陪你在日常裡慢慢前行。
          </p>
        </div>
      </div>

      {/* 2. Primary 3-Column Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Creators & Characters (Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="watercolor-card p-5 border border-[#6D4E7B]/8">
            <h3 className="font-serif text-[#372D3E] font-extrabold text-sm tracking-wider flex items-center gap-2 mb-4">
              <span>創作者 / 角色</span>
              <span className="w-1.5 h-1.5 bg-[#6D4E7B] rounded-full" />
            </h3>

            <div className="flex flex-col gap-4">
              {creators.map((c) => {
                const isSelected = selectedCreator === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCreator(isSelected ? '全部' : c.name)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-[#6D4E7B]/10 border-[#6D4E7B]/20 shadow-xs' 
                        : 'bg-transparent border-transparent hover:bg-[#FAF8F5]/80'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img 
                        src={c.avatar} 
                        alt={c.name} 
                        className="w-10 h-10 rounded-full object-cover border border-[#6D4E7B]/15 bg-purple-50"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[7px] font-bold border border-white">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-serif font-extrabold text-[#372D3E] text-xs">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-[#372D3E]/70 font-sans mt-0.5 leading-normal line-clamp-2">
                        {c.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedCreator !== '全部' && (
              <button 
                onClick={() => setSelectedCreator('全部')}
                className="mt-4 w-full py-1.5 bg-[#FAF8F5] hover:bg-purple-50 border border-purple-100/60 rounded-lg text-[10px] font-bold text-[#6D4E7B] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                🔄 顯示全部角色
              </button>
            )}
          </div>

          {/* Quick Stats widget */}
          <div className="watercolor-card p-5 border border-[#6D4E7B]/8 bg-[#FDFBF7]">
            <h4 className="font-serif text-[#372D3E] font-bold text-xs tracking-wide flex items-center gap-1.5 mb-3">
              <span>🖼️ 作品牆點記</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-white rounded-xl border border-purple-50">
                <span className="block text-[10px] text-[#9A8AA6] font-sans">總展出作品</span>
                <span className="font-serif font-extrabold text-sm text-[#6D4E7B]">{items.length} 件</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-purple-50">
                <span className="block text-[10px] text-[#9A8AA6] font-sans">收穫喜愛</span>
                <span className="font-serif font-extrabold text-sm text-rose-500">
                  {items.reduce((acc, item) => acc + item.likes, 0)} ❤️
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Gallery Photo Wall (Span 6) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Circular Category Quick Track (From Mockup) */}
          <div className="watercolor-card p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#6D4E7B] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#6D4E7B]" />
              快速導覽各類設計作品：
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { name: '語錄圖文', icon: '📝', desc: '暖心文字', bg: 'bg-[#FFF0F2]' },
                { name: '品牌網站', icon: '💻', desc: '純淨網站', bg: 'bg-indigo-50' },
                { name: '互動遊戲', icon: '🎮', desc: '寓教於樂', bg: 'bg-emerald-50' },
                { name: '角色故事', icon: '📚', desc: '成長故事', bg: 'bg-amber-50' },
                { name: '平面設計', icon: '🎨', desc: '明信片卡片', bg: 'bg-purple-50' },
                { name: '影音剪輯', icon: '🎬', desc: '動態影片', bg: 'bg-rose-50' }
              ].map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(isActive ? '全部作品' : cat.name)}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                      isActive 
                        ? 'border-2 border-[#6D4E7B] bg-white ring-2 ring-purple-100 scale-102' 
                        : 'border-transparent hover:border-purple-200 bg-[#FAF8F5]/80'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full ${cat.bg} flex items-center justify-center text-sm mb-1.5`}>
                      {cat.icon}
                    </span>
                    <span className="font-serif text-[#372D3E] text-[10px] font-extrabold block truncate w-full">
                      {cat.name}
                    </span>
                    <span className="text-[8px] text-[#9A8AA6] font-sans scale-90 block mt-0.5 whitespace-nowrap">
                      {isActive ? '篩選中' : '查看作品'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabletop Photo Filter Bar with Upload Creation trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#6D4E7B]" />
              <span className="text-[11px] font-bold text-[#372D3E]">
                當前展示：
                <span className="text-[#6D4E7B] font-extrabold underline decoration-2 decoration-purple-300 ml-1">
                  {activeCategory}
                </span>
                {selectedCreator !== '全部' && (
                  <span className="text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md ml-1.5 text-[9px] font-sans">
                    👤 創作者: {selectedCreator}
                  </span>
                )}
              </span>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="py-1.5 px-3 bg-[#6D4E7B] hover:bg-[#583D65] text-white rounded-full text-[10px] font-serif font-bold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>釘上我的創作照片</span>
            </button>
          </div>

          {/* Photo Wall Tabletop Grid! */}
          {filteredItems.length === 0 ? (
            <div className="watercolor-card p-12 text-center border-dashed border-2 border-purple-200 flex flex-col items-center justify-center gap-3">
              <span className="text-3xl">📷</span>
              <span className="font-serif text-xs font-bold text-[#372D3E]/80">
                該分類下暫時沒有釘上的照片呢
              </span>
              <p className="text-[10px] text-[#9A8AA6] max-w-xs font-sans">
                你可以點擊右上方「釘上我的創作照片」，親自上傳或選擇一張療癒插畫，將你的專屬作品展示於照片牆上！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-1 bg-[#FAF8F5]/30 rounded-2xl">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => {
                  const isLiked = !!likedItems[item.id];
                  
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -15 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={`${getPhotoStyleClasses(item.photoStyle, index)} cursor-pointer relative group flex flex-col`}
                      onClick={() => setSelectedItem(item)}
                    >
                      {/* Paper Tape Masking on Pinned/Tape style */}
                      {(item.photoStyle === 'tape' || item.photoStyle === 'polaroid') && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-white/40 border border-white/60 backdrop-blur-xs shadow-xs rotate-1 z-15 flex items-center justify-center">
                          <span className="text-[7px] text-purple-400 font-mono tracking-widest scale-90">AIFEILER</span>
                        </div>
                      )}

                      {/* Photo Image Aspect Frame */}
                      <div className="w-full aspect-square rounded-sm overflow-hidden relative bg-[#FAF8F5] border border-black/5 shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          referrerPolicy="no-referrer"
                        />
                        {/* Soft light leaks or water stain overlay for natural physical photo feel */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/5 via-transparent to-amber-100/10 mix-blend-overlay pointer-events-none" />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#372D3E]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <span className="text-[10px] font-serif font-bold text-white bg-white/15 backdrop-blur-xs border border-white/30 px-3 py-1.5 rounded-full shadow-md">
                            🔍 放大觀賞照片
                          </span>
                        </div>

                        {/* Category tag on image border */}
                        <span className="absolute top-2 left-2 text-[8px] font-bold font-sans tracking-wide bg-white/90 text-[#6D4E7B] border border-[#6D4E7B]/10 px-1.5 py-0.5 rounded shadow-xs z-10">
                          {item.category}
                        </span>

                        {/* Delete Custom button */}
                        {item.isCustom && (
                          <button
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-500 flex items-center justify-center text-xs shadow-md hover:scale-105 transition-all z-20 cursor-pointer"
                            title="從照片牆上取下"
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      {/* Photo Description Text Area */}
                      <div className="flex flex-col gap-1.5 mt-3 pt-1 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-serif font-extrabold text-[#372D3E] text-xs sm:text-[13px] tracking-wide line-clamp-1 group-hover:text-[#6D4E7B] transition-colors">
                            {item.title}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-[#372D3E]/75 font-sans leading-relaxed line-clamp-2 mt-0.5 h-7">
                          {item.desc}
                        </p>

                        {/* Footer details with interactive Like */}
                        <div className="flex items-center justify-between border-t border-purple-50/75 pt-2 mt-auto text-[9px] font-sans text-[#9A8AA6]">
                          <div className="flex items-center gap-1 font-medium">
                            <User className="w-2.5 h-2.5" />
                            <span className="text-[#372D3E]/70 font-semibold">{item.creator}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono tracking-tighter opacity-80">{item.date}</span>
                            <button
                              onClick={(e) => handleLike(item.id, e)}
                              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full border transition-all cursor-pointer ${
                                isLiked 
                                  ? 'bg-rose-50 border-rose-200 text-rose-500 scale-105' 
                                  : 'bg-[#FAF8F5] border-purple-100 text-[#9A8AA6] hover:text-rose-500 hover:border-rose-200'
                              }`}
                            >
                              <Heart className={`w-2.5 h-2.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                              <span className="font-bold">{item.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Featured Spotlights & Category Index (Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Featured Selection Spotlight Component */}
          <div className="watercolor-card p-5 border border-[#6D4E7B]/8">
            <h3 className="font-serif text-[#372D3E] font-extrabold text-sm tracking-wider flex items-center gap-2 mb-4">
              <span>精選作品</span>
              <span className="w-1.5 h-1.5 bg-[#6D4E7B] rounded-full" />
            </h3>

            {/* Custom Photo Frame */}
            <div className="rounded-xl border border-[#6D4E7B]/10 overflow-hidden bg-white p-3 shadow-md relative flex flex-col gap-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-black/5 relative">
                <img 
                  src={IMAGES.illustrationFlower} 
                  alt="Featured illustration" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 right-2 text-[8px] font-sans font-bold bg-white/95 text-[#6D4E7B] border border-[#6D4E7B]/10 px-1.5 py-0.5 rounded shadow-xs">
                  🏆 首推精選
                </span>
              </div>
              <span className="text-[10px] bg-[#6D4E7B]/10 text-[#6D4E7B] font-bold py-0.5 px-2 rounded-full w-fit">
                療癒語錄系列
              </span>
              <p className="text-[10px] text-[#372D3E]/85 leading-relaxed font-sans font-medium">
                在字句與花草中，找到溫柔的力量。每天隨風搖曳，散播微小而美好的療癒。
              </p>
              <button 
                onClick={() => {
                  const flowerItem = items.find(i => i.id === 'p1');
                  if (flowerItem) setSelectedItem(flowerItem);
                }}
                className="mt-1 w-full py-1.5 bg-[#6D4E7B] text-white hover:bg-[#583D65] rounded-lg text-[10px] font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <span>查看詳情 ➔</span>
              </button>
            </div>
          </div>

          {/* Quick Info Tip of Artwork */}
          <div className="watercolor-card p-5 border border-amber-100/60 bg-[#FFFDF9]/95 text-[#372D3E]/90">
            <h4 className="font-serif text-[#6D4E7B] font-extrabold text-xs tracking-wide flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>照片牆精神</span>
            </h4>
            <p className="text-[10px] leading-relaxed font-sans font-medium text-[#372D3E]/80">
              「相片，是把日常溫柔定格的畫布。」每一件作品都是一個成長的刻度，承載著思索的軌跡。歡迎釘上你的心情，或點擊愛心收藏喜歡的作品！
            </p>
          </div>

        </div>

      </div>

      {/* 3. PHOTO DETAILS LIGHTBOX DIALOG */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#372D3E]/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 20, rotate: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white p-4 pb-8 max-w-lg w-full rounded-md shadow-2xl border border-black/10 flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Wooden clip / Washi tape simulation */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-18 h-6 bg-amber-50/70 border border-amber-200/60 backdrop-blur-xs shadow-md z-10 flex items-center justify-center">
                <span className="text-[8px] text-amber-700 font-serif font-bold tracking-widest scale-95">📌 PINNED</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white hover:bg-[#FAF8F5] text-[#372D3E] flex items-center justify-center text-xs shadow-md border border-purple-50 transition-all z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Main Photo Image Aspect Ratio Block */}
              <div className="w-full aspect-video sm:aspect-[4/3] rounded-sm overflow-hidden bg-[#FAF8F5] border border-black/5 shadow-inner">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Description Box */}
              <div className="flex flex-col gap-3 mt-4 px-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-50/75 pb-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-purple-500 font-extrabold font-sans uppercase tracking-wider bg-purple-50 border border-purple-100 w-fit px-2 py-0.5 rounded-full">
                      {selectedItem.category}
                    </span>
                    <h3 className="font-serif font-extrabold text-[#372D3E] text-base md:text-lg tracking-wide mt-1 leading-snug">
                      {selectedItem.title}
                    </h3>
                  </div>
                  
                  {/* Photo details with Interactive Like */}
                  <button
                    onClick={(e) => handleLike(selectedItem.id, e)}
                    className={`flex items-center gap-1.5 py-1 px-3.5 rounded-full border transition-all cursor-pointer shadow-xs ${
                      likedItems[selectedItem.id]
                        ? 'bg-rose-50 border-rose-200 text-rose-500' 
                        : 'bg-[#FAF8F5] border-purple-100 text-[#9A8AA6] hover:text-rose-500 hover:border-rose-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedItems[selectedItem.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="font-bold text-xs">{selectedItem.likes} 個喜愛</span>
                  </button>
                </div>

                {/* Substantive text description */}
                <p className="text-xs text-[#372D3E]/85 leading-relaxed font-sans">
                  {selectedItem.desc}
                </p>

                {/* Technical / Metadata row */}
                <div className="grid grid-cols-2 gap-3 mt-1.5 p-2.5 bg-[#FAF8F5] rounded-xl border border-purple-50">
                  <div className="flex items-center gap-2 text-[10px] font-sans text-[#372D3E]/75">
                    <div className="w-6 h-6 rounded-full bg-purple-100/70 border border-purple-100 flex items-center justify-center text-xs">
                      👤
                    </div>
                    <div>
                      <span className="block text-[8px] text-[#9A8AA6] leading-none">創作者角色</span>
                      <span className="font-bold text-[#372D3E]">{selectedItem.creator}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-sans text-[#372D3E]/75">
                    <div className="w-6 h-6 rounded-full bg-purple-100/70 border border-purple-100 flex items-center justify-center text-xs">
                      📅
                    </div>
                    <div>
                      <span className="block text-[8px] text-[#9A8AA6] leading-none">釘上日期</span>
                      <span className="font-bold text-[#372D3E]">{selectedItem.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#9A8AA6] font-sans flex items-center gap-1.5 justify-center mt-2.5">
                  <span>✨ 感謝你為溫柔點讚。在這個溫柔的角落，我們一起前行。</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. PIN NEW CREATION / UPLOAD DIALOG */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#372D3E]/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsUploadOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-5 sm:p-6 max-w-md w-full rounded-3xl shadow-2xl border border-purple-100 flex flex-col gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-[#FAF8F5] hover:bg-purple-50 text-[#372D3E] flex items-center justify-center text-xs border border-purple-50 transition-all z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col gap-1 pr-6 border-b border-purple-50 pb-2.5">
                <span className="text-sm">📷</span>
                <h3 className="font-serif font-extrabold text-[#372D3E] text-base tracking-wider">
                  在照片牆上，釘上你的療癒創作
                </h3>
                <p className="text-[10px] text-[#9A8AA6] font-sans">
                  分享你的手繪插畫、溫暖字句，或是一份讓你感到幸福的品牌體驗。
                </p>
              </div>

              {uploadError && (
                <div className="p-2 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-[10px] font-sans font-bold">
                  ⚠️ {uploadError}
                </div>
              )}

              <form onSubmit={handleAddCreation} className="flex flex-col gap-3.5 text-xs text-[#372D3E]">
                
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label className="font-serif font-bold text-[11px] text-[#6D4E7B]">作品名稱 *</label>
                  <input 
                    type="text" 
                    placeholder="例如：夏日微風水彩語錄" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-purple-100 focus:border-[#6D4E7B] focus:bg-white outline-none font-sans font-medium transition-all text-xs"
                    required
                  />
                </div>

                {/* Creator & Category row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-serif font-bold text-[11px] text-[#6D4E7B]">認領創作者</label>
                    <select
                      value={newCreator}
                      onChange={(e) => setNewCreator(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-[#FAF8F5] border border-purple-100 focus:border-[#6D4E7B] focus:bg-white outline-none font-sans font-semibold transition-all text-xs"
                    >
                      <option value="Ivy / 艾比">Ivy / 艾比</option>
                      <option value="小艾">小艾</option>
                      <option value="小思">小思</option>
                      <option value="思野">思野</option>
                      <option value="艾飛樂">艾飛樂</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-serif font-bold text-[11px] text-[#6D4E7B]">作品分類</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-[#FAF8F5] border border-purple-100 focus:border-[#6D4E7B] focus:bg-white outline-none font-sans font-semibold transition-all text-xs"
                    >
                      <option value="語錄圖文">語錄圖文</option>
                      <option value="品牌網站">品牌網站</option>
                      <option value="互動遊戲">互動遊戲</option>
                      <option value="角色故事">角色故事</option>
                      <option value="平面設計">平面設計</option>
                      <option value="影音剪輯">影音剪輯</option>
                    </select>
                  </div>
                </div>

                {/* Photo Style Frame */}
                <div className="flex flex-col gap-1">
                  <label className="font-serif font-bold text-[11px] text-[#6D4E7B]">照片相框樣式</label>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {(['polaroid', 'classic', 'retro', 'tape'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setNewStyle(style)}
                        className={`py-1.5 px-1 rounded-xl border text-[10px] font-sans font-bold transition-all cursor-pointer ${
                          newStyle === style 
                            ? 'bg-[#6D4E7B]/10 border-[#6D4E7B] text-[#6D4E7B]' 
                            : 'bg-[#FAF8F5] border-purple-100 text-[#9A8AA6] hover:border-purple-300'
                        }`}
                      >
                        {style === 'polaroid' ? '拍立得' : style === 'classic' ? '精緻' : style === 'retro' ? '復古' : '膠帶紙'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Selection Preset Picker */}
                <div className="flex flex-col gap-1">
                  <label className="font-serif font-bold text-[11px] text-[#6D4E7B]">選擇插圖照片 *</label>
                  <div className="grid grid-cols-6 gap-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-purple-50">
                    {photoPresets.map((preset) => {
                      const isSelected = newImageUrl === preset.url;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setNewImageUrl(preset.url)}
                          className={`aspect-video rounded-lg overflow-hidden relative border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-2 border-[#6D4E7B] ring-2 ring-purple-100 scale-102 shadow-xs' 
                              : 'border-purple-100/60 hover:border-purple-300 opacity-60 hover:opacity-100'
                          }`}
                          title={preset.name}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[9px] text-[#9A8AA6] font-sans mt-0.5 leading-none block">
                    💡 點擊上方其中一張 Aifeiler 經典療癒插畫，作為您作品的底圖。
                  </span>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="font-serif font-bold text-[11px] text-[#6D4E7B]">作品描述 *</label>
                  <textarea 
                    placeholder="寫下這件創作背後的故事，或者一段溫柔的心得語錄..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={2.5}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-purple-100 focus:border-[#6D4E7B] focus:bg-white outline-none font-sans font-medium transition-all text-xs resize-none"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="flex-1 py-2.5 bg-[#FAF8F5] hover:bg-purple-50 border border-purple-100 rounded-full text-[11px] font-serif font-bold transition-all text-[#372D3E] cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#6D4E7B] hover:bg-[#583D65] text-white rounded-full text-[11px] font-serif font-bold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>確定釘上照片牆 ➔</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
