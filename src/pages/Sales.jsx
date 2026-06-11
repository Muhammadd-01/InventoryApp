import { useState, useEffect } from "react";
import { getProducts, getSales, recordSale } from "../services/db";
import { ShoppingCart } from "lucide-react";
import { animateStagger } from "../utils/animations";

export function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    productId: "",
    quantitySold: 1,
    customerName: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, salesData] = await Promise.all([
        getProducts(),
        getSales()
      ]);
      setProducts(productsData.filter(p => p.quantity > 0)); // Only show products with stock
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
      setTimeout(() => animateStagger('.data-table tbody tr', 50), 100);
    }
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId) {
      alert("Please select a product");
      return;
    }
    
    const product = products.find(p => p.id === formData.productId);
    if (!product) return;

    if (formData.quantitySold > product.quantity) {
      alert(`Cannot sell ${formData.quantitySold}. Only ${product.quantity} in stock.`);
      return;
    }

    try {
      await recordSale(product.id, product.name, formData.quantitySold, formData.customerName, formData.date);
      setFormData({
        productId: "",
        quantitySold: 1,
        customerName: "",
        date: new Date().toISOString().split('T')[0]
      });
      alert("Sale recorded successfully!");
      fetchData();
    } catch (error) {
      console.error("Error recording sale", error);
      alert("Failed to record sale: " + error.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sales Management</h1>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Record Sale Form */}
        <div className="card" style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            <ShoppingCart size={20} /> Record New Sale
          </h2>
          <form onSubmit={handleSaleSubmit}>
            <div className="form-group">
              <label className="form-label">Product</label>
              <select 
                required 
                className="form-control"
                value={formData.productId}
                onChange={e => setFormData({...formData, productId: e.target.value})}
              >
                <option value="">-- Select a Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (${p.selling_price}) - {p.quantity} in stock</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Quantity Sold</label>
              <input 
                required 
                type="number" 
                min="1" 
                className="form-control"
                value={formData.quantitySold}
                onChange={e => setFormData({...formData, quantitySold: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer Name (Optional)</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                placeholder="Walk-in customer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                required 
                type="date" 
                className="form-control"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Confirm Sale
            </button>
          </form>
        </div>

        {/* Recent Sales Table */}
        <div className="card" style={{ flex: '2', minWidth: '400px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Sales</h2>
          <div className="table-container">
            {loading ? (
              <div>Loading sales...</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id}>
                      <td>{sale.date}</td>
                      <td style={{ fontWeight: 500 }}>{sale.product_name}</td>
                      <td>{sale.quantity_sold}</td>
                      <td>{sale.customer_name || "Walk-in"}</td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No sales recorded yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
