import React from 'react';

export default function QuestLog({ quests, isDark }) {
  const completed = quests.filter(q => q.completed).length;
  const total = quests.length;

  return (
    <div className={`w-full max-w-md p-4 rounded-2xl border transition-colors ${
      isDark ? 'bg-gray-800/80 border-yellow-600' : 'bg-white border-yellow-400'
    }`}>
      <h3 className={`text-lg font-bold mb-2 flex justify-between ${
        isDark ? 'text-yellow-400' : 'text-yellow-700'
      }`}>
        <span>📜 Quests</span>
        <span className="text-sm font-normal">{completed}/{total}</span>
      </h3>
      <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {quests.map(quest => (
          <li key={quest.id} className={`text-sm p-2 rounded ${
            quest.completed 
              ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
              : isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            <div className="flex items-start gap-2">
              <span className="text-lg">{quest.completed ? '✅' : '⏳'}</span>
              <div>
                <p className="font-semibold">{quest.name}</p>
                <p className="text-xs opacity-80">{quest.description}</p>
                {quest.type === 'progress' && (
                  <p className="text-xs mt-1">
                    Progress: {quest.progress}/{quest.target}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}