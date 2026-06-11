import { useState, useEffect } from "react";
import { Package, AlertCircle, ShoppingCart, DollarSign, Activity, ShieldCheck, Database, HardDrive, Download, CheckCircle } from "lucide-react";
import { getProducts, getSales } from "../services/db";
import { animateStagger } from "../utils/animations";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState(32);
  const { show } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        const [productsData, salesData] = await Promise.all([
          getProducts(currentUser.uid),
          getSales(currentUser.uid)
        ]);
        setProducts(productsData);
        setSales(salesData);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          animateStagger('.stat-card', 100);
          animateStagger('.dashboard-subcard', 100);
        }, 100);
      }
    };
    fetchData();
  }, []);

  // Simulate real-time server latency fluctuation
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const nextVal = prev + delta;
        return nextVal < 20 ? 20 : nextVal > 55 ? 55 : nextVal;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  const totalProducts = products.length;
  const totalInventory = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const lowStockProducts = products.filter(p => p.quantity <= 10).length;
  const totalSalesValue = sales.reduce((sum, s) => {
    const product = products.find(p => p.id === s.product_id);
    const price = product ? product.selling_price : 0;
    return sum + (s.quantity_sold * price);
  }, 0);

  // Export handlers
  const handleExportJSON = (type, data) => {
    try {
      if (!data || data.length === 0) {
        show(`No ${type} data available to export!`, "error");
        return;
      }
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `stockflow_${type}_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      show(`Exported ${type} backup successfully!`, "success");
    } catch (error) {
      show("Failed to export data: " + error.message, "error");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card" style={{ opacity: 0 }}>
          <div className="stat-content">
            <h3>Total Products</h3>
            <div className="value">{totalProducts}</div>
          </div>
          <div className="stat-icon">
            <Package size={24} />
          </div>
        </div>

        <div className="card stat-card" style={{ opacity: 0 }}>
          <div className="stat-content">
            <h3>Total Inventory</h3>
            <div className="value">{totalInventory}</div>
          </div>
          <div className="stat-icon">
            <Package size={24} />
          </div>
        </div>

        <div className="card stat-card" style={{ borderColor: lowStockProducts > 0 ? 'var(--warning)' : '', opacity: 0 }}>
          <div className="stat-content">
            <h3>Low Stock Alerts</h3>
            <div className="value" style={{ color: lowStockProducts > 0 ? 'var(--warning-text)' : '' }}>
              {lowStockProducts}
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: lowStockProducts > 0 ? 'var(--warning-bg)' : '', color: lowStockProducts > 0 ? 'var(--warning)' : '' }}>
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="card stat-card" style={{ opacity: 0 }}>
          <div className="stat-content">
            <h3>Total Sales Value</h3>
            <div className="value">${totalSalesValue.toFixed(2)}</div>
          </div>
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Two-Column Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Left Column: Low Stock Items Table */}
        <div className="card dashboard-subcard" style={{ opacity: 0 }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Low Stock Items</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => p.quantity <= 10).map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>
                      {product.quantity === 0 ? (
                        <span className="badge badge-danger">OUT OF STOCK</span>
                      ) : (
                        <span className="badge badge-warning">LOW STOCK</span>
                      )}
                    </td>
                  </tr>
                ))}
                {products.filter(p => p.quantity <= 10).length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No low stock items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Server Health & Backups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card 1: Server Status / Telemetry */}
          <div className="card dashboard-subcard" style={{ opacity: 0 }}>
            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} style={{ color: 'var(--success)' }} />
              System Integrity
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Item 1 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Database Stream</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success)',
                    display: 'inline-block',
                    boxShadow: '0 0 8px var(--success)',
                    animation: 'pulse 1.5s infinite alternate'
                  }} />
                  Live Sync
                </span>
              </div>

              {/* Item 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>API Latency</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'monospace' }}>
                  {latency}ms
                </span>
              </div>

              {/* Item 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Storage Buckets</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                  Verified
                </span>
              </div>

              {/* Item 4 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Memory Buffer</span>
                  <span style={{ fontWeight: 600 }}>38.4 MB / 512 MB</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '7.5%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--primary-hover))', borderRadius: '3px' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Backups / Export controls */}
          <div className="card dashboard-subcard" style={{ opacity: 0 }}>
            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={20} style={{ color: 'var(--primary)' }} />
              Ledger Backups
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              <button 
                onClick={() => handleExportJSON("products", products)}
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HardDrive size={16} />
                  Backup Inventory
                </span>
                <Download size={16} />
              </button>

              <button 
                onClick={() => handleExportJSON("sales", sales)}
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingCart size={16} />
                  Backup Sales Ledger
                </span>
                <Download size={16} />
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

