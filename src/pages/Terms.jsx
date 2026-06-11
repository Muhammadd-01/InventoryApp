import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { animateStagger } from "../utils/animations";

export function Terms() {
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
          <FileText size={32} />
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>Terms of Service</h1>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          Last updated: June 11, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6" }}>
          <p>
            Welcome to InventoryApp. By accessing or using our application, websites, or associated software solutions, you agree to comply with and be bound by the following Terms of Service. If you do not agree to these terms, please do not use the application.
          </p>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>1. Account Registration and Security</h2>
            <p>
              To use most components of our dashboard, you must register for an account using a valid email. You are fully responsible for maintaining the confidentiality of your account credentials, including passwords, and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>2. Description of Service</h2>
            <p>
              InventoryApp provides users with stock tracking, product management, sales logs, and financial transaction statistics. We reserve the right to modify, suspend, or discontinue any feature or component of the service at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>3. Acceptable Use Policy</h2>
            <p style={{ marginBottom: "0.75rem" }}>
              You agree not to use the application to:
            </p>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <li>Violate any local, national, or international laws or regulations</li>
              <li>Upload or transmit any malicious code, viruses, or security exploits</li>
              <li>Attempt to gain unauthorized access to other user accounts, servers, or databases</li>
              <li>Use automatic scraping or bot tools to harvest database data from the application</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>4. Subscription, Payments, and Billing</h2>
            <p>
              Access to premium subscription packages is subject to payment configurations described in our Billing panel. subscription renewals are billed automatically on a monthly/annual basis. You can cancel your subscription tier at any time from the billing dashboard, but no refunds will be provided for partial periods.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>5. Limitation of Liability</h2>
            <p>
              Under no circumstances shall InventoryApp or its developers be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, inventory assets, or system uptime, arising out of your access to or use of the application.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
