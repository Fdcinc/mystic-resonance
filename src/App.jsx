import React from 'react';
import useStore from './store'; // Import our centralized brain

// Components
import ZodiacCounter from './ZodiacCounter';
import EncryptedInput from './EncryptedInput';
import Oracle from './Oracle';
import Counter from './Counter';
import Toggle from './Toggle';
import TextInput from './TextInput';
import ManaBar from './ManaBar';
import QuestLog from './QuestLog';

export default function App() {
  // Use the store hook to get all state and actions
  const s = useStore();
  
  // Local UI state (Theme doesn't need to be in the global game store)
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // Mana regeneration effect - calls the store action every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      s.regenMana();
    }, 1000);
    return () => clearInterval(interval);
  }, [s]);

  // Determine layout order based on the current Zodiac count
  const isZodiacFirst = s.count % 2 === 0;
  const layoutOrder = isZodiacFirst ? ['zodiac', 'cipher'] : ['cipher', 'zodiac'];

  return (
    <div className={`min-h-screen font-sans p-6 flex flex-col items-center gap-8 transition-colors duration-500 ${
      isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
    }`}>
      
      <header className="text-center">
        <h1 className="text-4xl font-black text-yellow-400 mb-2 drop-shadow-md">
          Mystic Resonance
        </h1>
        <p className="text-gray-500 max-w-md italic">
          Master the artifacts to reveal your fortune.
        </p>
      </header>

      {/* Stats & Global Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="px-6 py-2 bg-purple-900/30 rounded-full text-purple-400 border border-purple-500/50 font-mono">
          🔮 SPELLS: {s.score}
        </div>
        
        <ManaBar mana={s.mana} maxMana={100} isDark={isDarkMode} />
        
        {s.comboCount >= 2 && (
          <div className="px-4 py-2 bg-orange-500/30 rounded-full text-orange-400 border border-orange-500/50 font-mono animate-bounce">
            ⚡ COMBO x{s.comboCount}
          </div>
        )}

        <div className="flex gap-2">
          <button 
            onClick={s.undo}
            className="px-4 py-2 text-xs font-bold border border-gray-500/50 text-gray-400 rounded-lg hover:bg-gray-500 hover:text-white transition-all"
          >
            UNDO
          </button>
          <button 
            onClick={s.resetGame}
            className="px-4 py-2 text-xs font-bold border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Synergy Alerts */}
      {s.synergyMessage && (
        <div className="text-sm text-cyan-400 bg-cyan-900/30 px-4 py-2 rounded-full animate-pulse border border-cyan-400/20">
          ✨ {s.synergyMessage}
        </div>
      )}

      {/* Main Artifacts Stage */}
      <div className="flex flex-col gap-6 w-full items-center">
        {layoutOrder.map(name => (
          name === 'zodiac' 
            ? <ZodiacCounter key="z" count={s.count} setCount={s.setCount} isDark={isDarkMode} /> 
            : <EncryptedInput key="c" text={s.text} setText={s.setText} isDark={isDarkMode} />
        ))}
      </div>

      {/* Spellcasting Zone */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <button
          onClick={s.castSpell}
          disabled={s.mana < 10}
          className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ✨ CAST SPELL ✨
        </button>

        {s.fortune && (
          <div className="w-full p-6 bg-white/5 backdrop-blur-md rounded-2xl border-2 border-yellow-500 text-center animate-in fade-in zoom-in duration-300">
            <p className="text-sm text-yellow-500 uppercase tracking-widest mb-1">Oracle Result</p>
            <p className="text-xl italic font-serif">"{s.fortune}"</p>
          </div>
        )}
      </div>

      <hr className="w-48 border-gray-800" />

      {/* Secondary Artifacts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Counter count={s.legacyCount} setCount={s.setLegacyCount} isDark={isDarkMode} />
        <Toggle isOn={s.legacyToggle} setToggle={s.setLegacyToggle} energy={s.legacyCount} isDark={isDarkMode} />
        <TextInput text={s.legacyText} setText={s.setLegacyText} isDark={isDarkMode} />
      </div>

      {/* Intelligence Row */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <Oracle count={s.count} text={s.text} isDark={isDarkMode} />
        <QuestLog quests={s.quests} isDark={isDarkMode} />
      </div>

      {/* Theme Control */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 right-6 p-4 bg-yellow-500 text-gray-900 rounded-full shadow-2xl hover:rotate-180 transition-all duration-500 z-50"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}