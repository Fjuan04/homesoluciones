import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight } from 'lucide-react';
import api from '../api';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        email: username,
        password: password
      });
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin();
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #F8F9FA 0%, #E9ECEF 100%)',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{ 
        position: 'absolute', 
        width: '600px', 
        height: '600px', 
        background: 'var(--color-primary)', 
        filter: 'blur(150px)', 
        opacity: 0.05,
        borderRadius: '50%',
        top: '-100px',
        right: '-100px'
      }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card glass" 
        style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            fontSize: '32px', 
            fontFamily: 'var(--font-sans)', 
            fontWeight: 600, 
            letterSpacing: '4px',
            marginBottom: '8px'
          }}>
            <span style={{ color: 'var(--color-primary)' }}>H</span>OME
          </div>
          <p style={{ opacity: 0.5, fontSize: '14px', letterSpacing: '2px' }}>BACKOFFICE</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Usuario" 
              style={{ paddingLeft: '48px' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              type="password" 
              className="input-field" 
              placeholder="Contraseña" 
              style={{ paddingLeft: '48px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={loading}>
            {loading ? 'Cargando...' : 'Entrar al Panel'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <a href="#" style={{ fontSize: '14px', opacity: 0.4 }}>¿Olvidaste tu contraseña?</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
