import { useEffect, useRef } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: Props) {
  const { items, itemCount, totalCount, totalPrice, removeItem, setQuantity, clearCart } =
    useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const orderLines = items
    .map((ci) => {
      const unit = ci.item.pricePerSpoon
        ? `${ci.quantity} ${ci.quantity === 1 ? "spoon" : "spoons"}`
        : `${ci.quantity} ${ci.quantity === 1 ? "portion" : "portions"}`;
      return `• ${ci.item.name} — ${unit} × ${formatNaira(ci.item.priceNaira)} = ${formatNaira(ci.item.priceNaira * ci.quantity)}`;
    })
    .join("\n");

  const whatsappHref = `https://wa.me/+2349039108517?text=${encodeURIComponent(
    `Hello Princess Eat Right Kitchen 👋\n\nI'd like to place this order:\n\n${orderLines}\n\n*Total: ${formatNaira(totalPrice)}*\n\nPlease confirm availability. Thank you!`,
  )}`;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 " +
          (open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
        }
      />

      {/* ── Drawer panel ── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your food list"
        className={
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-[22rem] flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-sm " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold leading-tight text-foreground">
                Food List
              </h2>
              {itemCount > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "dish" : "dishes"} · {formatNaira(totalPrice)}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close food list"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Item list ── */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center gap-5 px-6 py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted">
                <UtensilsCrossed className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-display text-lg text-foreground">Nothing here yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add dishes from the menu and they'll appear here.
                </p>
              </div>
              <Link
                to="/menu"
                onClick={onClose}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-105 hover:bg-primary/90"
              >
                Browse menu
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((ci) => (
                <li
                  key={ci.item.slug}
                  className="flex gap-3 px-4 py-4 transition hover:bg-muted/30"
                >
                  {/* Thumbnail */}
                  <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img
                      src={optimizeImageUrl(ci.item.image, 160, 75)}
                      alt={ci.item.name}
                      width={72}
                      height={72}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="truncate text-sm font-semibold leading-snug text-foreground">
                        {ci.item.name}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${ci.item.name}`}
                        onClick={() => removeItem(ci.item.slug)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* price label — per spoon for rice, per portion otherwise */}
                    <p className="text-[11px] text-muted-foreground">
                      {formatNaira(ci.item.priceNaira)}{" "}
                      {ci.item.pricePerSpoon ? "/ spoon" : "/ portion"}
                    </p>

                    <div className="mt-1 flex items-center justify-between">
                      {/* Spoon stepper */}
                      <div className="flex items-center rounded-full border border-border bg-background">
                        <button
                          type="button"
                          aria-label="Remove a spoon"
                          onClick={() => setQuantity(ci.item.slug, ci.quantity - 1)}
                          disabled={ci.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 transition hover:bg-muted hover:text-foreground disabled:opacity-40"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex min-w-[2.5rem] items-center justify-center gap-0.5 text-sm font-bold text-foreground">
                          {ci.item.pricePerSpoon ? "🥄 " : ""}
                          {ci.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Add a spoon"
                          onClick={() => setQuantity(ci.item.slug, ci.quantity + 1)}
                          disabled={ci.quantity >= 100}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 transition hover:bg-muted hover:text-foreground disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-sm font-bold text-primary">
                        {formatNaira(ci.item.priceNaira * ci.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer CTA ── */}
        {items.length > 0 && (
          <div className="border-t border-border bg-card px-5 pb-6 pt-4">
            {/* Order summary */}
            <div className="mb-4 rounded-xl bg-muted/60 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "dish" : "dishes"} · {totalCount}{" "}
                  {totalCount === 1 ? "item" : "items"}
                </span>
                <span className="font-display text-xl font-semibold text-foreground">
                  {formatNaira(totalPrice)}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Delivery fee quoted on WhatsApp
              </p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send order on WhatsApp
            </a>

            {/* Secondary actions */}
            <div className="mt-3 flex items-center justify-between">
              <Link
                to="/menu"
                onClick={onClose}
                className="text-xs text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline"
              >
                ← Add more items
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-muted-foreground underline-offset-2 transition hover:text-destructive hover:underline"
              >
                Clear list
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
