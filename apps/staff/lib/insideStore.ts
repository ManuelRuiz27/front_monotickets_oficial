'use client';
import { create } from 'zustand';

type InsidePerson = {
  id: string;
  name: string;
  passType?: string | null;
  alreadyEntered?: boolean;
  lastCheckinAt?: string | null;
  status: 'valid' | 'duplicate' | 'invalid';
};

type InsideState = {
  insideCount: number;
  lastPerson?: InsidePerson;
  setSnapshot: (n: number) => void;
  setFromCheckin: (p: InsidePerson, insideCount?: number) => void;
};

export const useInside = create<InsideState>((set) => ({
  insideCount: 0,
  lastPerson: undefined,
  setSnapshot: (n) => set({ insideCount: n }),
  setFromCheckin: (p, insideCount) => {
    set((s) => ({
      lastPerson: p,
      insideCount: typeof insideCount === 'number' ? insideCount : s.insideCount,
    }));
  },
}));
