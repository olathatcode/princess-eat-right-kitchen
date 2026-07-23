import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { MenuItem } from "@/data/menu";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CartItem = {
  item: MenuItem;
  /**
   * For rice items (pricePerSpoon): number of spoons.
   * For all other items: number of portions.
   */
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD"; item: MenuItem; quantity: number }
  | { type: "REMOVE"; slug: string }
  | { type: "SET_QTY"; slug: string; quantity: number }
  | { type: "CLEAR" };

type CartContextValue = {
  items: CartItem[];
  /** Number of distinct dish types in the cart */
  itemCount: number;
  /** Total quantity across all items (spoons + portions combined) */
  totalCount: number;
  totalPrice: number;
  addItem: (item: MenuItem, quantity: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  getQuantity: (slug: string) => number;
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

const MAX_QTY = 100;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((ci) => ci.item.slug === action.item.slug);
      if (existing) {
        return {
          items: state.items.map((ci) =>
            ci.item.slug === action.item.slug
              ? { ...ci, quantity: Math.min(ci.quantity + action.quantity, MAX_QTY) }
              : ci,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { item: action.item, quantity: Math.min(action.quantity, MAX_QTY) },
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((ci) => ci.item.slug !== action.slug) };
    case "SET_QTY": {
      if (action.quantity <= 0) {
        return { items: state.items.filter((ci) => ci.item.slug !== action.slug) };
      }
      return {
        items: state.items.map((ci) =>
          ci.item.slug === action.slug
            ? { ...ci, quantity: Math.min(action.quantity, MAX_QTY) }
            : ci,
        ),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const itemCount = state.items.length;
  const totalCount = state.items.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalPrice = state.items.reduce((sum, ci) => sum + ci.item.priceNaira * ci.quantity, 0);

  const addItem = (item: MenuItem, quantity: number) => dispatch({ type: "ADD", item, quantity });
  const removeItem = (slug: string) => dispatch({ type: "REMOVE", slug });
  const setQuantity = (slug: string, quantity: number) =>
    dispatch({ type: "SET_QTY", slug, quantity });
  const clearCart = () => dispatch({ type: "CLEAR" });
  const getQuantity = (slug: string) =>
    state.items.find((ci) => ci.item.slug === slug)?.quantity ?? 0;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        totalCount,
        totalPrice,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
