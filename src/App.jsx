import React from 'react';
import ZodiacCounter from './ZodiacCounter';
import EncryptedInput from './EncryptedInput';
import Oracle from './Oracle';
import Counter from './Counter';
import Toggle from './Toggle';
import TextInput from './TextInput';
import ManaBar from './ManaBar';
import QuestLog from './QuestLog';

// Constants
const MAX_MANA = 100;
const MANA_COST = 10;
const MANA_REGEN_RATE = 1; // per second
const COMBO_WINDOW_MS = 5000; // 5 seconds
const SYNERGY_BONUS_MANA = 5;

const TARGETS = {
  ZODIAC_EXPLORER: 6,
  ENERGY_SURGE: 20,
  SPELLMASTER: 10
};

// Fortunes
const fortunes = [
  "A mysterious force awakens.",
  "The stars align in your favor.",
  "Dark clouds gather…",
  "An ancient secret is revealed.",
  "Your spell fizzles. Try again!",
  "A new path opens before you."
];

const comboFortunes = [
  "A cosmic cascade empowers you!",
  "The universe bends to your will!",
  "You've tapped into the resonance!",
  "An epic surge of magic!",
  "The Oracle bows before you!"
];

// Quest definitions (without unused properties)
const questsDefinitions = [
  {
    id: 1,
    name: "Novice Caster",
    description: "Cast your first spell",
    type: 'once',
    completed: false,
  },
  {
    id: 2,
    name: "Zodiac Explorer",
    description: `Visit ${TARGETS.ZODIAC_EXPLORER} different zodiac signs`,
    type: 'progress',
    target: `${TARGETS.ZODIAC_EXPLORER}`,
    progress: 0,
    completed: false,
  },
  {
    id: 3,
    name: "Mana Conduit",
    description: `Reach maximum mana (${MAX_MANA})`,
    type: 'once',
    completed: false,
  },
  {
    id: 4,
    name: "Energy Surge",
    description: `Reach energy level (${TARGETS.ENERGY_SURGE}) in Mystic Energy `,
    type: 'once',
    completed: false,
  },
  {
    id: 5,
    name: "Palindrome Seeker",
    description: "Enter a palindrome in the Secret Cipher",
    type: 'once',
    completed: false,
  },
  {
    id: 6,
    name: "Spellmaster",
    description: "Cast 10 spells",
    type: 'progress',
    target: 10,
    progress: 0,
    completed: false,
  },
];

export default function App() {
  // --- Game State ---
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState('');
  const [legacyCount, setLegacyCount] = React.useState(0);
  const [legacyToggle, setLegacyToggle] = React.useState(true);
  const [legacyText, setLegacyText] = React.useState('');
  
  // --- UI & Result State ---
  const [fortune, setFortune] = React.useState('');
  const [score, setScore] = React.useState(0);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // --- New Mechanics State ---
  const [mana, setMana] = React.useState(50);
  const [comboCount, setComboCount] = React.useState(0);
  const [lastCastTime, setLastCastTime] = React.useState(null);
  const [synergyMessage, setSynergyMessage] = React.useState('');
  const [quests, setQuests] = React.useState(() => 
    questsDefinitions.map(q => ({ ...q }))
  );
  const [visitedSigns, setVisitedSigns] = React.useState(new Set());

  // Mana regeneration
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMana(prev => Math.min(prev + MANA_REGEN_RATE, MAX_MANA));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update quests and visited signs whenever relevant state changes
  React.useEffect(() => {
    // Update visited signs set
    const currentSign = Math.abs(count) % 12;
    let newVisitedSigns = visitedSigns;
    if (!visitedSigns.has(currentSign)) {
      newVisitedSigns = new Set(visitedSigns).add(currentSign);
      setVisitedSigns(newVisitedSigns);
    }

    // Update quest progress
    setQuests(prevQuests =>
      prevQuests.map(quest => {
        if (quest.completed) return quest;

        // Zodiac Explorer (progress based on visited signs count)
        if (quest.id === 2) {
          const progress = newVisitedSigns.size;
          return {
            ...quest,
            progress,
            completed: progress >= quest.target,
          };
        }

        // Spellmaster (progress based on score)
        if (quest.id === 6) {
          return {
            ...quest,
            progress: score,
            completed: score >= quest.target,
          };
        }

        // Once-type quests
        if (quest.type === 'once') {
          if (quest.id === 1 && score >= 1) {
            return { ...quest, completed: true };
          }
          if (quest.id === 3 && mana >= MAX_MANA) {
            return { ...quest, completed: true };
          }
          if (quest.id === 4 && legacyCount >= TARGETS.ENERGY_SURGE) {
            return { ...quest, completed: true };
          }
          if (quest.id === 5) {
            const str = text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            if (str.length > 1 && str === str.split('').reverse().join('')) {
              return { ...quest, completed: true };
            }
          }
        }

        return quest;
      })
    );
  }, [count, text, legacyCount, legacyToggle, legacyText, mana, score, visitedSigns]);

  const handleGlobalReset = () => {
    setCount(0);
    setText('');
    setLegacyCount(0);
    setLegacyToggle(true);
    setLegacyText('');
    setFortune('');
    setScore(0);
    setMana(50);
    setComboCount(0);
    setLastCastTime(null);
    setSynergyMessage('');
    setVisitedSigns(new Set());
    setQuests(questsDefinitions.map(q => ({ ...q })));
  };

  // Check for artifact synergies
  const checkSynergies = () => {
    let message = '';
    if (count % 3 === 0 && legacyToggle) {
      message = "The stars and blessing align! Mana restored +5.";
      setMana(prev => Math.min(prev + SYNERGY_BONUS_MANA, MAX_MANA));
    } else if (text.toLowerCase().includes('mystic') && legacyCount > 10) {
      message = "Ancient words resonate with energy! Combo extended.";
      setLastCastTime(Date.now());
    } else if (legacyCount < 0 && !legacyToggle) {
      message = "Dark energies twist reality. Fortune reversed!";
    }
    setSynergyMessage(message);
    return message;
  };

  const castSpell = () => {
  if (mana < MANA_COST) {
    setFortune("Not enough mana! Wait for regeneration.");
    return;
  }

  setMana(prev => prev - MANA_COST);

  const now = Date.now();
  const isComboValid = lastCastTime && (now - lastCastTime) < COMBO_WINDOW_MS;
  const newCombo = isComboValid ? comboCount + 1 : 1;
  
  setComboCount(newCombo);
  setLastCastTime(now);

  const synergy = checkSynergies();
  
  // These are now at the TOP so the seed can see them
  const zodiacIndex = Math.abs(count) % 12;
  const spellLength = text.length;
  const energy = legacyCount;
  const isBlessing = legacyToggle;
  const secretName = legacyText;

  const stateSeed = zodiacIndex + spellLength + energy + (isBlessing ? 10 : 0) + secretName.length;
  let selectedFortune = "";

  if (newCombo >= 3) {
    selectedFortune = comboFortunes[stateSeed % comboFortunes.length];
  } else {
    selectedFortune = fortunes[stateSeed % fortunes.length];
  }

  if (synergy.includes("reversed")) {
    selectedFortune = selectedFortune.split('').reverse().join('');
  }

  setFortune(selectedFortune);
  setScore(prev => prev + 1);
};

  const isZodiacFirst = count % 2 === 0;
  const layoutOrder = isZodiacFirst ? ['zodiac', 'cipher'] : ['cipher', 'zodiac'];

  return (
    <div className={`min-h-screen font-sans p-6 flex flex-col items-center gap-8 transition-colors duration-500 ${
      isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
    }`}>
      
      <header className="text-center">
        <h1 className="text-4xl font-black text-yellow-400 mb-2 drop-shadow-md">
          Mystic Resonance Game
        </h1>
        <p className="text-gray-500 max-w-md">
          Align the artifacts and tap into the cosmic frequency.
        </p>
      </header>

      {/* Stats Bar + Mana + Combo */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="px-6 py-2 bg-purple-900/30 rounded-full text-purple-400 border border-purple-500/50 font-mono">
          🔮 SPELLS CAST: {score}
        </div>
        <ManaBar mana={mana} maxMana={MAX_MANA} isDark={isDarkMode} />
        {comboCount >= 2 && (
          <div className="px-4 py-2 bg-orange-500/30 rounded-full text-orange-400 border border-orange-500/50 font-mono">
            ⚡ COMBO x{comboCount}
          </div>
        )}
        <button 
          onClick={handleGlobalReset}
          className="px-4 py-2 text-xs font-bold border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
        >
          RESET UNIVERSE
        </button>
      </div>

      {/* Synergy Message */}
      {synergyMessage && (
        <div className="text-sm text-cyan-400 bg-cyan-900/30 px-4 py-2 rounded-full animate-pulse">
          ✨ {synergyMessage}
        </div>
      )}

      {/* Dynamic Main Stage */}
      <div className="flex flex-col gap-6 w-full items-center">
        {layoutOrder.map(name => (
          name === 'zodiac' 
            ? <ZodiacCounter key="z" count={count} setCount={setCount} isDark={isDarkMode} /> 
            : <EncryptedInput key="c" text={text} setText={setText} isDark={isDarkMode} />
        ))}
      </div>

      {/* The Action Zone */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <button
          onClick={castSpell}
          disabled={mana < MANA_COST}
          className={`w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-2xl font-black shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          ✨ CAST SPELL ✨
        </button>

        {fortune && (
          <div className="w-full p-6 bg-white/5 backdrop-blur-md rounded-2xl border-2 border-yellow-500 text-center animate-in fade-in zoom-in duration-300">
            <p className="text-sm text-yellow-500 uppercase tracking-widest mb-1">Fortune Revealed</p>
            <p className="text-xl italic font-serif">"{fortune}"</p>
          </div>
        )}
      </div>

      <hr className="w-48 border-gray-800" />

      {/* Artifacts Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Counter count={legacyCount} setCount={setLegacyCount} isDark={isDarkMode} />
        <Toggle isOn={legacyToggle} setToggle={setLegacyToggle} isDark={isDarkMode} />
        <TextInput text={legacyText} setText={setLegacyText} isDark={isDarkMode} />
      </div>

      {/* Oracle & Quest Log */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <Oracle count={count} text={text} isDark={isDarkMode} />
        <QuestLog quests={quests} isDark={isDarkMode} />
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 right-6 p-4 bg-yellow-500 text-gray-900 rounded-full shadow-2xl hover:rotate-180 transition-all duration-500 z-50"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}