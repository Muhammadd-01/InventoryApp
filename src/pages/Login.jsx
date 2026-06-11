import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle } from 'lucide-react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await signup(email, password);
        setSuccessMessage('Account created successfully! Please log in.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Failed to ' + (isLogin ? 'log in' : 'create an account') + ': ' + err.message);
    }

    setLoading(false);
  }

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Package size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
        </div>

        {error && <div className="badge badge-danger" style={{ display: 'block', marginBottom: '1rem', whiteSpace: 'normal', padding: '0.75rem' }}>{error}</div>}
        {successMessage && <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', whiteSpace: 'normal', padding: '0.75rem' }}><CheckCircle size={16}/> {successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-control" 
                required 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                minLength={6}
              />
            </div>
          )}

          <button disabled={loading} className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
            }} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
