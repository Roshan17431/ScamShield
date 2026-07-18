import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface AppLayoutProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function AppLayout({ theme, onToggleTheme }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
