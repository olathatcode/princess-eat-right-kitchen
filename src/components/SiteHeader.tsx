import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sun, Moon, ShoppingCart, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

export function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(currentTheme);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // close mobile nav on route change / resize
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const navLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/menu", label: "Menu", exact: false },
    { to: "/reviews", label: "Reviews", exact: false },
  ] as const;

  return (
    <>
      {/* ── Main header ── */}
      <header
        className={
          "sticky top-0 z-40 transition-all duration-500 " +
          (scrolled
            ? "liquid-glass-nav border-b border-white/10 shadow-lg shadow-black/10"
            : "border-b border-transparent bg-transparent")
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 leading-tight group">
            <img
              src="/logo.png"
              alt="Princess Eat Right Kitchen"
              className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold leading-tight text-foreground">
                Princess Eat Right
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Ijebu Ode · Ogun State
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                activeProps={{
                  className:
                    "relative rounded-full px-4 py-2 text-sm font-medium text-foreground bg-muted",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Cart */}
            <button
              type="button"
              aria-label={`Open food list${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? "s" : ""}` : ""}`}
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground"
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span
                  key={itemCount}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background animate-badge-pop"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Call CTA — desktop */}
            <a
              href="tel:+2349039108517"
              className="ml-2 hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md sm:flex"
            >
              <Phone className="h-3 w-3" />
              Call to order
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile nav drawer ── */}
        <div
          className={
            "overflow-hidden transition-all duration-300 md:hidden " +
            (mobileOpen ? "max-h-96 border-t border-border/60" : "max-h-0")
          }
        >
          <nav className="flex flex-col gap-1 bg-background/95 px-4 pb-5 pt-3 backdrop-blur-md">
            {navLinks.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground"
                activeProps={{
                  className: "rounded-xl px-4 py-3 text-sm font-medium text-foreground bg-muted",
                }}
              >
                {label}
              </Link>
            ))}
            <a
              href="tel:+2349039108517"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Phone className="h-4 w-4" />
              Call to order
            </a>
          </nav>
        </div>
      </header>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-block group">
            <img
              src="/logo.png"
              alt="Princess Eat Right Kitchen"
              className="h-28 w-28 object-contain rounded-2xl p-1 transition-transform duration-700 group-hover:rotate-[360deg]"
            />
          </Link>
          <div className="mt-3">
            <h3 className="text-base font-display font-bold bg-gradient-to-r from-primary via-pink-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow">
              Princess Eat Right Kitchen
            </h3>
          </div>
          <p className="mt-2 text-sm text-secondary-foreground/75 leading-relaxed">
            Women-owned home-style Nigerian kitchen.
            <br />
            Dine-in, kerbside pickup, and delivery.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-secondary-foreground/60">
            {[
              { to: "/", label: "Home" },
              { to: "/menu", label: "Menu" },
              { to: "/reviews", label: "Reviews" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="hover:text-secondary-foreground hover:underline transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Find us */}
        <div className="text-sm">
          <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground/50">
            Find us
          </h4>
          <p className="text-secondary-foreground/80 leading-relaxed">
            Adjacent Barracks Junction, Esepa
            <br />
            Ita-Paadi, Ijebu Ode 120102
            <br />
            Ogun State
          </p>
          <a
            href="https://maps.google.com/?q=Princess+Eat+Right+Kitchen+Ijebu+Ode"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-xs text-secondary-foreground/60 underline-offset-2 hover:text-secondary-foreground hover:underline transition"
          >
            Get directions →
          </a>
        </div>

        {/* Hours + contact */}
        <div className="text-sm">
          <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground/50">
            Hours
          </h4>
          <p className="text-secondary-foreground/80">Mon – Sat: 8 am – 9 pm</p>
          <p className="text-secondary-foreground/80">Sunday: 10 am – 6 pm</p>
          <div className="mt-4 flex flex-col gap-1">
            <a
              href="tel:+2349039108517"
              className="text-xs text-secondary-foreground/60 hover:text-secondary-foreground hover:underline underline-offset-2 transition"
            >
              +234 903 910 8517
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11px] text-secondary-foreground/40">
          <span>© {new Date().getFullYear()} Princess Eat Right Kitchen. All rights reserved.</span>
          <span>Ijebu Ode · Ogun State · Nigeria</span>
        </div>
      </div>
    </footer>
  );
}
