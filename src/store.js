import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';

// --- CONSTANTS ---
const MAX_MANA = 100;
const MANA_COST = 10;
const COMBO_WINDOW_MS = 5000;
const SYNERGY_BONUS_MANA = 5;

// --- WEB3 CONFIGURATION ---
// Replace this with your actual contract address after deployment
const CONTRACT_ADDRESS = "0x8F43f4Ff504E18b2b60733a03A87B78122077B77"; 
const CONTRACT_ABI = [
  "function castSpell(uint256 _currentZodiac) external",
  "function players(address) view returns (uint256 mana, uint256 lastRegenTime, uint256 score, uint256 curseEndTime)"
];

const fortunes = [
  "A mysterious force awakens.", "The stars align in your favor.",
  "Dark clouds gather…", "An ancient secret is revealed.",
  "Your spell fizzles. Try again!", "A new path opens before you."
];

const comboFortunes = [
  "A cosmic cascade empowers you!", "The universe bends to your will!",
  "You've tapped into the resonance!", "An epic surge of magic!",
  "The Oracle bows before you!"
];

const questsDefinitions = [
  { id: 1, name: "Novice Caster", description: "Cast your first spell", type: 'once', completed: false },
  { id: 2, name: "Zodiac Explorer", description: "Visit 6 different zodiac signs", type: 'progress', target: 6, progress: 0, completed: false },
  { id: 3, name: "Mana Conduit", description: `Reach max mana (${MAX_MANA})`, type: 'once', completed: false },
  { id: 4, name: "Energy Surge", description: `Reach energy level 20 in Mystic Energy`, type: 'once', completed: false },
  { id: 5, name: "Palindrome Seeker", description: "Enter a palindrome in the Secret Cipher", type: 'once', completed: false },
  { id: 6, name: "Spellmaster", description: "Cast 10 spells", type: 'progress', target: 10, progress: 0, completed: false },
];

const useStore = create(
  persist(
    (set, get) => ({
      // --- CORE STATE ---
      count: 0,
      text: '',
      legacyCount: 0,
      legacyToggle: true,
      legacyText: '',
      score: 0,
      mana: 50,
      fortune: '',
      comboCount: 0,
      lastCastTime: null,
      synergyMessage: '',
      visitedSigns: new Set(),
      quests: questsDefinitions.map(q => ({ ...q })),
      past: [],
      future: [],

      // --- WEB3 STATE ---
      walletAddress: null,
      isSyncing: false,

      // --- INTERNAL LOGIC ---
      _applyQuestAndSynergyLogic: (stateUpdate) => {
        const s = { ...get(), ...stateUpdate };
        const currentSign = Math.abs(s.count) % 12;
        const newVisited = new Set(s.visitedSigns).add(currentSign);

        let newMsg = "";
        if (s.legacyToggle === false && s.legacyCount < 0) {
          newMsg = "🌑 The Curse takes hold. Fortune will be reversed!";
        } else if (s.legacyToggle === true && s.count % 3 === 0) {
          newMsg = "✨ The Blessing Aligns! Cast a spell for bonus Mana.";
        } else if (s.text.toLowerCase().includes('mystic')) {
          newMsg = "🌀 Mystic resonance detected in the cipher.";
        }

        const updatedQuests = s.quests.map(q => {
          if (q.completed) return q;
          switch (q.id) {
            case 1: return { ...q, completed: s.score >= 1 };
            case 2: return { ...q, progress: newVisited.size, completed: newVisited.size >= q.target };
            case 3: return { ...q, completed: s.mana >= MAX_MANA };
            case 4: return { ...q, completed: s.legacyCount >= 20 };
            case 5: {
              const clean = s.text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              return { ...q, completed: clean.length > 1 && clean === clean.split('').reverse().join('') };
            }
            case 6: return { ...q, progress: s.score, completed: s.score >= q.target };
            default: return q;
          }
        });

        return { 
          ...stateUpdate, 
          quests: updatedQuests, 
          visitedSigns: newVisited, 
          synergyMessage: newMsg 
        };
      },

      _setWithHistory: (newState) => {
        const reactiveState = get()._applyQuestAndSynergyLogic(newState);
        const snapshot = {
          count: get().count, text: get().text, legacyCount: get().legacyCount,
          legacyToggle: get().legacyToggle, legacyText: get().legacyText,
          score: get().score, mana: get().mana, visitedSigns: get().visitedSigns,
          quests: get().quests, fortune: get().fortune
        };
        set({ past: [...get().past, snapshot], future: [], ...reactiveState });
      },

      // --- WEB3 ACTIONS ---
      connectWallet: async () => {
        if (!window.ethereum) return alert("Please install MetaMask!");
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          set({ walletAddress: accounts[0] });
          get().syncWithBlockchain();
        } catch (err) {
          console.error("Wallet connection failed", err);
        }
      },

      syncWithBlockchain: async () => {
        const address = get().walletAddress;
        if (!address || !window.ethereum) return;

        set({ isSyncing: true });
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const data = await contract.players(address);
          
          set({ 
            mana: Number(data[0]), 
            score: Number(data[2]),
            isSyncing: false 
          });
        } catch (e) {
          console.error("Blockchain sync failed", e);
          set({ isSyncing: false });
        }
      },

      // --- GAME ACTIONS ---
      setCount: (val) => get()._setWithHistory({ count: typeof val === 'function' ? val(get().count) : val }),
      setText: (val) => get()._setWithHistory({ text: typeof val === 'function' ? val(get().text) : val }),
      setLegacyCount: (val) => get()._setWithHistory({ legacyCount: typeof val === 'function' ? val(get().legacyCount) : val }),
      setLegacyToggle: (val) => get()._setWithHistory({ legacyToggle: val }),
      setLegacyText: (val) => get()._setWithHistory({ legacyText: typeof val === 'function' ? val(get().legacyText) : val }),
      
      regenMana: () => {
        const newMana = Math.min(get().mana + 1, MAX_MANA);
        set({ mana: newMana });
      },

      castSpell: async () => {
        const state = get();
        if (state.mana < MANA_COST) return;

        // --- WEB3 TRANSACTION ---
        if (state.walletAddress && window.ethereum) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            const currentZodiac = Math.abs(state.count) % 12;
            const tx = await contract.castSpell(currentZodiac);
            
            set({ synergyMessage: "🌌 Calling upon the Blockchain Oracle..." });
            await tx.wait(); // Wait for confirmation
          } catch (e) {
            console.error("Spell transaction cancelled or failed", e);
            return; 
          }
        }

        // --- LOCAL LOGIC (UI UPDATES) ---
        let m = state.mana - MANA_COST;
        const now = Date.now();
        const combo = state.lastCastTime && (now - state.lastCastTime) < COMBO_WINDOW_MS ? state.comboCount + 1 : 1;

        if (state.synergyMessage.includes("Blessing")) m = Math.min(m + SYNERGY_BONUS_MANA, MAX_MANA);

        const seed = Math.abs(state.count) % 12 + state.text.length + state.legacyCount + (state.legacyToggle ? 10 : 0);
        let fort = combo >= 3 ? comboFortunes[seed % comboFortunes.length] : fortunes[seed % fortunes.length];

        if (state.synergyMessage.includes("Curse")) fort = fort.split('').reverse().join('');

        get()._setWithHistory({
          mana: m, comboCount: combo, lastCastTime: now, score: state.score + 1, fortune: fort
        });
      },

      undo: () => {
        const { past, future: _future, ...currentState } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        set({ past: past.slice(0, -1), future: [currentState, ..._future], ...previous });
      },

      resetGame: () => set({
        count: 0, text: '', legacyCount: 0, legacyToggle: true, legacyText: '',
        score: 0, mana: 50, fortune: '', comboCount: 0, lastCastTime: null,
        visitedSigns: new Set(), quests: questsDefinitions.map(q => ({ ...q })),
        past: [], future: [], synergyMessage: '', walletAddress: null
      }),
    }),
    {
      name: 'mystic-resonance-game',
      partialize: (state) => {
        // Exclude huge history arrays and temporary Web3 state from local storage
        const { past: _p, future: _f, isSyncing: _s, visitedSigns: _vs, ...rest } = state;
        return { ...rest, visitedSigns: Array.from(_vs || []) };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.visitedSigns) state.visitedSigns = new Set(state.visitedSigns);
      },
    }
  )
);

export default useStore;