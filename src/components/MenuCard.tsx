import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  Minus,
  ShoppingCart,
  X,
  ChefHat,
  Star,
  Heart,
  Timer,
  Zap,
  Flame,
} from "lucide-react";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";
import type { MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

/* ─── static per-item metadata ─────────────────────────────────────── */
const META: Record<string, { prepMins: string; kcal: number; rating: number; orders: number }> = {
  "jollof-rice": { prepMins: "15–25", kcal: 480, rating: 4.9, orders: 312 },
  "fried-rice": { prepMins: "15–25", kcal: 460, rating: 4.8, orders: 256 },
  amala: { prepMins: "10–15", kcal: 320, rating: 4.7, orders: 198 },
  semo: { prepMins: "10–15", kcal: 310, rating: 4.6, orders: 142 },
  eba: { prepMins: "10–15", kcal: 300, rating: 4.6, orders: 130 },
  fufu: { prepMins: "15–20", kcal: 330, rating: 4.7, orders: 120 },
  egusi: { prepMins: "20–30", kcal: 410, rating: 4.9, orders: 287 },
  "efo-riro": { prepMins: "20–30", kcal: 390, rating: 4.8, orders: 214 },
  chicken: { prepMins: "20–30", kcal: 520, rating: 4.9, orders: 341 },
  beef: { prepMins: "15–20", kcal: 280, rating: 4.7, orders: 189 },
  "turkey-big": { prepMins: "25–35", kcal: 580, rating: 4.8, orders: 177 },
  "turkey-small": { prepMins: "25–35", kcal: 460, rating: 4.7, orders: 143 },
  "chicken-wings-big": { prepMins: "20–25", kcal: 490, rating: 4.8, orders: 201 },
  "chicken-wings-small": { prepMins: "20–25", kcal: 340, rating: 4.7, orders: 167 },
  moimoi: { prepMins: "10–15", kcal: 290, rating: 4.8, orders: 230 },
  "meat-pie": { prepMins: "5–10", kcal: 380, rating: 4.6, orders: 164 },
  coleslaw: { prepMins: "5–10", kcal: 120, rating: 4.5, orders: 98 },
  "coke-pet": { prepMins: "< 5", kcal: 140, rating: 4.5, orders: 220 },
  "fanta-pet": { prepMins: "< 5", kcal: 140, rating: 4.5, orders: 198 },
  "sprite-pet": { prepMins: "< 5", kcal: 130, rating: 4.5, orders: 185 },
  water: { prepMins: "< 5", kcal: 0, rating: 4.5, orders: 145 },
};
const DEFAULT_META = { prepMins: "15–20", kcal: 350, rating: 4.7, orders: 100 };

export function MenuCard({ item }: { item: MenuItem }) {
  const { addItem, removeItem, setQuantity, getQuantity } = useCart();
  const qty = getQuantity(item.slug);
  const inCart = qty > 0;
  const isSpoon = !!item.pricePerSpoon;
  const isFav = !!item.tags?.length;
  const meta = META[item.slug] ?? DEFAULT_META;

  const [picking, setPicking] = useState(false);
  const [pendingQty, setPendingQty] = useState(1);
  const [liked, setLiked] = useState(false);

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
  function handleDec(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (qty <= 1) removeItem(item.slug);
    else setQuantity(item.slug, qty - 1);
  }
  function handleInc(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(item.slug, qty + 1);
  }

  return (
    <Link
      to="/menu/$slug"
      params={{ slug: item.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* ── image ── */}
      <div className="relative overflow-hidden bg-muted">
        <img
          src={optimizeImageUrl(item.image, 600, 75)}
          alt={item.name}
          loading="lazy"
          width={600}
          height={600}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* bestseller / tag badge */}
        {isFav ? (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            <Flame className="h-3 w-3" />
            {item.tags![0]}
          </span>
        ) : null}

        {/* in-cart badge */}
        {inCart && (
          <span className="absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow animate-badge-pop">
            {isSpoon ? "🥄" : "×"}
            {qty}
          </span>
        )}

        {/* heart button — visible on hover */}
        <button
          type="button"
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 dark:bg-black/70"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${liked ? "fill-red-500 text-red-500" : "text-foreground/50"}`}
          />
        </button>

        {/* quick-view pill — visible on hover */}
        <div className="absolute bottom-3 left-3 z-10 opacity-0 transition-all duration-200 group-hover:opacity-100">
          <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-foreground shadow-md transition hover:bg-primary hover:text-primary-foreground dark:bg-black/70 dark:text-white">
            Quick view →
          </span>
        </div>
      </div>

      {/* ── body ── */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {/* name + rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {item.name}
          </h3>
          <div className="flex shrink-0 items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-foreground">{meta.rating}</span>
          </div>
        </div>

        {/* description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item.shortDescription}
        </p>

        {/* meta row: prep time, calories, orders */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {meta.prepMins} min
          </span>
          {meta.kcal > 0 && (
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {meta.kcal} kcal
            </span>
          )}
          <span className="flex items-center gap-1">
            <ChefHat className="h-3 w-3" />
            {meta.orders}+ orders
          </span>
        </div>

        {/* price + cart controls */}
        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold text-primary">
              {formatNaira(item.priceNaira)}
            </span>
            {isSpoon && <span className="text-[10px] text-muted-foreground">per spoon</span>}
          </div>

          {/* ── cart controls ── */}
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
                onClick={handleDec}
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
                disabled={qty >= 100}
                onClick={handleInc}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : isSpoon ? (
            <button
              type="button"
              aria-label={`Add ${item.name}`}
              onClick={openPicker}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:scale-110 hover:bg-primary/90 active:scale-95 animate-bounce-in"
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              aria-label={`Add ${item.name}`}
              onClick={handleAdd}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:scale-110 hover:bg-primary/90 active:scale-95 animate-bounce-in"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── spoon picker overlay ── */}
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
              disabled={pendingQty <= 1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPendingQty((v) => Math.max(1, v - 1));
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:border-primary hover:text-primary disabled:opacity-40 transition"
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
              disabled={pendingQty >= 100}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPendingQty((v) => Math.min(100, v + 1));
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition"
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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to order
          </button>
        </div>
      )}
    </Link>
  );
}
