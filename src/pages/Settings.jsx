import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { animateStagger } from "../utils/animations";
import { Sun, Moon, Bell, Shield, Globe, FileText, ChevronRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { show } = useNotification();

  // Mock settings state
  const [emailAlerts, setEmailAlerts] = useState(() => {
    const saved = localStorage.getItem("settings_email_alerts");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [securityAlerts, setSecurityAlerts] = useState(() => {
    const saved = localStorage.getItem("settings_security_alerts");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [weeklyReports, setWeeklyReports] = useState(() => {
    const saved = localStorage.getItem("settings_weekly_reports");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem("settings_currency");
    return saved || "USD";
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("settings_language");
    return saved || "en";
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    animateStagger(".settings-card", 100);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("settings_email_alerts", JSON.stringify(emailAlerts));
      localStorage.setItem("settings_security_alerts", JSON.stringify(securityAlerts));
      localStorage.setItem("settings_weekly_reports", JSON.stringify(weeklyReports));
      localStorage.setItem("settings_currency", currency);
      localStorage.setItem("settings_language", language);
      setSaving(false);
      show("Settings saved successfully!", "success");
    }, 800);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Theme Settings Card */}
        <div className="card settings-card" style={{ opacity: 0 }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {theme === "dark" ? <Moon size={20} className="text-primary" /> : <Sun size={20} style={{ color: "orange" }} />}
            Appearance & Theme
          </h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600 }}>Dark Mode</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Switch between light and dark UI themes
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: theme === "dark" ? "var(--primary)" : "var(--border)",
                border: "none",
                borderRadius: "2rem",
                width: "60px",
                height: "32px",
                padding: "4px",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.3s ease",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  left: theme === "dark" ? "32px" : "4px",
                  transition: "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                  boxShadow: "var(--shadow-sm)"
                }}
              />
            </button>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="card settings-card" style={{ opacity: 0 }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Bell size={20} style={{ color: "var(--primary)" }} />
            Notification Preferences
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Toggle 1 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>Email Alerts</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Receive low stock alerts and sales reports via email
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                style={{
                  background: emailAlerts ? "var(--primary)" : "var(--border)",
                  border: "none",
                  borderRadius: "2rem",
                  width: "60px",
                  height: "32px",
                  padding: "4px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    left: emailAlerts ? "32px" : "4px",
                    transition: "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                    boxShadow: "var(--shadow-sm)"
                  }}
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
              <div>
                <div style={{ fontWeight: 600 }}>Security Alerts</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Notify me about new sign-ins or password updates
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSecurityAlerts(!securityAlerts)}
                style={{
                  background: securityAlerts ? "var(--primary)" : "var(--border)",
                  border: "none",
                  borderRadius: "2rem",
                  width: "60px",
                  height: "32px",
                  padding: "4px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    left: securityAlerts ? "32px" : "4px",
                    transition: "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                    boxShadow: "var(--shadow-sm)"
                  }}
                />
              </button>
            </div>

            {/* Toggle 3 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
              <div>
                <div style={{ fontWeight: 600 }}>Weekly Digest</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  A weekly summary of stock levels and store sales metrics
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWeeklyReports(!weeklyReports)}
                style={{
                  background: weeklyReports ? "var(--primary)" : "var(--border)",
                  border: "none",
                  borderRadius: "2rem",
                  width: "60px",
                  height: "32px",
                  padding: "4px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    left: weeklyReports ? "32px" : "4px",
                    transition: "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                    boxShadow: "var(--shadow-sm)"
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Localization Preferences Card */}
        <div className="card settings-card" style={{ opacity: 0 }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Globe size={20} style={{ color: "var(--primary)" }} />
            Region & Local Preferences
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Currency Symbol</label>
              <select 
                className="form-control" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{ background: "var(--surface)", color: "var(--text-main)" }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (Rs)</option>
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Default Language</label>
              <select 
                className="form-control" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ background: "var(--surface)", color: "var(--text-main)" }}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="ur">اردو</option>
              </select>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Card */}
        <div className="card settings-card" style={{ opacity: 0 }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={20} style={{ color: "var(--primary)" }} />
            Legal & Support
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link 
              to="/privacy" 
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--text-main)",
                transition: "all 0.2s"
              }}
              className="settings-link-item"
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={18} style={{ color: "var(--text-muted)" }} />
                Privacy Policy
              </span>
              <ChevronRight size={16} />
            </Link>

            <Link 
              to="/terms" 
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--text-main)",
                transition: "all 0.2s"
              }}
              className="settings-link-item"
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={18} style={{ color: "var(--text-muted)" }} />
                Terms of Service
              </span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", justifyContent: "center", height: "48px" }}
        >
          {saving ? "Saving Preferences..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}
