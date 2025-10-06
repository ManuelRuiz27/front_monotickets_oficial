import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastState = {
  message: string;
  type: ToastType;
  isOpen: boolean;
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
};

export const useToast = create<ToastState>((set) => ({
  message: '',
  type: 'info',
  isOpen: false,
  showToast: (message, type) => set({ message, type, isOpen: true }),
  hideToast: () => set({ isOpen: false }),
}));
