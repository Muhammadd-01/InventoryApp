import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { PrivateRoute } from "./components/PrivateRoute";
import { SplashScreen } from "./components/SplashScreen";
import { NotificationProvider } from "./context/NotificationContext";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Sales } from "./pages/Sales";
import { History } from "./pages/History";
import { Profile } from "./pages/Profile";
import { Billing } from "./pages/Billing";
import { Settings } from "./pages/Settings";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { ThemeProvider } from "./context/ThemeContext";

// Create a component that handles the global loading state
function AppContent() {
  const [appLoading, setAppLoading] = useState(true);
  const { currentUser } = useAuth(); // just to hook into auth readiness implicitly

  // Simulate a heavy initial load to show off the 3D animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="sales" element={<Sales />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
      </Route>
      
      {/* Catch all redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
