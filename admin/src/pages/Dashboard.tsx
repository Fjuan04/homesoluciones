import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  Eye,
  MousePointer2
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Visitas Totales', value: '2,845', icon: <Eye size={20} />, trend: '+12.5%' },
    { label: 'Proyectos', value: '18', icon: <Briefcase size={20} />, trend: '+2' },
    { label: 'Servicios', value: '6', icon: <TrendingUp size={20} />, trend: '0' },
    { label: 'Consultas', value: '42', icon: <MessageSquare size={20} />, trend: '+5' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="dashboard-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Bienvenido, Administrador</h1>
        <p style={{ opacity: 0.6 }}>Panel de control central de Home Soluciones.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px' 
      }}>
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            className="card"
            variants={itemVariants}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ 
                background: 'rgba(221, 47, 57, 0.1)', 
                color: 'var(--color-primary)', 
                padding: '12px', 
                borderRadius: '10px' 
              }}>
                {stat.icon}
              </div>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 600, 
                color: stat.trend?.startsWith('+') ? '#4caf50' : '#888' 
              }}>
                {stat.trend}
              </span>
            </div>
            <h3 style={{ fontSize: '28px', marginBottom: '4px' }}>{stat.value}</h3>
            <p style={{ fontSize: '14px', opacity: 0.6 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '40px' }}>
        <motion.div className="card" variants={itemVariants}>
          <h3 style={{ marginBottom: '24px' }}>Actividad Reciente</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              "Se actualizó la galería de proyectos",
              "Nueva consulta desde el formulario de contacto",
              "Se modificó el texto del Hero"
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" variants={itemVariants}>
          <h3 style={{ marginBottom: '24px' }}>Accesos Rápidos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button className="btn-ghost" style={{ border: '1px solid var(--glass-border)', justifyContent: 'center' }}>
              <MousePointer2 size={18} />
              Editar Web
            </button>
            <button className="btn-ghost" style={{ border: '1px solid var(--glass-border)', justifyContent: 'center' }}>
              <Briefcase size={18} />
              Servicios
            </button>
            <button className="btn-ghost" style={{ border: '1px solid var(--glass-border)', justifyContent: 'center' }}>
              <Users size={18} />
              Usuarios
            </button>
            <button className="btn-ghost" style={{ border: '1px solid var(--glass-border)', justifyContent: 'center' }}>
              <MessageSquare size={18} />
              Mensajes
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
