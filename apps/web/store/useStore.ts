import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface UserState {
  favorites: string[];
  cartItems: CartItem[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<UserState>((set) => ({
  favorites: [],
  cartItems: [],
  addFavorite: (id) =>
    set((state) => ({ favorites: [...state.favorites, id] })),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((favId) => favId !== id),
    })),
  addToCart: (newItem) =>
    set((state) => {
      const existingItem = state.cartItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cartItems: [...state.cartItems, { ...newItem, quantity: 1 }] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    })),
  clearCart: () => set({ cartItems: [] }),
}));
