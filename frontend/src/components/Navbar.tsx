import { Moon, Search, Shield, Sun } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export default function Navbar({ theme, onToggleTheme, onOpenSearch }: NavbarProps) {
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--nav-bg)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8" aria-label="Primary">
        <Link to="/" className="flex items-center gap-3 focus-ring">
          <span className="brand-mark" aria-hidden="true">
            <Shield size={20} />
          </span>
          <span className="text-base font-semibold text-[color:var(--text)]">ScamShield AI</span>
        </Link>

        <div className="nav-control-group">
          <div className="nav-links-scroll">
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            <NavLink to="/app" className="nav-link">Workspace</NavLink>
            <NavLink to="/advanced" className="nav-link">Advanced</NavLink>
            <NavLink to="/coach" className="nav-link">Safety Coach</NavLink>
            <NavLink to="/awareness" className="nav-link">Awareness</NavLink>
            <NavLink to="/history" className="nav-link">History</NavLink>
            <NavLink to="/settings" className="nav-link">Settings</NavLink>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onOpenSearch}
            aria-label="Open global search"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search size={18} />
          </button>
          <button type="button" className="icon-button" onClick={onToggleTheme} aria-label="Toggle color theme">
            <ThemeIcon size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
}
