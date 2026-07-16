import React from 'react';

// Beautiful and high-fidelity custom SVG illustrations representing the 6 newly uploaded character drawings
// Boy: Straw hat (yellow/brown), blue hair, dark green jacket, red shirt.
// Girl: Straw hat, blue hair with braids/pigtails, green dress, pink sleeves.

export function GardenIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background soft rosy circle */}
      <circle cx="60" cy="60" r="54" fill="#FFF2F3" stroke="#FCE3E5" strokeWidth="2" />
      
      {/* Boy (Left) */}
      <g id="boy">
        {/* Hair back */}
        <path d="M35 55 C28 55, 25 70, 35 75 Z" fill="#5F88A3" />
        {/* Face */}
        <circle cx="45" cy="65" r="16" fill="#FCECE2" />
        {/* Hair front */}
        <path d="M30 58 C35 48, 55 48, 58 58 C50 56, 40 56, 30 58 Z" fill="#4B728D" />
        <path d="M34 57 C36 62, 42 62, 44 58" fill="#4B728D" />
        {/* Straw Hat */}
        <path d="M22 55 Q45 42 68 55" stroke="#E3C498" strokeWidth="6" strokeLinecap="round" />
        <path d="M32 50 Q45 35 58 50" fill="#CDAB7E" />
        <path d="M30 51 L60 51" stroke="#C54B62" strokeWidth="2" /> {/* Red hat ribbon */}
        {/* Wink Eye & smile */}
        <path d="M38 64 Q41 62 44 64" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="64" r="1.5" fill="#4A3B32" />
        <path d="M43 72 Q46 76 49 72" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Rosy Cheek */}
        <ellipse cx="37" cy="68" rx="3" ry="1.5" fill="#FA8F99" opacity="0.6" />
        <ellipse cx="55" cy="68" rx="2" ry="1" fill="#FA8F99" opacity="0.6" />
        {/* Red Shirt & Green Jacket */}
        <path d="M33 80 L57 80 L55 98 L35 98 Z" fill="#CE4D5A" />
        <path d="M30 80 C26 84, 28 94, 34 96 L37 80 Z" fill="#566F53" />
        <path d="M60 80 C64 84, 62 94, 56 96 L53 80 Z" fill="#566F53" />
      </g>

      {/* Girl (Right, Hugging) */}
      <g id="girl">
        {/* Hair braids */}
        <path d="M85 75 Q92 82 90 90" stroke="#4B728D" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M88 88 L92 92" stroke="#C54B62" strokeWidth="2" strokeLinecap="round" /> {/* Hair tie */}
        {/* Face */}
        <circle cx="70" cy="63" r="15" fill="#FCECE2" />
        {/* Hair front */}
        <path d="M56 57 C62 48, 78 48, 83 57 C75 55, 65 55, 56 57 Z" fill="#4B728D" />
        {/* Straw Hat */}
        <path d="M52 54 Q70 42 88 54" stroke="#E3C498" strokeWidth="6" strokeLinecap="round" />
        <path d="M60 49 Q70 35 80 49" fill="#CDAB7E" />
        <path d="M58 50 L82 50" stroke="#C54B62" strokeWidth="2" /> {/* Red ribbon */}
        {/* Happy closed eyes & open mouth */}
        <path d="M62 62 Q65 60 68 62" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M74 62 Q77 60 80 62" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Cute open mouth */}
        <path d="M68 69 Q71 74 74 69 Z" fill="#CE4D5A" stroke="#4A3B32" strokeWidth="1" />
        {/* Rosy Cheek */}
        <ellipse cx="61" cy="66" rx="2.5" ry="1.2" fill="#FA8F99" opacity="0.6" />
        <ellipse cx="81" cy="66" rx="2.5" ry="1.2" fill="#FA8F99" opacity="0.6" />
        {/* Pink Sleeve & Green Dress */}
        <path d="M60 77 L80 77 L78 98 L62 98 Z" fill="#566F53" />
        <path d="M55 77 Q48 83 55 90" stroke="#E3A8B1" strokeWidth="6.5" strokeLinecap="round" fill="none" /> {/* Arm hugging boy */}
      </g>
      
      {/* Sparkles / Note */}
      <path d="M98 45 Q101 42 104 45 Q101 48 98 45 Z" fill="#FBC02D" />
      <path d="M102 41 L102 49" stroke="#FBC02D" strokeWidth="1" />
      <path d="M98 45 L106 45" stroke="#FBC02D" strokeWidth="1" />
    </svg>
  );
}

export function SolitudeIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background soft indigo circle */}
      <circle cx="60" cy="60" r="54" fill="#EEF2FF" stroke="#E0E7FF" strokeWidth="2" />

      {/* Boy (Left, Surprised) */}
      <g id="boy">
        {/* Face */}
        <circle cx="43" cy="66" r="15" fill="#FCECE2" />
        {/* Hair */}
        <path d="M29 59 C34 50, 52 50, 55 59 C48 57, 38 57, 29 59 Z" fill="#4B728D" />
        {/* Straw Hat */}
        <path d="M20 56 Q42 43 64 56" stroke="#E3C498" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M30 51 Q42 36 54 51" fill="#CDAB7E" />
        <path d="M28 52 L56 52" stroke="#C54B62" strokeWidth="1.8" />
        {/* Surprised eyes & Open circular mouth */}
        <circle cx="36" cy="64" r="2" fill="#4A3B32" />
        <circle cx="48" cy="64" r="2" fill="#4A3B32" />
        <circle cx="42" cy="72" r="3.2" fill="#4A3B32" /> {/* Surprise O mouth */}
        {/* Red Shirt */}
        <path d="M31 81 L55 81 L53 98 L33 98 Z" fill="#CE4D5A" />
        <path d="M28 81 C24 85, 26 94, 31 96 L34 81 Z" fill="#566F53" />
      </g>

      {/* Girl (Right, Poking nose) */}
      <g id="girl">
        {/* Braids */}
        <path d="M84 76 Q91 83 89 91" stroke="#4B728D" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Face */}
        <circle cx="69" cy="63" r="14" fill="#FCECE2" />
        {/* Hair */}
        <path d="M56 57 C61 48, 77 48, 81 57 C73 55, 63 55, 56 57 Z" fill="#4B728D" />
        {/* Straw Hat */}
        <path d="M52 54 Q69 42 86 54" stroke="#E3C498" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M60 49 Q69 35 78 49" fill="#CDAB7E" />
        {/* Eyes (playful closed) */}
        <path d="M62 61 Q65 59 67 62" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M72 61 Q75 59 77 62" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Smile */}
        <path d="M66 69 Q69 72 72 69" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Arm reaching out poking boy's nose */}
        <path d="M60 76 Q52 70 43 68" stroke="#E3A8B1" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {/* Green Dress */}
        <path d="M60 76 L78 76 L76 98 L62 98 Z" fill="#566F53" />
      </g>
    </svg>
  );
}

export function ChessIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background soft slate/gray-pink circle */}
      <circle cx="60" cy="60" r="54" fill="#FAF5F0" stroke="#F3EBE3" strokeWidth="2" />

      {/* Boy (Left, Shy & Happy) */}
      <g id="boy">
        {/* Face */}
        <circle cx="45" cy="65" r="15" fill="#FCECE2" />
        {/* Hair */}
        <path d="M31 58 C36 49, 54 49, 57 58 C50 56, 40 56, 31 58 Z" fill="#4B728D" />
        {/* Straw Hat */}
        <path d="M22 55 Q44 42 66 55" stroke="#E3C498" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M32 50 Q44 35 56 50" fill="#CDAB7E" />
        {/* Happy curves for eyes & smile */}
        <path d="M36 63 Q39 61 41 63" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M47 63 Q49 61 51 63" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M40 70 Q43 73 46 70" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Blush / Red cheeks (really shy) */}
        <ellipse cx="37" cy="67" rx="3.5" ry="2" fill="#FF7D8A" opacity="0.75" />
        <ellipse cx="51" cy="67" rx="2.5" ry="1.5" fill="#FF7D8A" opacity="0.6" />
        {/* Red Shirt */}
        <path d="M33 79 L57 79 L55 98 L35 98 Z" fill="#CE4D5A" />
      </g>

      {/* Girl (Right, Kissing) */}
      <g id="girl">
        {/* Braids */}
        <path d="M84 75 Q91 82 89 90" stroke="#4B728D" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Face (tilted/touching boy's cheek) */}
        <circle cx="67" cy="63" r="14" fill="#FCECE2" />
        {/* Hair */}
        <path d="M54 57 C59 48, 75 48, 79 57 Z" fill="#4B728D" />
        {/* Straw Hat */}
        <path d="M50 54 Q67 42 84 54" stroke="#E3C498" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M58 49 Q67 35 76 49" fill="#CDAB7E" />
        {/* Kissing closed eye & puckered mouth */}
        <path d="M65 61 Q68 59 71 61" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M58 66 Q56 65 58 64" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" fill="none" /> {/* Puckered kiss mouth */}
        {/* Arm hugging boy's shoulder */}
        <path d="M72 76 Q62 74 54 77" stroke="#E3A8B1" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {/* Green Dress */}
        <path d="M58 76 L76 76 L74 98 L60 98 Z" fill="#566F53" />
      </g>

      {/* Floating Red Hearts */}
      <path d="M56 34 C56 31, 52 30, 52 33 C52 36, 56 38, 56 38 C56 38, 60 36, 60 33 C60 30, 56 31, 56 34 Z" fill="#E64A19" />
      <path d="M66 26 C66 24, 63 23, 63 25 C63 27, 66 29, 66 29 C66 29, 69 27, 69 25 C69 23, 66 24, 66 26 Z" fill="#E64A19" />
    </svg>
  );
}

export function EmotionsIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background soft purple/night circle */}
      <circle cx="60" cy="60" r="54" fill="#FAF5FF" stroke="#F3E8FF" strokeWidth="2" />

      {/* Striped Blanket wrapping both */}
      <path d="M28 66 C28 50, 92 50, 92 66 L86 98 L34 98 Z" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
      {/* Yellow stripes */}
      <path d="M38 60 L44 98" stroke="#FDE68A" strokeWidth="5" opacity="0.6" />
      <path d="M50 56 L54 98" stroke="#FDE68A" strokeWidth="5" opacity="0.6" />
      <path d="M62 56 L64 98" stroke="#FDE68A" strokeWidth="5" opacity="0.6" />
      <path d="M74 58 L72 98" stroke="#FDE68A" strokeWidth="5" opacity="0.6" />
      <path d="M84 62 L78 98" stroke="#FDE68A" strokeWidth="5" opacity="0.6" />

      {/* Boy Face (Left, inside blanket) */}
      <g id="boy">
        <circle cx="48" cy="60" r="11" fill="#FCECE2" />
        <path d="M38 55 C42 48, 54 48, 56 55 Z" fill="#4B728D" />
        <circle cx="44" cy="59" r="1" fill="#4A3B32" />
        <circle cx="51" cy="59" r="1" fill="#4A3B32" />
        <path d="M46 64 Q48 66 50 64" stroke="#4A3B32" strokeWidth="1" fill="none" />
      </g>

      {/* Girl Face (Right, inside blanket) */}
      <g id="girl">
        <circle cx="68" cy="59" r="11" fill="#FCECE2" />
        <path d="M58 54 C62 47, 74 47, 76 54 Z" fill="#4B728D" />
        <circle cx="64" cy="58" r="1" fill="#4A3B32" />
        <circle cx="71" cy="58" r="1" fill="#4A3B32" />
        <path d="M66 63 Q68 65 70 63" stroke="#4A3B32" strokeWidth="1" fill="none" />
      </g>

      {/* Cozy Campfire in front */}
      <g id="campfire">
        {/* Logs */}
        <rect x="44" y="93" width="30" height="4" rx="2" fill="#78350F" transform="rotate(-15 59 95)" />
        <rect x="44" y="93" width="30" height="4" rx="2" fill="#78350F" transform="rotate(15 59 95)" />
        {/* Flames */}
        <path d="M52 94 C48 88, 52 78, 58 74 C62 78, 68 84, 64 94 Z" fill="#EF4444" />
        <path d="M55 94 C52 90, 54 84, 58 81 C60 84, 64 88, 61 94 Z" fill="#F59E0B" />
      </g>
    </svg>
  );
}

export function RelationshipIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background soft emerald/green circle */}
      <circle cx="60" cy="60" r="54" fill="#ECFDF5" stroke="#D1FAE5" strokeWidth="2" />

      {/* Cute handwritten style text: "這麼這麼愛你" */}
      <text x="60" y="22" fill="#10B981" fontSize="11" fontFamily="PingFang TC, Microsoft JhengHei, sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="1">
        這麼這麼愛你
      </text>

      {/* Boy centered (Finger Hearts) */}
      <g id="boy">
        {/* Hair back */}
        <path d="M48 55 C40 55, 37 70, 48 75 Z" fill="#5F88A3" />
        {/* Face */}
        <circle cx="60" cy="65" r="16" fill="#FCECE2" />
        {/* Hair front */}
        <path d="M45 58 C50 48, 70 48, 73 58 C65 56, 55 56, 45 58 Z" fill="#4B728D" />
        <path d="M49 57 C51 62, 57 62, 59 58" fill="#4B728D" />
        {/* Straw Hat */}
        <path d="M37 55 Q60 42 83 55" stroke="#E3C498" strokeWidth="6" strokeLinecap="round" />
        <path d="M47 50 Q60 35 73 50" fill="#CDAB7E" />
        <path d="M45 51 L75 51" stroke="#C54B62" strokeWidth="2" />
        {/* Happy eyes & huge smile */}
        <path d="M51 64 Q54 62 56 64" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M64 64 Q66 62 68 64" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Smile */}
        <path d="M55 71 Q60 76 65 71" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Rosy Cheeks */}
        <ellipse cx="50" cy="68" rx="2.5" ry="1.2" fill="#FA8F99" opacity="0.6" />
        <ellipse cx="70" cy="68" rx="2.5" ry="1.2" fill="#FA8F99" opacity="0.6" />
        
        {/* Green Jacket */}
        <path d="M46 80 L74 80 L72 105 L48 105 Z" fill="#566F53" />
        <path d="M48 80 L60 105 L72 80" stroke="#FAF7F2" strokeWidth="1.5" />

        {/* Reaching hands doing finger hearts */}
        {/* Left hand */}
        <path d="M40 86 Q30 84 34 78" stroke="#FCECE2" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {/* Right hand */}
        <path d="M80 86 Q90 84 86 78" stroke="#FCECE2" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Tiny red hearts above fingers */}
        {/* Left hand heart */}
        <path d="M32 72 C32 70.5, 29.5 70, 29.5 71.5 C29.5 73, 32 74.5, 32 74.5 C32 74.5, 34.5 73, 34.5 71.5 C34.5 70, 32 70.5, 32 72 Z" fill="#EF4444" />
        {/* Right hand heart */}
        <path d="M88 72 C88 70.5, 85.5 70, 85.5 71.5 C85.5 73, 88 74.5, 88 74.5 C88 74.5, 90.5 73, 90.5 71.5 C90.5 70, 88 70.5, 88 72 Z" fill="#EF4444" />
      </g>
    </svg>
  );
}

export function DreamsIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background soft amber/orange circle */}
      <circle cx="60" cy="60" r="54" fill="#FFFBEB" stroke="#FEF3C7" strokeWidth="2" />

      {/* Cute handwritten style text: "看情況囉" */}
      <text x="60" y="22" fill="#D97706" fontSize="11" fontFamily="PingFang TC, Microsoft JhengHei, sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
        看情況囉
      </text>

      {/* Girl centered (Thinking) */}
      <g id="girl">
        {/* Braids */}
        <path d="M78 76 Q85 83 83 91" stroke="#4B728D" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {/* Face */}
        <circle cx="60" cy="64" r="16" fill="#FCECE2" />
        {/* Hair front */}
        <path d="M45 58 C50 48, 70 48, 75 58 C67 56, 57 55, 45 58 Z" fill="#4B728D" />
        {/* Straw Hat */}
        <path d="M40 55 Q60 42 80 55" stroke="#E3C498" strokeWidth="6" strokeLinecap="round" />
        <path d="M48 50 Q60 35 72 50" fill="#CDAB7E" />
        <path d="M46 51 L74 51" stroke="#C54B62" strokeWidth="2" />
        
        {/* Curious thinking eyes */}
        <path d="M51 64 C53 62, 57 62, 59 64" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Eyeballs looking sideways playfully */}
        <circle cx="56" cy="63" r="1.5" fill="#4A3B32" />
        <circle cx="66" cy="63" r="1.5" fill="#4A3B32" />
        
        {/* Subtle smirk / smile */}
        <path d="M58 71 Q61 73 64 70" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        
        {/* Rosy Cheek */}
        <ellipse cx="50" cy="68" rx="2.5" ry="1.2" fill="#FA8F99" opacity="0.6" />
        <ellipse cx="70" cy="68" rx="2.5" ry="1.2" fill="#FA8F99" opacity="0.6" />

        {/* Green Dress */}
        <path d="M48 81 L72 81 L70 105 L50 105 Z" fill="#566F53" />

        {/* Arm resting chin on hand */}
        <path d="M48 94 Q42 84 52 75" stroke="#E3A8B1" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
