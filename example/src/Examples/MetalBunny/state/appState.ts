import create from "zustand";

interface AppState {
  isMetallic: boolean;
  isBump: boolean;
  setMetallic: (isMetallic: boolean) => void;
  setBump: (isBump: boolean) => void;
}

export default create<AppState>((set) => ({
  isMetallic: true,
  isBump: false,

  setMetallic: (isMetallic: boolean) => set({ isMetallic }),
  setBump: (isBump: boolean) => set({ isBump }),
}));
