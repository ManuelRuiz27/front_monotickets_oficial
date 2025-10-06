'use client';
import { create } from 'zustand';

type UIStore = {
  gate: string;
  passType: string;
  setGate: (v: string) => void;
  setPassType: (v: string) => void;
  load: () => void;
};

export const useUI = create<UIStore>((set) => ({
  gate: 'Puerta A',
  passType: '',
  setGate: (v) => {
    localStorage.setItem('staff_gate', v);
    set({ gate: v });
  },
  setPassType: (v) => {
    localStorage.setItem('staff_passType', v);
    set({ passType: v });
  },
  load: () => {
    const g = localStorage.getItem('staff_gate') || 'Puerta A';
    const p = localStorage.getItem('staff_passType') || '';
    set({ gate: g, passType: p });
  },
}));
