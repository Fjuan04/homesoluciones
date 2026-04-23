import React from 'react';

const ServicesManager = () => {
  return (
    <div className="services-manager">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Gestión de Servicios</h1>
          <p style={{ opacity: 0.6 }}>Administra el catálogo de servicios ofrecidos.</p>
        </div>
        <button className="btn-primary">Añadir Servicio</button>
      </div>
      
      <div className="card" style={{ textAlign: 'center', padding: '80px' }}>
        <p style={{ opacity: 0.5 }}>Módulo de servicios en desarrollo...</p>
      </div>
    </div>
  );
};

export default ServicesManager;
