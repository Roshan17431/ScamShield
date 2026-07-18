import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnalysisHistoryProvider } from "./contexts/AnalysisHistoryContext";
import { AppPreferencesProvider } from "./contexts/AppPreferencesContext";
import PageSkeleton from "./components/PageSkeleton";
import AppLayout from "./layouts/AppLayout";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AdvancedDetectionPage = lazy(() => import("./pages/AdvancedDetectionPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const SafetyCoachPage = lazy(() => import("./pages/SafetyCoachPage"));
const AwarenessHubPage = lazy(() => import("./pages/AwarenessHubPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

export default function App() {
  return (
    <AppPreferencesProvider>
      <AnalysisHistoryProvider>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/app" element={<HomePage />} />
              <Route path="/advanced" element={<AdvancedDetectionPage />} />
              <Route path="/coach" element={<SafetyCoachPage />} />
              <Route path="/awareness" element={<AwarenessHubPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </AnalysisHistoryProvider>
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
    </AppPreferencesProvider>
  );
}
