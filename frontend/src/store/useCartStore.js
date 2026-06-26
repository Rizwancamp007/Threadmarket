import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isDrawerOpen: false,
      promoCode: null, // { _id, code, type, value }
      promoDiscount: 0,

      // Actions
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

      addToCart: (product, qty, selectedSize, selectedColor) => {
        const item = {
          product: product._id,
          name: product.name,
          image: product.images ? product.images[0] : product.image,
          price: product.price,
          qty: Number(qty),
          size: selectedSize,
          color: selectedColor,
        };

        set((state) => {
          const existItem = state.cartItems.find(
            (x) => x.product === item.product && x.size === item.size && x.color === item.color
          );

          if (existItem) {
            return {
              cartItems: state.cartItems.map((x) =>
                x.product === existItem.product && x.size === existItem.size && x.color === existItem.color
                  ? { ...item, qty: x.qty + item.qty }
                  : x
              ),
              isDrawerOpen: true, // Auto open drawer on add
            };
          } else {
            return {
              cartItems: [...state.cartItems, item],
              isDrawerOpen: true,
            };
          }
        });
      },

      removeFromCart: (productId, size, color) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (x) => !(x.product === productId && x.size === size && x.color === color)
          ),
        }));
      },

      updateQty: (productId, size, color, newQty) => {
        set((state) => ({
          cartItems: state.cartItems.map((x) =>
            x.product === productId && x.size === size && x.color === color
              ? { ...x, qty: Number(newQty) }
              : x
          ),
        }));
      },

      clearCart: () => set({ cartItems: [], promoCode: null, promoDiscount: 0 }),

      applyPromo: (promo) => {
        set((state) => {
          let discount = 0;
          const subtotal = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
          
          if (promo.type === 'percent') {
            discount = (subtotal * promo.value) / 100;
          } else if (promo.type === 'fixed') {
            discount = promo.value;
          }
          
          return { promoCode: promo, promoDiscount: discount };
        });
      },

      removePromo: () => set({ promoCode: null, promoDiscount: 0 }),

      // Computed totals
      getCartTotal: () => {
        const subtotal = get().cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        let discount = 0;
        const promo = get().promoCode;
        
        if (promo) {
          if (promo.type === 'percent') {
            discount = (subtotal * promo.value) / 100;
          } else if (promo.type === 'fixed') {
            discount = promo.value;
          }
        }
        
        return {
          subtotal,
          discount,
          total: Math.max(0, subtotal - discount)
        };
      },
      
      getCartCount: () => {
        return get().cartItems.reduce((acc, item) => acc + item.qty, 0);
      }
    }),
    {
      name: 'threadmarket-cart', // local storage key
      partialize: (state) => ({ 
        cartItems: state.cartItems,
        promoCode: state.promoCode,
        promoDiscount: state.promoDiscount
      }), 
    }
  )
);

export default useCartStore;
