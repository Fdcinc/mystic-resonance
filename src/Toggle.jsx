import React from 'react';

export default function Toggle({ isOn, setToggle, energy, isDark }) {
  // A "True Curse" happens when Toggle is OFF AND Energy is negative
  const isActuallyCursed = !isOn && energy < 0;

  return (
    <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-all duration-500 ${
      isActuallyCursed 
        ? 'bg-red-900/20 border-red-500 shadow-red-500/20' 
        : (isDark ? 'bg-gray-800 border-green-500' : 'bg-white border-green-300')
    } text-center`}>
      
      <h2 className={`text-xl font-semibold mb-4 transition-colors ${
        isActuallyCursed ? 'text-red-400' : (isDark ? 'text-green-300' : 'text-green-700')
      }`}>
        {isActuallyCursed ? "Abyssal Energy" : "Blessing or Curse"}
      </h2>

      <button
        onClick={() => setToggle(!isOn)}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 text-white shadow-md ${
          isOn 
            ? 'bg-green-600 hover:bg-green-500' 
            : 'bg-red-600 hover:bg-red-500'
        }`}
      >
        {isOn ? '✨ Blessed' : '💀 Cursed'}
      </button>

      <p className={`mt-4 italic transition-colors ${
        isActuallyCursed ? 'text-red-300' : (isDark ? 'text-gray-400' : 'text-gray-600')
      }`}>
        {isActuallyCursed ? "The curse is active. Fortune reversed." : "The gods smile upon you."}
      </p>
    </div>
  );
}