import { create } from 'zustand';

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'AI' | 'OTT' | 'Music' | 'Productivity';
  price: number;
  slotsLeft: number;
  totalSlots: number;
  model: 'peer' | 'managed';
  description: string;
}

export interface ManagedGroup {
  id: string;
  name: string;
  joined: number;
  total: number;
  price: number;
}

export interface AppToast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface SubsyncState {
  darkMode: boolean;
  marketplace: MarketplaceItem[];
  groups: ManagedGroup[];
  toasts: AppToast[];
  toggleDarkMode: () => void;
  createListing: (item: Omit<MarketplaceItem, 'id'>) => void;
  joinGroup: (id: string) => { ok: boolean; message: string };
  joinManagedGroup: (id: string) => { ok: boolean; message: string };
  addToast: (toast: Omit<AppToast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const initialMarketplace: MarketplaceItem[] = [
  {
    id: 'chatgpt-pro',
    name: 'ChatGPT Pro',
    category: 'AI',
    price: 399,
    slotsLeft: 2,
    totalSlots: 5,
    model: 'managed',
    description: 'Code, write and research faster with premium AI.',
  },
  {
    id: 'netflix',
    name: 'Netflix Premium',
    category: 'OTT',
    price: 149,
    slotsLeft: 1,
    totalSlots: 4,
    model: 'peer',
    description: '4K streaming with shared household-friendly plans.',
  },
  {
    id: 'spotify',
    name: 'Spotify Family',
    category: 'Music',
    price: 59,
    slotsLeft: 3,
    totalSlots: 6,
    model: 'peer',
    description: 'Ad-free playlists, group sessions and offline sync.',
  },
  {
    id: 'canva',
    name: 'Canva Pro Team',
    category: 'Productivity',
    price: 99,
    slotsLeft: 2,
    totalSlots: 5,
    model: 'managed',
    description: 'Design kits, premium templates and collaboration.',
  },
];

const initialGroups: ManagedGroup[] = [
  { id: 'g1', name: 'ChatGPT Cohort A', joined: 3, total: 5, price: 399 },
  { id: 'g2', name: 'Canva Creators Pod', joined: 4, total: 5, price: 99 },
  { id: 'g3', name: 'Spotify Night Owls', joined: 2, total: 6, price: 59 },
];

export const useSubsyncStore = create<SubsyncState>((set) => ({
  darkMode: false,
  marketplace: initialMarketplace,
  groups: initialGroups,
  toasts: [],
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  createListing: (item) =>
    set((state) => ({
      marketplace: [{ ...item, id: `${item.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}` }, ...state.marketplace],
    })),
  joinGroup: (id) => {
    let result = { ok: false, message: 'Group not found' };
    set((state) => {
      const updated = state.marketplace.map((item) => {
        if (item.id !== id) return item;
        if (item.slotsLeft <= 0) {
          result = { ok: false, message: 'No slots left in this group.' };
          return item;
        }
        result = { ok: true, message: `You joined ${item.name}. Payment confirmed.` };
        return { ...item, slotsLeft: item.slotsLeft - 1 };
      });
      return { marketplace: updated };
    });
    return result;
  },
  joinManagedGroup: (id) => {
    let result = { ok: false, message: 'Group not found' };
    set((state) => {
      const updated = state.groups.map((group) => {
        if (group.id !== id) return group;
        if (group.joined >= group.total) {
          result = { ok: false, message: 'Group is already full.' };
          return group;
        }
        result = { ok: true, message: `${group.name} updated. Access unlocks when full.` };
        return { ...group, joined: group.joined + 1 };
      });
      return { groups: updated };
    });
    return result;
  },
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: `${Date.now()}-${Math.random().toString(16).slice(2)}` }],
    })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
