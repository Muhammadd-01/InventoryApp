import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleToggle = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleLogoutStart = async (logoutFn) => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      try {
        await logoutFn();
        navigate("/login");
      } catch (error) {
        console.error("Failed to log out", error);
        setIsLoggingOut(false);
      }
    }, 1500);
  };

  return (
    <div className={`app-container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} onLogoutStart={handleLogoutStart} />
      <main className="main-content">
        <Outlet />
      </main>

      {isLoggingOut && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999999,
          color: "white",
          animation: "fadeIn 0.3s ease forwards"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(255, 255, 255, 0.15)",
            borderTop: "4px solid var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1.5rem"
          }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem", color: "#f8fafc" }}>Securing Session...</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Signing out of InventoryApp safely</p>
        </div>
      )}
    </div>
  );
}


