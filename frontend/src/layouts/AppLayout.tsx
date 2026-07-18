import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import GlobalSearchDialog from "../components/GlobalSearchDialog";
import Navbar from "../components/Navbar";
import { useAppPreferences } from "../contexts/AppPreferencesContext";

export default function AppLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useAppPreferences();

  return (
    <div className="app-shell">
      <Navbar theme={theme} onToggleTheme={toggleTheme} onOpenSearch={() => setIsSearchOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <GlobalSearchDialog isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
}
