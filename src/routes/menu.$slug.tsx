import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, Plus, Minus, ArrowLeft, Flame } from "lucide-react";
import { getMenuItem, MENU } from "@/data/menu";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { MenuCard } from "@/components/MenuCard";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/menu/$slug")({
  loader: ({ params }) => {
    const item = getMenuItem(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Dish not found — Princess Eat Right Kitchen" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { item } = loaderData;
    const title = `${item.name} — ${formatNaira(item.priceNaira)} | Princess Eat Right Kitchen`;
    return {
      meta: [
        { title },
        { name: "description", content: item.shortDescription },
        { property: "og:title", content: item.name },
        { property: "og:description", content: item.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:image", content: item.image },
        { property: "og:url", content: `/menu/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: item.image },
      ],
      links: [{ rel: "canonical", href: `/menu/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MenuItem",
            name: item.name,
            description: item.description,
            image: item.image,
            offers: {
              "@type": "Offer",
              price: item.priceNaira,
              priceCurrency: "NGN",
              availability: "https://schema.org/InStock",
            },
          }),
        },
      ],
    };
  },
  component: MenuDetail,
  notFoundComponent: DishNotFound,
  errorComponent: DishError,
});

function DishNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">404</p>
        <h1 className="mt-3 font-display text-4xl text-foreground">We don't have that dish</h1>
        <p className="mt-4 text-muted-foreground">
          It may have sold out or been renamed. Browse our full menu below.
        </p>
        <Link
          to="/menu"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          See the menu
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function DishError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <Link
          to="/menu"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
        >
          Back to menu
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function SpiceIndicator({ level }: { level: 1 | 2 | 3 }) {
  const labels = { 1: "Mild", 2: "Medium", 3: "Hot" };
  const colors = {
    1: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    2: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    3: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${colors[level]}`}
    >
      <Flame className="h-3 w-3" />
      {labels[level]}
    </span>
  );
}

function MenuDetail() {
  const { item } = Route.useLoaderData() as { item: (typeof MENU)[number] };
  const { addItem, setQuantity: setCartQty, getQuantity, removeItem } = useCart();
  const isSpoon = !!item.pricePerSpoon;
  const [localQty, setLocalQty] = useState(1);
  const cartQty = getQuantity(item.slug);
  const inCart = cartQty > 0;

  const related = (item.pairsWith ?? [])
    .map((slug: string) => MENU.find((m) => m.slug === slug))
    .filter((m): m is (typeof MENU)[number] => Boolean(m));

  const totalPrice = item.priceNaira * localQty;
  const unit = isSpoon
    ? `${localQty} ${localQty === 1 ? "spoon" : "spoons"}`
    : `${localQty} ${localQty === 1 ? "portion" : "portions"}`;
  const whatsappHref = `https://wa.me/+2349039108517?text=${encodeURIComponent(
    `Hello Princess Eat Right Kitchen, I would like to order ${unit} of ${item.name} (Total: ${formatNaira(totalPrice)}).`,
  )}`;

  function handleAddToCart() {
    if (inCart) {
      setCartQty(item.slug, cartQty + localQty);
    } else {
      addItem(item, localQty);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-5 sm:pt-8 animate-fade-in">
        {/* ── Breadcrumb ── */}
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground animate-fade-in-up">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-foreground transition-colors">
            Menu
          </Link>
          <span>/</span>
          <span className="text-foreground">{item.name}</span>
        </nav>

        {/* ── Back link (mobile) ── */}
        <Link
          to="/menu"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:hidden"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to menu
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* ── Image ── */}
          <div
            className="relative overflow-hidden rounded-3xl border border-border bg-muted shadow-lg animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <img
              src={optimizeImageUrl(item.image, 1000, 80)}
              alt={`${item.name} served at Princess Eat Right Kitchen`}
              width={1000}
              height={1000}
              fetchPriority="high"
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* category label pinned to bottom of photo */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                {item.category}
              </span>
              {item.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Info + order panel ── */}
          <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {/* spice */}
            {item.spiceLevel && (
              <div className="mb-3">
                <SpiceIndicator level={item.spiceLevel} />
              </div>
            )}

            <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              {item.name}
            </h1>
            <p className="mt-3 font-display text-3xl font-semibold text-primary">
              {formatNaira(item.priceNaira)}
              <span className="ml-2 text-base font-normal text-muted-foreground">
                {isSpoon ? "/ spoon" : "/ portion"}
              </span>
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {item.shortDescription}
            </p>

            {/* ── Sticky order card ── */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {isSpoon ? "How many spoons?" : "How many portions?"}
              </p>

              {/* qty stepper */}
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-border bg-background">
                  <button
                    type="button"
                    aria-label={isSpoon ? "Decrease spoons" : "Decrease portions"}
                    onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                    disabled={localQty <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex min-w-[3rem] items-center justify-center gap-0.5 text-base font-bold text-foreground">
                    {isSpoon ? "🥄" : ""}
                    {localQty}
                  </span>
                  <button
                    type="button"
                    aria-label={isSpoon ? "Increase spoons" : "Increase portions"}
                    onClick={() => setLocalQty((q) => Math.min(100, q + 1))}
                    disabled={localQty >= 100}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total:{" "}
                  <span className="font-semibold text-foreground">{formatNaira(totalPrice)}</span>
                </span>
              </div>

              {/* action buttons */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {inCart ? `Add ${localQty} more` : `Add ${unit} to list`}
                </button>

                {/* WhatsApp direct */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-green-500"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order on WhatsApp
                </a>
              </div>

              {/* call fallback */}
              <a
                href="tel:+2349039108517"
                className="mt-3 flex w-full items-center justify-center text-xs text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline"
              >
                Or call +234 903 910 8517 to reserve
              </a>

              {/* in-cart indicator */}
              {inCart && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5">
                  <span className="text-sm font-medium text-primary">
                    {isSpoon ? "🥄 " : ""}
                    {cartQty}{" "}
                    {isSpoon
                      ? cartQty === 1
                        ? "spoon"
                        : "spoons"
                      : cartQty === 1
                        ? "portion"
                        : "portions"}{" "}
                    in your food list
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="text-xs text-muted-foreground underline-offset-2 transition hover:text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* ── About ── */}
            <div className="mt-8">
              <h2 className="font-display text-xl text-foreground">About this dish</h2>
              <p className="mt-3 leading-relaxed text-foreground/80">{item.description}</p>
            </div>

            {/* ── Ingredients ── */}
            <div className="mt-6">
              <h2 className="font-display text-xl text-foreground">Ingredients</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground/80 transition hover:border-primary/40 hover:text-foreground"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Pairs well with ── */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="mb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Complete your meal
              </p>
              <div className="mt-1 flex items-end justify-between">
                <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                  Pairs well with
                </h2>
                <Link to="/menu" className="text-sm text-primary transition hover:opacity-75">
                  Full menu →
                </Link>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <div
                  key={r.slug}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <MenuCard item={r} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
