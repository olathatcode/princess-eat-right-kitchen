import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(currentTheme);
  }, []);

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

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex flex-col leading-tight">
          <span>
            <img
              src="/logo.png"
              alt="Princess Eat Right Kitchen logo with a warm restaurant brand style and text Ijebu Ode · Ogun State"
              className="h-15 w-20"
            />
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Ijebu Ode · Ogun State
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="text-foreground/80 hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground font-semibold" }}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="text-foreground/80 hover:text-foreground"
            activeProps={{ className: "text-foreground font-semibold" }}
          >
            Menu
          </Link>
          <Link
            to="/reviews"
            className="text-foreground/80 hover:text-foreground"
            activeProps={{ className: "text-foreground font-semibold" }}
          >
            Reviews
          </Link>
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-foreground/80 hover:bg-muted hover:text-foreground transition-all duration-300 hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <a
            href="tel:+2349039108517"
            className="hidden rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:inline-block"
          >
            Call to order
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-lg">Princess Eat Right Kitchen</h3>
          <p className="mt-2 text-sm text-secondary-foreground/80">
            Women-owned home-style Nigerian kitchen. Dine-in, kerbside pickup, and delivery.
          </p>
          <div className="mt-4 flex gap-4 text-xs text-secondary-foreground/70">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/menu" className="hover:underline">
              Menu
            </Link>
            <Link to="/reviews" className="hover:underline">
              Reviews
            </Link>
          </div>
        </div>
        <div className="text-sm">
          <h4 className="mb-2 font-semibold uppercase tracking-widest text-secondary-foreground/70 text-xs">
            Find us
          </h4>
          <p className="text-secondary-foreground/85">
            Adjacent Barracks Junction, Esepa, Ita-Paadi
            <br />
            Ijebu Ode 120102, Ogun State
          </p>
        </div>
        <div className="text-sm">
          <h4 className="mb-2 font-semibold uppercase tracking-widest text-secondary-foreground/70 text-xs">
            Hours
          </h4>
          <p className="text-secondary-foreground/85">Open daily · Closes 9:30 pm</p>
          <p className="mt-2 text-secondary-foreground/85">₦1 – 10,000 per person</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-secondary-foreground/60">
        © {new Date().getFullYear()} Princess Eat Right Kitchen
      </div>
    </footer>
  );
}
