import React from 'react';

const BlogManager = () => {
  return (
    <div className="blog-manager">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Gestión de Blog</h1>
          <p style={{ opacity: 0.6 }}>Publica noticias y artículos de interés.</p>
        </div>
        <button className="btn-primary">Nueva Entrada</button>
      </div>
      
      <div className="card" style={{ textAlign: 'center', padding: '80px' }}>
        <p style={{ opacity: 0.5 }}>Módulo de blog en desarrollo...</p>
      </div>
    </div>
  );
};

export default BlogManager;
