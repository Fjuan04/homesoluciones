import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Edit2
} from 'lucide-react';

const LandingManager = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'stats', label: 'Estadísticas' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'process', label: 'Proceso' },
  ];

  return (
    <div className="landing-manager">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Gestión de Landing Page</h1>
          <p style={{ opacity: 0.6 }}>Administra el contenido principal de tu sitio web.</p>
        </div>
        <button className="btn-primary">
          <Save size={18} />
          Guardar Cambios
        </button>
      </div>

      <div className="tabs-container glass" style={{ 
        display: 'flex', 
        padding: '4px', 
        borderRadius: '12px', 
        marginBottom: '32px',
        width: 'fit-content'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--color-text)',
              opacity: activeTab === tab.id ? 1 : 0.6,
              fontWeight: 500
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'hero' && <HeroSection />}
          {activeTab === 'stats' && <StatsSection />}
          {activeTab === 'projects' && <ProjectsSection />}
          {activeTab === 'process' && <ProcessSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const HeroSection = () => (
  <div className="card">
    <h3 style={{ marginBottom: '24px' }}>Sección Hero</h3>
    <div style={{ display: 'grid', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>Título Principal</label>
        <input type="text" className="input-field" defaultValue="Construyendo Hogares, Creando Sueños" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>Subtítulo</label>
        <textarea className="input-field" rows={3} defaultValue="Transformamos espacios con diseño de vanguardia y excelencia en cada detalle." />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>Imagen de Fondo</label>
        <div style={{ 
          height: '200px', 
          background: 'rgba(0,0,0,0.05)', 
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed var(--glass-border)',
          cursor: 'pointer'
        }}>
          <ImageIcon size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <span style={{ opacity: 0.5 }}>Click para subir o arrastra una imagen</span>
        </div>
      </div>
    </div>
  </div>
);

const StatsSection = () => (
  <div className="stats-manager">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h3>Contadores de Éxito</h3>
      <button className="btn-ghost" style={{ border: '1px solid var(--glass-border)' }}>
        <Plus size={18} />
        Añadir Estadística
      </button>
    </div>
    <div style={{ display: 'grid', gap: '16px' }}>
      {[
        { label: 'Años de Experiencia', value: '15+' },
        { label: 'Proyectos Completados', value: '120+' },
        { label: 'Clientes Satisfechos', value: '100%' }
      ].map((stat, i) => (
        <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <div style={{ display: 'flex', gap: '40px' }}>
            <div>
              <span style={{ fontSize: '12px', opacity: 0.5, display: 'block' }}>ETIQUETA</span>
              <strong>{stat.label}</strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', opacity: 0.5, display: 'block' }}>VALOR</span>
              <strong>{stat.value}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-ghost" style={{ padding: '8px' }}><Edit2 size={16} /></button>
            <button className="btn-ghost" style={{ padding: '8px', color: '#ff4444' }}><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProjectsSection = () => (
  <div className="projects-manager">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h3>Proyectos Destacados</h3>
      <button className="btn-ghost" style={{ border: '1px solid var(--glass-border)' }}>
        <Plus size={18} />
        Nuevo Proyecto
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ height: '160px', background: 'rgba(0,0,0,0.05)' }}></div>
          <div style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: '8px' }}>Proyecto de Lujo {i}</h4>
            <p style={{ fontSize: '14px', opacity: 0.6, marginBottom: '16px' }}>Diseño interior minimalista en San José.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn-ghost" style={{ padding: '8px' }}><Edit2 size={16} /></button>
              <button className="btn-ghost" style={{ padding: '8px', color: '#ff4444' }}><Trash2 size={16} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProcessSection = () => (
  <div className="process-manager">
     <h3>Pasos del Proceso</h3>
     <p style={{ opacity: 0.6, marginBottom: '24px' }}>Define el flujo de trabajo que los clientes verán en la web.</p>
     <div style={{ display: 'grid', gap: '16px' }}>
        {[
          { num: '01', title: 'Consulta Inicial', desc: 'Entendemos tus necesidades y visión.' },
          { num: '02', title: 'Diseño y Planificación', desc: 'Creamos planos y modelos 3D.' },
          { num: '03', title: 'Construcción', desc: 'Ejecutamos el proyecto con precisión.' }
        ].map((step, i) => (
          <div key={i} className="card" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span style={{ fontSize: '32px', fontFamily: 'var(--font-sans)', color: 'var(--color-primary)', opacity: 0.5 }}>{step.num}</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '4px' }}>{step.title}</h4>
              <p style={{ fontSize: '14px', opacity: 0.6 }}>{step.desc}</p>
            </div>
            <button className="btn-ghost" style={{ padding: '8px' }}><Edit2 size={16} /></button>
          </div>
        ))}
     </div>
  </div>
);

export default LandingManager;
