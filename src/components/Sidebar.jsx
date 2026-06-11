import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Activity, LogOut, User, CreditCard, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Sidebar({ isCollapsed, onToggle, onLogoutStart }) {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    if (onLogoutStart) {
      onLogoutStart(logout);
    } else {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error("Failed to log out", error);
      }
    }
  }


  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header" style={{ justifyContent: isCollapsed ? 'center' : 'space-between', padding: isCollapsed ? '1.5rem 0.5rem' : '1.5rem' }}>
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={24} />
          {!isCollapsed && <span>InventoryApp</span>}
        </div>
        <button 
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem',
            borderRadius: '4px',
          }}
          className="collapse-toggle-btn"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/products" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Package size={20} />
          {!isCollapsed && <span>Products</span>}
        </NavLink>
        <NavLink to="/sales" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          {!isCollapsed && <span>Sales</span>}
        </NavLink>
        <NavLink to="/history" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={20} />
          {!isCollapsed && <span>History</span>}
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={20} />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>
        <NavLink to="/billing" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <CreditCard size={20} />
          {!isCollapsed && <span>Billing</span>}
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </nav>
      <div className="sidebar-footer" style={{ padding: isCollapsed ? '1.5rem 0.5rem' : '1.5rem', borderTop: '1px solid var(--border)' }}>
        {!isCollapsed && (
          <div className="sidebar-footer-links" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', alignItems: 'center' }}>
            <NavLink to="/privacy" style={({isActive}) => ({ color: isActive ? 'var(--primary)' : 'var(--text-muted)', textDecoration: 'none' })}>Privacy</NavLink>
            <span>•</span>
            <NavLink to="/terms" style={({isActive}) => ({ color: isActive ? 'var(--primary)' : 'var(--text-muted)', textDecoration: 'none' })}>Terms</NavLink>
          </div>
        )}
        {!isCollapsed && (
          <div className="user-email" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
            {currentUser?.email}
          </div>
        )}
        <button className="btn btn-secondary logout-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
          <LogOut size={16} />
          {!isCollapsed && <span style={{ marginLeft: '0.5rem' }}>Logout</span>}
        </button>
      </div>
    </div>
  );
}


