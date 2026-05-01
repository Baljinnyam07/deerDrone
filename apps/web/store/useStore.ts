import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  slug?: string;
  brand?: string;
  stockQty?: number;
}

interface UserState {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  cartItems: CartItem[];
  clearCart: () => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (newItem) =>
        set((state) => {
          const existingItem = state.cartItems.find((item) => item.id === newItem.id);

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === newItem.id
                  ? {
                      ...item,
                      image: newItem.image || item.image,
                      quantity: item.quantity + 1,
                      slug: newItem.slug ?? item.slug,
                    }
                  : item,
              ),
            };
          }

          return {
            cartItems: [...state.cartItems, { ...newItem, quantity: 1 }],
          };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "deer-drone-store",
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    },
  ),
);
