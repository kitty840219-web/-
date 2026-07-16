import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, Cpu, CheckCircle2, RotateCcw, Play, 
  Volume2, VolumeX, Eye, Info, Sparkles, Sliders, Zap, Orbit, Heart
} from 'lucide-react';
import { IMAGES } from '../assets/images';
import { safeStorage } from '../utils/storage';

interface VRElectroGameProps {
  activeCharacter?: string;
}

// 3D Point Interface for the Botanical Constellation
interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
}

export default function VRElectroGame({ activeCharacter: propActiveCharacter }: VRElectroGameProps) {
  // Companion State
  const [activeCompanion, setActiveCompanion] = useState<'小艾' | '小思' | '艾比' | '思野'>(() => {
    if (propActiveCharacter) {
      if (propActiveCharacter.includes('小思')) return '小思';
      if (propActiveCharacter.includes('艾比') || propActiveCharacter.includes('Ivy')) return '艾比';
      if (propActiveCharacter.includes('思野')) return '思野';
    }
    return '小艾';
  });

  // Keep companion synced with parent changes
  useEffect(() => {
    if (propActiveCharacter) {
      if (propActiveCharacter.includes('小思')) setActiveCompanion('小思');
      else if (propActiveCharacter.includes('艾比') || propActiveCharacter.includes('Ivy')) setActiveCompanion('艾比');
      else if (propActiveCharacter.includes('思野')) setActiveCompanion('思野');
      else setActiveCompanion('小艾');
    }
  }, [propActiveCharacter]);

  // Game states
  const [activeMode, setActiveMode] = useState<'memory' | 'alignment'>('memory');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [floralOverlay, setFloralOverlay] = useState<boolean>(true);
  
  // Companion Dialog Action States
  const [actionIndex, setActionIndex] = useState<number>(0);
  const [companionAnim, setCompanionAnim] = useState<any>({});
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  // Audio Synthesis Trigger helper
  const playAudio = (type: 'beep' | 'success' | 'fail' | 'laser' | 'hum') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5 (softer chime)
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // Beautiful warm major arpeggio
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.02, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
        });
      } else if (type === 'fail') {
        const osc1 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(220, ctx.currentTime);
        osc1.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc1.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.35);
      } else if (type === 'laser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'hum') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // safe fallback for browser security blockers
    }
  };

  // Canvas-based 3D Spinning Floral Mandala Constellation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationAngle = useRef<number>(0);
  const neuralPulses = useRef<{x: number, y: number, z: number, r: number, maxR: number, color: string}[]>([]);

  // Initialize a set of 3D points mimicking a blooming flower mandala
  const flowerPoints = useRef<Point3D[]>([]);
  useEffect(() => {
    const pts: Point3D[] = [];
    
    // Core of the flower (central glowing particles)
    for (let i = 0; i < 25; i++) {
      const u = Math.random() * Math.PI * 2;
      const r = Math.random() * 12;
      const x = Math.cos(u) * r;
      const z = Math.sin(u) * r;
      const y = (Math.random() - 0.5) * 8;
      pts.push({ x, y, z, color: '#E2B13C', size: Math.random() * 2 + 1.2 }); // Golden core
    }

    // Layered Petals (using 3D phyllotaxis spiral geometry)
    for (let i = 25; i < 115; i++) {
      const theta = i * 0.1375 * Math.PI; // Golden angle spiral
      const r = Math.sqrt(i - 20) * 6; // spiral growth radius
      
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      
      // Volumetric wave height to simulate curved flower petals
      const y = Math.sin(r * 0.08 - theta * 0.2) * 12;

      // Color coding: lavender and pale rose petals
      let color = '#7C5B8C'; // Signature Lavender
      if (i % 3 === 0) {
        color = '#E59A9A'; // Delicate Rose Pink
      } else if (i % 7 === 0) {
        color = '#9A8AA6'; // Soft Iris Grey
      }
      
      pts.push({ x, y, z, color, size: Math.random() * 2.5 + 1 });
    }

    // Sparkles floating around the botanical structure
    for (let i = 0; i < 15; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const r = 65 + Math.random() * 15;
      const x = r * Math.sin(v) * Math.cos(u);
      const y = r * Math.sin(v) * Math.sin(u);
      const z = r * Math.cos(v);
      pts.push({ x, y, z, color: '#E9D5FF', size: Math.random() * 1.5 + 0.6 }); // Pale purple sparkles
    }

    flowerPoints.current = pts;
  }, []);

  // Animate Canvas
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear with soft off-white to maintain beautiful trail blending with page color
      ctx.fillStyle = 'rgba(250, 247, 242, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Update rotation
      rotationAngle.current += 0.004;
      const angle = rotationAngle.current;

      // Draw Grid Radar Concentric Circles in matching lavender
      ctx.strokeStyle = 'rgba(124, 91, 140, 0.06)';
      ctx.lineWidth = 1;
      for (let r = 30; r <= 130; r += 25) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Blinking Soft Radial Sweep Scanner line
      const sweepY = centerY + Math.sin(angle * 2.2) * 100;
      ctx.strokeStyle = 'rgba(124, 91, 140, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 110, sweepY);
      ctx.lineTo(centerX + 110, sweepY);
      ctx.stroke();

      // Project and draw lines between close 3D neural nodes
      const projected: {sx: number, sy: number, depth: number, color: string, size: number}[] = [];
      const radCos = Math.cos(angle);
      const radSin = Math.sin(angle);

      flowerPoints.current.forEach(pt => {
        // Rotate points around Y axis (spin brain flower)
        const rx = pt.x * radCos - pt.z * radSin;
        const rz = pt.x * radSin + pt.z * radCos;
        const ry = pt.y; // Keep Y as is

        // Perspective projection scale factor
        const depth = 220;
        const distance = 160;
        const scale = depth / (depth + rz + distance);
        const sx = centerX + rx * scale * 1.6;
        const sy = centerY + ry * scale * 1.6;

        projected.push({ sx, sy, depth: rz, color: pt.color || '#7C5B8C', size: (pt.size || 2) * scale * 1.3 });
      });

      // Draw connection lines to form a beautiful botanical wireframe lattice
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].sx - projected[j].sx;
          const dy = projected[i].sy - projected[j].sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 22) {
            const alpha = (1 - dist / 22) * 0.15;
            ctx.strokeStyle = projected[i].color === '#E2B13C' 
              ? `rgba(226, 177, 60, ${alpha})` 
              : `rgba(124, 91, 140, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].sx, projected[i].sy);
            ctx.lineTo(projected[j].sx, projected[j].sy);
            ctx.stroke();
          }
        }
      }

      // Draw all nodes on top
      projected.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle radial shine to bigger glowing cores
        if (p.size > 2) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(p.sx - 0.4, p.sy - 0.4, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw neural energy pulse rings traveling outwards in soft pink/lavender
      neuralPulses.current.forEach((pulse, idx) => {
        pulse.r += 2.2;
        ctx.strokeStyle = pulse.color;
        ctx.lineWidth = 1.2 * (1 - pulse.r / pulse.maxR);
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulse.r, 0, Math.PI * 2);
        ctx.stroke();

        if (pulse.r >= pulse.maxR) {
          neuralPulses.current.splice(idx, 1);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const triggerPulse = (color: string) => {
    neuralPulses.current.push({
      x: 0, y: 0, z: 0,
      r: 10,
      maxR: 120,
      color: color
    });
  };

  // ============================================
  // MODE 1: NEURAL PULSE MEMORY GRID (神經脈衝同步記憶)
  // ============================================
  const [gridLevel, setGridLevel] = useState<number>(1);
  const [gridScore, setGridScore] = useState<number>(0);
  const [gridHighScore, setGridHighScore] = useState<number>(() => {
    try {
      const saved = safeStorage.getItem('aifeiler_vr_memory_highscore');
      return saved ? parseInt(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'player' | 'success' | 'failed'>('idle');
  const [systemSequence, setSystemSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [syncRate, setSyncRate] = useState<number>(0); // Sync Quality percentage readout

  // Grid setup (3x3 grid indices 0-8)
  const cellPositions = [
    { name: '🌸', label: '前額葉 01' }, { name: '🌿', label: '前額葉 02' }, { name: '🌸', label: '前額葉 03' },
    { name: '🌱', label: '頂葉 01' },   { name: '🌾', label: '頂葉 02' },   { name: '🌱', label: '頂葉 03' },
    { name: '🍀', label: '枕葉 01' },   { name: '🍁', label: '枕葉 02' },   { name: '🍀', label: '枕葉 03' }
  ];

  const startMemoryGame = () => {
    setGridLevel(1);
    setGridScore(0);
    setSyncRate(100);
    generateNextLevelSequence(1);
  };

  const generateNextLevelSequence = (level: number) => {
    setGameState('showing');
    setPlayerSequence([]);
    
    // Sequence length starts at 3, increases as level advances
    const length = 2 + level;
    const newSeq: number[] = [];
    for (let i = 0; i < length; i++) {
      newSeq.push(Math.floor(Math.random() * 9));
    }
    setSystemSequence(newSeq);
    
    // Play back sequence
    setTimeout(() => {
      playSequenceToPlayer(newSeq);
    }, 600);
  };

  const playSequenceToPlayer = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setActiveCell(seq[i]);
          playAudio('beep');
          triggerPulse('rgba(124, 91, 140, 0.35)');
          
          setTimeout(() => {
            setActiveCell(null);
            resolve();
          }, 380);
        }, 180);
      });
    }
    setGameState('player');
  };

  const handleCellClick = (cellIndex: number) => {
    if (gameState !== 'player') return;
    
    playAudio('hum');
    const newPlayerSeq = [...playerSequence, cellIndex];
    setPlayerSequence(newPlayerSeq);
    
    // Pulse animation
    triggerPulse('rgba(229, 154, 154, 0.45)');

    // Flashing cell feedback
    setActiveCell(cellIndex);
    setTimeout(() => setActiveCell(null), 200);

    // Verify cell choice
    const currentIndexToCheck = newPlayerSeq.length - 1;
    if (newPlayerSeq[currentIndexToCheck] !== systemSequence[currentIndexToCheck]) {
      // Failed!
      playAudio('fail');
      setGameState('failed');
      const penalties = Math.max(0, Math.floor(syncRate - 15 - Math.random() * 10));
      setSyncRate(penalties);
      return;
    }

    // Checked if completed sequence
    if (newPlayerSeq.length === systemSequence.length) {
      // Level Success!
      playAudio('success');
      setGameState('success');
      
      const newScore = gridScore + gridLevel * 10;
      setGridScore(newScore);
      if (newScore > gridHighScore) {
        setGridHighScore(newScore);
        try {
          safeStorage.setItem('aifeiler_vr_memory_highscore', newScore.toString());
        } catch {}
      }

      // Sync Rate calculation boosts
      setSyncRate(Math.min(100, Math.round(95 + Math.random() * 5)));

      setTimeout(() => {
        setGridLevel(prev => prev + 1);
        generateNextLevelSequence(gridLevel + 1);
      }, 1500);
    }
  };


  // ============================================
  // MODE 2: SPATIAL WAVE POLAR ALIGNMENT (空間波形極性對準)
  // ============================================
  const [targetX, setTargetX] = useState<number>(65);
  const [targetY, setTargetY] = useState<number>(35);
  const [targetFreq, setTargetFreq] = useState<number>(45);

  const [controlX, setControlX] = useState<number>(50);
  const [controlY, setControlY] = useState<number>(50);
  const [controlFreq, setControlFreq] = useState<number>(20);
  
  const [alignmentLocked, setAlignmentLocked] = useState<boolean>(false);
  const [alignmentStreak, setAlignmentStreak] = useState<number>(0);
  const [alignStatus, setAlignStatus] = useState<string>('RESONATING_SCAN');

  const calcProximity = () => {
    const dX = Math.abs(targetX - controlX);
    const dY = Math.abs(targetY - controlY);
    const dF = Math.abs(targetFreq - controlFreq);
    
    // Normalize percentage
    const matchX = Math.max(0, 100 - dX * 2);
    const matchY = Math.max(0, 100 - dY * 2);
    const matchFreq = Math.max(0, 100 - dF * 2.5);

    return Math.round((matchX + matchY + matchFreq) / 3);
  };

  const currentMatchPercent = calcProximity();

  useEffect(() => {
    // Laser tracking hum sound on slider change
    if (currentMatchPercent > 60) {
      playAudio('hum');
    }
    
    if (currentMatchPercent >= 98 && !alignmentLocked) {
      setAlignmentLocked(true);
      playAudio('success');
      triggerPulse('rgba(124, 91, 140, 0.6)');
      setAlignmentStreak(prev => prev + 1);
      setAlignStatus('POLARITY_LOCKED_SUCCESS');
    } else if (currentMatchPercent < 97 && alignmentLocked) {
      setAlignmentLocked(false);
      setAlignStatus('RESONATING_SCAN');
    }
  }, [controlX, controlY, controlFreq]);

  const generateNewSpatialTarget = () => {
    setTargetX(Math.floor(15 + Math.random() * 70));
    setTargetY(Math.floor(15 + Math.random() * 70));
    setTargetFreq(Math.floor(25 + Math.random() * 60));
    setAlignmentLocked(false);
    setAlignStatus('SCANNING_NEW_BEACON');
    playAudio('laser');
    triggerPulse('rgba(229, 154, 154, 0.5)');
  };

  // ============================================
  // CHARACTER DETAILS, ACTIONS & ANIMATED RESPONSES
  // ============================================
  const CHARACTERS: Record<'小艾' | '小思' | '艾比' | '思野', {
    role: string;
    avatar: string;
    bgColor: string;
    borderColor: string;
    actions: { emoji: string; text: string; response: string }[];
  }> = {
    '小艾': {
      role: '🌸 溫柔療癒夥伴',
      avatar: IMAGES.avatarXiaoi,
      bgColor: 'bg-rose-50/50',
      borderColor: 'border-rose-200/40',
      actions: [
        { emoji: '🌸', text: '送你小花', response: '「送你一朵水漾薰衣草，輕輕聞一聞清草香，把大腦的疲憊都放鬆下來吧。」' },
        { emoji: '🍵', text: '輕柔泡茶', response: '「我為你泡了暖呼呼的洋甘菊茶喔，我們慢慢喝，在寧靜中好好休息。」' },
        { emoji: '💖', text: '溫柔擁抱', response: '「抱抱你！你今天真的已經做得很棒了，順著你的第一直覺，不要有壓力喔。」' },
        { emoji: '✨', text: '打氣祝福', response: '「哇！做得太好啦！看見你專注玩遊戲的樣子，真的非常耀眼喔！」' }
      ]
    },
    '小思': {
      role: '🧠 理性思辨夥伴',
      avatar: IMAGES.avatarXiaosi,
      bgColor: 'bg-indigo-50/50',
      borderColor: 'border-indigo-200/40',
      actions: [
        { emoji: '💭', text: '思考發呆', response: '「思考雖然有時會感到有些迷惘，但正是這些不確定性，組成了我們獨一無二的拼圖。」' },
        { emoji: '📚', text: '記錄筆記', response: '「這是一場心靈波譜的邏輯校正，專注於它的軌跡，我們一起提煉出理性的秩序。」' },
        { emoji: '🔭', text: '仰望星空', response: '「你看那一顆閃爍的小白星，就像我們心底最堅實的信念。世界再黑，微光依然存在。」' },
        { emoji: '💡', text: '智慧提問', response: '「理智能釐清眼前的迷霧。吸氣、吐氣，順著你剛才腦海中的思考軌道慢慢解開它吧。」' }
      ]
    },
    '艾比': {
      role: '🖊️ 故事創作者',
      avatar: IMAGES.avatarIvy,
      bgColor: 'bg-amber-50/50',
      borderColor: 'border-amber-200/40',
      actions: [
        { emoji: '🖋️', text: '手寫微光', response: '「文字和故事是具有治癒力量的，能讓在黑夜裡不知所措的旅人，重新找到前行的方向。」' },
        { emoji: '🎨', text: '水彩渲染', response: '「感受每一道微光在心房流動，就像斑斕的水彩，這就是我們正在繪製的生命畫卷。」' },
        { emoji: '🌾', text: '收集晨露', response: '「生活中的點滴微調，都像是在清晨採集甘露與芬芳。這是你為自己積攢的心靈養分。」' },
        { emoji: '🍰', text: '烘焙甜心', response: '「剛烤好的司康與茶點！吃一口甜甜的，讓心情也跟著溫暖治癒起來吧。」' }
      ]
    },
    '思野': {
      role: '🧘 故事陪伴者',
      avatar: IMAGES.avatarSiye,
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-200/40',
      actions: [
        { emoji: '🧘', text: '靜心禪修', response: '「吸氣，感受大地的溫厚與穩固；呼氣，放開多餘的執念。你本身就擁有一切生長的力量。」' },
        { emoji: '🪵', text: '圍爐取暖', response: '「心靜下來時，最幽微的律動都會變得清晰可見。在爐火旁放空，隨意去體驗吧。」' },
        { emoji: '🧉', text: '靜品茗茗', response: '「不急，不躁。人生如這杯茶，先苦澀而後甘甜。聽聽林間鳥鳴，歲月自會給你最自洽的答案。」' },
        { emoji: '🦉', text: '守護庇護', response: '「即使前方身體在微微顫抖，也不要害怕迷航。深呼吸，我的庇護永遠等候著你。」' }
      ]
    }
  };

  const handleAvatarClick = () => {
    // Play synthesis chime sound
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && soundEnabled) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {}

    // Cycle action index
    const compData = CHARACTERS[activeCompanion];
    const nextIdx = (actionIndex + 1) % compData.actions.length;
    setActionIndex(nextIdx);

    // Random trigger physics-like spring animation
    const animTypes = [
      { scale: [1, 1.25, 0.8, 1.15, 0.95, 1], y: [0, -18, 3, -2, 0] }, // High bounce
      { rotate: [0, -15, 12, -8, 5, 0], scale: [1, 1.15, 0.95, 1.05, 1] }, // Playful wiggle
      { scale: [1, 1.2, 1], rotate: [0, 360], transition: { duration: 0.6 } } // Spiral spin
    ];
    const selectedAnim = animTypes[Math.floor(Math.random() * animTypes.length)];
    setCompanionAnim(selectedAnim);

    // Spawn 5 pretty floaty heart/sparkle particles
    const emojis = ['🌸', '💖', '✨', '🌿', '🌟', '🧁', '🦉'][Math.floor(Math.random() * 7)];
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 80,
      y: -40 - Math.random() * 80,
      emoji: i === 0 ? compData.actions[nextIdx].emoji : emojis
    }));
    setFloatingHearts(prev => [...prev, ...newParticles]);
  };

  // Autoclear old floaty particles
  useEffect(() => {
    if (floatingHearts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingHearts(prev => prev.filter(p => Date.now() - p.id < 1200));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [floatingHearts]);

  const currentAction = CHARACTERS[activeCompanion].actions[actionIndex];

  // Helper to generate context-specific companion advice dialogue
  const getCompanionAdvice = () => {
    if (activeMode === 'memory') {
      if (gameState === 'idle') {
        return `「此處是艾飛樂的腦力同步儀。當開始校準後，請專注觀察並記錄晶片花瓣亮起的順序，這能強化短時記憶儲存能力喔。」`;
      }
      if (gameState === 'showing') {
        return `「注意：花卉晶片信號正在寫入中。請保持專注與放鬆，捕捉每一片花瓣的微光傳導...」`;
      }
      if (gameState === 'player') {
        return `「深呼吸，不要心急喔。順著你剛才腦海中的第一直覺，輕點晶片花瓣。我相信你一定能順利解開的。」`;
      }
      if (gameState === 'success') {
        return `「哇！太棒了！大腦同步率達到最完美的 100%！看見你在亮光中專注、沉著的模樣，真的非常迷人。」`;
      }
      if (gameState === 'failed') {
        return `「大腦同步信號稍微中斷。不用沮喪，這是因片刻神魂發散造成的。點擊下方『重新載入』即可重新同步喔。」`;
      }
    } else {
      if (alignmentLocked) {
        return `「太和諧了！大腦與極化光柵完全疊合，頻率共振成功，量子同步率達到最極致的 100% 指標。」`;
      }
      if (currentMatchPercent > 80) {
        return `「看！探針光圈和紅色信號快要重疊在一起了！你的微調非常精緻，再稍微調試一下頻率，就能感受到大腦的溫柔共鳴了！」`;
      }
      return `「請拖動下方的 Pitch (俯仰)、Yaw (偏航) 與量子頻率，把探針圈準星對準閃爍的紅色脈衝信號，來一場虛擬空間對齊實驗吧。」`;
    }
    return currentAction.response;
  };

  const adviceText = getCompanionAdvice();

  return (
    <div id="vr-electro-game-widget" className="w-full bg-gradient-to-br from-[#FAF6F0] to-[#FAF8F5] border border-[#7C5B8C]/15 rounded-3xl p-5 md:p-6 text-[#4E4158] font-sans shadow-lg relative overflow-hidden">
      
      {/* BACKGROUND ILLUSTRATION FLOWER DECORATION PATTERN */}
      {floralOverlay && (
        <div 
          style={{ 
            backgroundImage: `url(${IMAGES.illustrationFlower})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'multiply'
          }}
          className="absolute inset-0 opacity-[0.06] pointer-events-none z-0 select-none"
        />
      )}

      {/* TOP HEADER STATUS PANEL */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#7C5B8C]/10 pb-4 mb-5 gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white border border-[#7C5B8C]/15 rounded-xl flex items-center justify-center text-[#7C5B8C] shadow-sm">
            <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C5B8C] font-sans">SYNAPTIC CALIBRATOR</span>
              <span className="text-[8px] bg-purple-50 text-[#7C5B8C] px-1.5 py-0.5 rounded font-sans border border-[#7C5B8C]/12">BOTANICAL EDITION</span>
            </div>
            <h4 className="font-serif font-black text-sm md:text-base text-[#4E4158] flex items-center gap-1.5 mt-0.5">
              心靈與賽博電子智力同步儀
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            </h4>
          </div>
        </div>

        {/* HUD Quick Settings Toggle Toggles */}
        <div className="flex items-center gap-1.5 font-sans text-[10px] self-end sm:self-auto bg-white/90 border border-[#7C5B8C]/12 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playAudio('beep');
            }}
            className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-bold ${soundEnabled ? 'text-[#7C5B8C] bg-[#FAF5EF]' : 'text-[#9A8AA6] hover:text-[#4E4158]'}`}
            title="開關音效"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>AUDIO</span>
          </button>

          <button
            onClick={() => setFloralOverlay(!floralOverlay)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-bold ${floralOverlay ? 'text-rose-500 bg-[#FAF5EF]' : 'text-[#9A8AA6] hover:text-[#4E4158]'}`}
            title="插花背景圖開關"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>FLORAL BG</span>
          </button>
        </div>
      </div>

      {/* GAME MODE TABS */}
      <div className="grid grid-cols-2 gap-2 mb-5 relative z-10">
        <button
          onClick={() => {
            setActiveMode('memory');
            playAudio('beep');
          }}
          className={`py-2 px-3 rounded-xl font-serif text-xs font-extrabold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
            activeMode === 'memory' 
              ? 'bg-[#7C5B8C]/10 border-[#7C5B8C]/30 text-[#7C5B8C] shadow-sm' 
              : 'bg-white/60 border-purple-100/40 hover:border-[#7C5B8C]/30 text-[#9A8AA6] hover:text-[#4E4158]'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${activeMode === 'memory' ? 'text-[#7C5B8C] animate-pulse' : ''}`} />
          神經脈衝同步記憶
        </button>
        <button
          onClick={() => {
            setActiveMode('alignment');
            playAudio('beep');
          }}
          className={`py-2 px-3 rounded-xl font-serif text-xs font-extrabold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
            activeMode === 'alignment' 
              ? 'bg-[#7C5B8C]/10 border-[#7C5B8C]/30 text-[#7C5B8C] shadow-sm' 
              : 'bg-white/60 border-purple-100/40 hover:border-[#7C5B8C]/30 text-[#9A8AA6] hover:text-[#4E4158]'
          }`}
        >
          <Orbit className={`w-3.5 h-3.5 ${activeMode === 'alignment' ? 'text-[#7C5B8C] animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          空間波形極性對準
        </button>
      </div>

      {/* COMPANION QUICK SWITCH BAR */}
      <div className="bg-white/70 border border-[#7C5B8C]/8 rounded-2xl p-2.5 mb-5 flex flex-wrap items-center justify-between gap-3 relative z-10 shadow-xs">
        <span className="text-[10px] font-bold text-[#9A8AA6] pl-1">✨ 選擇你的隨身引導夥伴：</span>
        <div className="flex gap-2.5">
          {(['小艾', '小思', '艾比', '思野'] as const).map(name => {
            const isSelected = activeCompanion === name;
            return (
              <button
                key={name}
                onClick={() => {
                  setActiveCompanion(name);
                  setActionIndex(0);
                  playAudio('beep');
                  // Trigger quick entrance bounce animation
                  setCompanionAnim({ scale: [0.8, 1.15, 0.95, 1], y: [0, -10, 0] });
                }}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-lg border text-xs font-serif font-extrabold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#7C5B8C] text-white border-[#7C5B8C] shadow-xs scale-105' 
                    : 'bg-white hover:bg-purple-50/40 border-purple-100/40 text-[#4E4158]/80'
                }`}
              >
                <img 
                  src={CHARACTERS[name].avatar} 
                  alt={name} 
                  className="w-4.5 h-4.5 rounded-full object-cover shrink-0 border border-white"
                  referrerPolicy="no-referrer"
                />
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN GAME CONTAINER: SPLIT SCREEN (LEFT GAMEPLAY, RIGHT CANVAS BRAIN FLOWER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative z-10">
        
        {/* LEFT PANEL: INTERACTIVE GAMEPLAY (Spans 7 cols) */}
        <div className="lg:col-span-7 bg-white/70 border border-[#7C5B8C]/12 rounded-2xl p-4 flex flex-col justify-between min-h-[360px] relative overflow-hidden shadow-xs">
          
          {/* Active Mode 1: NEURAL PULSE MEMORY */}
          {activeMode === 'memory' && (
            <div className="flex-1 flex flex-col justify-between w-full h-full">
              
              {/* Stats HUD readouts */}
              <div className="flex items-center justify-between border-b border-[#7C5B8C]/10 pb-3 mb-3 text-[10px] font-sans font-bold text-[#9A8AA6]">
                <div className="flex items-center gap-3">
                  <div>
                    <span>LEVEL</span>
                    <p className="text-[#7C5B8C] font-extrabold text-xs">{gridLevel}</p>
                  </div>
                  <div className="border-l border-purple-100/40 pl-3">
                    <span>SCORE</span>
                    <p className="text-[#4E4158] font-extrabold text-xs">{gridScore}</p>
                  </div>
                  <div className="border-l border-purple-100/40 pl-3">
                    <span>HIGH SCORE</span>
                    <p className="text-[#E2B13C] font-extrabold text-xs">🏆 {gridHighScore}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span>BRAIN SYNC</span>
                  <p className={`font-extrabold text-xs ${syncRate > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ⚡ {syncRate}%
                  </p>
                </div>
              </div>

              {/* Game Viewport Container */}
              <div className="flex-1 flex items-center justify-center py-2">
                {gameState === 'idle' ? (
                  <div className="text-center p-6 flex flex-col items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#FAF5EF]/90 border border-[#7C5B8C]/15 flex items-center justify-center text-[#7C5B8C] animate-pulse">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <div>
                      <h5 className="font-serif font-extrabold text-xs text-[#4E4158]">
                        系統自檢：神經晶片同步已就緒
                      </h5>
                      <p className="text-[10px] text-[#9A8AA6] mt-1 max-w-[240px] leading-relaxed mx-auto font-sans font-medium">
                        本遊戲將以「草木植物花瓣」為媒介，考驗你大腦的短時脈衝先後順序記憶力。放鬆呼吸，我們一起開始吧。
                      </p>
                    </div>
                    <button
                      id="vr-memory-start-btn"
                      onClick={startMemoryGame}
                      className="bg-[#7C5B8C] hover:bg-[#684a75] text-white font-serif font-bold text-xs py-2 px-6 rounded-full shadow-md hover:scale-102 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      開始心靈同步校準
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-[240px] flex flex-col gap-3">
                    
                    {/* Status prompt */}
                    <div className="text-center">
                      <span className="text-[10px] tracking-wider text-[#7C5B8C] font-serif font-bold block mb-1">
                        {gameState === 'showing' && '🌱 心靈同步信號寫入中...'}
                        {gameState === 'player' && '👉 請依序點擊花草晶片：'}
                        {gameState === 'success' && '✨ 傳導完成！心靈感應百分百'}
                        {gameState === 'failed' && '🍂 晶片訊號短暫失調'}
                      </span>
                    </div>

                    {/* 3x3 Electronic Grid */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {cellPositions.map((cell, idx) => {
                        const isGlowing = activeCell === idx;
                        return (
                          <button
                            key={idx}
                            disabled={gameState !== 'player'}
                            onClick={() => handleCellClick(idx)}
                            className={`aspect-square rounded-2xl border text-base flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden ${
                              isGlowing 
                                ? 'bg-[#7C5B8C]/20 border-[#7C5B8C] text-[#7C5B8C] shadow-md scale-[0.97] font-bold' 
                                : gameState === 'player'
                                  ? 'bg-white border-purple-100 hover:border-[#7C5B8C]/40 text-[#4E4158]/80 hover:text-[#7C5B8C] cursor-pointer hover:bg-purple-50/10'
                                  : 'bg-white/50 border-purple-50 text-slate-300'
                            }`}
                          >
                            <span className="text-sm">{cell.name}</span>
                            <span className="text-[8px] opacity-80 whitespace-nowrap font-sans font-bold">{cell.label}</span>
                            
                            {/* Neon spark decoration inner glow */}
                            {isGlowing && (
                              <span className="absolute inset-0 bg-purple-200/20 animate-ping rounded-2xl pointer-events-none"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Reset button if failed */}
                    {gameState === 'failed' && (
                      <button
                        onClick={startMemoryGame}
                        className="mt-2 bg-[#FAF5EF] hover:bg-purple-50 border border-[#7C5B8C]/20 text-[#7C5B8C] font-serif font-bold text-xs py-1.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        重新校準
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Mode 2: SPATIAL WAVE ALIGNMENT */}
          {activeMode === 'alignment' && (
            <div className="flex-1 flex flex-col justify-between w-full h-full">
              
              {/* Stats HUD readout */}
              <div className="flex items-center justify-between border-b border-[#7C5B8C]/10 pb-3 mb-3 text-[10px] font-sans font-bold text-[#9A8AA6]">
                <div className="flex items-center gap-3">
                  <div>
                    <span>ALIGN STREAK</span>
                    <p className="text-[#7C5B8C] font-extrabold text-xs">🔥 {alignmentStreak}</p>
                  </div>
                  <div className="border-l border-purple-100/40 pl-3">
                    <span>COORDINATES</span>
                    <p className="text-[#4E4158] font-extrabold text-xs">[X:{controlX}, Y:{controlY}]</p>
                  </div>
                </div>
                <div className="text-right">
                  <span>WAVE RESONANCE</span>
                  <p className={`font-extrabold text-xs ${currentMatchPercent > 90 ? 'text-emerald-600' : currentMatchPercent > 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                    🌾 {currentMatchPercent}% MATCH
                  </p>
                </div>
              </div>

              {/* Slider Controller Interface */}
              <div className="flex-1 flex flex-col justify-center gap-4">
                
                {/* Simulated Radar Polar Screen */}
                <div className="w-full h-24 bg-[#FAF7F2] border border-purple-100/30 rounded-2xl relative overflow-hidden flex items-center justify-center">
                  
                  {/* Scope sweeping laser rings */}
                  <div className="absolute w-24 h-24 rounded-full border border-purple-200/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-purple-100/20"></div>
                  </div>
                  
                  {/* Grid Crosshairs */}
                  <div className="absolute w-full h-[1px] bg-purple-100/15"></div>
                  <div className="absolute h-full w-[1px] bg-purple-100/15"></div>
                  
                  {/* Target brain wave point (Pink Neon Dot) */}
                  <div 
                    style={{ left: `${targetX}%`, top: `${targetY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                  >
                    <span className="absolute animate-ping h-4.5 w-4.5 rounded-full bg-rose-400 opacity-60"></span>
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm flex items-center justify-center">
                      <span className="text-[6px] text-white font-bold select-none">T</span>
                    </div>
                  </div>

                  {/* Player wave tracking dot (Cyan Neon Circle) */}
                  <div 
                    style={{ left: `${controlX}%`, top: `${controlY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-[#7C5B8C] animate-spin shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#7C5B8C] rounded-full"></div>
                    </div>
                  </div>

                  {/* Synchronized successfully visual splash overlay */}
                  <AnimatePresence>
                    {alignmentLocked && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#FAF5EF]/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-2 z-20"
                      >
                        <span className="text-[10px] font-serif font-extrabold tracking-widest text-[#7C5B8C] animate-bounce">
                          🎯 POLARITY SYNC LOCK ACQUIRED!
                        </span>
                        <button
                          onClick={generateNewSpatialTarget}
                          className="mt-1.5 bg-[#7C5B8C] hover:bg-[#684a75] text-white font-serif font-black text-[9px] py-1 px-3.5 rounded-lg transition-all cursor-pointer shadow-sm hover:scale-102"
                        >
                          傳導下一個座標 ➜
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status Indicator Tag */}
                  <span className="absolute bottom-1.5 right-2.5 font-sans text-[7px] text-[#9A8AA6] font-bold uppercase tracking-wider">
                    STATUS: {alignStatus}
                  </span>
                </div>

                {/* 3 Interactive Wave sliders */}
                <div className="flex flex-col gap-2.5">
                  {/* Pitch Control */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[9px] font-sans font-bold text-[#9A8AA6]">
                      <span className="flex items-center gap-1"><Sliders className="w-3 h-3 text-[#7C5B8C]" /> PITCH ANGLE (水平對準)</span>
                      <span className="text-[#7C5B8C] font-extrabold">{controlX}°</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      value={controlX} 
                      onChange={(e) => setControlX(parseInt(e.target.value))}
                      className="w-full h-1 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#7C5B8C]" 
                    />
                  </div>

                  {/* Yaw Control */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[9px] font-sans font-bold text-[#9A8AA6]">
                      <span className="flex items-center gap-1"><Sliders className="w-3 h-3 text-rose-400" /> YAW ANGLE (垂直對準)</span>
                      <span className="text-rose-400 font-extrabold">{controlY}°</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      value={controlY} 
                      onChange={(e) => setControlY(parseInt(e.target.value))}
                      className="w-full h-1 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-rose-400" 
                    />
                  </div>

                  {/* Quantum Resonance frequency Control */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[9px] font-sans font-bold text-[#9A8AA6]">
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500 animate-pulse" /> QUANTUM FREQUENCY (共振頻率)</span>
                      <span className="text-amber-600 font-extrabold">{controlFreq} Hz / Target {targetFreq} Hz</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      value={controlFreq} 
                      onChange={(e) => setControlFreq(parseInt(e.target.value))}
                      className="w-full h-1 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                    />
                  </div>
                </div>

                {/* Quick Trigger re-align target button */}
                {!alignmentLocked && (
                  <button
                    onClick={generateNewSpatialTarget}
                    className="mt-1 bg-white hover:bg-purple-50 border border-purple-100/50 text-[#9A8AA6] hover:text-[#7C5B8C] font-serif text-[10px] font-bold py-1 px-3 rounded-lg transition-all self-end cursor-pointer"
                  >
                    🔄 擾亂全息極座標 (亂數重算)
                  </button>
                )}

              </div>

            </div>
          )}

        </div>

        {/* RIGHT PANEL: HOLOGRAM VIRTUAL CANVAS (Spans 5 cols) */}
        <div className="lg:col-span-5 bg-white/70 border border-[#7C5B8C]/12 rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-xs relative overflow-hidden">
          
          {/* Canvas for holographic neural spinning head */}
          <div className="relative w-full aspect-square max-w-[210px] bg-gradient-to-br from-[#FAF8F5] to-white rounded-full border border-purple-100 shadow-inner flex items-center justify-center p-1 overflow-hidden">
            <canvas 
              ref={canvasRef} 
              width={240} 
              height={240} 
              className="w-full h-full object-contain"
            />
            {/* Soft Overlay Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-purple-100/20 pointer-events-none"></div>
          </div>

          <div className="w-full mt-3">
            <div className="flex items-center justify-center gap-1.5 text-[#7C5B8C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C5B8C] animate-ping"></span>
              <span className="font-sans text-[9px] tracking-widest font-extrabold">NEURO-FEEDBACK SCREEN</span>
            </div>
            
            <p className="text-[10px] text-[#9A8AA6] font-sans leading-relaxed mt-1.5 px-2 font-medium">
              3D植物花瓣網格正接收你的專注波頻率。配合遊戲操控，全息花卉會自動微調，協助大腦活化前額葉神經。
            </p>
          </div>

          {/* Quick Stats list readout */}
          <div className="w-full grid grid-cols-2 gap-2 mt-3.5 border-t border-purple-100/30 pt-3 text-[8px] font-sans font-bold text-left text-[#9A8AA6]">
            <div>
              <p>📍 LINK TYPE: COGNI-LINK</p>
              <p>📡 BANDWIDTH: 4.8 GBPS</p>
            </div>
            <div>
              <p>🔍 DESIGN: SACRED MANDALA</p>
              <p>⚡ STABILITY: PERFECT</p>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM WIDGET: INTERACTIVE COMPANION SPEECH BUBBLE */}
      <div className="mt-5 bg-white border border-[#7C5B8C]/12 rounded-2xl p-4 relative overflow-hidden flex flex-col sm:flex-row items-center gap-4 shadow-xs">
        
        {/* Soft background glow */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-purple-500/5 blur-xl"></div>

        {/* Companion head avatar - fully animatable and click triggers action transitions */}
        <div className="flex-shrink-0 relative cursor-pointer" onClick={handleAvatarClick}>
          
          {/* Pulse ring indicating clickability */}
          <div className="absolute -inset-1.5 rounded-full opacity-40 blur-xs animate-pulse bg-purple-200" />
          
          {/* Floating heart/emoji particles */}
          <AnimatePresence>
            {floatingHearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ opacity: 1, scale: 0.6, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 1.5, x: h.x, y: h.y }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute z-30 pointer-events-none text-base select-none"
              >
                {h.emoji}
              </motion.span>
            ))}
          </AnimatePresence>

          {/* Avatar Image Frame */}
          <motion.div 
            animate={companionAnim}
            transition={
              companionAnim && Object.values(companionAnim).some(Array.isArray)
                ? { duration: 0.6, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 350, damping: 12 }
            }
            className={`relative w-14 h-14 rounded-full overflow-hidden border border-purple-200/50 ${CHARACTERS[activeCompanion].bgColor} shadow-md flex items-center justify-center`}
          >
            <img 
              src={CHARACTERS[activeCompanion].avatar} 
              alt={activeCompanion} 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {/* Badge saying "Click Me" */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#7C5B8C] text-white text-[7px] px-1 py-0.5 rounded font-sans font-extrabold shadow-sm whitespace-nowrap uppercase tracking-widest scale-90">
            Click Me
          </span>
        </div>

        {/* Speech Speech Bubble Content */}
        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 mb-1.5">
            <span className="font-serif font-black text-xs text-[#4E4158]">{activeCompanion}</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-[#7C5B8C] border border-[#7C5B8C]/15">
              {CHARACTERS[activeCompanion].role}
            </span>
            <span className="text-[8px] text-[#9A8AA6] font-medium hidden sm:inline">
              ∙ 點擊頭像切換心情動作 🌸
            </span>
          </div>
          <p className="text-[11px] text-[#4E4158]/95 leading-relaxed font-serif font-bold italic min-h-[32px] flex items-center justify-center sm:justify-start">
            {adviceText}
          </p>
        </div>

      </div>

    </div>
  );
}
