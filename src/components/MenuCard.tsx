import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus, ShoppingCart, X, ChefHat } from "lucide-react";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";
import type { MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addItem, removeItem, setQuantity, getQuantity } = useCart();
  const qty = getQuantity(item.slug);
  const inCart = qty > 0;
  const isFavourite = !!item.tags?.length;
  const isSpoon = !!item.pricePerSpoon;

  // Spoon picker state (rice items only)
  const [picking, setPicking] = useState(false);
  const [pendingQty, setPendingQty] = useState(1);

  function openPicker(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPendingQty(qty > 0 ? qty : 1);
    setPicking(true);
  }

  function closePicker(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPicking(false);
  }

  function confirmAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, pendingQty);
    setPicking(false);
  }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);
  }

  function handleDecrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (qty <= 1) removeItem(item.slug);
    else setQuantity(item.slug, qty - 1);
  }

  function handleIncrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(item.slug, qty + 1);
  }

  return (
    <Link
      to="/menu/$slug"
      params={{ slug: item.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden bg-muted">
        {isFavourite && (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-sm dark:bg-black/60 dark:text-foreground">
            Favourite
            <span aria-hidden className="text-sm">
              🔥
            </span>
          </span>
        )}

        {/* quantity / spoon badge */}
        {inCart && (
          <span className="absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow">
            {isSpoon ? "🥄" : "×"} {qty}
          </span>
        )}

        <img
          src={optimizeImageUrl(item.image, 500, 75)}
          alt={item.name}
          loading="lazy"
          width={500}
          height={500}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-foreground">
          {item.name}
        </h3>

        <div className="mt-1 flex items-center justify-between gap-2">
          {/* price */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground">
              {formatNaira(item.priceNaira)}
            </span>
            {isSpoon && <span className="text-[10px] text-muted-foreground">per spoon</span>}
          </div>

          {/* cart controls */}
          {inCart ? (
            <div
              className="flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                aria-label={isSpoon ? "Remove a spoon" : "Decrease"}
                onClick={handleDecrement}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground/70 transition hover:border-primary hover:text-primary"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="flex min-w-[2rem] items-center justify-center gap-0.5 text-sm font-bold text-foreground">
                {isSpoon ? "🥄" : ""}
                {qty}
              </span>
              <button
                type="button"
                aria-label={isSpoon ? "Add a spoon" : "Increase"}
                onClick={handleIncrement}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
                disabled={qty >= 100}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : isSpoon ? (
            // Rice items → open spoon picker
            <button
              type="button"
              aria-label={`Add ${item.name} to order`}
              onClick={openPicker}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-110 active:scale-95 animate-bounce-in"
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : (
            // All other items → add 1 directly
            <button
              type="button"
              aria-label={`Add ${item.name} to order`}
              onClick={handleAdd}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-110 active:scale-95 animate-bounce-in"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Spoon picker overlay (rice items only) ── */}
      {picking && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-2xl bg-card/97 px-5 backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            aria-label="Cancel"
            onClick={closePicker}
            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="flex flex-col items-center gap-1 text-center">
            <ChefHat className="h-6 w-6 text-primary" />
            <p className="font-display text-sm font-semibold text-foreground">How many spoons?</p>
            <p className="text-[11px] text-muted-foreground">{item.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPendingQty((v) => Math.max(1, v - 1));
              }}
              disabled={pendingQty <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition hover:border-primary hover:text-primary disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex min-w-[3.5rem] flex-col items-center">
              <span className="text-2xl font-bold text-foreground">{pendingQty}</span>
              <span className="text-[10px] text-muted-foreground">
                {pendingQty === 1 ? "spoon" : "spoons"}
              </span>
            </div>
            <button
              type="button"
              aria-label="Increase"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPendingQty((v) => Math.min(100, v + 1));
              }}
              disabled={pendingQty >= 100}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm font-bold text-primary">
            {formatNaira(item.priceNaira * pendingQty)}
          </p>

          <button
            type="button"
            onClick={confirmAdd}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to order
          </button>
        </div>
      )}
    </Link>
  );
}
