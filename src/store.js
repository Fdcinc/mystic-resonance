import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Constants
const MAX_MANA = 100;
const MANA_COST = 10;
const COMBO_WINDOW_MS = 5000;
const SYNERGY_BONUS_MANA = 5;

// Fortunes
const fortunes = [
  "A mysterious force awakens.",
  "The stars align in your favor.",
  "Dark clouds gather…",
  "An ancient secret is revealed.",
  "Your spell fizzles. Try again!",
  "A new path opens before you."
];

const comboFortunes = [
  "A cosmic cascade empowers you!",
  "The universe bends to your will!",
  "You've tapped into the resonance!",
  "An epic surge of magic!",
  "The Oracle bows before you!"
];

// Quest definitions
const questsDefinitions = [
  {
    id: 1,
    name: "Novice Caster",
    description: "Cast your first spell",
    type: 'once',
    completed: false,
  },
  {
    id: 2,
    name: "Zodiac Explorer",
    description: "Visit 6 different zodiac signs",
    type: 'progress',
    target: 6,
    progress: 0,
    completed: false,
  },
  {
    id: 3,
    name: "Mana Conduit",
    description: `Reach maximum mana (${MAX_MANA})`,
    type: 'once',
    completed: false,
  },
  {
    id: 4,
    name: "Energy Surge",
    description: `Reach energy level 20 in Mystic Energy`,
    type: 'once',
    completed: false,
  },
  {
    id: 5,
    name: "Palindrome Seeker",
    description: "Enter a palindrome in the Secret Cipher",
    type: 'once',
    completed: false,
  },
  {
    id: 6,
    name: "Spellmaster",
    description: "Cast 10 spells",
    type: 'progress',
    target: 10,
    progress: 0,
    completed: false,
  },
];

const useStore = create(
  persist(
    (set, get) => ({
      // --- Game State ---
      count: 0,
      text: '',
      legacyCount: 0,
      legacyToggle: true,
      legacyText: '',
      score: 0,
      mana: 50,
      comboCount: 0,
      lastCastTime: null,
      synergyMessage: '',
      visitedSigns: new Set(),
      quests: questsDefinitions.map(q => ({ ...q })),
      
      // --- History for undo/redo ---
      past: [],
      future: [],

      // --- Helper to record history and apply new state ---
      _setWithHistory: (newState) => {
        const currentState = {
          count: get().count,
          text: get().text,
          legacyCount: get().legacyCount,
          legacyToggle: get().legacyToggle,
          legacyText: get().legacyText,
          score: get().score,
          mana: get().mana,
          comboCount: get().comboCount,
          lastCastTime: get().lastCastTime,
          synergyMessage: get().synergyMessage,
          visitedSigns: get().visitedSigns,
          quests: get().quests,
        };
        set({
          past: [...get().past, currentState],
          future: [],
          ...newState,
        });
      },

      // --- Actions (all user-triggered changes use _setWithHistory) ---
      incrementCount: () => get()._setWithHistory({ count: get().count + 1 }),
      decrementCount: () => get()._setWithHistory({ count: get().count - 1 }),
      setCount: (value) => get()._setWithHistory({ count: typeof value === 'function' ? value(get().count) : value }),

      setText: (value) => get()._setWithHistory({ text: typeof value === 'function' ? value(get().text) : value }),

      incrementLegacyCount: () => get()._setWithHistory({ legacyCount: get().legacyCount + 1 }),
      decrementLegacyCount: () => get()._setWithHistory({ legacyCount: get().legacyCount - 1 }),
      setLegacyCount: (value) => get()._setWithHistory({ legacyCount: typeof value === 'function' ? value(get().legacyCount) : value }),

      toggleLegacy: () => get()._setWithHistory({ legacyToggle: !get().legacyToggle }),
      setLegacyToggle: (value) => get()._setWithHistory({ legacyToggle: value }),

      setLegacyText: (value) => get()._setWithHistory({ legacyText: typeof value === 'function' ? value(get().legacyText) : value }),

      // --- Mana regeneration (not recorded in history) ---
      regenMana: () => set({ mana: Math.min(get().mana + 1, MAX_MANA) }),

      // --- Spell casting (complex logic, recorded as one history step) ---
      castSpell: () => {
        const state = get();
        if (state.mana < MANA_COST) {
          set({ synergyMessage: "Not enough mana! Wait for regeneration." });
          return;
        }

        // Mana deduction – use let so it can be modified by synergy
        let newMana = state.mana - MANA_COST;

        // Combo
        const now = Date.now();
        let newCombo = 1;
        if (state.lastCastTime && (now - state.lastCastTime) < COMBO_WINDOW_MS) {
          newCombo = state.comboCount + 1;
        }

        // Synergies
        let synergyMsg = '';
        if (state.count % 3 === 0 && state.legacyToggle) {
          synergyMsg = "The stars and blessing align! Mana restored +5.";
          newMana = Math.min(newMana + SYNERGY_BONUS_MANA, MAX_MANA);
        } else if (state.text.toLowerCase().includes('mystic') && state.legacyCount > 10) {
          synergyMsg = "Ancient words resonate with energy! Combo extended.";
          // extend combo by resetting lastCastTime to now (already handled by new combo logic)
        } else if (state.legacyCount < 0 && !state.legacyToggle) {
          synergyMsg = "Dark energies twist reality. Fortune reversed!";
        }

        // Fortune calculation
        const zodiacIndex = Math.abs(state.count) % 12;
        const spellLength = state.text.length;
        const energy = state.legacyCount;
        const isBlessing = state.legacyToggle;
        const secretName = state.legacyText;

        let fortuneIndex = (zodiacIndex + spellLength + energy + (isBlessing ? 10 : 0) + secretName.length) % fortunes.length;

        let fortune;
        if (newCombo >= 3) {
          fortuneIndex = (fortuneIndex + newCombo) % comboFortunes.length;
          fortune = comboFortunes[fortuneIndex];
        } else {
          fortune = fortunes[fortuneIndex];
        }

        if (synergyMsg.includes("reversed")) {
          fortune = fortune.split('').reverse().join('');
        }

        // Update visited signs (if new sign)
        const currentSign = Math.abs(state.count) % 12;
        const newVisited = new Set(state.visitedSigns).add(currentSign);

        // Update quests progress
        const newQuests = state.quests.map(q => {
          if (q.completed) return q;
          // Zodiac Explorer
          if (q.id === 2) {
            const progress = newVisited.size;
            return { ...q, progress, completed: progress >= q.target };
          }
          // Spellmaster
          if (q.id === 6) {
            const progress = state.score + 1;
            return { ...q, progress, completed: progress >= q.target };
          }
          // Once-type quests
          if (q.type === 'once') {
            if (q.id === 1 && state.score + 1 >= 1) return { ...q, completed: true };
            if (q.id === 3 && newMana >= MAX_MANA) return { ...q, completed: true };
            if (q.id === 4 && state.legacyCount >= 20) return { ...q, completed: true };
            if (q.id === 5) {
              const str = state.text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              if (str.length > 1 && str === str.split('').reverse().join('')) return { ...q, completed: true };
            }
          }
          return q;
        });

        // Apply all changes as one history step
        get()._setWithHistory({
          mana: newMana,
          comboCount: newCombo,
          lastCastTime: now,
          synergyMessage: synergyMsg,
          score: state.score + 1,
          fortune: fortune,
          visitedSigns: newVisited,
          quests: newQuests,
        });
      },

      // --- Undo/Redo ---
      undo: () => {
        const { past, future, ...current } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);
        set({
          past: newPast,
          future: [current, ...future],
          ...previous,
        });
      },

      redo: () => {
        const { past, future, ...current } = get();
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);
        set({
          past: [...past, current],
          future: newFuture,
          ...next,
        });
      },

      // --- Save/Load to custom slot ---
      saveGame: (key = 'mystic-save') => {
        const state = {
          count: get().count,
          text: get().text,
          legacyCount: get().legacyCount,
          legacyToggle: get().legacyToggle,
          legacyText: get().legacyText,
          score: get().score,
          mana: get().mana,
          comboCount: get().comboCount,
          lastCastTime: get().lastCastTime,
          synergyMessage: get().synergyMessage,
          visitedSigns: Array.from(get().visitedSigns),
          quests: get().quests,
        };
        localStorage.setItem(key, JSON.stringify(state));
      },

      loadGame: (key = 'mystic-save') => {
        const saved = localStorage.getItem(key);
        if (saved) {
          const state = JSON.parse(saved);
          if (state.visitedSigns) state.visitedSigns = new Set(state.visitedSigns);
          // Load should not affect history? We'll just set state and clear history.
          set({
            ...state,
            fortune: '',
            past: [],
            future: [],
          });
        }
      },

      // --- Reset (clears history too) ---
      resetGame: () => {
        set({
          count: 0,
          text: '',
          legacyCount: 0,
          legacyToggle: true,
          legacyText: '',
          score: 0,
          mana: 50,
          comboCount: 0,
          lastCastTime: null,
          synergyMessage: '',
          visitedSigns: new Set(),
          quests: questsDefinitions.map(q => ({ ...q })),
          fortune: '',
          past: [],
          future: [],
        });
      },

      // --- Manual set for fortune (used after load?) not needed, fortune is part of state
    }),
    {
      name: 'mystic-resonance-game',
      // Exclude history from persistence without unused variables
      partialize: (state) => {
        // Create a copy and delete history fields
        const rest = { ...state };
        delete rest.past;
        delete rest.future;
        return {
          ...rest,
          visitedSigns: Array.from(rest.visitedSigns),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && state.visitedSigns) {
          state.visitedSigns = new Set(state.visitedSigns);
        }
      },
    }
  )
);

export default useStore;