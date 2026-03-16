import React from 'react';

export default function TextInput({ text, setText, isDark }) {
  return (
    <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-colors ${
      isDark 
        ? 'bg-gray-800 border-amber-500' 
        : 'bg-white border-amber-300'
    } text-center`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        isDark ? 'text-amber-300' : 'text-amber-700'
      }`}>Ancient Name</h2>
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter an ancient name..."
        className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
          isDark 
            ? 'bg-gray-700 text-white placeholder-gray-400' 
            : 'bg-gray-100 text-gray-900 placeholder-gray-500'
        }`}
      />
      <p className={`mt-4 text-lg font-mono ${
        isDark ? 'text-yellow-400' : 'text-yellow-700'
      }`}>
        You are known as: <span className="font-bold">{text || "???"}</span>
      </p>
    </div>
  );
}