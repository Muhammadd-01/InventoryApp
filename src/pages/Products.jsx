import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Eye } from "lucide-react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/db";
import { supabase } from "../supabase";
import { Badge } from "../components/Badge";
import { animateStagger } from "../utils/animations";
import { useAuth } from "../context/AuthContext";

export function Products() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [search, setSearch] = useState("");
  const [filterStock, setFilterStock] = useState("ALL"); 
  
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "", sku: "", quantity: 0, purchase_price: 0, selling_price: 0, image_url: ""
  });
  
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getProducts(currentUser.uid);
      setProducts(data);
      } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
      setTimeout(() => animateStagger('.data-table tbody tr', 50), 100);
    }
  };

  const handleOpenModal = (product = null) => {
    setImageFile(null);
    if (product) {
      setEditingProduct(product.id);
      setFormData({
        name: product.name,
        category: product.category,
        sku: product.sku,
        quantity: product.quantity,
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        image_url: product.image_url || ""
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", category: "", sku: "", quantity: 0, purchase_price: 0, selling_price: 0, image_url: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploadingImage(true);
    
    try {
      let finalImageUrl = formData.image_url;

      // If user selected a new image, upload to Supabase
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Image upload failed: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const productToSave = { ...formData, image_url: finalImageUrl };

      if (editingProduct) {
        await updateProduct(currentUser.uid, editingProduct, productToSave, formData.name);
      } else {
        await addProduct(currentUser.uid, productToSave);
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error);
      alert("Failed to save product: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteProduct(currentUser.uid, id, name);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product", error);
        alert("Failed to delete product.");
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStock === "IN_STOCK") return p.quantity > 10;
    if (filterStock === "LOW_STOCK") return p.quantity > 0 && p.quantity <= 10;
    if (filterStock === "OUT_OF_STOCK") return p.quantity === 0;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="filters-bar">
          <div className="search-input">
            <Search size={18} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by name or category..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="form-control" 
            style={{ width: 'auto' }}
            value={filterStock}
            onChange={e => setFilterStock(e.target.value)}
          >
            <option value="ALL">All Stock Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>

        <div className="table-container">
          {loading ? (
            <div>Loading products...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} 
                        />
                      ) : (
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--background)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.sku}</td>
                    <td>{product.quantity}</td>
                    <td>${Number(product.selling_price).toFixed(2)}</td>
                    <td><Badge quantity={product.quantity} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setViewingProduct(product)}>
                          <Eye size={16} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleOpenModal(product)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(product.id, product.name)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                
                <div className="form-group" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : formData.image_url ? (
                      <img src={formData.image_url} alt="Current" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--background)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>
                      {formData.image_url || imageFile ? "Change Image" : "Upload Image"}
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      onChange={handleImageChange} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input required type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Category</label>
                    <input required type="text" className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">SKU</label>
                    <input required type="text" className="form-control" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input required type="number" min="0" className="form-control" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Purchase Price ($)</label>
                    <input required type="number" step="0.01" min="0" className="form-control" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Selling Price ($)</label>
                    <input required type="number" step="0.01" min="0" className="form-control" value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={uploadingImage}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploadingImage}>
                  {uploadingImage ? "Saving..." : (editingProduct ? "Update Product" : "Save Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details View Modal */}
      {viewingProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Product Details</h2>
              <button className="modal-close" onClick={() => setViewingProduct(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0 }}>
                  {viewingProduct.image_url ? (
                    <img src={viewingProduct.image_url} alt={viewingProduct.name} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: '150px', height: '150px', backgroundColor: 'var(--background)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{viewingProduct.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>{viewingProduct.category}</span>
                    <Badge quantity={viewingProduct.quantity} />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SKU</div>
                      <div style={{ fontWeight: 600 }}>{viewingProduct.sku}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</div>
                      <div style={{ fontWeight: 600 }}>{viewingProduct.quantity} Units</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purchase Price</div>
                      <div style={{ fontWeight: 600 }}>${Number(viewingProduct.purchase_price).toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selling Price</div>
                      <div style={{ fontWeight: 600, color: 'var(--success)' }}>${Number(viewingProduct.selling_price).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button className="btn btn-primary" onClick={() => setViewingProduct(null)} style={{ width: '100%', justifyContent: 'center' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
