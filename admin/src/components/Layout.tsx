import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  User,
  Home
} from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Home size={20} />, label: 'Landing Page', path: '/landing' },
    { icon: <Briefcase size={20} />, label: 'Servicios', path: '/services' },
    { icon: <FileText size={20} />, label: 'Blog', path: '/blog' },
    { icon: <Settings size={20} />, label: 'Configuración', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Force reload to clear states
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar glass ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-accent">H</span>OME
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="toggle-btn">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span className="label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span className="label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-container">
        <header className="main-header glass">
          <div className="header-left">
            <h2 className="page-title">Panel de Administración</h2>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <span className="user-name">Admin</span>
              <div className="user-avatar">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        <section className="content-area">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
