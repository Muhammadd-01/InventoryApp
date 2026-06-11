import { useState, useEffect } from "react";
import { Package, AlertCircle, ShoppingCart, DollarSign } from "lucide-react";
import { getProducts, getSales } from "../services/db";
import { animateStagger } from "../utils/animations";

export function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, salesData] = await Promise.all([
          getProducts(),
          getSales()
        ]);
        setProducts(productsData);
        setSales(salesData);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
        setTimeout(() => animateStagger('.stat-card', 100), 100);
      }
    };
    fetchData();
  }, []);

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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-content">
            <h3>Total Products</h3>
            <div className="value">{totalProducts}</div>
          </div>
          <div className="stat-icon">
            <Package size={24} />
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-content">
            <h3>Total Inventory</h3>
            <div className="value">{totalInventory}</div>
          </div>
          <div className="stat-icon">
            <Package size={24} />
          </div>
        </div>

        <div className="card stat-card" style={{ borderColor: lowStockProducts > 0 ? 'var(--warning)' : '' }}>
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

        <div className="card stat-card">
          <div className="stat-content">
            <h3>Total Sales Value</h3>
            <div className="value">${totalSalesValue.toFixed(2)}</div>
          </div>
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      <div className="card">
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
    </div>
  );
}
