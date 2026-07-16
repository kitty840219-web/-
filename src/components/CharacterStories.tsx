import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Heart, 
  MessageSquare, 
  ChevronRight, 
  Sparkles, 
  User, 
  FileText, 
  ArrowRightLeft,
  PenTool,
  Bookmark,
  Users
} from 'lucide-react';
import { IMAGES } from '../assets/images';

interface CharacterStoriesProps {
  activeCharacter: string;
}

const chaptersList = [
  { 
    id: 'ch1', 
    num: 1, 
    title: '初次相遇', 
    desc: '在那個午後，他們相遇了。', 
    image: IMAGES.illustrationFlower,
    content: '午後的陽光穿過薰衣草花瓣，灑在小徑旁的石椅上。小思手裡拿著一本泛黃的筆記本，正在苦思一個關於「陪伴」的命題。「為什麼每個人都在尋求陪伴，卻又害怕受傷呢？」他自言自語道。這時，一朵蒲公英輕輕落在他的筆記上，隨之而來的是一個銀鈴般的聲音：「因為陪伴就像曬太陽呀，雖然偶爾會被曬傷，但溫暖的感覺是無可替代的！」小思抬起頭，看見了抱著一籃花草的小艾，她的眼睛裡閃爍著比陽光還要溫暖的光芒。這一天，理性與溫柔在薰衣草田邊，悄悄相遇了。' 
  },
  { 
    id: 'ch2', 
    num: 2, 
    title: '心事交換', 
    desc: '分享心事，成為彼此的樹洞。', 
    image: IMAGES.illustrationSolitude,
    content: '「小艾，你也有感到脆弱的時候嗎？」小思坐在大樹下，雙膝併攏。小艾輕輕點頭，遞給他一片溫熱的薰衣草葉子。「有呀，當我覺得自己不夠好，或者無法安慰到哭泣的朋友時。但艾比告訴我，眼淚並不是軟弱，它只是心靈在給自己下一場溫柔的雨。雨停了，泥土會更香甜。」小思聞著葉子淡淡的香氣，心頭的緊繃慢慢鬆開了。原來，分享脆弱並不可怕，那反而是讓靈魂靠得更近的契機。' 
  },
  { 
    id: 'ch3', 
    num: 3, 
    title: '陪伴成長', 
    desc: '在每個日常裡，一起長大。', 
    image: IMAGES.illustrationChess,
    content: '日子一天天過去，小思和小艾成了最默契的朋友。每當小思陷入無盡的理智循環、感到疲累時，小艾就會帶他去聽微風吹過稻田的協奏曲，給他泡一杯暖烘烘的洋甘菊茶；而每當小艾因為過度的共感而感到沉重時，小思就會用清晰的邏輯幫她理清雜亂的心緒，陪她一起在星空下做深呼吸。他們在彼此的修剪中，沒有變成完美的人，卻變成了更喜歡自己的人。' 
  },
  { 
    id: 'ch4', 
    num: 4, 
    title: '勇敢出發', 
    desc: '帶著勇氣，走向更寬廣的世界。', 
    image: IMAGES.illustrationPathway,
    content: '一天傍晚，思野守護在森林深處，看著兩個孩子走來。「你們準備好去外面的世界看看了嗎？」思野沉穩地問。小思和小艾對視一眼，雖然手心有些微微顫抖，但眼神卻無比堅定。「我們有些害怕未知，思野。但我們相信，彼此的陪伴就是我們的護盾。」小思說。思野微微一笑，遞給他們一枚象徵勇氣的松果。「去吧，帶著顫抖前行，這本身就是最偉大的冒險。」' 
  },
  { 
    id: 'ch5', 
    num: 5, 
    title: '寫下未來', 
    desc: '未完待續的故事，等你一起寫下。', 
    image: IMAGES.mainBanner,
    content: 'Ivy在書房裡，用細膩的鋼筆在紙上劃下最後一行字：『於是，旅程還在繼續，故事也才剛剛開始。』她抬起頭看著窗外，小艾、小思、思野還有無數的夥伴正一起走在灑滿陽光的路上。「文字的力量，就是讓迷惘的人找到光。」Ivy寫道。而你，親愛的讀者，此時此刻，你也正拿著筆，在人生的繪本裡寫下專屬於你的、未完待續的故事。' 
  }
];

const profilesList = [
  {
    name: '小艾',
    role: '溫柔善良的女孩',
    motto: '擅長傾聽與感受',
    info: '溫柔善良，喜歡傾聽與感受。相信每個人心中都有光。',
    avatar: IMAGES.avatarXiaoi,
    color: '#FDF4F5',
    borderColor: 'border-rose-100',
    tags: ['溫柔', '傾聽', '共感'],
    fullInfo: '小艾是個心思非常細膩、具有極高同理心的女孩。她就像山谷裡的蒲公英與薰衣草，安靜且輕柔。她相信善良是一股能融化冰霜的力量，不論你面臨何等迷惘，她都願意做你的樹洞，抱著膝蓋默默傾聽，在恰當的時刻用極其柔軟的話語輕輕包裹你。'
  },
  {
    name: '小思',
    role: '溫柔顧慮的男孩',
    motto: '喜歡觀察與思考',
    info: '安靜細心，喜歡觀察與思考。總是用行動默默支持朋友。',
    avatar: IMAGES.avatarXiaosi,
    color: '#EEF1FB',
    borderColor: 'border-indigo-100',
    tags: ['思考', '觀察', '細膩'],
    fullInfo: '小思是個邏輯清晰、充滿探索慾的男孩。他討厭簡單粗暴的說教，熱愛詢問「為什麼」。他相信每一個困境背後，都藏著一塊需要打磨的生命拼圖。他會陪著你一步步拆解複雜的思維，在理智與對話中，慢慢尋找溫柔卻不失深度的心靈答案。'
  },
  {
    name: '艾比 / Ivy',
    role: '溫柔創作者',
    motto: '用故事陪伴你',
    info: '溫柔創作者，用文字與故事陪伴每一顆需要被理解的心。',
    avatar: IMAGES.avatarIvy,
    color: '#FAF4ED',
    borderColor: 'border-amber-100',
    tags: ['創作', '陪伴', '療癒'],
    fullInfo: 'Ivy是艾飛樂的靈魂與筆尖。她熱情、包容，帶著無私的支持力量。她擅長用帶有微光的文字和童話風格故事，為疲倦的都市旅人搭建一座心靈驛站。在她眼裡，每一個生命都是一個珍貴的冒險奇蹟，迷惘只是前進的墨水痕跡。'
  },
  {
    name: '思野',
    role: '理性思考者',
    motto: '陪伴與支持的力量',
    info: '理性思考，穩重可靠，在迷惘時給予方向與力量。',
    avatar: IMAGES.avatarSiye,
    color: '#EAF5ED',
    borderColor: 'border-emerald-100',
    tags: ['理性', '支持', '堅定'],
    fullInfo: '思野是森林深處的長者與傾聽者，沉穩、安祥。他不常發表冗長的言論，但說出的每一句話都如同晨鐘般深邃平靜。他會引導你連結山林、清風與呼吸，在寂靜無聲中找到自己心靈深處最真實、最堅固的內在力量。'
  }
];

const quotesList = [
  {
    id: 1,
    character: '小艾',
    avatar: IMAGES.avatarXiaoi,
    quote: '「眼淚並不是軟弱，它只是心靈在給自己下一場溫柔的雨。雨停了，泥土會更香甜。」',
    source: '故事章節《心事交換》',
    bgColor: 'bg-rose-50/40 border-rose-100'
  },
  {
    id: 2,
    character: '小思',
    avatar: IMAGES.avatarXiaosi,
    quote: '「為什麼陪伴就像曬太陽呢？因為雖然偶爾會被曬傷，但那份溫暖是無可替代的。」',
    source: '故事章節《初次相遇》',
    bgColor: 'bg-indigo-50/40 border-indigo-100'
  },
  {
    id: 3,
    character: '艾比 / Ivy',
    avatar: IMAGES.avatarIvy,
    quote: '「文字的力量，就是讓迷惘的人找到光。在人生的繪本裡，我們都是未完待續的故事。」',
    source: 'Ivy 的創作筆記',
    bgColor: 'bg-amber-50/40 border-amber-100'
  },
  {
    id: 4,
    character: '思野',
    avatar: IMAGES.avatarSiye,
    quote: '「去吧，帶著顫抖前行，這本身就是最偉大的冒險。彼此的陪伴就是你們的護盾。」',
    source: '故事章節《勇敢出發》',
    bgColor: 'bg-emerald-50/40 border-emerald-100'
  }
];

const creativeNotesList = [
  {
    id: 'n1',
    title: '關於「小艾」的初始設計',
    date: '2026.04.12',
    content: '小艾的靈感源自於薰衣草花田與柔軟的小兔子。在手繪草稿中，我給她戴上了小草帽和一雙會笑的圓眼睛。她的雙眼代表同理心與溫和，在配色上，我使用了淡淡的水彩粉與薰衣草紫，象徵心靈深處最輕柔的防線。'
  },
  {
    id: 'n2',
    title: '關於「小思」的思維拼圖',
    date: '2026.04.28',
    content: '小思手裡的泛黃筆記本是我最初的核心點子。他一邊走一邊記錄思考，他戴著綠色小帽子，性格有些理智卻十分顧慮周遭的人。他的理智與思考不是用來反駁，而是用來守護，用來溫柔地梳理亂麻般的思緒。'
  },
  {
    id: 'n3',
    title: '「思野」與古老森林的呼喚',
    date: '2026.05.15',
    content: '思野是整個繪本世界中代表「沉穩底色」的存在。他就像一株守護森林的大松樹。在繪製思野時，我使用了深邃的翠綠與木質棕，背景點綴著象徵智慧的星宿。他用無聲的陪伴與幾句清醒的問答，指引孩子們前進的方向。'
  }
];

export default function CharacterStories({ activeCharacter }: CharacterStoriesProps) {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState('小艾');
  const [activeSubTab, setActiveSubTab] = useState('relation-map');

  // Interactive Chapter & Card Favorites
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Guestbook comments
  const [fanStories, setFanStories] = useState([
    { id: 1, name: '晴天草本', story: '每次看到小艾對小思說眼淚是心靈的雨，都讓在深夜哭泣的我得到了無比的安慰。謝謝艾飛樂！', likes: 45, liked: false },
    { id: 2, name: '微風思辨手記', story: '我很喜歡小思。在這個只要求快速給出答案的世界裡，有一個角色願意陪你慢慢問「為什麼」，真的很難得。', likes: 32, liked: false },
    { id: 3, name: '薰衣草田的貓', story: '與艾飛樂相遇的第一天，我學會了對自己說：辛苦了，你已經做得很好了。這個暖心故事館是我的避風港。', likes: 58, liked: false }
  ]);
  const [newNick, setNewNick] = useState('');
  const [newStory, setNewStory] = useState('');

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNick.trim() || !newStory.trim()) return;
    const newStoryItem = {
      id: Date.now(),
      name: newNick.trim(),
      story: newStory.trim(),
      likes: 1,
      liked: true
    };
    setFanStories([newStoryItem, ...fanStories]);
    setNewNick('');
    setNewStory('');
  };

  const handleLikeFanStory = (id: number) => {
    setFanStories(prev => prev.map(story => {
      if (story.id === id) {
        return {
          ...story,
          likes: story.liked ? story.likes - 1 : story.likes + 1,
          liked: !story.liked
        };
      }
      return story;
    }));
  };

  const currentChapterData = chaptersList.find((c) => c.id === activeChapter);

  // Smooth scroll helper
  const scrollToSection = (id: string, subTab: string) => {
    setActiveSubTab(subTab);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 font-sans text-[#4E4158] select-none">
      
      {/* Three Column Outer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* ================= COLUMN 1: LEFT SUB-NAV & INTERACTIVE CORNER (Spans 3 cols) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-[90px] z-10 w-full">
          
          {/* Sub Navigation Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.03)] flex flex-col gap-4">
            <h4 className="font-serif text-sm font-bold text-[#4E4158] flex items-center gap-2 border-b border-purple-50 pb-3">
              <span className="text-purple-500">🔮</span> 角色故事導覽
            </h4>
            
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'relation-map', target: 'character-relation-map', label: '角色關係地圖', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
                { id: 'chapters', target: 'character-chapters', label: '故事章節', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'profiles', target: 'character-profiles', label: '角色檔案', icon: <User className="w-3.5 h-3.5" /> },
                { id: 'quotes', target: 'character-quotes', label: '角色語錄', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { id: 'creative-notes', target: 'creative-notes-sec', label: '創作筆記', icon: <PenTool className="w-3.5 h-3.5" /> },
                { id: 'fan-stories', target: 'fan-stories-sec', label: '粉絲故事', icon: <Heart className="w-3.5 h-3.5" /> }
              ].map((menuItem) => (
                <button
                  key={menuItem.id}
                  onClick={() => scrollToSection(menuItem.target, menuItem.id)}
                  className={`w-full flex items-center gap-3 py-2.5 px-4 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                    activeSubTab === menuItem.id
                      ? 'bg-[#7C5B8C] text-white shadow-sm'
                      : 'text-[#9A8AA6] hover:text-[#4E4158] hover:bg-purple-50/50'
                  }`}
                >
                  {menuItem.icon}
                  <span>{menuItem.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mini Relationship Map Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.03)] flex flex-col items-center gap-4 text-center">
            <h5 className="font-serif text-xs font-bold text-[#4E4158] self-start flex items-center gap-1.5">
              <span className="text-[#7C5B8C]">✨</span> 迷你關係地圖
            </h5>

            {/* Dotted Diamond Graphic */}
            <div className="relative w-full aspect-square max-w-[190px] bg-[#FAF7F2]/60 rounded-3xl border border-purple-100/50 flex items-center justify-center p-4">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                {/* Diamond shape dotted lines */}
                <polygon points="50,16 84,50 50,84 16,50" stroke="rgba(124, 91, 140, 0.3)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
                <line x1="16" y1="50" x2="84" y2="50" stroke="rgba(124, 91, 140, 0.2)" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="50" y1="16" x2="50" y2="84" stroke="rgba(124, 91, 140, 0.2)" strokeWidth="1" strokeDasharray="2 2" />
              </svg>

              {/* Avatars */}
              {/* Top: 小艾 */}
              <div 
                onClick={() => setSelectedCompanion('小艾')}
                className="absolute top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-[#FDF4F5] border border-rose-200/50 overflow-hidden shadow-sm group-hover:scale-105 transition-transform ring-2 ring-white">
                  <img src={IMAGES.avatarXiaoi} alt="小艾" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[8px] font-bold text-[#4E4158] mt-1">小艾</span>
              </div>

              {/* Left: 小思 */}
              <div 
                onClick={() => setSelectedCompanion('小思')}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-[#EEF1FB] border border-indigo-200/50 overflow-hidden shadow-sm group-hover:scale-105 transition-transform ring-2 ring-white">
                  <img src={IMAGES.avatarXiaosi} alt="小思" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[8px] font-bold text-[#4E4158] mt-1">小思</span>
              </div>

              {/* Right: 艾比 / Ivy */}
              <div 
                onClick={() => setSelectedCompanion('艾比')}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-[#FAF4ED] border border-amber-200/50 overflow-hidden shadow-sm group-hover:scale-105 transition-transform ring-2 ring-white">
                  <img src={IMAGES.avatarIvy} alt="艾比" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[8px] font-bold text-[#4E4158] mt-1">艾比 / Ivy</span>
              </div>

              {/* Bottom: 思野 */}
              <div 
                onClick={() => setSelectedCompanion('思野')}
                className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-[#EAF5ED] border border-emerald-200/50 overflow-hidden shadow-sm group-hover:scale-105 transition-transform ring-2 ring-white">
                  <img src={IMAGES.avatarSiye} alt="思野" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[8px] font-bold text-[#4E4158] mt-1">思野</span>
              </div>

              {/* Center Heart overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-rose-100 flex items-center justify-center shadow-md animate-soft-pulse z-10">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              </div>
            </div>
          </div>

          {/* Quote Block Sticker Card */}
          <div className="bg-[#FAF5EF]/95 p-5 rounded-3xl border border-purple-200/20 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            {/* Soft decorative floral corner sketch */}
            <div className="absolute bottom-1 right-2 opacity-80 pointer-events-none">
              <svg className="w-14 h-24" viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 90 C25 60, 25 30, 25 12" stroke="#68806F" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="25" cy="18" r="2.2" fill="#7C5B8C" />
                <circle cx="22" cy="25" r="2" fill="#9333EA" />
                <circle cx="28" cy="25" r="2" fill="#7C5B8C" />
                <circle cx="25" cy="32" r="2" fill="#A855F7" />
                <circle cx="22" cy="40" r="2" fill="#9333EA" />
                <circle cx="28" cy="40" r="2" fill="#7C5B8C" />
                <circle cx="25" cy="48" r="1.8" fill="#A855F7" />
                <path d="M25 68 C20 68, 22 62, 22 62" stroke="#68806F" strokeWidth="0.8" />
                <path d="M25 72 C30 72, 28 66, 28 66" stroke="#68806F" strokeWidth="0.8" />
              </svg>
            </div>

            <div className="pt-2 text-center flex flex-col justify-between h-full relative z-10">
              <span className="text-xl text-[#7C5B8C]/40 block text-left">❝</span>
              <p className="font-serif font-bold text-xs md:text-sm text-[#4E4158] leading-relaxed px-2">
                每一段關係，<br />
                都是一則尚未完結的故事。
              </p>
              <div className="flex flex-col items-end mt-4">
                <span className="text-[9px] text-[#9A8AA6] font-semibold font-sans tracking-wide">
                  — 艾飛樂 Aifeiler
                </span>
                <span className="text-xl text-[#7C5B8C]/40 block leading-none select-none">❞</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= COLUMN 2: MIDDLE MAIN AREA (Spans 6 cols) ================= */}
        <div className="lg:col-span-6 flex flex-col gap-8 w-full">
          
          {/* Main Display Illustration Banner */}
          <div 
            style={{ backgroundImage: `url(${IMAGES.mainBanner})`, backgroundSize: 'cover', backgroundPosition: 'center 40%' }}
            className="rounded-3xl p-8 md:p-10 border border-purple-100/40 relative overflow-hidden min-h-[260px] md:min-h-[300px] flex items-end shadow-xs"
          >
            {/* Elegant vignette layout for pristine text rendering */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent"></div>
            
            <div className="relative z-10 max-w-lg text-white">
              <span className="text-[9px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold font-sans uppercase tracking-widest backdrop-blur-xs border border-white/10">
                Aifeiler Story Map ∙ 故事館
              </span>
              <h2 className="font-serif text-xl md:text-[26px] font-bold mt-3 leading-snug drop-shadow-sm tracking-wide">
                走進角色的故事，<br />
                也走進自己的情感宇宙。
              </h2>
              <p className="text-[10px] md:text-xs text-purple-100/90 leading-relaxed mt-2 font-sans font-medium max-w-sm">
                在小艾與小思的世界裡，每一次相遇都是一份禮物，每一段陪伴，都是成長的印記。
              </p>
              
              <div className="mt-5">
                <button
                  onClick={() => scrollToSection('character-chapters', 'chapters')}
                  className="bg-white hover:bg-[#FAF7F2] text-[#7C5B8C] font-serif text-xs font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                >
                  探索角色故事 ➜
                </button>
              </div>
            </div>
          </div>

          {/* ✦ 角色關係地圖 */}
          <div id="character-relation-map" className="bg-white/80 p-5 md:p-6 rounded-3xl border border-[#7C5B8C]/12 shadow-xs scroll-mt-24">
            <h4 className="font-serif text-sm font-bold text-[#4E4158] mb-6 flex items-center gap-1.5">
              <span className="text-[#7C5B8C]">✦</span> 角色關係地圖
            </h4>

            {/* Scrollable container on mobile, full flex on large */}
            <div className="overflow-x-auto pb-4 -mx-2 px-2 scrollbar-none">
              <div className="flex items-center justify-between gap-3 min-w-[580px] py-2 relative">
                
                {/* Node 1: 小思 */}
                <div 
                  onClick={() => setSelectedCompanion('小思')}
                  className="flex flex-col items-center p-3.5 bg-[#FAF7F2]/40 hover:bg-white rounded-3xl border border-purple-100/30 hover:border-[#7C5B8C]/30 shadow-2xs hover:shadow-md transition-all text-center w-[115px] cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-[#EEF1FB] border border-indigo-200 overflow-hidden shadow-sm ring-4 ring-white">
                    <img src={IMAGES.avatarXiaosi} alt="小思" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="font-serif font-extrabold text-xs text-[#4E4158] mt-2">小思</span>
                  <span className="text-[9px] text-[#7C5B8C] font-bold mt-0.5">溫柔顧慮的男孩</span>
                  <span className="text-[8px] text-[#9A8AA6] font-semibold scale-90 mt-0.5 block whitespace-nowrap">喜歡觀察與思考</span>
                </div>

                {/* Connector 1 */}
                <div className="flex-1 flex flex-col items-center justify-center text-center relative px-1">
                  <span className="text-[9px] font-bold text-[#9A8AA6] leading-none mb-1 select-none whitespace-nowrap">一起思考</span>
                  <div className="w-full border-t border-dashed border-purple-300/60 relative"></div>
                  <span className="text-[9px] font-bold text-[#9A8AA6] leading-none mt-1 select-none whitespace-nowrap">互相啟發</span>
                  <div className="absolute top-[52%] -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-purple-100 flex items-center justify-center shadow-2xs">
                    <Heart className="w-2 h-2 text-rose-400 fill-rose-400" />
                  </div>
                </div>

                {/* Node 2: 小艾 */}
                <div 
                  onClick={() => setSelectedCompanion('小艾')}
                  className="flex flex-col items-center p-3.5 bg-[#FAF7F2]/40 hover:bg-white rounded-3xl border border-purple-100/30 hover:border-[#7C5B8C]/30 shadow-2xs hover:shadow-md transition-all text-center w-[115px] cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-[#FDF4F5] border border-rose-200 overflow-hidden shadow-sm ring-4 ring-white">
                    <img src={IMAGES.avatarXiaoi} alt="小艾" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="font-serif font-extrabold text-xs text-[#4E4158] mt-2">小艾</span>
                  <span className="text-[9px] text-[#7C5B8C] font-bold mt-0.5">溫柔善良的女孩</span>
                  <span className="text-[8px] text-[#9A8AA6] font-semibold scale-90 mt-0.5 block whitespace-nowrap">擅長傾聽與感受</span>
                </div>

                {/* Connector 2 */}
                <div className="flex-1 flex flex-col items-center justify-center text-center relative px-1">
                  <span className="text-[9px] font-bold text-[#9A8AA6] leading-none mb-1 select-none whitespace-nowrap">創作靈感</span>
                  <div className="w-full border-t border-dashed border-purple-300/60 relative"></div>
                  <span className="text-[9px] font-bold text-[#9A8AA6] leading-none mt-1 select-none whitespace-nowrap">情感投射</span>
                  <div className="absolute top-[52%] -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-purple-100 flex items-center justify-center shadow-2xs">
                    <Heart className="w-2 h-2 text-rose-400 fill-rose-400" />
                  </div>
                </div>

                {/* Node 3: 艾比 */}
                <div 
                  onClick={() => setSelectedCompanion('艾比')}
                  className="flex flex-col items-center p-3.5 bg-[#FAF7F2]/40 hover:bg-white rounded-3xl border border-purple-100/30 hover:border-[#7C5B8C]/30 shadow-2xs hover:shadow-md transition-all text-center w-[115px] cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-[#FAF4ED] border border-amber-200 overflow-hidden shadow-sm ring-4 ring-white">
                    <img src={IMAGES.avatarIvy} alt="艾比" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="font-serif font-extrabold text-xs text-[#4E4158] mt-2">艾比 / Ivy</span>
                  <span className="text-[9px] text-[#7C5B8C] font-bold mt-0.5">溫柔創作者</span>
                  <span className="text-[8px] text-[#9A8AA6] font-semibold scale-90 mt-0.5 block whitespace-nowrap">用故事陪伴你</span>
                </div>

                {/* Connector 3 */}
                <div className="flex-1 flex flex-col items-center justify-center text-center relative px-1">
                  <span className="text-[9px] font-bold text-[#9A8AA6] leading-none mb-1 select-none whitespace-nowrap">彼此理解</span>
                  <div className="w-full border-t border-dashed border-purple-300/60 relative"></div>
                  <span className="text-[9px] font-bold text-[#9A8AA6] leading-none mt-1 select-none whitespace-nowrap">共同成長</span>
                  <div className="absolute top-[52%] -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-purple-100 flex items-center justify-center shadow-2xs">
                    <Heart className="w-2 h-2 text-rose-400 fill-rose-400" />
                  </div>
                </div>

                {/* Node 4: 思野 */}
                <div 
                  onClick={() => setSelectedCompanion('思野')}
                  className="flex flex-col items-center p-3.5 bg-[#FAF7F2]/40 hover:bg-white rounded-3xl border border-purple-100/30 hover:border-[#7C5B8C]/30 shadow-2xs hover:shadow-md transition-all text-center w-[115px] cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-[#EAF5ED] border border-emerald-200 overflow-hidden shadow-sm ring-4 ring-white">
                    <img src={IMAGES.avatarSiye} alt="思野" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="font-serif font-extrabold text-xs text-[#4E4158] mt-2">思野</span>
                  <span className="text-[9px] text-[#7C5B8C] font-bold mt-0.5">理性思考者</span>
                  <span className="text-[8px] text-[#9A8AA6] font-semibold scale-90 mt-0.5 block whitespace-nowrap">陪伴與支持的力量</span>
                </div>

              </div>
            </div>
          </div>

          {/* ✦ 故事章節 */}
          <div id="character-chapters" className="flex flex-col gap-5 scroll-mt-24">
            <h4 className="font-serif text-sm font-bold text-[#4E4158] flex items-center gap-1.5">
              <span className="text-[#7C5B8C]">✦</span> 故事章節
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {chaptersList.map((chap) => (
                <div
                  key={chap.id}
                  className="bg-white/80 border border-purple-100/30 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group min-h-[220px]"
                >
                  {/* Aspect-video watercolor banner decoration */}
                  <div className="h-28 w-full overflow-hidden relative bg-[#FAF7F2]">
                    <img 
                      src={chap.image} 
                      alt={chap.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <span className="absolute top-3 left-3 text-[9px] text-white font-bold bg-[#7C5B8C]/90 px-2 py-0.5 rounded-md font-sans shadow-xs">
                      Chapter 0{chap.num}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-serif font-extrabold text-xs text-[#4E4158] mt-0.5">{chap.title}</h5>
                      <p className="text-[10px] text-[#9A8AA6] leading-relaxed mt-1 font-semibold">
                        {chap.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <button
                        id={`read-chapter-btn-${chap.id}`}
                        onClick={() => setActiveChapter(chap.id)}
                        className="flex-1 bg-[#FAF7F2] hover:bg-[#7C5B8C] hover:text-white border border-[#7C5B8C]/15 text-[#7C5B8C] font-serif text-[10px] py-2 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                      >
                        閱讀故事 ➜
                      </button>

                      {/* Heart Button */}
                      <button
                        onClick={(e) => toggleFavorite(`chap-${chap.id}`, e)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          favorites[`chap-${chap.id}`]
                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                            : 'border-purple-100/50 bg-white text-purple-300 hover:text-rose-500 hover:bg-rose-50/20'
                        }`}
                        title="收藏故事"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites[`chap-${chap.id}`] ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✦ 角色檔案 */}
          <div id="character-profiles" className="bg-white/80 p-5 md:p-6 rounded-3xl border border-[#7C5B8C]/12 shadow-xs scroll-mt-24">
            <h4 className="font-serif text-sm font-bold text-[#4E4158] mb-5 flex items-center gap-1.5">
              <span className="text-[#7C5B8C]">✦</span> 角色檔案
            </h4>
            
            <div className="flex gap-1.5 border-b border-purple-50 pb-3 mb-5 overflow-x-auto scrollbar-none">
              {['小艾', '小思', '艾比', '思野'].map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedCompanion(name)}
                  className={`px-4 py-1.5 text-xs font-serif font-bold rounded-xl transition-all cursor-pointer select-none ${
                    selectedCompanion === name || (selectedCompanion === '艾比' && name === '艾比')
                      ? 'bg-[#7C5B8C] text-white shadow-xs'
                      : 'text-[#9A8AA6] hover:bg-purple-50/50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {profilesList.map((prof) => {
              const matchesSelected = 
                selectedCompanion === prof.name || 
                (selectedCompanion === '艾比' && prof.name.includes('Ivy'));
              
              if (!matchesSelected) return null;

              return (
                <div key={prof.name} className="flex flex-col md:flex-row gap-5 items-start">
                  <motion.div 
                    initial={{ scale: 0.8, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 12 }}
                    className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm ring-4 ring-white border ${prof.borderColor}`} 
                    style={{ backgroundColor: prof.color }}
                  >
                    <img src={prof.avatar} alt={prof.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </motion.div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-extrabold text-sm md:text-base text-[#4E4158]">{prof.name}</span>
                        <span className="text-[9px] bg-purple-50 text-[#7C5B8C] px-2 py-0.5 rounded-md border border-purple-100/50 font-sans font-bold">
                          {prof.role}
                        </span>
                      </div>
                      
                      {/* Heart Indicator */}
                      <button
                        onClick={(e) => toggleFavorite(`prof-${prof.name}`, e)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          favorites[`prof-${prof.name}`]
                            ? 'bg-rose-50 border-rose-100 text-rose-500'
                            : 'border-purple-50 bg-white text-purple-300 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites[`prof-${prof.name}`] ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#9A8AA6] font-bold font-sans mt-1">關鍵字: {prof.motto}</p>
                    
                    <p className="text-xs text-[#4E4158]/85 leading-relaxed mt-3 font-sans font-medium bg-[#FAF7F2]/40 p-3 rounded-2xl border border-purple-50">
                      {prof.fullInfo}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-1.5">
                        {prof.tags.map((tag) => (
                          <span key={tag} className="bg-[#FAF7F2] border border-purple-100/30 px-2.5 py-0.5 rounded-lg text-[9px] font-sans font-bold text-[#7C5B8C]">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => scrollToSection('fan-stories-sec', 'fan-stories')}
                        className="text-[10px] text-[#7C5B8C] font-bold hover:underline transition-all cursor-pointer"
                      >
                        了解更多 ➜
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✦ 角色語錄 (NEW SECTION MATCHING IMAGES LOOK) */}
          <div id="character-quotes" className="bg-white/80 p-5 md:p-6 rounded-3xl border border-[#7C5B8C]/12 shadow-xs scroll-mt-24">
            <h4 className="font-serif text-sm font-bold text-[#4E4158] mb-5 flex items-center gap-1.5">
              <span className="text-[#7C5B8C]">✦</span> 角色語錄
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotesList.map((q) => (
                <div key={q.id} className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[120px] transition-all hover:shadow-xs ${q.bgColor}`}>
                  <p className="font-serif text-xs leading-relaxed font-bold italic">
                    {q.quote}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-purple-100/20 pt-2.5 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-purple-100">
                        <img src={q.avatar} alt={q.character} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-[10px] font-bold">{q.character}</span>
                    </div>
                    <span className="text-[8px] text-[#9A8AA6] font-semibold">{q.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✦ 創作筆記 (NEW SECTION MATCHING IMAGES LOOK) */}
          <div id="creative-notes-sec" className="bg-[#FAF5EF]/40 p-5 md:p-6 rounded-3xl border border-[#7C5B8C]/12 shadow-xs scroll-mt-24">
            <h4 className="font-serif text-sm font-bold text-[#4E4158] mb-5 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-[#7C5B8C]" />
              Ivy 的幕後創作手記
            </h4>

            <div className="flex flex-col gap-4">
              {creativeNotesList.map((note) => (
                <div key={note.id} className="bg-white/90 p-4 rounded-2xl border border-purple-100/20 relative shadow-2xs group">
                  <div className="absolute top-4 right-4 text-[9px] text-[#9A8AA6] font-semibold font-mono">{note.date}</div>
                  <h5 className="font-serif text-xs font-extrabold text-[#7C5B8C]">{note.title}</h5>
                  <p className="text-xs text-[#4E4158]/85 leading-relaxed mt-2 font-sans font-medium">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ✦ 粉絲故事 (NEW INTERACTIVE FEATURE) */}
          <div id="fan-stories-sec" className="bg-white/80 p-5 md:p-6 rounded-3xl border border-[#7C5B8C]/12 shadow-xs scroll-mt-24">
            <h4 className="font-serif text-sm font-bold text-[#4E4158] mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#7C5B8C]" />
              粉絲療癒故事館
            </h4>
            
            <p className="text-[11px] text-[#9A8AA6] font-medium leading-relaxed mb-5 font-sans">
              分享你在艾飛樂陪伴下走過的點點滴滴，或者是某句語錄給予你的溫柔一擊。讓文字攜手溫柔。
            </p>

            {/* Leave a note form */}
            <form onSubmit={handleAddStory} className="bg-[#FAF7F2]/40 p-4 rounded-2xl border border-purple-100/30 flex flex-col gap-3 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="留下你的心靈暱稱..."
                  value={newNick}
                  onChange={(e) => setNewNick(e.target.value)}
                  className="flex-1 bg-white border border-purple-100 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#7C5B8C]/30 text-[#4E4158]"
                  required
                />
              </div>
              <textarea
                placeholder="寫下你想分享的相遇故事或感受..."
                rows={2}
                value={newStory}
                onChange={(e) => setNewStory(e.target.value)}
                className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7C5B8C]/30 text-[#4E4158] resize-none"
                required
              />
              <button
                type="submit"
                className="self-end bg-[#7C5B8C] hover:bg-[#684a75] text-white text-[10px] font-bold px-4 py-1.5 rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                遞交心靈故事 ✉
              </button>
            </form>

            {/* Feed list */}
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {fanStories.map((item) => (
                <div key={item.id} className="p-3.5 bg-[#FAF7F2]/30 rounded-xl border border-purple-50/50 flex flex-col justify-between gap-2 shadow-2xs">
                  <div className="flex justify-between items-center text-[10px] text-[#9A8AA6] font-sans">
                    <span className="font-bold text-[#7C5B8C]">👤 {item.name}</span>
                    <span className="font-semibold scale-90">療癒之行 ∙ 相伴中</span>
                  </div>
                  <p className="text-xs text-[#4E4158]/90 font-sans leading-relaxed font-medium">
                    {item.story}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleLikeFanStory(item.id)}
                    className={`self-end flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                      item.liked
                        ? 'bg-rose-50 border-rose-100 text-rose-500'
                        : 'bg-white border-purple-100/40 text-[#9A8AA6] hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-2.5 h-2.5 ${item.liked ? 'fill-rose-500' : ''}`} />
                    <span>{item.likes} 個共鳴</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= COLUMN 3: RIGHT PANEL & WIDGETS (Spans 3 cols) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-6 w-full lg:sticky lg:top-[90px] z-10">
          
          {/* Widget 1: 熱門角色 */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.03)]">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50 mb-4 text-xs">
              <h4 className="font-serif font-bold text-[#4E4158] flex items-center gap-1.5">
                <span>🔥</span> 熱門角色
              </h4>
              <span className="text-[9px] text-[#9A8AA6] cursor-pointer hover:text-[#7C5B8C] font-semibold">查看全部 ➜</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {[
                { rank: 1, name: '小艾', desc: '溫柔暖心的傾聽者', hearts: '18.6K', avatar: IMAGES.avatarXiaoi, color: 'text-rose-500 bg-rose-50' },
                { rank: 2, name: '艾比 / Ivy', desc: '充滿力量的陪伴創作者', hearts: '16.2K', avatar: IMAGES.avatarIvy, color: 'text-amber-500 bg-amber-50' },
                { rank: 3, name: '小思', desc: '追求思考的探索男孩', hearts: '12.3K', avatar: IMAGES.avatarXiaosi, color: 'text-indigo-500 bg-indigo-50' },
                { rank: 4, name: '思野', desc: '安靜沉穩的大自然守護者', hearts: '9.8K', avatar: IMAGES.avatarSiye, color: 'text-emerald-500 bg-emerald-50' }
              ].map((char) => (
                <div 
                  key={char.rank} 
                  onClick={() => setSelectedCompanion(char.name.includes('Ivy') ? '艾比' : char.name)}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-xs font-sans">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold ${char.color}`}>
                      {char.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-purple-100 overflow-hidden shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[#4E4158] group-hover:text-[#7C5B8C] transition-colors leading-tight">{char.name}</h5>
                      <p className="text-[8px] text-[#9A8AA6] font-semibold mt-0.5">{char.desc}</p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] text-[#7C5B8C] font-semibold flex items-center gap-0.5 shrink-0">
                    <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" /> {char.hearts}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: 本週推薦故事 */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.03)] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50 text-xs">
              <h4 className="font-serif font-bold text-[#4E4158] flex items-center gap-1.5">
                <span>✦</span> 本週推薦故事
              </h4>
              <span className="text-[9px] text-[#9A8AA6] cursor-pointer hover:text-[#7C5B8C] font-semibold">查看更多 ➜</span>
            </div>

            {/* Night Sky Graphic Post */}
            <div 
              onClick={() => scrollToSection('character-chapters', 'chapters')}
              className="group cursor-pointer bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#431407] text-white rounded-2xl overflow-hidden shadow-xs relative flex flex-col justify-end p-4 min-h-[140px] border border-purple-500/10"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.3),transparent_70%)]"></div>
              {/* Star constellation map vector */}
              <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15%" cy="20%" r="1" fill="white" />
                <circle cx="35%" cy="15%" r="0.8" fill="white" />
                <circle cx="70%" cy="30%" r="1.2" fill="white" />
                <circle cx="85%" cy="10%" r="1" fill="white" />
                <circle cx="50%" cy="40%" r="1" fill="white" />
                <line x1="15%" y1="20%" x2="35%" y2="15%" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                <line x1="35%" y1="15%" x2="50%" y2="40%" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                <line x1="50%" y1="40%" x2="70%" y2="30%" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              </svg>
              <div className="absolute top-3.5 right-4 text-xl filter drop-shadow-[0_0_6px_rgba(253,224,71,0.4)]">🌙</div>
              
              <div className="relative z-10">
                <span className="text-[8px] font-sans font-bold bg-white/20 px-2.5 py-0.5 rounded-md backdrop-blur-xs text-white border border-white/5">
                  精選短章
                </span>
                <h5 className="font-serif text-[11px] md:text-xs font-bold mt-2 text-white tracking-wide">夜裡的星光，那段前行的路</h5>
                <p className="text-[9px] text-purple-200/90 leading-tight mt-0.5">關於勇氣與陪伴的溫暖故事</p>
                
                <div className="flex justify-between items-center text-[8px] text-purple-300 mt-2 border-t border-white/10 pt-2">
                  <span className="font-sans font-medium">艾飛樂語錄推薦</span>
                  <span className="flex items-center gap-0.5 text-rose-300 font-sans font-bold">
                    <Heart className="w-2.5 h-2.5 fill-rose-300" /> 2.4K
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 3: Ivy 的創作筆記 (Handwritten styled notebook with binder coil) */}
          <div className="bg-[#FAF5EF]/95 border border-[#E1D1C1]/60 rounded-3xl p-5 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.03)] relative overflow-hidden flex flex-col justify-between min-h-[190px]">
            {/* Binder ring slots left side */}
            <div className="absolute left-2.5 inset-y-4 flex flex-col justify-between w-1.5 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 bg-zinc-400/50 rounded-full border border-zinc-300 shadow-2xs"></div>
              ))}
            </div>

            {/* Binder loop lines connecting left paper */}
            <div className="absolute left-0 inset-y-4 flex flex-col justify-between w-3.5 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <svg key={i} className="w-3.5 h-2.5" viewBox="0 0 14 10" fill="none">
                  <path d="M0 5 Q7 0, 14 5" stroke="#9E9E9E" strokeWidth="1.2" />
                </svg>
              ))}
            </div>

            {/* Content area padded to avoid binder coils */}
            <div className="pl-6 pt-1 flex flex-col justify-between h-full relative z-10 font-serif">
              <div className="flex justify-between items-center text-[10px] text-[#9A8AA6] border-b border-[#E1D1C1]/60 pb-1.5 font-bold">
                <span>Ivy 的創作筆記</span>
                <span 
                  onClick={() => scrollToSection('creative-notes-sec', 'creative-notes')}
                  className="text-[9px] cursor-pointer hover:text-purple-900"
                >
                  查看更多 ➜
                </span>
              </div>
              
              <div className="mt-4 text-[11px] text-[#4E4158]/95 leading-relaxed space-y-2 font-bold italic pr-1">
                <p>「有時候，一個角色的誕生，</p>
                <p>是因為我們心底的某個自己。</p>
                <p>小艾與小思，是我與你們的對話，</p>
                <p>也是我送給世界的溫柔。」</p>
              </div>

              <div className="flex justify-between items-center mt-5 pt-2 border-t border-[#E1D1C1]/20">
                <span className="text-[9px] text-[#9A8AA6] font-semibold">— 艾比 / Ivy</span>
                
                {/* Micro pen vector image */}
                <svg className="w-12 h-6 rotate-[-15deg] opacity-70" viewBox="0 0 50 20" fill="none">
                  <path d="M5 10 L45 10" stroke="#7C5B8C" strokeWidth="1" strokeLinecap="round" />
                  <path d="M40 7 L45 10 L40 13 Z" fill="#7C5B8C" />
                  <circle cx="15" cy="10" r="1.5" fill="#C5A880" />
                </svg>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Chapter Reader Dialog Popup Modal */}
      <AnimatePresence>
        {activeChapter && currentChapterData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-purple-950/20 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-[#7C5B8C]/12 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 relative font-serif"
            >
              <div className="flex items-center justify-between border-b border-purple-50 pb-3 mb-4">
                <span className="text-xs text-[#7C5B8C] font-mono tracking-wider font-bold">Chapter 0{currentChapterData.num} 📚</span>
                <button
                  id="close-reader"
                  onClick={() => setActiveChapter(null)}
                  className="w-7 h-7 rounded-full bg-[#FAF7F2] hover:bg-purple-50 text-[#4E4158]/70 hover:text-black flex items-center justify-center transition-colors shadow-xs cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="text-center pb-2">
                <h3 className="text-base font-bold text-[#4E4158]">{currentChapterData.title}</h3>
                <span className="text-[10px] text-[#9A8AA6] italic font-sans block mt-1">{currentChapterData.desc}</span>
              </div>

              {/* Story content */}
              <div className="my-5 p-5 bg-[#FAF7F2]/40 rounded-2xl border border-purple-100/20 max-h-56 overflow-y-auto leading-relaxed text-xs text-[#4E4158] font-sans space-y-3">
                <p>{currentChapterData.content}</p>
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] text-[#9A8AA6] font-sans">
                <span>🎐 艾飛樂語錄生命故事館</span>
                <span className="text-rose-500 font-bold">溫柔陪伴中 ➜</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
