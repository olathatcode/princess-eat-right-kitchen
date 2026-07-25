import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShoppingCart,
  Clock,
  Star,
  CheckCircle2,
  Truck,
  CalendarCheck,
  ChefHat,
  Minus,
  Plus,
  X,
  Heart,
  Flame,
  Zap,
  Award,
  Users,
  PhoneCall,
  ChevronDown,
  ArrowRight,
  MapPin,
  Timer,
  ArrowUp,
  MessageCircle,
  Package,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MENU } from "@/data/menu";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useCart } from "@/context/CartContext";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";

/* ─── Route meta ─────────────────────────────────────────────────────── */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Princess Eat Right Kitchen — Fresh. Delicious. Delivered. | Ijebu Ode" },
      {
        name: "description",
        content:
          "Women-owned Nigerian kitchen in Ijebu Ode. Jollof Rice, Fried Rice, Amala, Egusi, Efo Riro & more. Dine-in, pickup, and delivery.",
      },
      { property: "og:title", content: "Princess Eat Right Kitchen — Ijebu Ode" },
      {
        property: "og:description",
        content: "Fresh homemade meals delivered straight to your doorstep.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Princess Eat Right Kitchen",
          servesCuisine: "Nigerian",
          priceRange: "₦200–₦5,000",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Adjacent Barracks Junction, Esepa, Ita-Paadi",
            addressLocality: "Ijebu Ode",
            postalCode: "120102",
            addressRegion: "Ogun State",
            addressCountry: "NG",
          },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "127" },
        }),
      },
    ],
  }),
  component: Home,
});

/* ─── Announcement marquee ───────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  "🍛 Fresh Jollof Rice daily",
  "🥘 Egusi · Efo Riro · Gbegiri",
  "🍗 Peppered Goat Meat & Chicken",
  "🚚 Free delivery on orders over ₦5,000",
  "📞 Call: +234 703 585 5283",
  "⏰ Open Mon–Sat 8am–9pm · Sun 10am–6pm",
  "🌶️ Authentic Ijebu Ode flavours",
  "🫙 Amala · Eba · Pounded Yam",
  "⭐ 4.8 stars · 127+ happy customers",
  "🎁 Loyalty rewards — order 10, get 1 free",
];
function AnnouncementMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-b border-primary/30 bg-primary py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((text, i) => (
          <span
            key={i}
            className="mx-8 text-xs font-semibold uppercase tracking-widest text-primary-foreground"
          >
            {text}
            <span className="mx-8 opacity-50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Floating particles ─────────────────────────────────────────────── */
const PARTICLES = [
  { emoji: "🍛", top: "10%", left: "5%", delay: 0, dur: "7s", size: "text-2xl" },
  { emoji: "🌶️", top: "20%", left: "90%", delay: 1.5, dur: "6s", size: "text-xl" },
  { emoji: "🥘", top: "60%", left: "4%", delay: 2, dur: "8s", size: "text-lg" },
  { emoji: "🍗", top: "72%", left: "92%", delay: 0.5, dur: "7s", size: "text-2xl" },
  { emoji: "🫙", top: "42%", left: "94%", delay: 3, dur: "9s", size: "text-lg" },
  { emoji: "✨", top: "15%", left: "80%", delay: 1, dur: "5s", size: "text-sm" },
  { emoji: "🍃", top: "80%", left: "12%", delay: 2.5, dur: "6s", size: "text-sm" },
  { emoji: "🔥", top: "33%", left: "2%", delay: 3.5, dur: "7s", size: "text-lg" },
];

/* ─── Spoon-picker overlay (shared by DishCard & HeroCard) ──────────── */
type SpoonPickerProps = {
  item: (typeof MENU)[number];
  pendingQty: number;
  setPendingQty: (fn: (v: number) => number) => void;
  onConfirm: (e: React.MouseEvent) => void;
  onClose: (e: React.MouseEvent) => void;
};
function SpoonPickerOverlay({
  item,
  pendingQty,
  setPendingQty,
  onConfirm,
  onClose,
}: SpoonPickerProps) {
  return (
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
        onClick={onClose}
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
      <p className="text-sm font-bold text-primary">{formatNaira(item.priceNaira * pendingQty)}</p>
      <button
        type="button"
        onClick={onConfirm}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition"
      >
        <ShoppingCart className="h-4 w-4" />
        Add to order
      </button>
    </div>
  );
}

/* ─── Premium DishCard ───────────────────────────────────────────────── */
function DishCard({ item, badge }: { item: (typeof MENU)[number]; badge?: string }) {
  const { addItem, removeItem, setQuantity, getQuantity } = useCart();
  const qty = getQuantity(item.slug);
  const inCart = qty > 0;
  const isSpoon = !!item.pricePerSpoon;
  const [picking, setPicking] = useState(false);
  const [pendingQty, setPendingQty] = useState(1);
  const [liked, setLiked] = useState(false);

  function openPicker(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPendingQty(qty > 0 ? qty : 1);
    setPicking(true);
  }
  function confirmAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, pendingQty);
    setPicking(false);
  }

  return (
    <div className="group relative flex shrink-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      {/* image */}
      <div className="relative overflow-hidden bg-muted">
        <img
          src={optimizeImageUrl(item.image, 500, 75)}
          alt={item.name}
          loading="lazy"
          width={500}
          height={500}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {badge && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md">
            <Flame className="h-3 w-3" />
            {badge}
          </span>
        )}
        {item.tags?.[0] && !badge && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
            {item.tags[0]}
          </span>
        )}
        {inCart && (
          <span className="absolute right-3 top-3 flex items-center gap-0.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow animate-badge-pop">
            {isSpoon ? "🥄" : "×"}
            {qty}
          </span>
        )}
        {/* heart */}
        <button
          type="button"
          aria-label="Add to favourites"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-black/60 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-foreground/50"}`}
          />
        </button>
        {/* quick-view */}
        <Link
          to="/menu/$slug"
          params={{ slug: item.slug }}
          className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 dark:bg-black/60 px-3 py-1 text-[11px] font-semibold text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
        >
          Quick view
        </Link>
      </div>
      {/* body */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <div className="flex shrink-0 items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-semibold text-foreground">4.8</span>
          </div>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item.shortDescription}
        </p>
        <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            15–25 min
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            ~450 kcal
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold text-primary">
              {formatNaira(item.priceNaira)}
            </span>
            {isSpoon && <span className="text-[10px] text-muted-foreground">per spoon</span>}
          </div>
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
                aria-label="Decrease"
                onClick={(e) => {
                  e.preventDefault();
                  if (qty <= 1) removeItem(item.slug);
                  else setQuantity(item.slug, qty - 1);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground/70 hover:border-primary hover:text-primary transition"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="flex min-w-[2.5rem] items-center justify-center gap-0.5 text-sm font-bold text-foreground">
                {isSpoon ? "🥄" : ""}
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase"
                disabled={qty >= 100}
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity(item.slug, qty + 1);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : isSpoon ? (
            <button
              type="button"
              onClick={openPicker}
              aria-label={`Add ${item.name}`}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm hover:bg-primary/90 hover:scale-105 active:scale-95 transition"
            >
              <ShoppingCart className="h-3 w-3" />
              Add
            </button>
          ) : (
            <button
              type="button"
              aria-label={`Add ${item.name}`}
              onClick={(e) => {
                e.preventDefault();
                addItem(item, 1);
              }}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm hover:bg-primary/90 hover:scale-105 active:scale-95 transition"
            >
              <ShoppingCart className="h-3 w-3" />
              Add
            </button>
          )}
        </div>
      </div>
      {picking && (
        <SpoonPickerOverlay
          item={item}
          pendingQty={pendingQty}
          setPendingQty={setPendingQty}
          onConfirm={confirmAdd}
          onClose={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

/* ─── Countdown timer ────────────────────────────────────────────────── */
function useCountdown(targetHour = 21) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    function calc() {
      const now = new Date();
      const end = new Date();
      end.setHours(targetHour, 0, 0, 0);
      if (now >= end) end.setDate(end.getDate() + 1);
      setSecs(Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000)));
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetHour]);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return { h, m, s };
}

function CountdownUnit({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 font-display text-xl font-bold text-white sm:h-14 sm:w-14 sm:text-2xl">
        {String(val).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-white/70">
        {label}
      </span>
    </div>
  );
}

/* ─── Reviews ────────────────────────────────────────────────────────── */
const REVIEWS = [
  {
    name: "Tunde Bakare",
    avatar: "T",
    rating: 5,
    text: "The smoky Jollof Rice is out of this world! Tastes exactly like party Jollof. Portion was generous and the chicken perfectly spiced.",
    role: "Regular customer",
  },
  {
    name: "Chioma Nwachukwu",
    avatar: "C",
    rating: 5,
    text: "Their Egusi Soup is so rich and delicious. The beef was tender and well-seasoned. It arrived hot and fresh. Best Nigerian food in Ijebu Ode!",
    role: "Delivery customer",
  },
  {
    name: "Funmi Olayinka",
    avatar: "F",
    rating: 5,
    text: "Best restaurant in Ijebu Ode! The Efo Riro is so authentic and packed with flavor. Clean environment and extremely friendly staff.",
    role: "Loyal patron",
  },
  {
    name: "Abiola Adebayo",
    avatar: "A",
    rating: 4,
    text: "Amala and Abula was very smooth and hot. The soup was rich and authentic. Very worth the price!",
    role: "Dine-in customer",
  },
];

function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % REVIEWS.length), 4500);
    return () => clearInterval(t);
  }, []);
  const r = REVIEWS[idx];
  return (
    <section className="bg-secondary/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
            What customers say
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            Loved by <span className="text-primary">127+</span> Customers
          </h2>
        </div>
        <div className="relative mx-auto max-w-2xl overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {REVIEWS.map((rv) => (
              <div key={rv.name} className="w-full shrink-0">
                <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: rv.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed text-foreground/90">"{rv.text}"</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {rv.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{rv.name}</p>
                      <p className="text-xs text-muted-foreground">{rv.role}</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* dots */}
          <div className="mt-6 flex justify-center gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === idx ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50")
                }
              />
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
          >
            Read all reviews <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How do I place an order?",
    a: "Add dishes to your cart then tap 'Send order on WhatsApp'. Our team will confirm availability and delivery time immediately.",
  },
  {
    q: "Do you deliver on weekends?",
    a: "Yes! We deliver Monday to Saturday 8am–9pm and Sunday 10am–6pm across Ijebu Ode and environs.",
  },
  {
    q: "Can I schedule an order in advance?",
    a: "Absolutely. Send us a WhatsApp message with your preferred date and time, and we'll have your meal ready.",
  },
  {
    q: "Do you accept bank transfers?",
    a: "Yes — we accept cash, bank transfer, and mobile payments. Payment details are shared on WhatsApp after order confirmation.",
  },
  {
    q: "Can I customise a meal?",
    a: "Of course! Let us know your preferences (extra spice, no onions, etc.) in your WhatsApp message and we'll accommodate where possible.",
  },
  {
    q: "Is there a minimum order amount?",
    a: "No minimum for pickup or dine-in. For delivery, a minimum of ₦2,000 applies. Delivery fee is quoted based on your location.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
            Got questions?
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={
                "rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 " +
                (open === i ? "shadow-md" : "")
              }
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                {faq.q}
                <ChevronDown
                  className={
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 " +
                    (open === i ? "rotate-180 text-primary" : "")
                  }
                />
              </button>
              {open === i && (
                <div className="border-t border-border/60 px-5 pb-5 pt-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Floating action buttons ────────────────────────────────────────── */
function FloatingActions() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div
      className={
        "fixed bottom-6 right-4 z-50 flex flex-col gap-3 transition-all duration-300 " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")
      }
    >
      {/* WhatsApp */}
      <a
        href="https://wa.me/+2347035855283"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30 transition-all hover:scale-110 hover:bg-green-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
      {/* Call */}
      <a
        href="tel:+2347035855283"
        aria-label="Call us"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-all hover:scale-110 hover:bg-primary/90"
      >
        <PhoneCall className="h-5 w-5 text-white" />
      </a>
      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/80 shadow-lg transition-all hover:scale-110 hover:bg-foreground dark:bg-white/20 dark:hover:bg-white/30"
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}

/* ─── Loyalty programme ─────────────────────────────────────────────── */
function LoyaltySection() {
  /* Demo: track meals purchased in localStorage */
  const [count, setCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem("princess_loyalty_count") ?? "0", 10);
    } catch {
      return 0;
    }
  });

  const GOAL = 10;
  const pct = Math.min((count / GOAL) * 100, 100);
  const left = Math.max(GOAL - count, 0);

  function addMeal() {
    const next = Math.min(count + 1, GOAL);
    setCount(next);
    try {
      localStorage.setItem("princess_loyalty_count", String(next));
    } catch {
      /* noop */
    }
  }
  function reset() {
    setCount(0);
    try {
      localStorage.setItem("princess_loyalty_count", "0");
    } catch {
      /* noop */
    }
  }

  return (
    <section className="bg-gradient-to-br from-secondary/60 to-background py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          <div className="grid lg:grid-cols-2">
            {/* left: explainer */}
            <div className="flex flex-col justify-center gap-5 bg-primary p-8 sm:p-10 text-primary-foreground">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                🎁
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-foreground/70">
                  Rewards programme
                </p>
                <h2 className="mt-2 font-display text-3xl leading-tight">
                  Buy 10 Meals,
                  <br />
                  Get <span className="text-yellow-300">1 Free!</span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
                  Every meal you order earns a stamp. Collect 10 stamps and your next meal is
                  completely on us. No sign-up required — we track it on WhatsApp.
                </p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-primary-foreground/80">
                {[
                  "Order any dish to earn a stamp",
                  "Redeem any meal valued up to ₦3,000",
                  "Stamps never expire",
                  "Shareable with family",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* right: progress tracker */}
            <div className="flex flex-col items-center justify-center gap-6 p-8 sm:p-10">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  Your progress
                </p>
                <p className="mt-1 font-display text-5xl font-bold text-foreground">
                  {count}
                  <span className="text-2xl text-muted-foreground">/{GOAL}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {count >= GOAL
                    ? "🎉 You've earned a free meal!"
                    : `${left} more meal${left !== 1 ? "s" : ""} to go`}
                </p>
              </div>

              {/* stamp grid */}
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: GOAL }).map((_, i) => (
                  <div
                    key={i}
                    className={
                      "flex h-12 w-12 items-center justify-center rounded-xl border-2 text-xl transition-all duration-300 " +
                      (i < count
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-dashed border-border bg-muted text-muted-foreground/30")
                    }
                  >
                    {i < count ? "🍛" : "○"}
                  </div>
                ))}
              </div>

              {/* progress bar */}
              <div className="w-full">
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-right text-[11px] text-muted-foreground">
                  {Math.round(pct)}% complete
                </p>
              </div>

              {count < GOAL ? (
                <button
                  type="button"
                  onClick={addMeal}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 hover:scale-105 active:scale-95"
                >
                  + Add a stamp (demo)
                </button>
              ) : (
                <a
                  href="https://wa.me/+2347035855283?text=Hi!%20I%27ve%20earned%20my%20free%20meal%20from%20the%20loyalty%20programme!%20%F0%9F%8E%81"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-green-500 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-600 hover:scale-105"
                >
                  🎁 Claim your free meal on WhatsApp
                </a>
              )}
              {count > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline transition"
                >
                  Reset demo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Newsletter ─────────────────────────────────────────────────────── */
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("err");
      return;
    }
    setLoading(true);
    /* Simulate API call — replace with real endpoint */
    setTimeout(() => {
      setLoading(false);
      setStatus("ok");
      try {
        localStorage.setItem("princess_newsletter", email);
      } catch {
        /* noop */
      }
    }, 900);
  }

  return (
    <section className="relative overflow-hidden border-y border-border bg-secondary/30 py-16 sm:py-20">
      {/* decorative dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
          📬
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
          Stay in the loop
        </p>
        <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
          Get <span className="text-primary">Exclusive Deals</span> First
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Subscribe for weekly specials, new dish announcements, and exclusive discounts delivered
          straight to your inbox.
        </p>

        {status === "ok" ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/30">
              ✅
            </div>
            <p className="font-semibold text-foreground">
              You're in! Welcome to the Princess Kitchen family.
            </p>
            <p className="text-sm text-muted-foreground">
              Check your inbox for a welcome discount 🎁
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                placeholder="Enter your email address"
                required
                aria-label="Email address"
                className={
                  "w-full rounded-full border py-3.5 pl-5 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition " +
                  (status === "err"
                    ? "border-destructive/50 bg-destructive/5 focus:ring-2 focus:ring-destructive/20"
                    : "border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20")
                }
              />
              {status === "err" && (
                <p className="mt-1.5 text-left pl-5 text-[11px] text-destructive">
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        )}

        <p className="mt-4 text-[11px] text-muted-foreground">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}

/* ─── Home page ──────────────────────────────────────────────────────── */
function Home() {
  const heroItem = MENU.find((m) => m.slug === "jollof-rice")!;
  const bestSellers = MENU.filter((m) =>
    ["jollof-rice", "egusi", "efo-riro", "chicken", "fried-rice", "moimoi"].includes(m.slug),
  );
  const { h, m, s } = useCountdown(21);
  const specialItem = MENU.find((m) => m.slug === "jollof-rice")!;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <AnnouncementMarquee />

      {/* ══ §1 HERO ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/60 via-background to-secondary/30">
        {/* bg blobs */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-2xl" />
        {/* floating particles */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`pointer-events-none absolute select-none opacity-15 ${p.size} animate-float`}
            style={{
              top: p.top,
              left: p.left,
              animationDuration: p.dur,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </span>
        ))}

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
          {/* left: copy */}
          <div className="animate-fade-in-up">
            {/* pill badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Now Open · Ijebu Ode
              </span>
            </div>
            <h1 className="font-display text-4xl leading-[1.06] text-foreground sm:text-5xl lg:text-6xl">
              Fresh.
              <br />
              <span className="text-primary">Delicious.</span>
              <br />
              Delivered.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Healthy homemade meals prepared fresh every day and delivered straight to your
              doorstep. Authentic Nigerian flavours from our Esepa kitchen.
            </p>
            {/* stats */}
            <div className="mt-6 flex flex-wrap gap-6">
              {[
                {
                  icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" />,
                  val: "4.8",
                  label: "Rating",
                },
                {
                  icon: <Users className="h-4 w-4 text-primary" />,
                  val: "127+",
                  label: "Customers",
                },
                { icon: <Package className="h-4 w-4 text-primary" />, val: "25+", label: "Dishes" },
              ].map(({ icon, val, label }) => (
                <div key={label} className="flex items-center gap-2">
                  {icon}
                  <span className="font-bold text-foreground">{val}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="group flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-xl"
              >
                Order Now{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/menu"
                className="flex items-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-sm font-bold text-foreground transition-all hover:border-primary/50 hover:scale-105"
              >
                View Menu
              </Link>
            </div>
            {/* hours */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                8am–9:30pm
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Ijebu Ode, Ogun State
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-primary" />
                Delivery available
              </span>
            </div>
          </div>

          {/* right: circular food image */}
          <div
            className="relative flex items-center justify-center animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="absolute h-[380px] w-[380px] rounded-full border-2 border-dashed border-primary/20 sm:h-[440px] sm:w-[440px] animate-spin-slow" />
            <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full border-4 border-white/60 bg-primary/5 shadow-2xl sm:h-[360px] sm:w-[360px] dark:border-white/10">
              <img
                src={optimizeImageUrl(heroItem.image, 720, 80)}
                alt={heroItem.name}
                width={720}
                height={720}
                fetchPriority="high"
                loading="eager"
                className="h-full w-full object-cover animate-rotate-hero"
              />
            </div>
            {/* mini card */}
            <div className="absolute -bottom-2 left-0 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-3 py-2.5 shadow-xl backdrop-blur-sm sm:left-4">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-muted">
                <img
                  src={optimizeImageUrl(heroItem.image, 80, 75)}
                  alt={heroItem.name}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{heroItem.name}</p>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-primary mt-0.5">
                  {formatNaira(heroItem.priceNaira)}
                  <span className="font-normal text-muted-foreground"> / spoon</span>
                </p>
              </div>
            </div>
            <div className="absolute -top-3 right-2 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-md sm:right-6">
              <Award className="h-3.5 w-3.5" />
              Best Food 🏆
            </div>
          </div>
        </div>
        {/* scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </section>

      {/* ══ §2 BEST SELLERS ══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                From our kitchen
              </p>
              <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
                🔥 Best <span className="text-primary">Sellers</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The dishes our customers keep coming back for
              </p>
            </div>
            <Link
              to="/menu"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary sm:flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bestSellers.map((item, i) => (
              <div
                key={item.slug}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <DishCard
                  item={item}
                  badge={i === 0 ? "Best Seller" : i === 1 ? "Popular" : undefined}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/50"
            >
              See the full menu <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ §3 DIVIDER MARQUEE ═══════════════════════════════════════════ */}
      <div className="overflow-hidden bg-primary py-3">
        <div
          className="flex animate-marquee whitespace-nowrap"
          style={{ animationDuration: "20s" }}
        >
          {[
            "Princess Eat Right Kitchen",
            "Home-style Nigerian Cooking",
            "Ijebu Ode · Ogun State",
            "Fresh Every Day",
            "Dine In · Pickup · Delivery",
            "Women-Owned & Proud",
            "Princess Eat Right Kitchen",
            "Home-style Nigerian Cooking",
            "Ijebu Ode · Ogun State",
            "Fresh Every Day",
            "Dine In · Pickup · Delivery",
            "Women-Owned & Proud",
          ].map((text, i) => (
            <span
              key={i}
              className="mx-6 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              {text}
              <span className="mx-6 opacity-60">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ §4 TODAY'S SPECIAL ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-red-800 py-16 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* text */}
            <div className="text-white">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                <Flame className="h-3.5 w-3.5" />
                Today's Special — Limited Time
              </div>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl">
                Jollof Rice
                <br />
                <span className="text-yellow-300">+ Chicken</span>
                <br />+ Chapman
              </h2>
              <p className="mt-4 text-lg text-white/80">
                A complete meal deal — smoky Jollof, crispy chicken & a chilled Chapman. All for one
                great price.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="rounded-full bg-yellow-400 px-4 py-1.5 text-lg font-black text-black">
                  20% OFF
                </span>
                <span className="text-white/60 line-through text-base">{formatNaira(5000)}</span>
                <span className="text-2xl font-bold">{formatNaira(4000)}</span>
              </div>
              <p className="mt-3 text-sm text-white/70">Offer expires in:</p>
              <div className="mt-2 flex items-center gap-2">
                <CountdownUnit val={h} label="hrs" />
                <span className="mb-4 text-2xl font-bold text-white/60">:</span>
                <CountdownUnit val={m} label="min" />
                <span className="mb-4 text-2xl font-bold text-white/60">:</span>
                <CountdownUnit val={s} label="sec" />
              </div>
              <a
                href="https://wa.me/+2347035855283?text=Hi!%20I%27d%20like%20to%20order%20the%20Today%27s%20Special%20deal%20please!"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-xl transition hover:bg-white/90 hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                Claim This Deal
              </a>
            </div>
            {/* food image */}
            <div className="relative flex justify-center">
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white/30 shadow-2xl sm:h-80 sm:w-80">
                <img
                  src={optimizeImageUrl(specialItem.image, 640, 80)}
                  alt="Today's special"
                  width={640}
                  height={640}
                  loading="lazy"
                  className="h-full w-full object-cover animate-rotate-hero"
                />
              </div>
              <div className="absolute -top-2 right-4 rotate-12 rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-black text-black shadow-lg sm:right-8">
                🎉 Save ₦1,000!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ §5 WHY CHOOSE US ════════════════════════════════════════════ */}
      <section id="why-us" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
              Why choose us
            </p>
            <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
              We Provide the <span className="text-primary">Best Experience</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Flame className="h-6 w-6 text-orange-500" />,
                bg: "bg-orange-100 dark:bg-orange-900/30",
                title: "Fresh Ingredients",
                desc: "Every dish is made daily with locally sourced, high-quality ingredients. Never frozen, always fresh.",
              },
              {
                icon: <Truck className="h-6 w-6 text-blue-500" />,
                bg: "bg-blue-100 dark:bg-blue-900/30",
                title: "Fast Delivery",
                desc: "Hot meals delivered to your doorstep within 30–45 minutes. Tracked in real time on WhatsApp.",
              },
              {
                icon: <Award className="h-6 w-6 text-amber-500" />,
                bg: "bg-amber-100 dark:bg-amber-900/30",
                title: "Affordable Prices",
                desc: "Restaurant-quality food at home-kitchen prices. From ₦200 to ₦5,000 for premium proteins.",
              },
              {
                icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
                bg: "bg-green-100 dark:bg-green-900/30",
                title: "Healthy Meals",
                desc: "Balanced Nigerian cuisine rich in protein, fibre, and essential nutrients. Clean & hygienic kitchen.",
              },
              {
                icon: <ChefHat className="h-6 w-6 text-purple-500" />,
                bg: "bg-purple-100 dark:bg-purple-900/30",
                title: "Experienced Chefs",
                desc: "Our women-owned kitchen brings decades of authentic Yoruba and Nigerian culinary tradition.",
              },
              {
                icon: <CalendarCheck className="h-6 w-6 text-primary" />,
                bg: "bg-primary/10",
                title: "Easy Pre-Booking",
                desc: "Schedule catering for events, offices, and parties. Minimum notice: 24 hours. No event too big.",
              },
            ].map(({ icon, bg, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}
                >
                  {icon}
                </div>
                <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ §6 ORDER STEPS ══════════════════════════════════════════════ */}
      <section id="order-how" className="bg-secondary/30 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
              Simple process
            </p>
            <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
              How to <span className="text-primary">Order</span>
            </h2>
          </div>
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* connector line — desktop */}
            <div
              className="pointer-events-none absolute top-8 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10 lg:block"
              style={{ top: "2rem" }}
            />
            {[
              {
                step: "01",
                icon: <Package className="h-5 w-5" />,
                title: "Choose Meal",
                desc: "Browse our menu and pick your favourites",
              },
              {
                step: "02",
                icon: <ShoppingCart className="h-5 w-5" />,
                title: "Add to Cart",
                desc: "Set quantities and review your order",
              },
              {
                step: "03",
                icon: <MessageCircle className="h-5 w-5" />,
                title: "Send via WhatsApp",
                desc: "Tap Order Now — we confirm instantly",
              },
              {
                step: "04",
                icon: <Flame className="h-5 w-5" />,
                title: "We Cook",
                desc: "Your meal is freshly prepared with love",
              },
              {
                step: "05",
                icon: <Truck className="h-5 w-5" />,
                title: "Delivered Hot",
                desc: "Arrives at your door hot and on time",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background">
                  {icon}
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                    {step}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a
              href="https://wa.me/+2347035855283"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition hover:bg-green-600 hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              Start Your Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══ §7 TESTIMONIALS ═════════════════════════════════════════════ */}
      <TestimonialsCarousel />

      {/* ══ §8 DELIVERY INFO ════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid lg:grid-cols-2">
              {/* map placeholder / info */}
              <div className="bg-secondary/40 p-8 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  Find us
                </p>
                <h2 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
                  Delivery <span className="text-primary">Information</span>
                </h2>
                <div className="mt-6 flex flex-col gap-4">
                  {[
                    {
                      icon: <Clock className="h-5 w-5 text-primary" />,
                      label: "Delivery Hours",
                      val: "Mon–Sat: 8am–9pm · Sun: 10am–6pm",
                    },
                    {
                      icon: <MapPin className="h-5 w-5 text-primary" />,
                      label: "Delivery Zone",
                      val: "Ijebu Ode & surrounding areas",
                    },
                    {
                      icon: <Timer className="h-5 w-5 text-primary" />,
                      label: "Average ETA",
                      val: "30–45 minutes after confirmation",
                    },
                    {
                      icon: <Package className="h-5 w-5 text-primary" />,
                      label: "Pickup Available",
                      val: "Ready in 20 min · No delivery fee",
                    },
                    {
                      icon: <PhoneCall className="h-5 w-5 text-primary" />,
                      label: "Emergency Line",
                      val: "+234 703 585 5283 (call or WhatsApp)",
                    },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        {icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* CTA side */}
              <div className="flex flex-col items-center justify-center gap-6 p-8 sm:p-10 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-foreground">Ready to Order?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Call us or send a WhatsApp message and we'll handle the rest.
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <a
                    href="https://wa.me/+2347035855283"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-green-500 py-3.5 text-sm font-bold text-white transition hover:bg-green-600 hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Order
                  </a>
                  <a
                    href="tel:+2347035855283"
                    className="flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 hover:scale-105"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Call +234 703 585 5283
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ §9 FAQ ══════════════════════════════════════════════════════ */}
      <FAQ />

      {/* ══ §10 CTA BANNER ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-red-700 py-16 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,currentColor 0,currentColor 1px,transparent 0,transparent 50%)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Are You Ready to Enjoy <span className="text-yellow-300">Our Food?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/80">
            Fresh, home-style Nigerian dishes cooked daily in Ijebu Ode. Order now, pick up, or call
            — we're ready for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/menu"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-xl transition hover:bg-white/90 hover:scale-105"
            >
              Browse Menu
            </Link>
            <a
              href="tel:+2347035855283"
              className="rounded-full border-2 border-white/50 bg-white/10 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/20 hover:scale-105"
            >
              Call to Order
            </a>
          </div>
        </div>
      </section>

      {/* ══ §11 LOYALTY PROGRAMME ═══════════════════════════════════════ */}
      <LoyaltySection />

      {/* ══ §12 NEWSLETTER ══════════════════════════════════════════════ */}
      <NewsletterSection />

      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
