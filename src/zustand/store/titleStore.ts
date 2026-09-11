import { create } from "zustand";

interface TitleState {
  title: string;
  setTitle: (newTitle: string) => void;
}

export const useTitleStore = create<TitleState>((set) => ({
  title: "",
  setTitle: (newTitle) => set({ title: newTitle }),
}));
