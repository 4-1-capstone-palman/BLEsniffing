import { create } from 'zustand';

interface UserState {
  name: string;
  employeeId: string;
  setUser: (name: string, employeeId: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: '',
  employeeId: '',
  setUser: (name, employeeId) => set({ name, employeeId }),
  reset: () => set({ name: '', employeeId: '' }),
}));