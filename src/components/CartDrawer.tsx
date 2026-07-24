import { useEffect, useRef, useState } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  UtensilsCrossed,
  ArrowRight,
  Tag,
  Truck,
  Gift,
  ChevronRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void };

/* ── Coupon codes (client-side demo — swap with API in production) */
const COUPONS: Record<string, number> = {
  PRINCESS10: 0.1,
  WELCOME15: 0.15,
  LOYALTY20: 0.2,
};

const DELIVERY_FEE = 500; // ₦500 flat; waived over ₦5 000

export function CartDrawer({ open, onClose }: Props) {
  const { items, itemCount, totalCount, totalPrice, removeItem, setQuantity, clearCart } =
    useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  /* coupon */
  const [couponInput, setCouponInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "ok" | "err">("idle");

  const discount = appliedCode ? (COUPONS[appliedCode] ?? 0) : 0;
  const discountAmt = Math.round(totalPrice * discount);
  const deliveryFee = totalPrice >= 5000 ? 0 : items.length ? DELIVERY_FEE : 0;
  const grandTotal = totalPrice - discountAmt + deliveryFee;

  /* keyboard / scroll */
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a code first.");
      setCouponStatus("err");
      return;
    }
    if (COUPONS[code] !== undefined) {
      setAppliedCode(code);
      setCouponError("");
      setCouponStatus("ok");
    } else {
      setCouponError("Invalid code. Try PRINCESS10, WELCOME15 or LOYALTY20.");
      setCouponStatus("err");
    }
  }

  function removeCoupon() {
    setAppliedCode(null);
    setCouponInput("");
    setCouponStatus("idle");
    setCouponError("");
  }

  /* WhatsApp message */
  const orderLines = items
    .map((ci) => {
      const unit = ci.item.pricePerSpoon
        ? `${ci.quantity} ${ci.quantity === 1 ? "spoon" : "spoons"}`
        : `${ci.quantity} ${ci.quantity === 1 ? "portion" : "portions"}`;
      return `• ${ci.item.name} — ${unit} × ${formatNaira(ci.item.priceNaira)} = ${formatNaira(ci.item.priceNaira * ci.quantity)}`;
    })
    .join("\n");

  const discountLine =
    discountAmt > 0 ? `\n🎁 Discount (${appliedCode}): -${formatNaira(discountAmt)}` : "";
  const deliveryLine =
    deliveryFee > 0 ? `\n🚚 Delivery fee: ${formatNaira(deliveryFee)}` : "\n🚚 Delivery fee: FREE";
  const whatsappHref = `https://wa.me/+2349039108517?text=${encodeURIComponent(
    `Hello Princess Eat Right Kitchen 👋\n\nI'd like to place this order:\n\n${orderLines}${discountLine}${deliveryLine}\n\n*Grand Total: ${formatNaira(grandTotal)}*\n\nPlease confirm availability. Thank you!`,
  )}`;

  const isEmpty = items.length === 0;

  return (
    <>
      {/* backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 " +
          (open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
        }
      />

      {/* panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-[22rem] flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-sm " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        {/* ── header ── */}
        <div className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold leading-tight text-foreground">
                Your Cart
              </h2>
              {itemCount > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "dish" : "dishes"} · {formatNaira(totalPrice)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {itemCount > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              aria-label="Close cart"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── item list / empty state ── */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-5 px-6 py-20 text-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted">
                  <UtensilsCrossed className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  0
                </span>
              </div>
              <div>
                <p className="font-display text-lg text-foreground">Your cart is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add something delicious from our menu!
                </p>
              </div>
              <Link
                to="/menu"
                onClick={onClose}
                className="flex items-center gap-2 rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-105 hover:bg-primary/90"
              >
                Browse menu <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {/* suggestive badges */}
              <div className="flex flex-wrap justify-center gap-2">
                {["Jollof Rice", "Egusi Soup", "Fried Chicken"].map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((ci) => (
                <li
                  key={ci.item.slug}
                  className="group flex gap-3 px-4 py-4 transition hover:bg-muted/30"
                >
                  {/* thumbnail */}
                  <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img
                      src={optimizeImageUrl(ci.item.image, 160, 75)}
                      alt={ci.item.name}
                      width={72}
                      height={72}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* details */}
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
                    <p className="text-[11px] text-muted-foreground">
                      {formatNaira(ci.item.priceNaira)}{" "}
                      {ci.item.pricePerSpoon ? "/ spoon" : "/ portion"}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      {/* stepper */}
                      <div className="flex items-center rounded-full border border-border bg-background">
                        <button
                          type="button"
                          aria-label="Decrease"
                          disabled={ci.quantity <= 1}
                          onClick={() => setQuantity(ci.item.slug, ci.quantity - 1)}
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
                          aria-label="Increase"
                          disabled={ci.quantity >= 100}
                          onClick={() => setQuantity(ci.item.slug, ci.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 transition hover:bg-muted hover:text-foreground disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
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

        {/* ── footer / checkout ── */}
        {!isEmpty && (
          <div className="border-t border-border bg-card px-5 pb-6 pt-4">
            {/* coupon input */}
            <div className="mb-4">
              {appliedCode ? (
                <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-2.5 dark:bg-green-900/20">
                  <span className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
                    <Gift className="h-4 w-4" />
                    {appliedCode} — {Math.round(discount * 100)}% off applied!
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                    className="text-green-600 transition hover:text-green-800 dark:text-green-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponStatus("idle");
                        setCouponError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      className={
                        "w-full rounded-xl border py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition " +
                        (couponStatus === "err"
                          ? "border-destructive/50 bg-destructive/5 focus:ring-destructive/20"
                          : couponStatus === "ok"
                            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                            : "border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20")
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-95"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="mt-1.5 text-[11px] text-destructive">{couponError}</p>}
            </div>

            {/* order summary */}
            <div className="mb-4 space-y-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>
                  Subtotal ({itemCount} {itemCount === 1 ? "dish" : "dishes"})
                </span>
                <span className="font-medium text-foreground">{formatNaira(totalPrice)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1">
                    <Gift className="h-3.5 w-3.5" />
                    Discount ({Math.round(discount * 100)}%)
                  </span>
                  <span className="font-semibold">−{formatNaira(discountAmt)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  Delivery fee
                </span>
                {deliveryFee === 0 ? (
                  <span className="font-semibold text-green-600 dark:text-green-400">FREE</span>
                ) : (
                  <span className="font-medium text-foreground">{formatNaira(deliveryFee)}</span>
                )}
              </div>
              {totalPrice < 5000 && deliveryFee > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Add {formatNaira(5000 - totalPrice)} more for free delivery
                </p>
              )}
              <div className="border-t border-border/60 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Grand Total</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {formatNaira(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp checkout */}
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
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a6.23 6.23 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Checkout via WhatsApp
            </a>

            <div className="mt-3 flex items-center justify-between">
              <Link
                to="/menu"
                onClick={onClose}
                className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground hover:underline underline-offset-2"
              >
                <ChevronRight className="h-3 w-3 rotate-180" />
                Add more items
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
