import React from 'react';

const ZODIACS = [
  { symbol: "♈", name: "Aries", element: "Fire", desc: "Bold and passionate" },
  { symbol: "♉", name: "Taurus", element: "Earth", desc: "Steadfast and strong" },
  { symbol: "♊", name: "Gemini", element: "Air", desc: "Curious and adaptable" },
  { symbol: "♋", name: "Cancer", element: "Water", desc: "Intuitive and nurturing" },
  { symbol: "♌", name: "Leo", element: "Fire", desc: "Creative and confident" },
  { symbol: "♍", name: "Virgo", element: "Earth", desc: "Analytical and helpful" },
  { symbol: "♎", name: "Libra", element: "Air", desc: "Diplomatic and fair" },
  { symbol: "♏", name: "Scorpio", element: "Water", desc: "Passionate and resourceful" },
  { symbol: "♐", name: "Sagittarius", element: "Fire", desc: "Optimistic and adventurous" },
  { symbol: "♑", name: "Capricorn", element: "Earth", desc: "Disciplined and ambitious" },
  { symbol: "♒", name: "Aquarius", element: "Air", desc: "Innovative and humanitarian" },
  { symbol: "♓", name: "Pisces", element: "Water", desc: "Compassionate and artistic" }
];

export default function ZodiacCounter({ count, setCount, isDark }) {
  const currentIndex = Math.abs(count) % ZODIACS.length;
  const currentSign = ZODIACS[currentIndex];

  return (
    <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border transition-colors ${
      isDark 
        ? 'bg-gray-800 border-purple-500' 
        : 'bg-white border-purple-300'
    } text-center`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        isDark ? 'text-purple-300' : 'text-purple-700'
      }`}>Zodiac Wheel</h2>
      
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => setCount(prev => prev - 1)} 
          aria-label="Previous sign"
          className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-transform active:scale-90 text-white"
        >
          ◀
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-6xl mb-2 transition-all duration-300 hover:rotate-12">
            {currentSign.symbol}
          </span>
          <span className={`text-2xl font-bold ${
            isDark ? 'text-yellow-400' : 'text-yellow-600'
          }`}>
            {currentSign.name}
          </span>
          <p className={`text-sm mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>{currentSign.element} · {currentSign.desc}</p>
          <p className={`text-xs mt-2 ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}>Index: {count}</p>
        </div>

        <button 
          onClick={() => setCount(prev => prev + 1)} 
          aria-label="Next sign"
          className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-transform active:scale-90 text-white"
        >
          ▶
        </button>
      </div>
    </div>
  );
}