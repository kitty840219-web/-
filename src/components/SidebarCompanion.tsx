import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Trees, Sparkles, HelpCircle, Compass, ChevronRight, Droplet } from 'lucide-react';
import { Companion } from '../types';
import { IMAGES } from '../assets/images';
import { safeStorage } from '../utils/storage';

interface SidebarCompanionProps {
  onSelectCharacter: (name: string) => void;
  activeCharacter: string;
  activeTab: string;
  onChatOpenChange?: (isOpen: boolean) => void;
}

export const companionsList: Companion[] = [
  {
    name: '小艾',
    role: '溫柔勇敢的小女孩',
    avatar: IMAGES.avatarXiaoi,
    description: '相信善良與分享，用心感受世界的美好。',
    avatarColor: 'bg-[#FDF4F5] border-rose-200/40',
    watercolorBg: 'from-rose-50/70 to-purple-50/60',
    traits: ['溫柔', '傾聽', '共感']
  },
  {
    name: '小思',
    role: '好奇善良的小男孩',
    avatar: IMAGES.avatarXiaosi,
    description: '喜歡提問與觀察，用思考探索每個答案。',
    avatarColor: 'bg-[#EEF1FB] border-indigo-200/40',
    watercolorBg: 'from-indigo-50/70 to-purple-50/60',
    traits: ['思考', '觀察', '細膩']
  },
  {
    name: '艾比 / Ivy',
    role: '品牌創辦人',
    avatar: IMAGES.avatarIvy,
    description: '相信文字的力量，陪你在日常中找到微光。',
    avatarColor: 'bg-[#FAF4ED] border-amber-200/40',
    watercolorBg: 'from-amber-50/70 to-orange-50/60',
    traits: ['創作', '陪伴', '療癒']
  },
  {
    name: '思野',
    role: '故事陪伴者',
    avatar: IMAGES.avatarSiye,
    description: '用安靜與理解，陪你一起思考與成長。',
    avatarColor: 'bg-[#EAF5ED] border-emerald-200/40',
    watercolorBg: 'from-emerald-50/70 to-teal-50/60',
    traits: ['理性', '支持', '堅定']
  }
];

// 5 Beautiful unique interactive actions and matched animated dialogue quotes per character
const CHARACTER_ACTIONS: Record<string, { emoji: string; name: string; dialogue: string }[]> = {
  '小艾': [
    { emoji: '🌸', name: '送你花花', dialogue: '「送你一朵水漾薰衣草，聞一聞清草香，把今天疲憊的心情放鬆下來吧！」' },
    { emoji: '🍵', name: '溫柔泡茶', dialogue: '「我為你泡了熱烘烘的洋甘菊茶喔，我們一邊慢慢喝，一邊聽聽窗外微風吹過的協奏曲。」' },
    { emoji: '💖', name: '暖心擁抱', dialogue: '「抱抱你！你今天真的已經做得很棒、很努力了。不完美也沒關係的。」' },
    { emoji: '🎵', name: '閉眼聽風', dialogue: '「閉上眼睛放空，聽風穿過山林花草。這就是大自然給我們最溫柔的輕聲安慰。」' },
    { emoji: '💤', name: '樹洞傾聽', dialogue: '「累了的話就靠在我肩膀上吧。不論你有什麼心事或委屈，我都一直在這裡喔。」' },
  ],
  '小思': [
    { emoji: '📚', name: '深度思索', dialogue: '「思考雖然有時會感到有些迷惘，但正是這些不確定性，組成了我們獨一無二的生命拼圖。」' },
    { emoji: '💭', name: '放空發呆', dialogue: '「偶爾發呆不是停滯喔。那是靈魂在給自己做一次最體貼、最輕柔的深呼吸大掃除。」' },
    { emoji: '🔭', name: '仰望星光', dialogue: '「你看那一顆閃爍的小白星，就像我們心底最堅實的信念。世界再黑，微光依然存在。」' },
    { emoji: '📝', name: '整理筆記', dialogue: '「把繁雜的思緒記在泛黃的紙上，像把落葉揉進泥土。寫完後，心情是不是變輕了？」' },
    { emoji: '🍎', name: '好奇提問', dialogue: '「今天的你，有發現什麼生活中的神奇小驚奇嗎？我很想聽你興致勃勃地說說看！」' },
  ],
  '艾比': [
    { emoji: '🖊️', name: '揮毫寫作', dialogue: '「手握著筆尖，寫下帶有微光的文字與暖心故事。每一個筆劃，都是我們對溫柔陪伴的實踐。」' },
    { emoji: '🎨', name: '揮灑畫筆', dialogue: '「把那些說不出口的沉悶與脆弱，調配成水彩畫。你看，渲染開來的斑斕色彩也很有美感吧。」' },
    { emoji: '🌾', name: '收集花露', dialogue: '「清晨在薰衣草花田採集的甘露與芬芳，這就是我們生命中悄悄積攢的溫馨養分。」' },
    { emoji: '🌟', name: '傳遞微光', dialogue: '「文字和故事是具有治癒力量的，能讓在黑夜裡不知所措的旅人，重新找到希望的亮光。」' },
    { emoji: '🍰', name: '手作烘焙', dialogue: '「剛烤好的熱司康與藍莓塔！吃口甜甜的，讓心靈的小角落也跟著亮堂起來。」' },
  ],
  '思野': [
    { emoji: '🧘', name: '深呼吸禪修', dialogue: '「吸氣，感受大地的溫厚與穩固；呼氣，放開多餘的執念。你本身就擁有一切生長的力量。」' },
    { emoji: '🪵', name: '圍爐取暖', dialogue: '「夜冷了，在溫暖的爐火旁坐下吧。聽乾柴燃燒劈啪作響，感受這份靈魂深處的安詳。」' },
    { emoji: '🍂', name: '打掃心房', dialogue: '「就像清掃林間小徑的落葉一樣，慢慢掃清腦袋裡的雜思。心寬了，生機自然就來了。」' },
    { emoji: '🧉', name: '靜心品茗', dialogue: '「不急，不躁。人生如這杯茶，先苦澀而後甘甜。聽聽林間鳥鳴，歲月自會給你最自洽的答案。」' },
    { emoji: '🦉', name: '默默守護', dialogue: '「去勇敢冒險吧，孩子。即使前方身體在微微顫抖，回頭看，我的松果與庇護永遠等候著你。」' },
  ]
};

const getCharacterKey = (name: string): string => {
  if (name.includes('小艾')) return '小艾';
  if (name.includes('小思')) return '小思';
  if (name.includes('艾比') || name.includes('Ivy')) return '艾比';
  if (name.includes('思野')) return '思野';
  return '小艾';
};

export default function SidebarCompanion({ onSelectCharacter, activeCharacter, activeTab, onChatOpenChange }: SidebarCompanionProps) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_companion_favs');
      return saved ? JSON.parse(saved) : ['小艾'];
    } catch {
      return ['小艾'];
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (onChatOpenChange) {
      onChatOpenChange(isChatOpen);
    }
  }, [isChatOpen, onChatOpenChange]);

  const [chatCharacter, setChatCharacter] = useState<Companion | null>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'companion'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom states for interactive widgets
  const [gardenWatered, setGardenWatered] = useState(0);
  const [waterEnergy, setWaterEnergy] = useState(45);

  // States for active actions, avatars wiggle/bounce animations, and micro floating particles
  const [actionIndexes, setActionIndexes] = useState<Record<string, number>>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_companion_action_idxs');
      return saved ? JSON.parse(saved) : { '小艾': 0, '小思': 0, '艾比': 0, '思野': 0 };
    } catch {
      return { '小艾': 0, '小思': 0, '艾比': 0, '思野': 0 };
    }
  });

  const [avatarAnimStates, setAvatarAnimStates] = useState<Record<string, any>>({});
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number; char: string; emoji: string }[]>([]);

  useEffect(() => {
    if (floatingHearts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => Date.now() - h.id < 1200));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [floatingHearts]);

  // Gentle synthesizer sound effect on click/interaction via Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // ignore silently
    }
  };

  const triggerCharacterAnimation = (name: string, type: 'bounce' | 'wobble' | 'spin' = 'bounce') => {
    playChime();
    
    let animState = {};
    if (type === 'bounce') {
      animState = {
        scale: [1, 1.25, 0.8, 1.15, 0.95, 1],
        y: [0, -15, 3, -2, 0],
      };
    } else if (type === 'wobble') {
      animState = {
        rotate: [0, -14, 12, -8, 5, 0],
        scale: [1, 1.12, 0.96, 1.05, 1],
      };
    } else {
      animState = {
        rotate: [0, 360],
        scale: [1, 1.18, 1],
      };
    }
    
    setAvatarAnimStates(prev => ({ ...prev, [name]: animState }));
    
    const key = getCharacterKey(name);
    const actions = CHARACTER_ACTIONS[key] || CHARACTER_ACTIONS['小艾'];
    const idx = actionIndexes[key] || 0;
    const currentAct = actions[idx];
    const floatingEmoji = currentAct ? currentAct.emoji : '🌸';
    
    const newHearts = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i * 1000 + Math.random() * 500,
      x: (Math.random() - 0.5) * 60,
      y: -50 - Math.random() * 60,
      char: name,
      emoji: i === 0 ? floatingEmoji : ['💖', '✨', '🌟', '🎈'][Math.floor(Math.random() * 4)]
    }));
    
    setFloatingHearts(prev => [...prev, ...newHearts]);
  };

  const handleNextAction = (name: string) => {
    const key = getCharacterKey(name);
    const actions = CHARACTER_ACTIONS[key] || CHARACTER_ACTIONS['小艾'];
    const newIdx = ((actionIndexes[key] || 0) + 1) % actions.length;
    
    const updated = { ...actionIndexes, [key]: newIdx };
    setActionIndexes(updated);
    try {
      safeStorage.setItem('aifeiler_companion_action_idxs', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    
    triggerCharacterAnimation(name, 'spin');
  };

  const handleInteract = (name: string) => {
    triggerCharacterAnimation(name, 'wobble');
  };

  const toggleFavorite = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(name)) {
      updated = favorites.filter((f) => f !== name);
    } else {
      updated = [...favorites, name];
    }
    setFavorites(updated);
    safeStorage.setItem('aifeiler_companion_favs', JSON.stringify(updated));
  };

  const startChat = (companion: Companion, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatCharacter(companion);
    setChatHistory([]);
    setIsChatOpen(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || !chatCharacter) return;

    const userMsg = message;
    setMessage('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, character: chatCharacter.name.split(' ')[0] })
      });
      const data = await response.json();
      setChatHistory((prev) => [...prev, { sender: 'companion', text: data.text }]);
    } catch (err) {
      console.error('Error talking to companion:', err);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'companion',
          text: `對不起，我的思緒稍微飄遠了...但我想對你說：沒關係的，深呼吸一下，我一直都在這。`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 陪伴角色卡 Panel */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)] flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#7C5B8C]/8">
          <Heart className="w-4 h-4 text-[#7C5B8C] fill-[#7C5B8C]/30" />
          <h3 className="font-serif text-base font-semibold text-[#4E4158] tracking-wide">陪伴角色卡</h3>
        </div>

        <div className="flex flex-col gap-3">
          {companionsList.map((comp) => {
            const isActive = activeCharacter === comp.name || (comp.name.startsWith('艾比') && activeCharacter.startsWith('艾比'));
            const isLiked = favorites.includes(comp.name);
            const key = getCharacterKey(comp.name);
            const actions = CHARACTER_ACTIONS[key] || CHARACTER_ACTIONS['小艾'];
            const activeActionIdx = actionIndexes[key] || 0;
            const currentAction = actions[activeActionIdx];

            return (
              <div
                key={comp.name}
                onClick={() => {
                  onSelectCharacter(comp.name);
                  triggerCharacterAnimation(comp.name, 'bounce');
                }}
                className={`group p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col gap-3.5 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#FAF5EF]/95 to-[#FAF6F0]/85 border-[#7C5B8C]/40 shadow-[0_8px_25px_-5px_rgba(124,91,140,0.08)] scale-[1.01]'
                    : 'bg-white/40 hover:bg-white/70 border-purple-100/30'
                }`}
              >
                {/* Upper card core block */}
                <div className="flex gap-3">
                  {/* Character avatar with custom floating animations & particles on click */}
                  <div className="relative shrink-0">
                    {/* Floating mini heart/emoji particles */}
                    <AnimatePresence>
                      {floatingHearts
                        .filter((h) => h.char === comp.name)
                        .map((h) => (
                          <motion.span
                            key={h.id}
                            initial={{ opacity: 1, scale: 0.6, x: 0, y: 0 }}
                            animate={{ opacity: 0, scale: 1.4, x: h.x, y: h.y }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="absolute z-30 pointer-events-none text-base select-none"
                          >
                            {h.emoji}
                          </motion.span>
                        ))}
                    </AnimatePresence>
                    
                    <motion.div
                      animate={avatarAnimStates[comp.name] || { scale: 1, y: 0, rotate: 0 }}
                      transition={
                        avatarAnimStates[comp.name] && Object.values(avatarAnimStates[comp.name]).some(Array.isArray)
                          ? { duration: 0.6, ease: 'easeInOut' }
                          : { type: 'spring', stiffness: 350, damping: 11 }
                      }
                      className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-sm border ${comp.avatarColor}`}
                    >
                      {comp.avatar.includes('/') || comp.avatar.includes('.') ? (
                        <img src={comp.avatar} alt={comp.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-2xl">{comp.avatar}</span>
                      )}
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#4E4158]">{comp.name}</span>
                      <span className="text-[10px] text-[#9A8AA6] font-medium tracking-wide">
                        {comp.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4E4158]/80 leading-relaxed mt-1 font-sans line-clamp-2">
                      {comp.description}
                    </p>
                  </div>

                  {/* Right side floating buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
                    <button
                      id={`fav-btn-${comp.name}`}
                      onClick={(e) => toggleFavorite(comp.name, e)}
                      className={`p-1.5 rounded-full transition-all ${
                        isLiked ? 'text-rose-500 hover:text-rose-600' : 'text-purple-300 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </button>
                    <button
                      id={`chat-trigger-${comp.name}`}
                      onClick={(e) => startChat(comp, e)}
                      className="p-1.5 rounded-full text-purple-400 hover:text-[#7C5B8C] transition-all bg-purple-50/30 hover:bg-purple-50"
                      title="對話聊聊"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Interactive Actions Area when Companion Card is Selected */}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="pt-3 border-t border-[#7C5B8C]/10 flex flex-col gap-3"
                  >
                    {/* Watercolor styled dynamic action description box */}
                    <div className="flex items-start gap-2.5 bg-white/70 p-3 rounded-2xl border border-purple-100/40 shadow-3xs">
                      <span className="text-2xl animate-bounce shrink-0" style={{ animationDuration: '2.5s' }}>
                        {currentAction.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold text-[#7C5B8C] bg-purple-50/80 px-2.5 py-0.5 rounded-full border border-purple-100/50">
                            狀態 ∙ {currentAction.name}
                          </span>
                          <span className="text-[9px] text-[#9A8AA6] font-semibold animate-pulse">
                            點擊觸發動畫
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4E4158] mt-2 font-serif italic leading-relaxed pl-1">
                          {currentAction.dialogue}
                        </p>
                      </div>
                    </div>

                    {/* Interactive play buttons */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextAction(comp.name);
                        }}
                        className="flex-1 text-[10px] text-[#7C5B8C] hover:text-white bg-white hover:bg-[#7C5B8C] border border-[#7C5B8C]/25 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 font-bold transition-all duration-300 cursor-pointer shadow-3xs hover:shadow-2xs active:scale-[0.98]"
                        title="切換到下一種動作姿態"
                      >
                        <span>🔄 切換動作</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInteract(comp.name);
                        }}
                        className="flex-1 text-[10px] text-rose-600 hover:text-white bg-white hover:bg-rose-500 border border-rose-200 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 font-bold transition-all duration-300 cursor-pointer shadow-3xs hover:shadow-2xs active:scale-[0.98]"
                        title="給予溫柔的摸摸頭互動"
                      >
                        <span>👋 摸摸頭</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. If on 語錄地圖: 艾飛樂的小花園 */}
      {activeTab === 'quote-map' && (
        <div className="bg-gradient-to-br from-[#FDF4F5]/70 to-[#FAF6F0]/80 rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)] flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-rose-200/20 rounded-full blur-2xl"></div>
          <div>
            <h4 className="font-serif text-xs font-bold text-[#4E4158] flex items-center gap-1.5">
              <span>🏡</span> 艾飛樂的小花園
            </h4>
            <p className="text-[10px] text-[#9A8AA6] font-sans mt-1 leading-relaxed">
              澆灌心田的小練習，為心靈花朵灌溉水分。
            </p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-purple-100/30 flex flex-col items-center gap-3">
            {/* Flower State illustration */}
            <div className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>
              {gardenWatered === 0 && '🌱'}
              {gardenWatered === 1 && '🌿'}
              {gardenWatered === 2 && '🌸'}
              {gardenWatered >= 3 && '💐'}
            </div>
            
            <div className="w-full">
              <div className="flex justify-between text-[10px] text-[#4E4158] mb-1 font-mono">
                <span>療癒能量:</span>
                <span>{waterEnergy}%</span>
              </div>
              <div className="w-full bg-[#FAF7F2] rounded-full h-2 overflow-hidden border border-purple-100/20">
                <div
                  className="bg-gradient-to-r from-purple-400 to-rose-400 h-full transition-all duration-500"
                  style={{ width: `${waterEnergy}%` }}
                />
              </div>
            </div>

            <button
              id="water-garden-btn"
              onClick={() => {
                setGardenWatered(prev => prev + 1);
                setWaterEnergy(prev => Math.min(100, prev + 15));
              }}
              className="w-full bg-white hover:bg-purple-50 text-purple-700 border border-purple-100 shadow-xs py-2 px-3 rounded-xl transition-all duration-300 text-xs font-serif flex items-center justify-center gap-1"
            >
              <Droplet className="w-3.5 h-3.5 text-blue-400 fill-blue-300" />
              澆灌一滴溫柔
            </button>
          </div>
        </div>
      )}

      {/* 3. If on 思辨實驗: 我的陪伴軌跡 */}
      {activeTab === 'divination' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)] flex flex-col gap-3">
          <h4 className="font-serif text-xs font-bold text-[#4E4158] flex items-center gap-1.5 pb-2 border-b border-purple-50">
            <span>✨</span> 我的陪伴軌跡
          </h4>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#FAF7F2]/60 p-3 rounded-xl border border-purple-50/30">
              <div className="text-lg font-serif font-bold text-[#7C5B8C]">86 天</div>
              <div className="text-[9px] text-[#9A8AA6] mt-0.5">探索天數</div>
            </div>
            <div className="bg-[#FAF7F2]/60 p-3 rounded-xl border border-purple-50/30">
              <div className="text-lg font-serif font-bold text-[#7C5B8C]">23 個</div>
              <div className="text-[9px] text-[#9A8AA6] mt-0.5">完成實驗</div>
            </div>
            <div className="bg-[#FAF7F2]/60 p-3 rounded-xl border border-purple-50/30">
              <div className="text-lg font-serif font-bold text-[#7C5B8C]">18.6 小時</div>
              <div className="text-[9px] text-[#9A8AA6] mt-0.5">思辨時光</div>
            </div>
            <div className="bg-[#FAF7F2]/60 p-3 rounded-xl border border-purple-50/30">
              <div className="text-lg font-serif font-bold text-[#7C5B8C]">12 枚</div>
              <div className="text-[9px] text-[#9A8AA6] mt-0.5">解鎖章數</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. If on 成長表單: 快速建立表單 */}
      {activeTab === 'woop' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)] flex flex-col gap-2.5">
          <h4 className="font-serif text-xs font-bold text-[#4E4158] flex items-center gap-1.5 pb-1 border-b border-purple-50">
            <span>📝</span> 快速建立表單
          </h4>
          <div className="flex flex-col gap-1.5 text-xs text-[#4E4158]/80 font-sans">
            <button className="text-left py-2 px-3 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-between">
              <span>😊 今日心情溫度計</span>
              <ChevronRight className="w-3 h-3 text-purple-300" />
            </button>
            <button className="text-left py-2 px-3 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-between">
              <span>📊 本週成長紀錄</span>
              <ChevronRight className="w-3 h-3 text-purple-300" />
            </button>
            <button className="text-left py-2 px-3 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-between">
              <span>🎯 WOOP 計畫</span>
              <ChevronRight className="w-3 h-3 text-purple-300" />
            </button>
            <button className="text-left py-2 px-3 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-between">
              <span>💌 想對自己說的話</span>
              <ChevronRight className="w-3 h-3 text-purple-300" />
            </button>
          </div>
        </div>
      )}

      {/* CHAT INTERACTIVE OVERLAY */}
      <AnimatePresence>
        {isChatOpen && chatCharacter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-purple-950/20 backdrop-blur-xs z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-[#7C5B8C]/12 rounded-3xl w-full max-w-lg h-[500px] shadow-2xl flex flex-col overflow-hidden relative font-sans"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${chatCharacter.watercolorBg} p-4 border-b border-purple-100/40 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-sm border shrink-0 ${chatCharacter.avatarColor}`}>
                    {chatCharacter.avatar.includes('/') || chatCharacter.avatar.includes('.') ? (
                      <img src={chatCharacter.avatar} alt={chatCharacter.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-2xl">{chatCharacter.avatar}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#4E4158] flex items-center gap-1.5">
                      {chatCharacter.name}
                      <span className="text-[10px] text-purple-600 font-normal bg-white/75 px-1.5 py-0.5 rounded-md border border-purple-100">
                        {chatCharacter.role}
                      </span>
                    </h4>
                    <p className="text-[10px] text-[#9A8AA6] flex items-center gap-1">
                      正在用心地圖傾聽你的每一句話...
                    </p>
                  </div>
                </div>
                <button
                  id="close-chat"
                  onClick={() => setIsChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#4E4158]/60 hover:text-[#4E4158] transition-colors flex items-center justify-center border border-purple-100 shadow-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Chat log */}
              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-purple-50/10 to-white flex flex-col gap-3">
                {chatHistory.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#9A8AA6]">
                    <span className="text-3xl mb-2">🎐</span>
                    <p className="font-serif text-sm">「你好，我是{chatCharacter.name}。」</p>
                    <p className="text-[11px] mt-1 text-[#9A8AA6]/80 max-w-xs leading-relaxed">
                      有沒有什麼心事想和我分享？不論是今天的小喜悅，還是有些疲憊的感受，我都一直在這裡陪伴你。
                    </p>
                  </div>
                ) : (
                  chatHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                          chat.sender === 'user'
                            ? 'bg-[#7C5B8C] text-white rounded-tr-none'
                            : 'bg-[#FAF7F2] text-[#4E4158] rounded-tl-none border border-purple-100/30'
                        }`}
                      >
                        {chat.text}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#FAF7F2] border border-purple-100/30 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5 text-[#9A8AA6] shadow-sm">
                      <span className="text-[10px]">正在溫柔地聆聽思索中</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-[#7C5B8C] rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-[#7C5B8C] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 bg-[#7C5B8C] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#7C5B8C]/8 bg-white flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`寫下想和 ${chatCharacter.name} 說的話...`}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-purple-100/60 px-3.5 py-2 text-xs focus:outline-none focus:border-[#7C5B8C] bg-purple-50/10"
                />
                <button
                  id="send-chat"
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white px-3.5 rounded-xl transition-all shadow-xs text-xs font-medium cursor-pointer"
                >
                  發送
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
