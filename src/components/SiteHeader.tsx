import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  ShoppingCart,
  Menu,
  X,
  Phone,
  ArrowRight,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/menu", label: "Menu", exact: false },
  { to: "/reviews", label: "Reviews", exact: false },
] as const;

/* ─── Inline About anchor links (smooth-scroll within home) */
const EXTRA_LINKS = [
  { href: "/#why-us", label: "About" },
  { href: "/#order-how", label: "How It Works" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const t = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <>
      <header
        className={
          "sticky top-0 z-40 transition-all duration-500 " +
          (scrolled
            ? "liquid-glass-nav border-b border-white/10 shadow-lg shadow-black/10"
            : "border-b border-transparent bg-transparent")
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:py-3">
          {/* ── Logo ── */}
          <Link to="/" className="group flex items-center gap-2.5 leading-tight">
            <img
              src="/logo.png"
              alt="Princess Eat Right Kitchen"
              className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
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

          {/* ── Desktop nav ── */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label, exact }) => (
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
            {EXTRA_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? "s" : ""}` : ""}`}
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

            {/* Order Now — desktop */}
            <Link
              to="/menu"
              className="ml-2 hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md sm:flex"
            >
              Order Now <ArrowRight className="h-3 w-3" />
            </Link>

            {/* Call — small screens */}
            <a
              href="tel:+2349039108517"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground sm:hidden"
              aria-label="Call us"
            >
              <Phone className="h-4 w-4" />
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className={
            "overflow-hidden transition-all duration-300 lg:hidden " +
            (mobileOpen ? "max-h-screen border-t border-border/60" : "max-h-0")
          }
        >
          <nav className="flex flex-col bg-background/97 px-4 pb-6 pt-3 backdrop-blur-lg">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, exact }) => (
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
              {EXTRA_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/menu"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                <ShoppingCart className="h-4 w-4" />
                Order Now
              </Link>
              <a
                href="tel:+2349039108517"
                className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition hover:border-primary/50"
              >
                <Phone className="h-4 w-4 text-primary" />
                +234 903 910 8517
              </a>
            </div>
            {/* quick info */}
            <div className="mt-4 flex flex-wrap gap-3 border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" />
                8am – 9:30pm
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary" />
                Ijebu Ode, Ogun State
              </span>
            </div>
          </nav>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      className="border-t border-border/70 bg-secondary text-secondary-foreground"
    >
      {/* ── Main grid ── */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="group inline-block">
            <img
              src="/logo.png"
              alt="Princess Eat Right Kitchen"
              className="h-24 w-24 rounded-2xl p-1 object-contain transition-transform duration-700 group-hover:rotate-[360deg]"
            />
          </Link>
          <h3 className="mt-3 bg-gradient-to-r from-primary via-pink-500 to-primary bg-[length:200%_auto] bg-clip-text text-base font-display font-bold text-transparent animate-gradient-flow">
            Princess Eat Right Kitchen
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/75">
            Women-owned home-style Nigerian kitchen in Ijebu Ode. Serving fresh, authentic meals
            daily.
          </p>
          {/* social */}
          <div className="mt-4 flex gap-2">
            {[
              {
                href: "https://instagram.com",
                icon: <Instagram className="h-4 w-4" />,
                label: "Instagram",
              },
              {
                href: "https://facebook.com",
                icon: <Facebook className="h-4 w-4" />,
                label: "Facebook",
              },
              {
                href: "https://twitter.com",
                icon: <Twitter className="h-4 w-4" />,
                label: "Twitter",
              },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary-foreground/20 text-secondary-foreground/60 transition hover:border-primary hover:text-primary"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="text-sm">
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground/50">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/menu", label: "Our Menu" },
              { to: "/reviews", label: "Reviews" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center gap-1.5 text-secondary-foreground/70 transition hover:text-secondary-foreground hover:gap-2.5"
                >
                  <ArrowRight className="h-3 w-3 text-primary" />
                  {label}
                </Link>
              </li>
            ))}
            {[
              { href: "/#why-us", label: "About Us" },
              { href: "/#order-how", label: "How to Order" },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-1.5 text-secondary-foreground/70 transition hover:text-secondary-foreground hover:gap-2.5"
                >
                  <ArrowRight className="h-3 w-3 text-primary" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Opening hours */}
        <div className="text-sm">
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground/50">
            Opening Hours
          </h4>
          <ul className="flex flex-col gap-2 text-secondary-foreground/80">
            {[
              { day: "Monday – Friday", time: "8:00am – 9:30pm" },
              { day: "Saturday", time: "8:00am – 9:30pm" },
              { day: "Sunday", time: "10:00am – 6:00pm" },
            ].map(({ day, time }) => (
              <li key={day} className="flex items-center justify-between gap-4">
                <span className="text-secondary-foreground/60">{day}</span>
                <span className="font-semibold">{time}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-primary">Open Now</span>
          </div>
        </div>

        {/* Contact */}
        <div className="text-sm">
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground/50">
            Contact Us
          </h4>
          <address className="not-italic flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-secondary-foreground/80 leading-relaxed">
                Adjacent Barracks Junction, Esepa
                <br />
                Ita-Paadi, Ijebu Ode 120102
                <br />
                Ogun State, Nigeria
              </p>
            </div>
            <a
              href="tel:+2349039108517"
              className="flex items-center gap-2 text-secondary-foreground/80 transition hover:text-secondary-foreground hover:underline underline-offset-2"
            >
              <Phone className="h-4 w-4 text-primary" />
              +234 903 910 8517
            </a>
            <a
              href="https://maps.google.com/?q=Princess+Eat+Right+Kitchen+Ijebu+Ode"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-secondary-foreground/60 transition hover:text-secondary-foreground hover:underline underline-offset-2"
            >
              Get directions →
            </a>
          </address>
          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/+2349039108517"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-xs font-bold text-white transition hover:bg-green-700"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a6.23 6.23 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-secondary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11px] text-secondary-foreground/40">
          <span>© {year} Princess Eat Right Kitchen. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="transition hover:text-secondary-foreground">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-secondary-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
