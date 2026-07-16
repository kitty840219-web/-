import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sprout, Droplets, Sun, Scissors, Heart, RefreshCw, BookOpen, ArrowLeft } from 'lucide-react';

interface MindGardenProps {
  activeCharacter: string;
}

interface PlantState {
  seedType: 'gentle' | 'wisdom' | 'courage' | 'explore';
  growth: number; // 0 to 100
  water: number;
  sunlight: number;
  prune: number;
  love: number;
  actionsCount: number;
  stage: 'seed' | 'sprout' | 'bud' | 'bloom';
}

export default function MindGarden({ activeCharacter }: MindGardenProps) {
  const [plant, setPlant] = useState<PlantState>({
    seedType: 'gentle',
    growth: 0,
    water: 10,
    sunlight: 10,
    prune: 10,
    love: 10,
    actionsCount: 0,
    stage: 'seed',
  });

  const [isPlanted, setIsPlanted] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<{ analysis: string; prompt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; type: string }[]>([]);

  // Sound synthesis using Web Audio API
  const playChime = (type: 'water' | 'sun' | 'prune' | 'love' | 'bloom' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'water') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      } else if (type === 'sun') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      } else if (type === 'prune') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      } else if (type === 'love') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      } else if (type === 'bloom') {
        // Arpeggio
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        freqs.forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
          g.gain.setValueAtTime(0.02, ctx.currentTime + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.08);
          o.stop(ctx.currentTime + i * 0.08 + 0.3);
        });
        return;
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      }
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // support fallback quietly
    }
  };

  const seedConfig = {
    gentle: {
      name: '溫柔之種',
      flower: '薰衣草粉紫花朵',
      desc: '帶有淡淡的慈愛與包容，在安靜中釋放溫柔。',
      color: '#7C5B8C',
      accentColor: '#F3ECF8',
      bgGradient: 'from-[#FAF7F2] to-[#F3ECF8]'
    },
    wisdom: {
      name: '智慧之種',
      flower: '忘憂草淺藍花卉',
      desc: '追求清澈明理的心靈深度，開出寧靜的智慧之光。',
      color: '#4B6B94',
      accentColor: '#EBF2FA',
      bgGradient: 'from-[#FAF7F2] to-[#EBF2FA]'
    },
    courage: {
      name: '勇氣之種',
      flower: '金盞橘黃向日葵',
      desc: '堅定、溫暖、開朗、帶著挑戰未知的前行活力。',
      color: '#D97706',
      accentColor: '#FEF3C7',
      bgGradient: 'from-[#FAF7F2] to-[#FEF3C7]'
    },
    explore: {
      name: '探索之種',
      flower: '絢麗緋紅玫瑰蘭',
      desc: '擁抱生命的多樣性與好奇，開出絢爛自由的心靈繁花。',
      color: '#B45309',
      accentColor: '#FDF2F8',
      bgGradient: 'from-[#FAF7F2] to-[#FCE7F3]'
    }
  };

  const currentSeed = seedConfig[plant.seedType];

  const handlePlantSeed = (type: 'gentle' | 'wisdom' | 'courage' | 'explore') => {
    playChime('click');
    setPlant({
      seedType: type,
      growth: 5,
      water: 15,
      sunlight: 15,
      prune: 15,
      love: 15,
      actionsCount: 0,
      stage: 'seed',
    });
    setIsPlanted(true);
    setEvalResult(null);
  };

  const triggerParticles = (type: string) => {
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40, // percentage in container
      y: 15 + Math.random() * 30,
      type
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  // cleanup particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  const handleAction = (action: 'water' | 'sun' | 'prune' | 'love') => {
    if (plant.growth >= 100) return;
    
    playChime(action);
    setActiveAction(action);
    triggerParticles(action);
    
    setTimeout(() => setActiveAction(null), 500);

    setPlant(prev => {
      const updatedWater = prev.water + (action === 'water' ? 15 : -3);
      const updatedSun = prev.sunlight + (action === 'sun' ? 15 : -3);
      const updatedPrune = prev.prune + (action === 'prune' ? 15 : -3);
      const updatedLove = prev.love + (action === 'love' ? 15 : -3);
      
      const step = 15; // growth increase per action
      const newGrowth = Math.min(100, prev.growth + step);
      const actionsCount = prev.actionsCount + 1;

      let stage: 'seed' | 'sprout' | 'bud' | 'bloom' = 'seed';
      if (newGrowth >= 100) {
        stage = 'bloom';
        playChime('bloom');
      } else if (newGrowth >= 70) {
        stage = 'bud';
      } else if (newGrowth >= 35) {
        stage = 'sprout';
      }

      return {
        ...prev,
        water: Math.max(0, Math.min(100, updatedWater)),
        sunlight: Math.max(0, Math.min(100, updatedSun)),
        prune: Math.max(0, Math.min(100, updatedPrune)),
        love: Math.max(0, Math.min(100, updatedLove)),
        growth: newGrowth,
        actionsCount,
        stage,
      };
    });
  };

  const handleEvaluate = async () => {
    playChime('click');
    setLoading(true);
    try {
      const res = await fetch('/api/garden/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedType: plant.seedType,
          water: plant.water,
          sunlight: plant.sunlight,
          prune: plant.prune,
          love: plant.love,
          actionsCount: plant.actionsCount,
          activeCharacter,
        })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setEvalResult(data);
    } catch (err) {
      // Local fallback for evaluation if API fails or isn't loaded
      const characterName = activeCharacter || '小艾';
      const presetsFallback = {
        gentle: {
          analysis: `【薰衣草粉紫花語】你悉心灌溉的「溫柔之種」已經璀璨綻放了！看那柔美的水彩紫瓣，散發著寧靜的愛意。你的心靈水份達到 ${plant.water}%、陽光 ${plant.sunlight}%。這代表你是一個極度細膩、體貼的靈魂，你懂得用無聲的擁抱，撫平周遭朋友內心的皺褶。`,
          prompt: `「今天，對鏡子裡的自己展現最溫柔的微笑。你最想对自己說一句什麼溫馨的感謝呢？」`
        },
        wisdom: {
          analysis: `【忘憂草淺藍花語】寧靜的智慧花朵盛開了！在你的澆灌（${plant.water}%）與日光照耀（${plant.sunlight}%）下，這株心靈之花展現出明亮、深邃的質感。這象徵著你在此刻擁有一顆澄澈、能靜心思考的心靈。你不被情緒迷霧所困，正慢慢尋找自我的內在定力。`,
          prompt: `「閉上雙眼，寫下最近在你的思緒中最澄澈、最想守護的一道真理。」`
        },
        courage: {
          analysis: `【金盞橘黃向日葵花語】看呀！那帶給周圍滿滿熱情與前行力量的向日葵傲然挺立！你在生命中所展現的勇氣（${plant.sunlight}%）與修剪雜念的決心（${plant.prune}%）賦予了這株花朵最絢爛的朝氣。不要害怕顫抖，你已經長出了無懼風雨的根莖。`,
          prompt: `「此時此刻，回想一件你需要跨出一小步的事，你準備好帶著微笑前進了嗎？」`
        },
        explore: {
          analysis: `【緋紅玫瑰蘭花語】生命探索的繽紛花瓣燦爛而熱烈地展開了！高達 ${plant.growth}% 的成長度凝聚了你對這世界的無盡好奇心。這朵花帶著狂野與自由的靈性，代表你拒絕被單一的角色框架綁架，正大步走向充滿色彩的多樣性生命軌道。`,
          prompt: `「想像一張世界地圖，你最想帶著你那不滅的好奇心去探尋哪一片溫柔未知的領域？」`
        }
      };
      
      setEvalResult(presetsFallback[plant.seedType]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    playChime('click');
    setIsPlanted(false);
    setEvalResult(null);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
      
      {/* LEFT PORTION: Garden Canvas & Interactions */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {!isPlanted ? (
          <div className="bg-white/90 rounded-3xl p-6 md:p-8 border border-purple-100/40 shadow-xs flex flex-col gap-6">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-[#FAF5EF] rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm border border-orange-100">
                🌱
              </div>
              <h3 className="font-serif font-extrabold text-[#4E4158] text-base md:text-xl mt-4">
                歡迎來到「心靈種植小花園」
              </h3>
              <p className="text-xs text-[#9A8AA6] leading-relaxed mt-2">
                「在文字中漫步，在心靈的花園裡種下一朵溫柔。」<br />
                請選擇一顆象徵你當下內心想望的「種子」，細心灌溉、給予光芒與陪伴，看見靈魂綻放的模樣。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(seedConfig) as ('gentle' | 'wisdom' | 'courage' | 'explore')[]).map((type) => {
                const cfg = seedConfig[type];
                return (
                  <div
                    key={type}
                    onClick={() => handlePlantSeed(type)}
                    className="bg-white/80 hover:bg-white border border-purple-100/30 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer group flex gap-3.5 items-start"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {type === 'gentle' && '💜'}
                      {type === 'wisdom' && '💙'}
                      {type === 'courage' && '🧡'}
                      {type === 'explore' && '💖'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#4E4158] flex items-center gap-1.5">
                        {cfg.name}
                        <span className="text-[8px] bg-purple-50 text-[#7C5B8C] px-1.5 py-0.5 rounded">
                          {cfg.flower}
                        </span>
                      </h4>
                      <p className="text-[10px] text-[#9A8AA6] mt-1 leading-relaxed">
                        {cfg.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/90 rounded-3xl p-6 border border-purple-100/40 shadow-xs flex flex-col gap-6">
            
            {/* Header of Active Garden */}
            <div className="flex items-center justify-between border-b border-purple-50 pb-3">
              <button
                onClick={handleRestart}
                className="text-[#9A8AA6] hover:text-[#4E4158] transition-colors text-[10px] flex items-center gap-1 cursor-pointer font-bold font-serif"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                重新挑選種子
              </button>

              <div className="text-right">
                <span className="text-[9px] text-[#9A8AA6] font-mono uppercase tracking-widest block">Intention 意念</span>
                <span className="font-serif font-extrabold text-xs text-[#7C5B8C]">{currentSeed.name} · {currentSeed.flower}</span>
              </div>
            </div>

            {/* Main Interactive Stage */}
            <div className={`w-full aspect-video min-h-[300px] bg-gradient-to-b ${currentSeed.bgGradient} rounded-2xl border border-purple-100/20 shadow-inner relative overflow-hidden flex flex-col items-center justify-center p-6`}>
              
              {/* Particle effects for active actions */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 1, scale: 0.5, x: `${p.x}%`, y: `${p.y}%` }}
                    animate={{ opacity: 0, scale: 1.5, y: `${p.y - 20}%` }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute z-20 pointer-events-none text-xl"
                  >
                    {p.type === 'water' && '💧'}
                    {p.type === 'sun' && '☀️'}
                    {p.type === 'prune' && '✂️'}
                    {p.type === 'love' && '💖'}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Dynamic Flower Visual */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                
                {/* Seed state */}
                {plant.stage === 'seed' && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-10 h-10 bg-[#8C7A6B] rounded-full border-2 border-[#5C4D42] shadow-md flex items-center justify-center relative"
                  >
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[9px] text-white font-mono font-bold select-none">SEED</span>
                  </motion.div>
                )}

                {/* Sprout state */}
                {plant.stage === 'sprout' && (
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="flex flex-col items-center"
                  >
                    <svg className="w-16 h-20 text-emerald-500 fill-current drop-shadow-xs" viewBox="0 0 40 60">
                      <path d="M20,60 C20,40 18,30 18,20 C18,20 12,25 10,20 C8,15 15,10 18,18 C19,10 12,5 15,0 C18,0 23,8 21,18 C22,12 28,10 30,15 C32,20 26,20 22,21 C22,30 20,40 20,60 Z" />
                    </svg>
                    <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold mt-1 shadow-2xs">SPROUT</span>
                  </motion.div>
                )}

                {/* Bud state */}
                {plant.stage === 'bud' && (
                  <motion.div
                    animate={{ rotate: [-1.5, 1.5, -1.5] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="flex flex-col items-center"
                  >
                    <svg className="w-24 h-32 text-emerald-500 fill-current drop-shadow-sm" viewBox="0 0 60 80">
                      {/* Stem */}
                      <path d="M30,80 C30,50 28,30 28,20 C28,15 32,15 32,20 C32,30 30,50 30,80 Z" />
                      {/* Leaf Left */}
                      <path d="M28,45 C20,42 15,45 10,38 C15,32 24,35 28,45 Z" fill="#10B981" />
                      {/* Leaf Right */}
                      <path d="M32,35 C40,32 45,35 50,28 C45,22 36,25 32,35 Z" fill="#10B981" />
                      {/* Bud colored top */}
                      <path d="M30,10 C22,10 24,25 30,32 C36,25 38,10 30,10 Z" fill={currentSeed.color} />
                    </svg>
                    <span className="text-[8px] bg-purple-50 text-[#7C5B8C] border border-purple-100 px-1.5 py-0.5 rounded font-mono font-bold shadow-2xs">BUD</span>
                  </motion.div>
                )}

                {/* Bloom state */}
                {plant.stage === 'bloom' && (
                  <motion.div
                    animate={{ rotate: [-2, 2, -2], scale: [0.98, 1.02, 0.98] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="flex flex-col items-center justify-end"
                  >
                    <svg className="w-36 h-44 drop-shadow-md" viewBox="0 0 100 120">
                      {/* Stem with leaf */}
                      <path d="M50,120 C50,75 48,55 48,40 C48,35 52,35 52,40 C52,55 50,75 50,120 Z" fill="#10B981" />
                      {/* Left Leaf */}
                      <path d="M48,80 C32,75 25,80 18,70 C25,60 40,65 48,80 Z" fill="#059669" />
                      {/* Right Leaf */}
                      <path d="M52,65 C68,60 75,65 82,55 C75,45 60,50 52,65 Z" fill="#059669" />
                      
                      {/* Flower Blossom - Multi layered watercolor petals */}
                      <g transform="translate(50, 35)">
                        {/* Outer large petals */}
                        <circle cx="0" cy="-18" r="16" fill={currentSeed.color} opacity="0.85" />
                        <circle cx="-16" cy="-8" r="16" fill={currentSeed.color} opacity="0.85" />
                        <circle cx="16" cy="-8" r="16" fill={currentSeed.color} opacity="0.85" />
                        <circle cx="-12" cy="12" r="16" fill={currentSeed.color} opacity="0.85" />
                        <circle cx="12" cy="12" r="16" fill={currentSeed.color} opacity="0.85" />
                        
                        {/* Inner glowing core */}
                        <circle cx="0" cy="0" r="14" fill={currentSeed.accentColor} opacity="0.95" />
                        <circle cx="0" cy="0" r="8" fill="#FBBF24" /> {/* bright yellow pistil */}
                        <circle cx="0" cy="0" r="3" fill="#FFF" opacity="0.7" />
                      </g>
                    </svg>
                    <span className="text-[8px] bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded font-mono font-bold shadow-2xs tracking-widest uppercase flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> BLOOMED
                    </span>
                  </motion.div>
                )}

              </div>

              {/* Progress Bar of Growth */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-[9px] text-white/80 font-mono font-bold mb-1">
                    <span>成長進度 GROWTH</span>
                    <span>{plant.growth}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      style={{ width: `${plant.growth}%` }}
                      className="bg-white h-full rounded-full"
                      layoutId="growth-progress-bar"
                    />
                  </div>
                </div>

                <div className="text-right text-[10px] text-white font-mono font-black shrink-0">
                  {plant.stage === 'seed' && '🌱 播種期'}
                  {plant.stage === 'sprout' && '🌿 幼苗期'}
                  {plant.stage === 'bud' && '🌸 結苞期'}
                  {plant.stage === 'bloom' && '✨ 盛開期'}
                </div>
              </div>

            </div>

            {/* Action Buttons Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                disabled={plant.growth >= 100}
                onClick={() => handleAction('water')}
                className={`py-3 px-4 rounded-2xl border transition-all flex flex-col items-center gap-1.5 justify-center cursor-pointer ${
                  plant.growth >= 100 
                    ? 'bg-slate-50 border-slate-100 text-slate-300' 
                    : activeAction === 'water'
                      ? 'bg-blue-500 border-blue-400 text-white scale-[0.98]'
                      : 'bg-white hover:bg-blue-50/40 border-blue-100 text-blue-600'
                }`}
              >
                <Droplets className="w-5 h-5" />
                <span className="font-serif font-bold text-xs">澆灌慈愛</span>
                <span className="text-[8px] font-mono opacity-80">Water 💧</span>
              </button>

              <button
                disabled={plant.growth >= 100}
                onClick={() => handleAction('sun')}
                className={`py-3 px-4 rounded-2xl border transition-all flex flex-col items-center gap-1.5 justify-center cursor-pointer ${
                  plant.growth >= 100 
                    ? 'bg-slate-50 border-slate-100 text-slate-300' 
                    : activeAction === 'sun'
                      ? 'bg-amber-500 border-amber-400 text-white scale-[0.98]'
                      : 'bg-white hover:bg-amber-50/40 border-amber-100 text-amber-600'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="font-serif font-bold text-xs">給予陽光</span>
                <span className="text-[8px] font-mono opacity-80">Light ☀️</span>
              </button>

              <button
                disabled={plant.growth >= 100}
                onClick={() => handleAction('prune')}
                className={`py-3 px-4 rounded-2xl border transition-all flex flex-col items-center gap-1.5 justify-center cursor-pointer ${
                  plant.growth >= 100 
                    ? 'bg-slate-50 border-slate-100 text-slate-300' 
                    : activeAction === 'prune'
                      ? 'bg-purple-500 border-purple-400 text-white scale-[0.98]'
                      : 'bg-white hover:bg-purple-50/40 border-purple-100 text-purple-600'
                }`}
              >
                <Scissors className="w-5 h-5" />
                <span className="font-serif font-bold text-xs">修剪雜念</span>
                <span className="text-[8px] font-mono opacity-80">Prune ✂️</span>
              </button>

              <button
                disabled={plant.growth >= 100}
                onClick={() => handleAction('love')}
                className={`py-3 px-4 rounded-2xl border transition-all flex flex-col items-center gap-1.5 justify-center cursor-pointer ${
                  plant.growth >= 100 
                    ? 'bg-slate-50 border-slate-100 text-slate-300' 
                    : activeAction === 'love'
                      ? 'bg-rose-500 border-rose-400 text-white scale-[0.98]'
                      : 'bg-white hover:bg-rose-50/40 border-rose-100 text-rose-600'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="font-serif font-bold text-xs">給予陪伴</span>
                <span className="text-[8px] font-mono opacity-80">Love ❤️</span>
              </button>
            </div>

            {/* Blossom Evaluation Unfolding Card */}
            {plant.growth >= 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-rose-50/30 to-purple-50/20 p-5 rounded-2xl border border-rose-100 shadow-xs flex flex-col items-center gap-4 text-center mt-2"
              >
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#4E4158] flex items-center justify-center gap-1.5">
                    <span>✨</span> 恭喜！你的心靈花朵已完全綻放 <span>✨</span>
                  </h4>
                  <p className="text-[10px] text-[#9A8AA6] leading-relaxed mt-1 max-w-sm">
                    這株花蕾承載了你在生命之旅中的專注陪伴。點擊下方按鈕，由 AI 生命陪伴者解讀這朵花所折射出的「今日心靈花語」吧。
                  </p>
                </div>

                {!evalResult ? (
                  <button
                    disabled={loading}
                    onClick={handleEvaluate}
                    className="bg-[#7C5B8C] hover:bg-[#684a75] disabled:bg-purple-200 text-white text-xs font-serif font-bold py-2.5 px-6 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>正在聆聽心靈花語中...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        <span>解讀生命花語</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleRestart}
                    className="bg-white hover:bg-[#FAF7F2] text-[#7C5B8C] border border-[#7C5B8C]/15 text-xs font-serif font-bold py-2 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    栽種下一朵心靈之花
                  </button>
                )}
              </motion.div>
            )}

            {/* Evaluation Result Viewport */}
            <AnimatePresence>
              {evalResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-br from-[#FAF5EF]/60 to-[#FDF4F5]/40 p-5 rounded-2xl border border-[#7C5B8C]/15 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 pb-2 border-b border-purple-100/30">
                    <span className="text-xl">🎐</span>
                    <span className="font-serif font-bold text-xs text-[#4E4158]">
                      {activeCharacter || '小艾'} 捎來的心靈信箋：
                    </span>
                  </div>

                  <p className="mt-3.5 text-xs text-[#4E4158]/95 leading-relaxed font-sans">
                    {evalResult.analysis}
                  </p>

                  <div className="bg-white/60 p-4 rounded-xl border border-[#7C5B8C]/10 text-xs text-[#4E4158] font-serif mt-4 leading-relaxed italic relative">
                    <div className="absolute -top-2 left-4 text-[7px] font-sans font-extrabold tracking-widest bg-[#7C5B8C] text-white px-1.5 py-0.5 rounded">
                      REFLECTION 自由對話反思
                    </div>
                    「{evalResult.prompt}」
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </div>

      {/* RIGHT PORTION: Supportive widgets & Tips */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-[90px]">
        
        {/* Widget 1: 園藝日誌歷史 */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#7C5B8C]/12 shadow-[0_4px_20px_-2px_rgba(124,91,140,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50 mb-3 text-xs">
            <h4 className="font-serif font-bold text-[#4E4158] flex items-center gap-1.5">
              <span>🌾</span> 心靈種植小貼士
            </h4>
            <span className="text-[9px] text-[#9A8AA6]">百科</span>
          </div>

          <div className="flex flex-col gap-3 mt-3 text-xs font-sans">
            <div className="flex flex-col gap-1 text-[11px] text-[#9A8AA6] leading-relaxed">
              <p className="font-bold text-[#4E4158]">💧 澆灌慈愛：</p>
              <p>充足的水份象徵著你對他人與自身脆弱的同理、接納與滋養。</p>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-[#9A8AA6] leading-relaxed border-t border-purple-50/50 pt-2">
              <p className="font-bold text-[#4E4158]">☀️ 給予陽光：</p>
              <p>和煦的陽光代表理智與信心，帶領你的心靈驅散迷茫陰霾。</p>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-[#9A8AA6] leading-relaxed border-t border-purple-50/50 pt-2">
              <p className="font-bold text-[#4E4158]">✂️ 修剪雜念：</p>
              <p>修剪枯葉象徵勇氣與斷捨離，幫你清除紛亂的外部期望，重回內在主權。</p>
            </div>
          </div>
        </div>

        {/* Widget 2: 溫柔金句 */}
        <div className="bg-[#FAF5EF]/95 p-5 rounded-3xl border border-purple-200/20 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-4 notebook-tape rounded-xs"></div>
          
          <div className="pt-3 pb-1">
            <div className="flex justify-between items-center text-[9px] text-[#9A8AA6] font-serif border-b border-purple-100/30 pb-1">
              <span>思野的茶亭絮語</span>
              <span>隨想</span>
            </div>
            
            <p className="mt-4 font-serif text-xs font-semibold text-[#4E4158]/95 leading-relaxed">
              「生命中的每一次修剪，不是為了剝奪，而是為了讓你在最適合的季節，綻放出最有深度、最挺拔的芬芳。」
            </p>
            <span className="text-[10px] text-[#9A8AA6] block mt-4 font-sans text-right">— 思野 🌲</span>
          </div>
        </div>

      </div>

    </div>
  );
}
