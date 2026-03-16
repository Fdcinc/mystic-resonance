import React from 'react';

export default function Counter({ count, setCount, isDark }) {
  return (
    <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-colors ${
      isDark 
        ? 'bg-gray-800 border-blue-500' 
        : 'bg-white border-blue-300'
    } text-center`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        isDark ? 'text-blue-300' : 'text-blue-700'
      }`}>Mystic Energy</h2>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCount(prev => prev - 1)}
          className="p-3 bg-red-600 rounded-lg text-xl font-bold hover:bg-red-500 transition-colors text-white"
          aria-label="Decrease energy"
        >
          -
        </button>
        <span className={`text-4xl font-bold select-none ${
          isDark ? 'text-yellow-400' : 'text-yellow-600'
        }`}>{count}</span>
        <button
          onClick={() => setCount(prev => prev + 1)}
          className="p-3 bg-green-600 rounded-lg text-xl font-bold hover:bg-green-500 transition-colors text-white"
          aria-label="Increase energy"
        >
          +
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-3 bg-gray-600 rounded-lg text-sm font-bold hover:bg-gray-500 text-white"
        >
          Reset
        </button>
      </div>
      <p className={`text-sm mt-2 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>Energy level affects spell power.</p>
    </div>
  );
}