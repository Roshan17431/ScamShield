import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layouts/AppLayout";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Routes>
        <Route element={<AppLayout theme={theme} onToggleTheme={toggleTheme} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<HomePage />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3600,
          style: {
            background: "var(--surface-strong)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            boxShadow: "var(--shadow-soft)"
          }
        }}
      />
    </>
  );
}
