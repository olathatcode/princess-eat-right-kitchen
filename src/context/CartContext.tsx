import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { MenuItem } from "@/data/menu";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CartItem = {
  item: MenuItem;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD"; item: MenuItem }
  | { type: "REMOVE"; slug: string }
  | { type: "SET_QTY"; slug: string; quantity: number }
  | { type: "CLEAR" };

type CartContextValue = {
  items: CartItem[];
  /** Number of distinct dish types in the cart — used for nav badge */
  itemCount: number;
  /** Total number of portions across all items — used for order summaries */
  totalCount: number;
  totalPrice: number;
  addItem: (item: MenuItem) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  getQuantity: (slug: string) => number;
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((ci) => ci.item.slug === action.item.slug);
      if (existing) {
        return {
          items: state.items.map((ci) =>
            ci.item.slug === action.item.slug
              ? { ...ci, quantity: Math.min(ci.quantity + 1, 20) }
              : ci,
          ),
        };
      }
      return { items: [...state.items, { item: action.item, quantity: 1 }] };
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
            ? { ...ci, quantity: Math.min(action.quantity, 20) }
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
  const totalPrice = state.items.reduce(
    (sum, ci) => sum + ci.item.priceNaira * ci.quantity,
    0,
  );

  const addItem = (item: MenuItem) => dispatch({ type: "ADD", item });
  const removeItem = (slug: string) => dispatch({ type: "REMOVE", slug });
  const setQuantity = (slug: string, quantity: number) =>
    dispatch({ type: "SET_QTY", slug, quantity });
  const clearCart = () => dispatch({ type: "CLEAR" });
  const getQuantity = (slug: string) =>
    state.items.find((ci) => ci.item.slug === slug)?.quantity ?? 0;

  return (
    <CartContext.Provider
      value={{ items: state.items, itemCount, totalCount, totalPrice, addItem, removeItem, setQuantity, clearCart, getQuantity }}
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
