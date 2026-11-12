'use strict';
/* Brain-game content from the original "Learning Games" app: memory emoji, puzzle scenes (SVG), odd-one-out groups */
const GAMES = {
  // Emoji pool for Memory (picture mode) — child-friendly
  emoji: ['🐶', '🐱', '🐰', '🐼', '🦊', '🐸', '🦁', '🐵', '🐷', '🐮',
          '🍎', '🍌', '🍇', '🍓', '🍉', '🥕', '🌽', '🍞',
          '⭐', '🌙', '☀️', '🌈', '🌻', '🌸', '🎈', '🎂'],

  // Words by letter length
  words: {
    easy:   ['CAT', 'DOG', 'SUN', 'HAT', 'BUS', 'CAR', 'PIG', 'BEE'],
    medium: ['BALL', 'FISH', 'BIRD', 'APPLE', 'HOUSE', 'TRAIN', 'CLOUD'],
    hard:   ['FLOWER', 'ORANGE', 'RABBIT', 'MONKEY', 'RAINBOW', 'PURPLE', 'BANANA', 'BUTTER', 'DOLPHIN', 'PENGUIN'],
  },

  // Mapping word → emoji (for Picture↔Word mode in Memory)
  wordToEmoji: {
    CAT: '🐱', DOG: '🐶', SUN: '☀️', HAT: '🎩', BUS: '🚌', CAR: '🚗', PIG: '🐷', BEE: '🐝',
    BALL: '⚽', FISH: '🐟', BIRD: '🐦', APPLE: '🍎', HOUSE: '🏠', TRAIN: '🚂', CLOUD: '☁️',
    FLOWER: '🌻', ORANGE: '🍊', RABBIT: '🐰', MONKEY: '🐵', RAINBOW: '🌈', PURPLE: '🟣',
    BANANA: '🍌', BUTTER: '🧈', DOLPHIN: '🐬', PENGUIN: '🐧',
  },

  // Shapes for Pattern game (rendered as SVG, referenced by name)
  shapes: ['dot', 'triangle', 'square', 'hexagon', 'star', 'circle', 'diamond'],

  // Jigsaw puzzle scenes — inline SVG illustrations, viewBox is always 600x400.
  // Each scene is designed with many distinct regions (colors, shapes, patterns)
  // so individual jigsaw pieces are visually identifiable.
  puzzleScenes: [
    {
      name: 'butterfly-garden',
      label: '🦋 Butterfly Garden',
      svg: `<rect x="0" y="0" width="600" height="200" fill="#7EC8E3"/>
        <rect x="0" y="200" width="600" height="200" fill="#9CCC65"/>
        <ellipse cx="0" cy="200" rx="600" ry="20" fill="#7CB342"/>
        <circle cx="510" cy="60" r="38" fill="#FFD600"/>
        <g stroke="#FFA726" stroke-width="4" stroke-linecap="round">
          <line x1="510" y1="10" x2="510" y2="22"/><line x1="510" y1="98" x2="510" y2="110"/>
          <line x1="450" y1="60" x2="462" y2="60"/><line x1="558" y1="60" x2="570" y2="60"/>
          <line x1="468" y1="18" x2="475" y2="25"/><line x1="552" y1="18" x2="545" y2="25"/>
        </g>
        <ellipse cx="100" cy="50" rx="55" ry="20" fill="white"/>
        <ellipse cx="120" cy="40" rx="35" ry="15" fill="white"/>
        <ellipse cx="280" cy="80" rx="45" ry="18" fill="white"/>
        <ellipse cx="380" cy="40" rx="30" ry="12" fill="white"/>
        <g transform="translate(300 200)">
          <ellipse cx="-55" cy="-20" rx="60" ry="42" fill="#EC407A"/>
          <ellipse cx="55" cy="-20" rx="60" ry="42" fill="#EC407A"/>
          <ellipse cx="-50" cy="35" rx="42" ry="32" fill="#7E57C2"/>
          <ellipse cx="50" cy="35" rx="42" ry="32" fill="#7E57C2"/>
          <circle cx="-55" cy="-20" r="14" fill="#FFEB3B"/>
          <circle cx="55" cy="-20" r="14" fill="#FFEB3B"/>
          <circle cx="-50" cy="35" r="9" fill="#FFEB3B"/>
          <circle cx="50" cy="35" r="9" fill="#FFEB3B"/>
          <circle cx="-78" cy="-30" r="6" fill="white"/>
          <circle cx="78" cy="-30" r="6" fill="white"/>
          <rect x="-3" y="-50" width="6" height="115" rx="2" fill="#3E2723"/>
          <line x1="-3" y1="-48" x2="-12" y2="-62" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="-48" x2="12" y2="-62" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/>
          <circle cx="-12" cy="-62" r="3" fill="#3E2723"/>
          <circle cx="12" cy="-62" r="3" fill="#3E2723"/>
        </g>
        <g transform="translate(70 340)"><line x1="0" y1="0" x2="0" y2="-32" stroke="#388E3C" stroke-width="3"/><circle cx="0" cy="-32" r="13" fill="#E91E63"/><circle cx="0" cy="-32" r="5" fill="#FFEB3B"/></g>
        <g transform="translate(150 360)"><line x1="0" y1="0" x2="0" y2="-25" stroke="#388E3C" stroke-width="3"/><circle cx="0" cy="-25" r="10" fill="#FF7043"/><circle cx="0" cy="-25" r="4" fill="#FFEB3B"/></g>
        <g transform="translate(450 350)"><line x1="0" y1="0" x2="0" y2="-30" stroke="#388E3C" stroke-width="3"/><circle cx="0" cy="-30" r="12" fill="#7E57C2"/><circle cx="0" cy="-30" r="4" fill="#FFEB3B"/></g>
        <g transform="translate(540 365)"><line x1="0" y1="0" x2="0" y2="-22" stroke="#388E3C" stroke-width="3"/><circle cx="0" cy="-22" r="9" fill="#FFC107"/></g>
        <g transform="translate(385 295)">
          <ellipse cx="0" cy="0" rx="14" ry="9" fill="#FFD600"/>
          <rect x="-9" y="-9" width="3" height="18" fill="#000"/><rect x="-3" y="-9" width="3" height="18" fill="#000"/>
          <rect x="3" y="-9" width="3" height="18" fill="#000"/>
          <ellipse cx="-13" cy="-7" rx="6" ry="3" fill="white" opacity="0.8"/>
          <ellipse cx="13" cy="-7" rx="6" ry="3" fill="white" opacity="0.8"/>
        </g>
        <g transform="translate(115 365)">
          <ellipse cx="0" cy="0" rx="20" ry="14" fill="white"/>
          <circle cx="0" cy="-20" r="13" fill="white"/>
          <ellipse cx="-5" cy="-32" rx="3" ry="9" fill="white"/>
          <ellipse cx="5" cy="-32" rx="3" ry="9" fill="white"/>
          <circle cx="-5" cy="-20" r="2" fill="black"/>
          <circle cx="5" cy="-20" r="2" fill="black"/>
          <path d="M -2 -15 Q 0 -12 2 -15" stroke="black" stroke-width="1" fill="none"/>
        </g>
        <g transform="translate(220 340)" fill="#558B2F"><polygon points="0,0 -8,-14 8,-14"/></g>
        <g transform="translate(490 330)" fill="#558B2F"><polygon points="0,0 -10,-16 10,-16"/></g>`,
    },
    {
      name: 'snow-castle',
      label: '❄️ Snow Castle',
      svg: `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A237E"/><stop offset="1" stop-color="#7986CB"/></linearGradient></defs>
        <rect x="0" y="0" width="600" height="400" fill="url(#sky)"/>
        <g fill="white">
          <circle cx="40" cy="30" r="2"/><circle cx="120" cy="50" r="2.5"/><circle cx="200" cy="20" r="2"/>
          <circle cx="280" cy="60" r="1.8"/><circle cx="360" cy="35" r="2.2"/><circle cx="440" cy="55" r="1.5"/>
          <circle cx="80" cy="90" r="1.5"/><circle cx="240" cy="100" r="1.8"/><circle cx="380" cy="95" r="2"/>
          <circle cx="560" cy="40" r="2"/><circle cx="20" cy="120" r="1.5"/>
        </g>
        <circle cx="510" cy="70" r="42" fill="#FFF9C4"/>
        <circle cx="500" cy="60" r="35" fill="#1A237E"/>
        <polygon points="0,260 80,170 160,230 260,160 340,210 420,140 500,200 600,170 600,400 0,400" fill="#9FA8DA"/>
        <polygon points="0,290 60,235 150,275 230,220 320,265 400,225 470,255 600,230 600,400 0,400" fill="#7986CB"/>
        <polygon points="0,320 90,290 180,310 280,285 370,305 470,290 600,300 600,400 0,400" fill="#5C6BC0"/>
        <g transform="translate(250 180)">
          <rect x="-65" y="20" width="130" height="120" fill="#E1F5FE"/>
          <rect x="-90" y="40" width="40" height="100" fill="#B3E5FC"/>
          <rect x="50" y="40" width="40" height="100" fill="#B3E5FC"/>
          <polygon points="-90,40 -70,5 -50,40" fill="#0288D1"/>
          <polygon points="-25,20 0,-15 25,20" fill="#0288D1"/>
          <polygon points="50,40 70,5 90,40" fill="#0288D1"/>
          <rect x="-15" y="60" width="30" height="60" rx="15" fill="#01579B"/>
          <rect x="-77" y="60" width="14" height="20" fill="#01579B"/>
          <rect x="-77" y="100" width="14" height="20" fill="#01579B"/>
          <rect x="63" y="60" width="14" height="20" fill="#01579B"/>
          <rect x="63" y="100" width="14" height="20" fill="#01579B"/>
          <rect x="-83" y="32" width="6" height="6" fill="#E1F5FE"/><rect x="-71" y="32" width="6" height="6" fill="#E1F5FE"/><rect x="-59" y="32" width="6" height="6" fill="#E1F5FE"/>
          <rect x="-58" y="14" width="6" height="6" fill="#E1F5FE"/><rect x="-46" y="14" width="6" height="6" fill="#E1F5FE"/><rect x="42" y="14" width="6" height="6" fill="#E1F5FE"/>
          <rect x="53" y="32" width="6" height="6" fill="#E1F5FE"/><rect x="65" y="32" width="6" height="6" fill="#E1F5FE"/><rect x="77" y="32" width="6" height="6" fill="#E1F5FE"/>
        </g>
        <g fill="white" stroke="#E3F2FD" stroke-width="0.5">
          <g transform="translate(70 100)"><line x1="-7" y1="0" x2="7" y2="0" stroke="white" stroke-width="2"/><line x1="0" y1="-7" x2="0" y2="7" stroke="white" stroke-width="2"/><line x1="-5" y1="-5" x2="5" y2="5" stroke="white" stroke-width="2"/><line x1="-5" y1="5" x2="5" y2="-5" stroke="white" stroke-width="2"/></g>
          <g transform="translate(180 130)"><line x1="-6" y1="0" x2="6" y2="0" stroke="white" stroke-width="2"/><line x1="0" y1="-6" x2="0" y2="6" stroke="white" stroke-width="2"/></g>
          <g transform="translate(420 110)"><line x1="-7" y1="0" x2="7" y2="0" stroke="white" stroke-width="2"/><line x1="0" y1="-7" x2="0" y2="7" stroke="white" stroke-width="2"/><line x1="-5" y1="-5" x2="5" y2="5" stroke="white" stroke-width="2"/><line x1="-5" y1="5" x2="5" y2="-5" stroke="white" stroke-width="2"/></g>
          <g transform="translate(540 150)"><line x1="-6" y1="0" x2="6" y2="0" stroke="white" stroke-width="2"/><line x1="0" y1="-6" x2="0" y2="6" stroke="white" stroke-width="2"/></g>
        </g>
        <path d="M 0 360 Q 100 340 200 360 T 400 358 T 600 360 L 600 400 L 0 400 Z" fill="white"/>
        <path d="M 0 380 Q 150 370 300 380 T 600 378 L 600 400 L 0 400 Z" fill="#F5F5F5"/>
        <g transform="translate(80 360)"><circle cx="0" cy="-12" r="14" fill="white"/><circle cx="0" cy="-30" r="11" fill="white"/><circle cx="0" cy="-44" r="8" fill="white"/><circle cx="-2" cy="-46" r="1" fill="black"/><circle cx="2" cy="-46" r="1" fill="black"/><polygon points="0,-43 -1,-40 3,-42" fill="orange"/></g>
        <g transform="translate(490 365)"><circle cx="0" cy="-13" r="13" fill="white"/><circle cx="0" cy="-29" r="10" fill="white"/><circle cx="0" cy="-42" r="7" fill="white"/><line x1="-12" y1="-13" x2="-22" y2="-18" stroke="#5D4037" stroke-width="2"/><line x1="12" y1="-13" x2="22" y2="-18" stroke="#5D4037" stroke-width="2"/></g>
        <g transform="translate(180 345)" fill="#1B5E20"><polygon points="0,0 -12,-25 12,-25"/><polygon points="0,-15 -10,-35 10,-35"/></g>
        <g transform="translate(420 350)" fill="#1B5E20"><polygon points="0,0 -10,-22 10,-22"/></g>`,
    },
    {
      name: 'magic-lamp',
      label: '🪔 Magic Lamp',
      svg: `<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#311B92"/><stop offset="0.5" stop-color="#E91E63"/><stop offset="1" stop-color="#FF9800"/></linearGradient></defs>
        <rect x="0" y="0" width="600" height="400" fill="url(#dusk)"/>
        <circle cx="120" cy="80" r="32" fill="#FFF59D"/>
        <circle cx="105" cy="70" r="28" fill="url(#dusk)"/>
        <g fill="#FFF59D">
          <circle cx="50" cy="40" r="2"/><circle cx="200" cy="30" r="2"/><circle cx="320" cy="50" r="2.5"/>
          <circle cx="450" cy="35" r="2"/><circle cx="520" cy="60" r="2.5"/><circle cx="180" cy="80" r="1.5"/>
          <circle cx="380" cy="90" r="2"/><circle cx="560" cy="100" r="1.8"/>
        </g>
        <polygon points="0,260 80,200 200,250 350,180 450,240 600,200 600,400 0,400" fill="#FFB74D"/>
        <polygon points="0,300 100,260 250,290 380,250 500,280 600,260 600,400 0,400" fill="#FFA726"/>
        <polygon points="0,340 80,310 200,330 350,305 480,330 600,315 600,400 0,400" fill="#FF9800"/>
        <ellipse cx="450" cy="335" rx="80" ry="12" fill="#42A5F5"/>
        <ellipse cx="450" cy="335" rx="60" ry="8" fill="#64B5F6"/>
        <g transform="translate(95 220)">
          <rect x="-15" y="0" width="30" height="100" fill="#5D4037"/>
          <g fill="#2E7D32">
            <ellipse cx="-25" cy="-10" rx="35" ry="12" transform="rotate(-25)"/>
            <ellipse cx="25" cy="-10" rx="35" ry="12" transform="rotate(25)"/>
            <ellipse cx="0" cy="-30" rx="38" ry="14"/>
            <ellipse cx="-30" cy="-25" rx="32" ry="11" transform="rotate(-50)"/>
            <ellipse cx="30" cy="-25" rx="32" ry="11" transform="rotate(50)"/>
          </g>
          <circle cx="0" cy="-15" r="6" fill="#8D6E63"/>
          <circle cx="-15" cy="-12" r="5" fill="#8D6E63"/>
          <circle cx="15" cy="-12" r="5" fill="#8D6E63"/>
        </g>
        <g transform="translate(530 250)">
          <rect x="-10" y="0" width="20" height="80" fill="#5D4037"/>
          <g fill="#2E7D32">
            <ellipse cx="-20" cy="-8" rx="28" ry="10" transform="rotate(-30)"/>
            <ellipse cx="20" cy="-8" rx="28" ry="10" transform="rotate(30)"/>
            <ellipse cx="0" cy="-22" rx="30" ry="11"/>
          </g>
        </g>
        <g transform="translate(300 245)">
          <ellipse cx="0" cy="0" rx="80" ry="22" fill="#FFD700"/>
          <ellipse cx="0" cy="-5" rx="60" ry="18" fill="#FFC107"/>
          <ellipse cx="0" cy="-12" rx="36" ry="14" fill="#FFAB00"/>
          <path d="M 60 -8 Q 95 -15 100 -28 Q 110 -22 105 -10 L 80 -2 Z" fill="#FFC107"/>
          <ellipse cx="100" cy="-25" r="6" fill="#FFD700"/>
          <rect x="-3" y="-22" width="6" height="14" fill="#FFAB00"/>
          <ellipse cx="0" cy="-25" rx="12" ry="6" fill="#FFA000"/>
          <g transform="translate(10 -32)" fill="#FF6F00" opacity="0.8">
            <path d="M 0 0 Q -8 -14 0 -28 Q 8 -14 0 0 Z"/>
            <path d="M -10 -3 Q -16 -18 -8 -25 Q -2 -16 -10 -3 Z"/>
            <path d="M 10 -3 Q 16 -18 8 -25 Q 2 -16 10 -3 Z"/>
          </g>
        </g>
        <g transform="translate(380 130)">
          <rect x="-30" y="-3" width="60" height="6" fill="#9C27B0" rx="2"/>
          <path d="M -30 0 Q -45 8 -30 12 L 30 12 Q 45 8 30 0 Z" fill="#7B1FA2"/>
          <rect x="-26" y="-3" width="3" height="6" fill="#FFC107"/>
          <rect x="-15" y="-3" width="3" height="6" fill="#FFC107"/>
          <rect x="-4" y="-3" width="3" height="6" fill="#FFC107"/>
          <rect x="7" y="-3" width="3" height="6" fill="#FFC107"/>
          <rect x="18" y="-3" width="3" height="6" fill="#FFC107"/>
          <path d="M -28 12 L -32 22 L -10 16 L 0 22 L 10 16 L 32 22 L 28 12 Z" fill="#6A1B9A"/>
        </g>
        <g transform="translate(220 340)" fill="#FFCA28"><circle cx="0" cy="0" r="6"/><circle cx="-15" cy="3" r="4"/><circle cx="15" cy="3" r="4"/></g>`,
    },
    {
      name: 'coral-reef',
      label: '🧜 Coral Reef',
      svg: `<defs><linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#01579B"/><stop offset="0.5" stop-color="#0277BD"/><stop offset="1" stop-color="#0288D1"/></linearGradient></defs>
        <rect x="0" y="0" width="600" height="400" fill="url(#ocean)"/>
        <g fill="white" opacity="0.6">
          <circle cx="60" cy="50" r="6"/><circle cx="55" cy="40" r="3"/>
          <circle cx="180" cy="80" r="5"/><circle cx="185" cy="70" r="3"/>
          <circle cx="320" cy="40" r="7"/><circle cx="315" cy="30" r="3"/>
          <circle cx="450" cy="70" r="5"/><circle cx="460" cy="60" r="3"/>
          <circle cx="540" cy="100" r="6"/>
          <circle cx="100" cy="180" r="4"/><circle cx="280" cy="200" r="5"/><circle cx="500" cy="220" r="4"/>
        </g>
        <ellipse cx="0" cy="370" rx="600" ry="40" fill="#FDD835"/>
        <ellipse cx="100" cy="370" rx="80" ry="15" fill="#FBC02D"/>
        <ellipse cx="350" cy="375" rx="100" ry="15" fill="#FBC02D"/>
        <g transform="translate(80 320)">
          <path d="M 0 50 Q -20 20 -10 -10 Q 0 -30 0 -50 Q 5 -30 15 -10 Q 25 20 0 50 Z" fill="#E91E63"/>
          <circle cx="0" cy="-30" r="6" fill="#F8BBD0"/>
          <circle cx="-8" cy="0" r="5" fill="#F8BBD0"/>
          <circle cx="8" cy="20" r="5" fill="#F8BBD0"/>
        </g>
        <g transform="translate(200 330)">
          <path d="M 0 40 Q -15 10 -5 -20 Q 0 -40 5 -20 Q 15 10 0 40 Z" fill="#FF6F00"/>
          <path d="M -20 30 Q -30 0 -25 -25 Q -15 -10 -20 30 Z" fill="#FF8F00"/>
          <path d="M 20 30 Q 30 0 25 -25 Q 15 -10 20 30 Z" fill="#FF8F00"/>
        </g>
        <g transform="translate(420 325)">
          <path d="M 0 45 Q -25 15 -15 -15 Q 0 -40 0 -50 Q 8 -30 18 -15 Q 28 15 0 45 Z" fill="#9C27B0"/>
          <circle cx="-5" cy="-30" r="7" fill="#CE93D8"/>
          <circle cx="6" cy="-15" r="6" fill="#CE93D8"/>
          <circle cx="-2" cy="10" r="5" fill="#CE93D8"/>
        </g>
        <g transform="translate(530 340)">
          <path d="M 0 30 Q -15 5 -8 -20 Q 0 -30 8 -20 Q 15 5 0 30 Z" fill="#00BCD4"/>
        </g>
        <g transform="translate(150 250)">
          <ellipse cx="0" cy="0" rx="32" ry="18" fill="#FFEB3B"/>
          <polygon points="-32,0 -50,-12 -50,12" fill="#F9A825"/>
          <circle cx="14" cy="-3" r="4" fill="white"/>
          <circle cx="14" cy="-3" r="2" fill="black"/>
          <path d="M -10 0 Q -3 -6 5 0 T 22 0" stroke="#F9A825" stroke-width="2" fill="none"/>
          <path d="M -10 5 Q -3 11 5 5 T 22 5" stroke="#F9A825" stroke-width="2" fill="none"/>
        </g>
        <g transform="translate(360 180)">
          <ellipse cx="0" cy="0" rx="28" ry="16" fill="#E91E63"/>
          <polygon points="-28,0 -42,-10 -42,10" fill="#AD1457"/>
          <circle cx="12" cy="-2" r="3.5" fill="white"/>
          <circle cx="12" cy="-2" r="1.8" fill="black"/>
          <path d="M -8 0 Q 0 -5 6 0 T 18 0" stroke="white" stroke-width="2" fill="none"/>
        </g>
        <g transform="translate(480 270)">
          <ellipse cx="0" cy="0" rx="22" ry="13" fill="#7E57C2"/>
          <polygon points="-22,0 -34,-9 -34,9" fill="#4527A0"/>
          <circle cx="9" cy="-2" r="3" fill="white"/>
          <circle cx="9" cy="-2" r="1.5" fill="black"/>
        </g>
        <g transform="translate(50 220)">
          <ellipse cx="0" cy="0" rx="20" ry="11" fill="#FF7043"/>
          <polygon points="-20,0 -30,-8 -30,8" fill="#D84315"/>
          <circle cx="8" cy="-2" r="2.5" fill="white"/>
        </g>
        <g transform="translate(280 270)">
          <rect x="-30" y="-25" width="60" height="40" rx="4" fill="#5D4037"/>
          <rect x="-30" y="-30" width="60" height="10" rx="4" fill="#3E2723"/>
          <rect x="-3" y="-25" width="6" height="40" fill="#FFC107"/>
          <circle cx="0" cy="-5" r="4" fill="#FFD54F"/>
          <circle cx="-12" cy="-15" r="3" fill="#FFD600" opacity="0.9"/>
          <circle cx="14" cy="-12" r="3" fill="#FFD600" opacity="0.9"/>
          <circle cx="-22" cy="-5" r="2" fill="#FFD600" opacity="0.9"/>
          <circle cx="20" cy="-5" r="2" fill="#FFD600" opacity="0.9"/>
        </g>`,
    },
    {
      name: 'dragon-mountain',
      label: '🐉 Dragon Mountain',
      svg: `<defs><linearGradient id="mountSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFCDD2"/><stop offset="0.6" stop-color="#FFE0B2"/><stop offset="1" stop-color="#FFF59D"/></linearGradient></defs>
        <rect x="0" y="0" width="600" height="400" fill="url(#mountSky)"/>
        <circle cx="510" cy="80" r="48" fill="#FFCA28"/>
        <circle cx="510" cy="80" r="36" fill="#FFB300"/>
        <g fill="white" opacity="0.85">
          <ellipse cx="80" cy="50" rx="40" ry="12"/><ellipse cx="100" cy="40" rx="30" ry="10"/>
          <ellipse cx="280" cy="60" rx="35" ry="11"/>
          <ellipse cx="400" cy="35" rx="30" ry="10"/>
        </g>
        <polygon points="0,250 100,140 200,210 300,120 400,200 500,150 600,220 600,400 0,400" fill="#7E57C2"/>
        <polygon points="0,290 90,210 180,260 270,200 350,250 460,210 550,260 600,240 600,400 0,400" fill="#5E35B2"/>
        <polygon points="200,180 230,145 260,180" fill="white"/>
        <polygon points="350,165 380,130 410,165" fill="white"/>
        <g transform="translate(120 280)">
          <rect x="-50" y="0" width="100" height="60" fill="#D32F2F"/>
          <polygon points="-60,0 0,-30 60,0" fill="#B71C1C"/>
          <polygon points="-60,0 -65,15 -55,15" fill="#FFB300"/>
          <polygon points="60,0 65,15 55,15" fill="#FFB300"/>
          <rect x="-40" y="20" width="20" height="30" fill="#FFA000"/>
          <rect x="20" y="20" width="20" height="30" fill="#FFA000"/>
          <rect x="-8" y="30" width="16" height="30" fill="#3E2723"/>
          <rect x="-50" y="60" width="100" height="6" fill="#212121"/>
          <rect x="-30" y="-22" width="60" height="6" fill="#FFB300"/>
        </g>
        <g transform="translate(120 235)">
          <rect x="-30" y="-15" width="60" height="30" fill="#D32F2F"/>
          <polygon points="-40,-15 0,-35 40,-15" fill="#B71C1C"/>
          <rect x="-3" y="-12" width="6" height="20" fill="#FFB300"/>
        </g>
        <g transform="translate(380 320)">
          <path d="M -80 0 Q -60 -30 -30 -10 Q 0 -35 30 -10 Q 60 -30 80 0 Q 60 20 30 10 Q 0 30 -30 10 Q -60 20 -80 0 Z" fill="#388E3C"/>
          <circle cx="-60" cy="-10" r="6" fill="#FF6B9D"/>
          <circle cx="-40" cy="-15" r="5" fill="#FF8A95"/>
          <circle cx="-20" cy="-8" r="6" fill="#FF6B9D"/>
          <circle cx="0" cy="-18" r="6" fill="#FF8A95"/>
          <circle cx="20" cy="-8" r="5" fill="#FF6B9D"/>
          <circle cx="40" cy="-12" r="6" fill="#FF8A95"/>
          <circle cx="60" cy="-5" r="5" fill="#FF6B9D"/>
          <rect x="-3" y="0" width="6" height="20" fill="#5D4037"/>
        </g>
        <g transform="translate(460 200)">
          <ellipse cx="0" cy="0" rx="80" ry="20" fill="#43A047" transform="rotate(-15)"/>
          <ellipse cx="0" cy="-5" rx="40" ry="14" fill="#66BB6A" transform="rotate(15)"/>
          <circle cx="-20" cy="-4" r="5" fill="#FFAB91"/>
          <circle cx="0" cy="-10" r="5" fill="#FF8A65"/>
          <circle cx="20" cy="-2" r="5" fill="#FFAB91"/>
        </g>
        <g transform="translate(300 180)">
          <path d="M -100 0 Q -80 -30 -50 -20 Q -20 -10 0 -30 Q 30 -50 60 -30 Q 90 -10 110 -25 Q 120 -10 110 5 Q 90 25 60 15 Q 30 0 0 20 Q -30 35 -50 25 Q -80 20 -100 35 Q -110 20 -100 0 Z" fill="#2E7D32"/>
          <path d="M 110 -25 L 130 -35 L 125 -22 L 140 -25 L 130 -10 L 145 -8 Z" fill="#FF6F00"/>
          <circle cx="120" cy="-22" r="3" fill="#FFF59D"/>
          <circle cx="115" cy="-15" r="2" fill="black"/>
          <line x1="125" y1="-22" x2="135" y2="-30" stroke="#FF6F00" stroke-width="2"/>
          <line x1="125" y1="-22" x2="138" y2="-15" stroke="#FF6F00" stroke-width="2"/>
          <g fill="#FFB74D">
            <circle cx="-80" cy="-2" r="3"/><circle cx="-50" cy="-12" r="3"/>
            <circle cx="-20" cy="-22" r="3"/><circle cx="10" cy="-30" r="3"/>
            <circle cx="40" cy="-32" r="3"/><circle cx="70" cy="-22" r="3"/>
          </g>
        </g>
        <g transform="translate(50 100)">
          <rect x="-8" y="0" width="16" height="50" fill="#D32F2F"/>
          <ellipse cx="0" cy="0" rx="14" ry="6" fill="#FFA000"/>
          <ellipse cx="0" cy="50" rx="12" ry="4" fill="#FFA000"/>
        </g>
        <g transform="translate(550 130)">
          <rect x="-8" y="0" width="16" height="50" fill="#D32F2F"/>
          <ellipse cx="0" cy="0" rx="14" ry="6" fill="#FFA000"/>
          <ellipse cx="0" cy="50" rx="12" ry="4" fill="#FFA000"/>
        </g>`,
    },
    {
      name: 'ocean-island',
      label: '🌺 Island Voyage',
      svg: `<defs><linearGradient id="islSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FC3F7"/><stop offset="1" stop-color="#FFE082"/></linearGradient></defs>
        <rect x="0" y="0" width="600" height="400" fill="url(#islSky)"/>
        <circle cx="510" cy="100" r="40" fill="#FFD54F"/>
        <g stroke="#FFA000" stroke-width="3" stroke-linecap="round">
          <line x1="510" y1="50" x2="510" y2="58"/><line x1="510" y1="142" x2="510" y2="150"/>
          <line x1="460" y1="100" x2="468" y2="100"/><line x1="552" y1="100" x2="560" y2="100"/>
          <line x1="475" y1="65" x2="481" y2="71"/><line x1="545" y1="65" x2="539" y2="71"/>
        </g>
        <ellipse cx="100" cy="60" rx="45" ry="14" fill="white"/>
        <ellipse cx="120" cy="50" rx="32" ry="10" fill="white"/>
        <ellipse cx="350" cy="80" rx="38" ry="12" fill="white"/>
        <rect x="0" y="220" width="600" height="180" fill="#0288D1"/>
        <path d="M 0 220 Q 100 215 200 222 T 400 220 T 600 222 L 600 235 L 0 235 Z" fill="#03A9F4"/>
        <path d="M 0 250 Q 80 248 160 252 T 320 250 T 480 252 T 600 250 L 600 260 L 0 260 Z" fill="#4FC3F7" opacity="0.6"/>
        <path d="M 0 300 Q 90 295 180 303 T 360 300 T 540 302 T 600 300 L 600 308 L 0 308 Z" fill="#81D4FA" opacity="0.6"/>
        <path d="M 0 350 Q 100 345 200 352 T 400 350 T 600 352 L 600 358 L 0 358 Z" fill="#B3E5FC" opacity="0.6"/>
        <path d="M 100 240 Q 200 200 350 230 Q 500 250 540 240 L 540 280 L 100 280 Z" fill="#FBC02D"/>
        <path d="M 100 240 Q 200 200 350 230 Q 500 250 540 240 L 540 270 L 100 270 Z" fill="#FFD54F"/>
        <ellipse cx="200" cy="245" rx="12" ry="3" fill="#FFA000"/>
        <ellipse cx="380" cy="248" rx="15" ry="4" fill="#FFA000"/>
        <ellipse cx="450" cy="246" rx="10" ry="3" fill="#FFA000"/>
        <g transform="translate(180 230)">
          <path d="M -3 0 Q -8 -50 -3 -100 L 3 -100 Q 8 -50 3 0 Z" fill="#5D4037"/>
          <g fill="#2E7D32">
            <ellipse cx="-30" cy="-100" rx="42" ry="10" transform="rotate(-25)"/>
            <ellipse cx="30" cy="-100" rx="42" ry="10" transform="rotate(25)"/>
            <ellipse cx="-25" cy="-115" rx="38" ry="9" transform="rotate(-50)"/>
            <ellipse cx="25" cy="-115" rx="38" ry="9" transform="rotate(50)"/>
            <ellipse cx="0" cy="-120" rx="40" ry="11"/>
          </g>
          <circle cx="-3" cy="-95" r="5" fill="#8D6E63"/>
          <circle cx="5" cy="-92" r="4" fill="#8D6E63"/>
          <circle cx="-2" cy="-88" r="4" fill="#A1887F"/>
        </g>
        <g transform="translate(440 230)">
          <path d="M -2 0 Q -6 -45 -2 -90 L 2 -90 Q 6 -45 2 0 Z" fill="#5D4037"/>
          <g fill="#388E3C">
            <ellipse cx="-25" cy="-90" rx="38" ry="9" transform="rotate(-25)"/>
            <ellipse cx="25" cy="-90" rx="38" ry="9" transform="rotate(25)"/>
            <ellipse cx="0" cy="-105" rx="36" ry="10"/>
          </g>
        </g>
        <g transform="translate(120 230)">
          <ellipse cx="0" cy="0" rx="14" ry="14" fill="#E91E63"/>
          <ellipse cx="-10" cy="-5" rx="9" ry="9" fill="#F06292"/>
          <ellipse cx="10" cy="-5" rx="9" ry="9" fill="#F06292"/>
          <ellipse cx="-7" cy="6" rx="8" ry="8" fill="#F06292"/>
          <ellipse cx="7" cy="6" rx="8" ry="8" fill="#F06292"/>
          <circle cx="0" cy="0" r="5" fill="#FFEB3B"/>
        </g>
        <g transform="translate(485 220)">
          <ellipse cx="0" cy="0" rx="12" ry="12" fill="#FF6F00"/>
          <ellipse cx="-8" cy="-4" rx="7" ry="7" fill="#FFB74D"/>
          <ellipse cx="8" cy="-4" rx="7" ry="7" fill="#FFB74D"/>
          <ellipse cx="-6" cy="5" rx="7" ry="7" fill="#FFB74D"/>
          <ellipse cx="6" cy="5" rx="7" ry="7" fill="#FFB74D"/>
          <circle cx="0" cy="0" r="4" fill="#FFEB3B"/>
        </g>
        <g transform="translate(300 320)">
          <path d="M -55 0 Q -55 25 -45 30 L 45 30 Q 55 25 55 0 Z" fill="#6D4C41"/>
          <path d="M -55 0 Q -45 -8 0 -8 Q 45 -8 55 0 Z" fill="#8D6E63"/>
          <rect x="-2" y="-50" width="4" height="50" fill="#5D4037"/>
          <polygon points="2,-50 30,-30 2,-30" fill="#FFE082"/>
          <line x1="-50" y1="5" x2="50" y2="5" stroke="#5D4037" stroke-width="1"/>
          <line x1="-48" y1="15" x2="48" y2="15" stroke="#5D4037" stroke-width="1"/>
          <line x1="-45" y1="25" x2="45" y2="25" stroke="#5D4037" stroke-width="1"/>
        </g>
        <g transform="translate(80 320)" fill="#0288D1"><path d="M 0 0 Q 5 -8 10 0 Q 15 8 20 0" stroke="#01579B" stroke-width="2" fill="none"/></g>
        <g transform="translate(490 350)" fill="#0288D1"><path d="M 0 0 Q 5 -8 10 0 Q 15 8 20 0" stroke="#01579B" stroke-width="2" fill="none"/></g>
        <g transform="translate(550 285)">
          <path d="M 0 0 Q -5 -3 -10 0 L -10 4 Q -5 7 0 4 Z" fill="white"/>
          <circle cx="0" cy="2" r="1" fill="black"/>
          <path d="M 0 2 L 8 -2 L 8 6 Z" fill="white"/>
        </g>
        <g transform="translate(50 290)">
          <path d="M 0 0 Q -4 -2 -8 0 L -8 3 Q -4 5 0 3 Z" fill="white"/>
          <circle cx="0" cy="1" r="0.8" fill="black"/>
          <path d="M 0 1 L 6 -2 L 6 5 Z" fill="white"/>
        </g>`,
    },
    {
      name: 'flower-meadow',
      label: '🌻 Flower Meadow',
      svg: `<defs><linearGradient id="meadowSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#81D4FA"/><stop offset="1" stop-color="#E1F5FE"/></linearGradient></defs>
        <rect x="0" y="0" width="600" height="400" fill="url(#meadowSky)"/>
        <rect x="0" y="220" width="600" height="180" fill="#9CCC65"/>
        <circle cx="510" cy="60" r="35" fill="#FFD600"/>
        <g stroke="#FFA726" stroke-width="3" stroke-linecap="round">
          <line x1="510" y1="15" x2="510" y2="22"/><line x1="510" y1="98" x2="510" y2="105"/>
          <line x1="465" y1="60" x2="472" y2="60"/><line x1="548" y1="60" x2="555" y2="60"/>
        </g>
        <ellipse cx="120" cy="50" rx="40" ry="14" fill="white"/>
        <ellipse cx="140" cy="40" rx="28" ry="10" fill="white"/>
        <ellipse cx="350" cy="70" rx="35" ry="12" fill="white"/>
        <ellipse cx="0" cy="220" rx="600" ry="20" fill="#7CB342"/>
        <g transform="translate(60 320)">
          <line x1="0" y1="0" x2="0" y2="-50" stroke="#388E3C" stroke-width="4"/>
          <ellipse cx="-12" cy="-30" rx="14" ry="6" fill="#388E3C" transform="rotate(-30 -12 -30)"/>
          <ellipse cx="0" cy="-50" rx="22" ry="22" fill="#FFEB3B"/>
          <g fill="#FFD600"><circle cx="-15" cy="-50" r="10"/><circle cx="15" cy="-50" r="10"/><circle cx="0" cy="-65" r="10"/><circle cx="0" cy="-35" r="10"/></g>
          <circle cx="0" cy="-50" r="9" fill="#5D4037"/>
        </g>
        <g transform="translate(140 350)">
          <line x1="0" y1="0" x2="0" y2="-30" stroke="#388E3C" stroke-width="3"/>
          <g fill="#E91E63">
            <circle cx="0" cy="-30" r="8"/><circle cx="-8" cy="-26" r="6"/><circle cx="8" cy="-26" r="6"/>
            <circle cx="-5" cy="-36" r="6"/><circle cx="5" cy="-36" r="6"/>
          </g>
          <circle cx="0" cy="-30" r="3" fill="#FFEB3B"/>
        </g>
        <g transform="translate(220 340)">
          <line x1="0" y1="0" x2="0" y2="-32" stroke="#388E3C" stroke-width="3"/>
          <g fill="#9C27B0">
            <ellipse cx="0" cy="-32" rx="12" ry="9"/>
            <ellipse cx="-10" cy="-25" rx="6" ry="9" transform="rotate(-30)"/>
            <ellipse cx="10" cy="-25" rx="6" ry="9" transform="rotate(30)"/>
          </g>
          <circle cx="0" cy="-32" r="3" fill="#FFEB3B"/>
        </g>
        <g transform="translate(300 360)">
          <line x1="0" y1="0" x2="0" y2="-25" stroke="#388E3C" stroke-width="3"/>
          <g fill="#FF7043">
            <circle cx="0" cy="-25" r="8"/>
            <circle cx="-7" cy="-21" r="6"/><circle cx="7" cy="-21" r="6"/>
            <circle cx="-4" cy="-30" r="6"/><circle cx="4" cy="-30" r="6"/>
          </g>
          <circle cx="0" cy="-25" r="3" fill="#FFEB3B"/>
        </g>
        <g transform="translate(380 340)">
          <line x1="0" y1="0" x2="0" y2="-32" stroke="#388E3C" stroke-width="3"/>
          <g fill="#03A9F4">
            <ellipse cx="0" cy="-32" rx="11" ry="8"/>
            <ellipse cx="-9" cy="-26" rx="6" ry="9" transform="rotate(-30)"/>
            <ellipse cx="9" cy="-26" rx="6" ry="9" transform="rotate(30)"/>
            <ellipse cx="-7" cy="-37" rx="7" ry="6" transform="rotate(-50)"/>
            <ellipse cx="7" cy="-37" rx="7" ry="6" transform="rotate(50)"/>
          </g>
          <circle cx="0" cy="-32" r="3" fill="#FFEB3B"/>
        </g>
        <g transform="translate(470 350)">
          <line x1="0" y1="0" x2="0" y2="-28" stroke="#388E3C" stroke-width="3"/>
          <g fill="#F8BBD0">
            <circle cx="0" cy="-28" r="9"/>
            <circle cx="-6" cy="-23" r="5"/><circle cx="6" cy="-23" r="5"/>
            <circle cx="-4" cy="-33" r="5"/><circle cx="4" cy="-33" r="5"/>
          </g>
          <circle cx="0" cy="-28" r="3" fill="#FFD600"/>
        </g>
        <g transform="translate(540 365)">
          <line x1="0" y1="0" x2="0" y2="-22" stroke="#388E3C" stroke-width="3"/>
          <circle cx="0" cy="-22" r="9" fill="#FFC107"/>
          <circle cx="0" cy="-22" r="3" fill="#5D4037"/>
        </g>
        <g transform="translate(200 200)">
          <ellipse cx="-10" cy="0" rx="10" ry="8" fill="#FF6B9D"/>
          <ellipse cx="10" cy="0" rx="10" ry="8" fill="#FF6B9D"/>
          <ellipse cx="-8" cy="6" rx="7" ry="6" fill="#7E57C2"/>
          <ellipse cx="8" cy="6" rx="7" ry="6" fill="#7E57C2"/>
          <rect x="-1" y="-7" width="2" height="14" fill="#3E2723"/>
        </g>
        <g transform="translate(420 180)">
          <ellipse cx="-8" cy="0" rx="9" ry="7" fill="#FFEB3B"/>
          <ellipse cx="8" cy="0" rx="9" ry="7" fill="#FFEB3B"/>
          <ellipse cx="-6" cy="5" rx="6" ry="5" fill="#FFA726"/>
          <ellipse cx="6" cy="5" rx="6" ry="5" fill="#FFA726"/>
          <rect x="-1" y="-6" width="2" height="12" fill="#3E2723"/>
        </g>
        <g transform="translate(120 280)">
          <ellipse cx="0" cy="0" rx="14" ry="9" fill="#FFD600"/>
          <rect x="-9" y="-9" width="3" height="18" fill="#000"/>
          <rect x="-3" y="-9" width="3" height="18" fill="#000"/>
          <rect x="3" y="-9" width="3" height="18" fill="#000"/>
          <ellipse cx="-12" cy="-7" rx="6" ry="3" fill="white" opacity="0.8"/>
        </g>
        <g transform="translate(500 260)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#FFD600"/>
          <rect x="-7" y="-8" width="3" height="16" fill="#000"/>
          <rect x="-1" y="-8" width="3" height="16" fill="#000"/>
          <ellipse cx="-10" cy="-6" rx="5" ry="3" fill="white" opacity="0.8"/>
        </g>`,
    },
  ],

  // Odd-one-out groups by difficulty (~50 per level)
  // Each group: items array of 4 (3 belong + 1 odd), with oddIndex
  oddGroups: {
    easy: [
      { items: ['🐶', '🐱', '🐰', '🚗'], oddIndex: 3, hint: 'animals vs vehicle' },
      { items: ['🍎', '🍌', '🍇', '📚'], oddIndex: 3, hint: 'fruits vs book' },
      { items: ['⭐', '⭐', '⭐', '🌙'], oddIndex: 3, hint: 'star vs moon' },
      { items: ['🔴', '🔴', '🔴', '🔵'], oddIndex: 3, hint: 'red vs blue' },
      { items: ['🐟', '🐠', '🐡', '🐦'], oddIndex: 3, hint: 'sea vs sky' },
      { items: ['🐶', '🐱', '🐰', '⚽'], oddIndex: 3, hint: 'animals vs ball' },
      { items: ['🍎', '🍌', '🍇', '📱'], oddIndex: 3, hint: 'fruit vs phone' },
      { items: ['🥕', '🌽', '🥦', '🍭'], oddIndex: 3, hint: 'veggie vs candy' },
      { items: ['❄️', '❄️', '❄️', '🔥'], oddIndex: 3, hint: 'cold vs hot' },
      { items: ['🐢', '🐌', '🐜', '🐦'], oddIndex: 3, hint: 'ground vs sky' },
      { items: ['🦋', '🐝', '🐞', '🐦'], oddIndex: 3, hint: 'bug vs bird' },
      { items: ['⚽', '🍎', '🌕', '🟥'], oddIndex: 3, hint: 'round vs square' },
      { items: ['🐘', '🦁', '🐻', '🐭'], oddIndex: 3, hint: 'big vs small' },
      { items: ['☀️', '🌞', '⭐', '🌜'], oddIndex: 3, hint: 'day vs night' },
      { items: ['🍎', '🍌', '🍇', '🥕'], oddIndex: 3, hint: 'fruit vs veggie' },
      { items: ['🚗', '🚌', '🚂', '🚢'], oddIndex: 3, hint: 'land vs water' },
      { items: ['🌟', '⭐', '🌟', '🟣'], oddIndex: 3, hint: 'star vs circle' },
      { items: ['🐶', '🐱', '🐰', '🦁'], oddIndex: 3, hint: 'pets vs wild' },
      { items: ['🍕', '🍔', '🌭', '🍦'], oddIndex: 3, hint: 'hot vs cold food' },
      { items: ['🍰', '🧁', '🍪', '🥦'], oddIndex: 3, hint: 'sweet vs veggie' },
      { items: ['🐶', '🐶', '🐶', '🐱'], oddIndex: 3, hint: 'dog vs cat' },
      { items: ['🐱', '🐱', '🐱', '🐶'], oddIndex: 3, hint: 'cat vs dog' },
      { items: ['🔨', '🔧', '🪛', '🧸'], oddIndex: 3, hint: 'tools vs toy' },
      { items: ['🎸', '🎺', '🎹', '⚽'], oddIndex: 3, hint: 'music vs ball' },
      { items: ['🌳', '🌲', '🌴', '🐶'], oddIndex: 3, hint: 'plants vs animal' },
      { items: ['🦅', '🦆', '🦉', '🐟'], oddIndex: 3, hint: 'birds vs fish' },
      { items: ['🍎', '🍎', '🍎', '🍐'], oddIndex: 3, hint: 'apple vs pear' },
      { items: ['🍊', '🍊', '🍊', '🍋'], oddIndex: 3, hint: 'orange vs lemon' },
      { items: ['🐍', '🐍', '🐍', '🐱'], oddIndex: 3, hint: 'snake vs cat' },
      { items: ['🌳', '🌲', '🌴', '🌷'], oddIndex: 3, hint: 'tree vs flower' },
      { items: ['🌻', '🌼', '🌟', '🍎'], oddIndex: 3, hint: 'yellow vs red' },
      { items: ['🌧️', '🌦️', '☔', '☀️'], oddIndex: 3, hint: 'rain vs sun' },
      { items: ['❤️', '❤️', '❤️', '⭐'], oddIndex: 3, hint: 'heart vs star' },
      { items: ['⛵', '🚤', '🛥️', '🚗'], oddIndex: 3, hint: 'boat vs car' },
      { items: ['⭐', '⭐', '⭐', '🎈'], oddIndex: 3, hint: 'star vs balloon' },
      { items: ['👕', '👖', '👗', '🍕'], oddIndex: 3, hint: 'clothes vs food' },
      { items: ['🌸', '🌷', '🌻', '🍓'], oddIndex: 3, hint: 'flowers vs berry' },
      { items: ['🐻', '🐻', '🐻', '🐟'], oddIndex: 3, hint: 'bear vs fish' },
      { items: ['🐄', '🐄', '🐄', '🐎'], oddIndex: 3, hint: 'cow vs horse' },
      { items: ['🍎', '🍎', '🍎', '🌽'], oddIndex: 3, hint: 'apple vs corn' },
      { items: ['🌞', '🌞', '🌞', '🌚'], oddIndex: 3, hint: 'sun day vs night' },
      { items: ['🥛', '🧃', '🍵', '🍔'], oddIndex: 3, hint: 'drink vs food' },
      { items: ['🍽️', '🥄', '🍴', '🛁'], oddIndex: 3, hint: 'kitchen vs bath' },
      { items: ['⚽', '🏀', '🎾', '🎸'], oddIndex: 3, hint: 'sport vs music' },
      { items: ['🦆', '🦅', '🦢', '🐄'], oddIndex: 3, hint: 'bird vs cow' },
      { items: ['🐟', '🐠', '🐡', '🐸'], oddIndex: 3, hint: 'fish vs frog' },
      { items: ['🍋', '🍋', '🍋', '🍇'], oddIndex: 3, hint: 'lemon vs grape' },
      { items: ['🏠', '🏡', '🏘️', '🚗'], oddIndex: 3, hint: 'house vs car' },
      { items: ['🍓', '🫐', '🍒', '🥚'], oddIndex: 3, hint: 'berry vs egg' },
      { items: ['👁️', '👀', '👁️', '👂'], oddIndex: 3, hint: 'eye vs ear' },
      { items: ['🌹', '🌹', '🌹', '🌳'], oddIndex: 3, hint: 'rose vs tree' },
      { items: ['🍿', '🍪', '🍩', '🥕'], oddIndex: 3, hint: 'snack vs veggie' },
      { items: ['🐝', '🐝', '🐝', '🦋'], oddIndex: 3, hint: 'bee vs butterfly' },
      { items: ['🚲', '🛹', '🛴', '🐶'], oddIndex: 3, hint: 'wheels vs dog' },
    ],
    medium: [
      { items: ['🐶', '🐱', '🐄', '🐦'], oddIndex: 3, hint: 'mammals vs bird' },
      { items: ['🍎', '🍊', '🍇', '🥕'], oddIndex: 3, hint: 'fruit vs veggie' },
      { items: ['⚽', '🏀', '🎾', '📱'], oddIndex: 3, hint: 'balls vs phone' },
      { items: ['🚗', '🚌', '🚂', '✈️'], oddIndex: 3, hint: 'ground vs air' },
      { items: ['🌻', '🌹', '🌷', '🍎'], oddIndex: 3, hint: 'flowers vs fruit' },
      { items: ['🦁', '🐯', '🐻', '🐄'], oddIndex: 3, hint: 'wild vs farm' },
      { items: ['🍕', '🍜', '🌮', '🍦'], oddIndex: 3, hint: 'hot vs cold meal' },
      { items: ['🦅', '🦋', '🐝', '🐢'], oddIndex: 3, hint: 'fly vs walk' },
      { items: ['🐶', '🌳', '🌻', '🚗'], oddIndex: 3, hint: 'living vs vehicle' },
      { items: ['🍎', '🥕', '🍇', '🍕'], oddIndex: 3, hint: 'fresh vs cooked' },
      { items: ['🔊', '📢', '🥁', '🌸'], oddIndex: 3, hint: 'loud vs quiet' },
      { items: ['🍰', '🧁', '🍭', '🥨'], oddIndex: 3, hint: 'sweet vs salty' },
      { items: ['🐘', '🦁', '🐻', '🐹'], oddIndex: 3, hint: 'big vs small animal' },
      { items: ['🦁', '🐅', '🦊', '🐰'], oddIndex: 3, hint: 'predator vs prey' },
      { items: ['🐍', '🦎', '🐢', '🐶'], oddIndex: 3, hint: 'reptile vs mammal' },
      { items: ['🐧', '🐻‍❄️', '🦭', '🐪'], oddIndex: 3, hint: 'cold vs hot animal' },
      { items: ['🐠', '🐡', '🦈', '🐶'], oddIndex: 3, hint: 'water vs land' },
      { items: ['🍊', '🍋', '🍈', '🍓'], oddIndex: 3, hint: 'citrus vs berry' },
      { items: ['🦐', '🦀', '🐟', '🍗'], oddIndex: 3, hint: 'sea vs land food' },
      { items: ['🌻', '🌼', '🌹', '🌚'], oddIndex: 3, hint: 'flower vs moon' },
      { items: ['🌷', '🌹', '🌻', '🌴'], oddIndex: 3, hint: 'garden vs jungle' },
      { items: ['🧸', '🐻', '🐰', '🪨'], oddIndex: 3, hint: 'soft vs hard' },
      { items: ['🍎', '⚽', '🌕', '📐'], oddIndex: 3, hint: 'round vs angular' },
      { items: ['🦓', '🐅', '🐯', '🐆'], oddIndex: 3, hint: 'striped vs spotted' },
      { items: ['🌲', '🌴', '🎋', '🌱'], oddIndex: 3, hint: 'tall vs sprout' },
      { items: ['🌳', '🌴', '🎋', '🌲'], oddIndex: 3, hint: 'leafy vs needle' },
      { items: ['🐝', '🐞', '🦗', '🦋'], oddIndex: 3, hint: 'bug vs butterfly' },
      { items: ['🥞', '🥓', '🥚', '🍕'], oddIndex: 3, hint: 'breakfast vs pizza' },
      { items: ['🍊', '🍋', '🍈', '🍎'], oddIndex: 3, hint: 'citrus vs apple' },
      { items: ['🔨', '🪚', '🪛', '🧩'], oddIndex: 3, hint: 'tool vs puzzle' },
      { items: ['🦅', '🦉', '🦆', '🐦'], oddIndex: 3, hint: 'big vs small bird' },
      { items: ['🚗', '🚐', '🚌', '🚲'], oddIndex: 3, hint: 'engine vs pedal' },
      { items: ['🎺', '🎷', '🎻', '🎸'], oddIndex: 3, hint: 'brass vs string' },
      { items: ['📎', '📏', '✂️', '🍴'], oddIndex: 3, hint: 'office vs eating' },
      { items: ['👗', '👕', '👖', '💍'], oddIndex: 3, hint: 'clothes vs ring' },
      { items: ['👶', '🧒', '👦', '👴'], oddIndex: 3, hint: 'young vs old' },
      { items: ['😴', '💤', '🛏️', '🏃'], oddIndex: 3, hint: 'sleep vs run' },
      { items: ['🐶', '🐱', '🐰', '🦁'], oddIndex: 3, hint: 'pet vs zoo' },
      { items: ['😊', '😄', '😁', '😢'], oddIndex: 3, hint: 'happy vs sad' },
      { items: ['🦆', '🦢', '🐔', '🦅'], oddIndex: 3, hint: 'water vs sky bird' },
      { items: ['👋', '✋', '🤚', '🦶'], oddIndex: 3, hint: 'hand vs foot' },
      { items: ['🦁', '🐯', '🐅', '🐈'], oddIndex: 3, hint: 'big cat vs house cat' },
      { items: ['🍿', '🥨', '🥜', '🍰'], oddIndex: 3, hint: 'salty vs sweet' },
      { items: ['🔨', '🪓', '⛏️', '✂️'], oddIndex: 3, hint: 'pound vs cut' },
      { items: ['🍎', '🍊', '🍇', '🍕'], oddIndex: 3, hint: 'whole vs slice' },
      { items: ['☕', '🍵', '🍶', '🧃'], oddIndex: 3, hint: 'hot vs cold drink' },
      { items: ['🐶', '🐱', '🦁', '🦄'], oddIndex: 3, hint: 'real vs unicorn' },
      { items: ['🍇', '🍎', '🍐', '🌶️'], oddIndex: 3, hint: 'sweet vs spicy' },
      { items: ['👒', '🎩', '🧢', '👟'], oddIndex: 3, hint: 'hat vs shoe' },
      { items: ['🌷', '🌸', '🌻', '❄️'], oddIndex: 3, hint: 'spring vs winter' },
      { items: ['🍓', '🫐', '🍒', '🥒'], oddIndex: 3, hint: 'berry vs cucumber' },
    ],
    hard: [
      { items: ['🦋', '🐝', '🐦', '🐟'], oddIndex: 3, hint: 'fly vs swim' },
      { items: ['🌞', '🌙', '⭐', '🌈'], oddIndex: 3, hint: 'single vs arc' },
      { items: ['🏠', '🏫', '🏢', '🌳'], oddIndex: 3, hint: 'building vs tree' },
      { items: ['🍎', '🍊', '🍋', '🍇'], oddIndex: 3, hint: 'single vs bunch' },
      { items: ['🐶', '🐱', '🐹', '🐍'], oddIndex: 3, hint: 'furry vs scaly' },
      { items: ['🦋', '⭐', '❤️', '🍌'], oddIndex: 3, hint: 'symmetric vs curved' },
      { items: ['🐦', '🐠', '🦋', '🚲'], oddIndex: 3, hint: 'living vs machine' },
      { items: ['🦅', '🦋', '🐝', '🐠'], oddIndex: 3, hint: 'wings vs fins' },
      { items: ['🐶', '🐱', '🐍', '🐄'], oddIndex: 3, hint: 'legs vs no legs' },
      { items: ['🐢', '🐌', '🦀', '🐶'], oddIndex: 3, hint: 'shell vs no shell' },
      { items: ['🐦', '🐢', '🐍', '🐶'], oddIndex: 3, hint: 'eggs vs babies' },
      { items: ['🐻', '🐿️', '🦔', '🐶'], oddIndex: 3, hint: 'sleep all winter' },
      { items: ['🦁', '🐅', '🦊', '🐰'], oddIndex: 3, hint: 'meat vs plants' },
      { items: ['🐶', '🐱', '🐮', '🦊'], oddIndex: 3, hint: 'home vs forest' },
      { items: ['🐍', '🦎', '🐢', '🐶'], oddIndex: 3, hint: 'cold vs warm body' },
      { items: ['🐶', '🐱', '🐰', '🐍'], oddIndex: 3, hint: 'fur vs scales' },
      { items: ['🍌', '🍋', '🌽', '🍎'], oddIndex: 3, hint: 'yellow vs red' },
      { items: ['🍎', '🍓', '🍒', '🍇'], oddIndex: 3, hint: 'red vs purple' },
      { items: ['🍎', '🍊', '🍐', '🍌'], oddIndex: 3, hint: 'has stem vs not' },
      { items: ['🦇', '🦉', '🦊', '🐦'], oddIndex: 3, hint: 'night vs day' },
      { items: ['🦁', '🐅', '🦊', '🐎'], oddIndex: 3, hint: 'predator eyes' },
      { items: ['🚗', '🏠', '📱', '🌳'], oddIndex: 3, hint: 'man-made vs natural' },
      { items: ['💡', '📺', '🔋', '🕯️'], oddIndex: 3, hint: 'electric vs candle' },
      { items: ['👀', '👞', '👜', '🚗'], oddIndex: 3, hint: 'pair vs single' },
      { items: ['💧', '🌊', '☔', '🏜️'], oddIndex: 3, hint: 'wet vs dry' },
      { items: ['🧸', '🐻', '🐱', '🪨'], oddIndex: 3, hint: 'soft vs rock' },
      { items: ['🧸', '🎮', '💻', '🪵'], oddIndex: 3, hint: 'plastic vs wood' },
      { items: ['💧', '🥛', '☕', '🍞'], oddIndex: 3, hint: 'liquid vs bread' },
      { items: ['🍎', '🌳', '🪴', '🪨'], oddIndex: 3, hint: 'edible vs rock' },
      { items: ['🌴', '🦜', '🥥', '🐧'], oddIndex: 3, hint: 'tropical vs polar' },
      { items: ['🐶', '🐱', '🐭', '🐦'], oddIndex: 3, hint: 'tail vs none' },
      { items: ['🦘', '🐨', '🐱', '🐶'], oddIndex: 3, hint: 'pouch vs no pouch' },
      { items: ['🐟', '🐡', '🦀', '🐢'], oddIndex: 3, hint: 'water only vs land too' },
      { items: ['🦓', '🦒', '🐯', '🐶'], oddIndex: 3, hint: 'pattern vs solid' },
      { items: ['🍞', '🥖', '🥐', '🥨'], oddIndex: 3, hint: 'soft vs pretzel' },
      { items: ['🍓', '🍒', '🍇', '🍋'], oddIndex: 3, hint: 'sweet vs sour' },
      { items: ['🥛', '🍵', '☕', '📚'], oddIndex: 3, hint: 'has handle vs not' },
      { items: ['👒', '🎩', '🧢', '👞'], oddIndex: 3, hint: 'head vs foot' },
      { items: ['👀', '👂', '👅', '👃'], oddIndex: 3, hint: 'pair vs single' },
      { items: ['📐', '📏', '🔲', '⚪'], oddIndex: 3, hint: 'angles vs round' },
      { items: ['🔨', '🪛', '✂️', '⚽'], oddIndex: 3, hint: 'tool vs ball' },
      { items: ['🌹', '🍎', '🍓', '🥝'], oddIndex: 3, hint: 'red vs green' },
      { items: ['⛄', '☃️', '🎿', '🏖️'], oddIndex: 3, hint: 'winter vs beach' },
      { items: ['🌳', '🪨', '🏠', '🐦'], oddIndex: 3, hint: 'still vs moves' },
      { items: ['🐂', '🦏', '🐐', '🦌'], oddIndex: 3, hint: 'horns vs antlers' },
      { items: ['🌸', '🌷', '🌹', '🌿'], oddIndex: 3, hint: 'petals vs leaves' },
      { items: ['😄', '😊', '😃', '😢'], oddIndex: 3, hint: 'happy vs cry' },
      { items: ['🦁', '🐅', '🐄', '🦊'], oddIndex: 3, hint: 'wild vs farm' },
      { items: ['🦓', '🐝', '🦒', '🐅'], oddIndex: 3, hint: 'striped pattern' },
      { items: ['🏖️', '🌊', '🐚', '🌳'], oddIndex: 3, hint: 'beach vs forest' },
      { items: ['🐺', '🐶', '🐱', '🦊'], oddIndex: 3, hint: 'wild vs pet' },
    ],
  },
};
