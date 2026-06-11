import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { animateStagger } from "../utils/animations";

export function Privacy() {
  useEffect(() => {
    animateStagger(".legal-card", 0);
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/settings" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>
          <ArrowLeft size={16} /> Back to Settings
        </Link>
      </div>

      <div className="card legal-card" style={{ opacity: 0, padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", color: "var(--primary)" }}>
          <Shield size={32} />
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>Privacy Policy</h1>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          Last updated: June 11, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6" }}>
          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>1. Information We Collect</h2>
            <p style={{ marginBottom: "0.75rem" }}>
              We collect information you provide directly to us when creating or modifying your account, setting up products, recording sales, or communicating with us. This information includes:
            </p>
            <ul style={{ paddingLeft: "1.5rem", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <li>Account details (e.g. name, email address, password)</li>
              <li>Profile information (e.g. display name, profile photo)</li>
              <li>Inventory items, pricing, transactions, and sales metrics recorded inside the system</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>2. How We Use Your Information</h2>
            <p style={{ marginBottom: "0.75rem" }}>
              We use the collected information to:
            </p>
            <ul style={{ paddingLeft: "1.5rem", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <li>Provide, maintain, and improve our inventory management services</li>
              <li>Monitor and analyze usage logs, traffic, and sales trends</li>
              <li>Send security alerts, database notification changes, and technical support messages</li>
              <li>Personalize your experience (e.g. dark mode state, currency options)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>3. Data Storage and Security</h2>
            <p>
              Your personal data, accounts, and inventory lists are stored securely using Firebase (for Authentication and database queries) and Supabase Storage (for avatars and item photos). We employ industry-standard encryption and security rules to restrict database access. However, no database transmission over the Internet is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>4. Cookies and Local Storage</h2>
            <p style={{ marginBottom: "0.75rem" }}>
              We use local browser storage and cookie-like session tokens to store:
            </p>
            <ul style={{ paddingLeft: "1.5rem", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <li>User sessions (login state persistence)</li>
              <li>App preferences (dark theme toggle, currency configurations)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>5. Contact Us</h2>
            <p>
              If you have any questions or feedback about this Privacy Policy, please contact our support team at support@inventoryapp.example.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
