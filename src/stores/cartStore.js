import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (item) => {
        const exists = get().cartItems.find((b) => b.id === item.id);
        if (exists) {
          set({
            cartItems: get().cartItems.map((b) =>
              b.id === item.id ? { ...b, quantity: b.quantity + 1 } : b
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, { ...item, quantity: 1 }] });
        }
      },

      increaseQuantity: (id) => {
        set((state) => ({
          cartItems: state.cartItems.map((b) =>
            b.id === id ? { ...b, quantity: b.quantity + 1 } : b
          ),
        }));
      },

      decreaseQuantity: (id) => {
        set((state) => {
          const updated = state.cartItems
            .map((b) => (b.id === id ? { ...b, quantity: b.quantity - 1 } : b))
            .filter((b) => b.quantity > 0);

          return { cartItems: updated };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cartItems: state.cartItems.filter((b) => b.id !== id),
        }));
      },

      clearCart: () => set({ cartItems: [] }),
    }),
    // localsotrage key
    { name: "orangeCart" }
  )
);
