import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, Plus, Trash2, ShieldCheck } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { animateStagger } from "../utils/animations";
import { useNotification } from "../context/NotificationContext";

export function Billing() {
  const { currentUser } = useAuth();
  const { show } = useNotification();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, brand: "Visa", last4: "4242", exp: "12/26", isDefault: true }
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentPlan(docSnap.data().plan_type || 'free');
        }
      }
      setLoading(false);
      animateStagger('.pricing-card', 100);
    }
    fetchPlan();
  }, [currentUser]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate network delay for mock payment
    setTimeout(async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        await updateDoc(docRef, {
          plan_type: selectedPlan
        });
        setCurrentPlan(selectedPlan);
        setSelectedPlan(null);
        show(`Successfully upgraded to ${selectedPlan.toUpperCase()} plan!`, "success");
      } catch (error) {
        console.error(error);
        show("Failed to process payment.", "error");
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  const plans = [
    { id: 'free', name: 'Basic (Free)', price: '$0', features: ['Up to 50 products', 'Basic reporting', 'Community support'] },
    { id: 'pro', name: 'Professional', price: '$29/mo', features: ['Unlimited products', 'Advanced analytics', 'Priority email support', 'Custom badges'] },
    { id: 'enterprise', name: 'Enterprise', price: '$99/mo', features: ['All Pro features', 'Dedicated account manager', 'API Access', 'SSO Login'] },
  ];

  if (loading) return <div>Loading billing details...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Billing & Plans</h1>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-success" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          Current Plan: <strong>{currentPlan.toUpperCase()}</strong>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '3rem' }}>
        {plans.map(plan => (
          <div key={plan.id} className="card pricing-card" style={{ opacity: 0, border: currentPlan === plan.id ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--primary)' }}>{plan.price}</div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
              {plan.features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={16} color="var(--success)" /> {feat}
                </li>
              ))}
            </ul>
            {currentPlan !== plan.id && (
              <button 
                className={plan.id === 'pro' ? 'btn btn-primary' : 'btn btn-secondary'} 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                Select {plan.name}
              </button>
            )}
            {currentPlan === plan.id && (
              <div style={{ textAlign: 'center', fontWeight: '600', color: 'var(--primary)' }}>Active Plan</div>
            )}
          </div>
        ))}
      </div>

      {/* Payment Methods Section */}
      <div className="card" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} style={{ color: 'var(--primary)' }} /> Payment Methods
          </h2>
          <button className="btn btn-primary" onClick={() => setIsAddingCard(true)}>
            <Plus size={16} /> Add Method
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paymentMethods.map(method => (
            <div key={method.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: '0.25rem', color: 'var(--primary)' }}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{method.brand} ending in {method.last4}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Expires {method.exp}</div>
                </div>
                {method.isDefault && (
                  <span className="badge badge-success" style={{ marginLeft: '1rem' }}>Default</span>
                )}
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem', color: 'var(--danger)', border: 'none', background: 'transparent' }}
                onClick={() => setPaymentMethods(prev => prev.filter(m => m.id !== method.id))}
                title="Remove Payment Method"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {paymentMethods.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              No payment methods saved. Add one to keep your subscription active.
            </div>
          )}
        </div>
      </div>

      {selectedPlan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Secure Checkout</h2>
              <button className="modal-close" onClick={() => setSelectedPlan(null)}>✕</button>
            </div>
            <form onSubmit={handleSubscribe}>
              <div className="modal-body">
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <CreditCard size={20} /> <span>Enter mock payment details to upgrade to {selectedPlan.toUpperCase()}. No real card needed.</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input required type="text" placeholder="4242 4242 4242 4242" className="form-control" maxLength="16" />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input required type="text" placeholder="12/26" className="form-control" maxLength="5" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">CVC</label>
                    <input required type="text" placeholder="123" className="form-control" maxLength="3" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" disabled={processing} onClick={() => setSelectedPlan(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {isAddingCard && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Payment Method</h2>
              <button className="modal-close" onClick={() => setIsAddingCard(false)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setProcessing(true);
              setTimeout(() => {
                setPaymentMethods(prev => [...prev, { id: Date.now(), brand: "Mastercard", last4: "8888", exp: "10/28", isDefault: prev.length === 0 }]);
                setIsAddingCard(false);
                setProcessing(false);
                show("Payment method added successfully!", "success");
              }, 1000);
            }}>
              <div className="modal-body">
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <ShieldCheck size={20} /> <span style={{ fontSize: '0.875rem' }}>Your payment information is securely encrypted.</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" className="form-control" maxLength="19" />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input required type="text" placeholder="MM/YY" className="form-control" maxLength="5" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">CVC</label>
                    <input required type="text" placeholder="123" className="form-control" maxLength="4" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" disabled={processing} onClick={() => setIsAddingCard(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? "Saving..." : "Save Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
