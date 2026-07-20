import { Link } from "@tanstack/react-router";
import { Plus, Minus } from "lucide-react";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";
import type { MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addItem, removeItem, setQuantity, getQuantity } = useCart();
  const qty = getQuantity(item.slug);
  const inCart = qty > 0;
  const isFavourite = !!(item.tags?.length);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
  }

  function handleDecrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) removeItem(item.slug);
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden bg-muted">
        {/* Favourite badge */}
        {isFavourite && (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-sm dark:bg-black/60 dark:text-foreground">
            Favourite
            <span aria-hidden className="text-sm">🔥</span>
          </span>
        )}

        {/* in-cart qty bubble */}
        {inCart && (
          <span className="absolute right-3 top-3 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow">
            {qty}
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
          <span className="text-sm font-semibold text-foreground">
            {formatNaira(item.priceNaira)}
          </span>

          {/* cart controls */}
          {inCart ? (
            <div
              className="flex items-center gap-1"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <button
                type="button"
                aria-label="Decrease"
                onClick={handleDecrement}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground/70 transition hover:border-primary hover:text-primary disabled:opacity-40"
                disabled={qty <= 0}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-foreground">{qty}</span>
              <button
                type="button"
                aria-label="Increase"
                onClick={handleIncrement}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
                disabled={qty >= 20}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
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
    </Link>
  );
}
