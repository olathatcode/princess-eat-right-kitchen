import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { CATEGORIES, MENU, type MenuCategory } from "@/data/menu";
import { MenuCard } from "@/components/MenuCard";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/utils";

export const Route = createFileRoute("/menu/")({
  head: () => ({
    meta: [
      { title: "Menu — Princess Eat Right Kitchen | Ijebu Ode" },
      {
        name: "description",
        content:
          "Explore the full menu at Princess Eat Right Kitchen — Jollof Rice, Fried Rice, Amala, Egusi, Efo Riro, Chicken, Turkey, and more, from ₦200 to ₦5,000.",
      },
      { property: "og:title", content: "Menu — Princess Eat Right Kitchen" },
      {
        property: "og:description",
        content: "Home-style Nigerian dishes served daily in Ijebu Ode, Ogun State.",
      },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuIndex,
});

const PAGE_SIZE = 9;

/* ── Order panel ────────────────────────────────────────────────── */
function OrderPanel() {
  const { items, itemCount, totalCount, totalPrice, setQuantity, removeItem, clearCart } =
    useCart();

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
    <aside className="sticky top-[72px] flex h-fit flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">Your Order</h2>
          {itemCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {itemCount}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Your order is empty.</p>
          <p className="text-xs text-muted-foreground/70">
            Add dishes from the menu to get started.
          </p>
        </div>
      ) : (
        <>
          {/* item list */}
          <ul className="flex flex-col divide-y divide-border/60 px-5">
            {items.map((ci) => (
              <li key={ci.item.slug} className="flex flex-col gap-1 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {ci.item.name}
                  </p>
                  <button
                    type="button"
                    aria-label={`Remove ${ci.item.name}`}
                    onClick={() => removeItem(ci.item.slug)}
                    className="shrink-0 text-muted-foreground/50 transition hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNaira(ci.item.priceNaira)}{" "}
                  {ci.item.pricePerSpoon ? "/ spoon" : "/ portion"}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={ci.item.pricePerSpoon ? "Remove a spoon" : "Decrease"}
                      onClick={() => setQuantity(ci.item.slug, ci.quantity - 1)}
                      disabled={ci.quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground/60 transition hover:border-primary hover:text-primary disabled:opacity-40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="flex min-w-[2.5rem] items-center justify-center gap-0.5 text-sm font-bold text-foreground">
                      {ci.item.pricePerSpoon ? "🥄" : ""}
                      {ci.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={ci.item.pricePerSpoon ? "Add a spoon" : "Increase"}
                      onClick={() => setQuantity(ci.item.slug, ci.quantity + 1)}
                      disabled={ci.quantity >= 100}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {formatNaira(ci.item.priceNaira * ci.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* summary */}
          <div className="border-t border-border px-5 pt-4 pb-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {itemCount} {itemCount !== 1 ? "dishes" : "dish"} · {totalCount}{" "}
                {totalCount !== 1 ? "items" : "item"}
              </span>
              <span>{formatNaira(totalPrice)}</span>
            </div>
          </div>

          {/* subtotal */}
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm font-bold text-foreground">Subtotal</span>
            <span className="font-display text-base font-bold text-primary">
              {formatNaira(totalPrice)}
            </span>
          </div>

          {/* actions */}
          <div className="flex flex-col gap-2 px-5 pb-5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              Proceed Order
            </a>
            <button
              type="button"
              onClick={clearCart}
              className="w-full rounded-xl border border-border bg-background py-2.5 text-sm font-medium text-foreground/70 transition hover:border-primary/40 hover:text-foreground"
            >
              Cancel Order
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

/* ── Pagination ─────────────────────────────────────────────────── */
function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  // build page numbers: always show first, last, current ±1, and ellipsis
  const pages: (number | "…")[] = [];
  const window = new Set(
    [1, totalPages, page, page - 1, page + 1].filter((p) => p >= 1 && p <= totalPages),
  );
  let prev = 0;
  for (const p of Array.from(window).sort((a, b) => a - b)) {
    if (p - prev > 1) pages.push("…");
    pages.push(p);
    prev = p;
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground/60 transition hover:border-primary/40 hover:text-primary disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={
              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition " +
              (p === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-primary")
            }
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground/60 transition hover:border-primary/40 hover:text-primary disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/* ── Main page ──────────────────────────────────────────────────── */
function MenuIndex() {
  const [active, setActive] = useState<MenuCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // filter by category + search
  const filtered = useMemo(() => {
    let list = active === "All" ? MENU : MENU.filter((m) => m.category === active);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) => m.name.toLowerCase().includes(q) || m.shortDescription.toLowerCase().includes(q),
      );
    }
    return list;
  }, [active, search]);

  // reset page when filter changes
  const handleCategoryChange = (cat: MenuCategory | "All") => {
    setActive(cat);
    setPage(1);
  };
  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  // paginated slice
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs: (MenuCategory | "All")[] = ["All", ...CATEGORIES];

  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        {/* ── Top bar: category tabs + search ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* tabs */}
          <nav className="flex flex-wrap gap-1" aria-label="Menu categories">
            {tabs.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={
                    "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 " +
                    (isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-foreground/60 hover:bg-muted hover:text-foreground border border-border")
                  }
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          {/* search */}
          <div className="relative flex-shrink-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* ── Two-column split ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
          {/* ── Left: dish grid ── */}
          <div>
            {paged.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-20 text-center">
                <Search className="h-10 w-10 text-muted-foreground/30" />
                <p className="font-semibold text-foreground">No dishes found</p>
                <p className="text-sm text-muted-foreground">
                  Try a different category or search term.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleCategoryChange("All");
                    handleSearch("");
                  }}
                  className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Show all dishes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {paged.map((item) => (
                  <MenuCard key={item.slug} item={item} />
                ))}
              </div>
            )}

            {/* result count */}
            {filtered.length > 0 && (
              <p className="mt-4 text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                  {Math.min(page * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "dish" : "dishes"}
              </p>
            )}

            <Pagination
              page={page}
              total={filtered.length}
              pageSize={PAGE_SIZE}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>

          {/* ── Right: sticky order panel ── */}
          <OrderPanel />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
