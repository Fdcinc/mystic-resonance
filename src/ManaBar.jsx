import React from 'react';

export default function ManaBar({ mana, maxMana, isDark }) {
  const percentage = (mana / maxMana) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-mono text-blue-400">🔮 MANA</span>
      <div className={`w-32 h-4 rounded-full border ${
        isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-200'
      }`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {mana}/{maxMana}
      </span>
    </div>
  );
}