import React from 'react';

// Moved outside to avoid recreation
const encrypt = (str) => {
  const map = { 
    'a': 'Δ', 'b': 'ß', 'c': '©', 'd': 'Ð', 'e': 'Σ', 'f': 'ƒ', 'g': '6', 
    'h': '#', 'i': '!', 'j': '∫', 'k': 'κ', 'l': '£', 'm': 'м', 'n': 'и',
    'o': 'Ø', 'p': 'π', 'q': 'Φ', 'r': '®', 's': '§', 't': '†', 'u': 'µ',
    'v': 'ν', 'w': 'ω', 'x': 'χ', 'y': 'γ', 'z': 'ζ'
  };
  return str.toLowerCase().split('').map(char => map[char] || char).join('');
};

const randomWords = ["abracadabra", "zimzalabim", "hocuspocus", "alakazam", "mystic"];

export default function EncryptedInput({ text, setText, isDark }) {
  const setRandomSpell = () => {
    const random = randomWords[Math.floor(Math.random() * randomWords.length)];
    setText(random);
  };

  return (
    <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-colors ${
      isDark 
        ? 'bg-gray-800 border-yellow-600' 
        : 'bg-white border-yellow-400'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>Secret Cipher</h2>
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your secret message..."
        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none ${
          isDark 
            ? 'bg-gray-900 text-white border-gray-700' 
            : 'bg-gray-100 text-gray-900 border-gray-300'
        }`}
      />

      <div className="flex gap-2 mt-2">
        <button
          onClick={setRandomSpell}
          className="px-3 py-1 bg-purple-700 rounded text-sm hover:bg-purple-600 text-white"
        >
          🎲 Random Spell
        </button>
        <span className={`text-sm self-center ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>Mana: {text.length}</span>
      </div>

      <div className={`mt-6 p-4 rounded-lg border border-dashed transition-all duration-500 ${
        isDark 
          ? 'bg-black border-gray-600' 
          : 'bg-gray-100 border-gray-400'
      }`}>
        <p className={`text-xs uppercase tracking-widest mb-2 ${
          isDark ? 'text-gray-500' : 'text-gray-600'
        }`}>Encrypted Output:</p>
        <p className={`text-2xl font-mono break-all leading-relaxed ${
          isDark ? 'text-green-400' : 'text-green-700'
        }`}>
          {encrypt(text) || <span className={isDark ? 'text-gray-700' : 'text-gray-400'}>Waiting for input...</span>}
        </p>
      </div>
      
      {text.length > 10 && (
        <p className="mt-2 text-xs text-yellow-500 animate-pulse">
          ⚠️ Long messages amplify the resonance!
        </p>
      )}
    </div>
  );
}