import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import storage from '../storage';

const useScrollStore = create<ScrollState>()(
  persist(
    (set) => ({
      scrollIsVisible: false,
      setIsVisible: (scrollIsVisible: boolean) => set({ scrollIsVisible }),
    
    }),
    {
      name: "scroll-storage", // Unique name for storage
      storage: {
        getItem: async (key: string) => {
          const value = await storage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key: string, value: StorageValue<ScrollState>) => {
          return await storage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key: string) => {
          await storage.removeItem(key);
        },
      },
    }
  )
);

export default useScrollStore;