import { Moon, Shield, Sun } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--nav-bg)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Primary">
        <Link to="/" className="flex items-center gap-3 focus-ring">
          <span className="brand-mark" aria-hidden="true">
            <Shield size={20} />
          </span>
          <span className="text-base font-semibold text-[color:var(--text)]">ScamShield AI</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink to="/" className="nav-link">
            Landing
          </NavLink>
          <NavLink to="/app" className="nav-link">
            Workspace
          </NavLink>
          <button type="button" className="icon-button" onClick={onToggleTheme} aria-label="Toggle color theme">
            <ThemeIcon size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
}
