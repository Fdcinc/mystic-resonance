import React from 'react';

export default function Oracle({ count, text, isDark }) {
  const isThinking = text.length > 5;
  const zodiacIndex = Math.abs(count) % 12; // consistent with ZodiacCounter

  const getPrediction = () => {
    if (!isThinking) return "The stars are silent. Type more to wake the Oracle...";
    
    const moods = ["chaotic", "prosperous", "mysterious", "energetic", "calm"];
    const mood = moods[text.length % moods.length];
    
    return `Because the stars are at index ${zodiacIndex}, and your message carries a ${mood} frequency, the Oracle foresees a week of unexpected CSS bugs and perfect coffee.`;
  };

  return (
    <div className={`w-full max-w-md p-6 rounded-2xl border-2 border-dotted transition-all duration-700 ${
      isDark 
        ? 'bg-black/40 border-green-900' 
        : 'bg-green-50 border-green-200'
    } ${isThinking ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
      
      <h3 className="text-sm font-bold text-green-500 uppercase tracking-tighter mb-2">
        {isThinking ? "🔮 Oracle is Channeling..." : "🔮 Oracle Sleeping"}
      </h3>
      
      <p className={`text-lg font-serif italic ${
        isDark ? 'text-green-400' : 'text-green-800'
      }`}>
        "{getPrediction()}"
      </p>
      
      {isThinking && (
        <div className="mt-4 flex gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      )}
    </div>
  );
}