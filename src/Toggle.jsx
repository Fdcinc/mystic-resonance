import React from 'react';

export default function Toggle({ isOn, setToggle, isDark }) {
  return (
    <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-colors ${
      isDark 
        ? 'bg-gray-800 border-green-500' 
        : 'bg-white border-green-300'
    } text-center`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        isDark ? 'text-green-300' : 'text-green-700'
      }`}>Blessing or Curse</h2>
      <button
        onClick={() => setToggle(prev => !prev)}
        className={`w-full py-3 rounded-xl font-semibold transition-colors text-white ${
          isOn ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
        }`}
      >
        {isOn ? '✨ Blessed' : '💀 Cursed'}
      </button>
      <p className={`mt-4 italic ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {isOn ? "The gods smile upon you." : "Dark energies swirl."}
      </p>
    </div>
  );
}