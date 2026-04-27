import React from 'react';
import useStore from './store';

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
  
  // Local UI state (Theme toggle)
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
      isDarkMode ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* --- HEADER & WEB3 CONNECT --- */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-yellow-400 mb-1 drop-shadow-md">
            Mystic Resonance
          </h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-slate-500'} italic`}>
            {s.walletAddress ? "Ethereum Integrated Mage" : "Master the artifacts to reveal your fortune."}
          </p>
        </div>

        <button 
          onClick={s.connectWallet}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex flex-col items-center shadow-lg active:scale-95 ${
            s.walletAddress 
              ? 'bg-green-500/10 text-green-500 border border-green-500/50' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
          }`}
        >
          <span className="text-[10px] uppercase tracking-widest opacity-70">
            {s.walletAddress ? "CONNECTED ADDRESS" : "WEB3 IDENTITY"}
          </span>
          <span className="font-mono">
            {s.walletAddress 
              ? `${s.walletAddress.slice(0, 6)}...${s.walletAddress.slice(-4)}` 
              : "Connect Mystic Wallet"}
          </span>
        </button>
      </header>

      {/* --- STATS BAR --- */}
      <div className={`flex flex-wrap gap-4 items-center justify-center p-4 rounded-3xl backdrop-blur-sm border transition-all ${
        isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200 shadow-md'
      }`}>
        {/* Spell Score with Syncing Indicator */}
        <div className="px-6 py-2 bg-purple-900/30 rounded-full text-purple-400 border border-purple-500/50 font-mono font-bold relative">
          🔮 SPELLS: {s.score}
          {s.isSyncing && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          )}
        </div>
        
        <ManaBar mana={s.mana} maxMana={100} isDark={isDarkMode} />
        
        {s.comboCount >= 2 && (
          <div className="px-4 py-2 bg-orange-500/30 rounded-full text-orange-400 border border-orange-500/50 font-mono animate-bounce font-bold">
            ⚡ COMBO x{s.comboCount}
          </div>
        )}

        <div className="flex gap-2 border-l border-gray-500/30 pl-4">
          <button 
            onClick={s.undo}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            UNDO
          </button>
          <button 
            onClick={s.resetGame}
            className="px-4 py-2 text-xs font-bold text-red-500 rounded-lg hover:bg-red-500/10 transition-all"
          >
            RESET
          </button>
        </div>
      </div>

      {/* --- SYNERGY ALERTS --- */}
      {s.synergyMessage && (
        <div className="text-sm text-cyan-400 bg-cyan-900/30 px-6 py-2 rounded-full animate-pulse border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          ✨ {s.synergyMessage}
        </div>
      )}

      {/* --- MAIN ARTIFACTS STAGE --- */}
      <div className="flex flex-col gap-6 w-full items-center">
        {layoutOrder.map(name => (
          name === 'zodiac' 
            ? <ZodiacCounter key="z" count={s.count} setCount={s.setCount} isDark={isDarkMode} /> 
            : <EncryptedInput key="c" text={s.text} setText={s.setText} isDark={isDarkMode} />
        ))}
      </div>

      {/* --- SPELLCASTING ZONE --- */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <button
          onClick={s.castSpell}
          disabled={s.mana < 10 || s.isSyncing}
          className="w-full py-6 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl text-2xl font-black text-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
        >
          {s.isSyncing ? "SYNCING..." : s.walletAddress ? "🔥 CONQUER SIGN 🔥" : "✨ CAST SPELL ✨"}
        </button>

        {s.fortune && (
          <div className={`w-full p-6 backdrop-blur-lg rounded-3xl border-2 transition-all ${
            isDarkMode ? 'bg-white/5 border-yellow-500/50' : 'bg-white border-yellow-400 shadow-xl text-slate-800'
          } text-center animate-in fade-in zoom-in duration-300`}>
            <p className="text-[10px] text-yellow-500 uppercase tracking-[0.3em] mb-2 font-bold">Oracle Revelation</p>
            <p className="text-xl italic font-serif leading-relaxed">"{s.fortune}"</p>
          </div>
        )}
      </div>

      <hr className={`w-48 border-t-2 ${isDarkMode ? 'border-gray-800' : 'border-slate-200'}`} />

      {/* --- SECONDARY ARTIFACTS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Counter count={s.legacyCount} setCount={s.setLegacyCount} isDark={isDarkMode} />
        <Toggle isOn={s.legacyToggle} setToggle={s.setLegacyToggle} energy={s.legacyCount} isDark={isDarkMode} />
        <TextInput text={s.legacyText} setText={s.setLegacyText} isDark={isDarkMode} />
      </div>

      {/* --- INTELLIGENCE ROW --- */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mb-24">
        <Oracle count={s.count} text={s.text} isDark={isDarkMode} />
        <QuestLog quests={s.quests} isDark={isDarkMode} />
      </div>

      {/* --- THEME CONTROL --- */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed bottom-6 right-6 p-5 rounded-full shadow-2xl transition-all duration-500 z-50 hover:scale-110 active:rotate-180 ${
          isDarkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-900 text-yellow-400"
        }`}
      >
        <span className="text-2xl">{isDarkMode ? "☀️" : "🌙"}</span>
      </button>
    </div>
  );
}