import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Star,
  StarOff,
  X,
  MapPin,
  Upload,
} from 'lucide-react';
import api from '../api';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  location?: string;
  city?: string;
  country: string;
  isFeatured: boolean;
}

const emptyForm = {
  title: '',
  category: '',
  image: '',
  location: '',
  city: '',
  country: 'Colombia',
  isFeatured: false,
};

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // El backend sirve estáticos en la raíz del dominio
    const baseUrl = api.defaults.baseURL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${path}`;
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch {
      setError('No se pudieron cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setForm({
      title: p.title,
      category: p.category,
      image: p.image,
      location: p.location ?? '',
      city: p.city ?? '',
      country: p.country,
      isFeatured: p.isFeatured,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.image) {
      setError('Título, categoría e imagen son obligatorios');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingProject) {
        await api.patch(`/projects/${editingProject.id}`, form);
      } else {
        await api.post('/projects', form);
      }
      await fetchProjects();
      setShowModal(false);
    } catch {
      setError('Error al guardar el proyecto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Error al eliminar el proyecto');
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    try {
      await api.patch(`/projects/${p.id}`, { isFeatured: !p.isFeatured });
      await fetchProjects();
    } catch {
      alert('Error al actualizar el estado');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, image: res.data.url }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Proyectos</h1>
          <p style={{ opacity: 0.5, fontSize: '14px', marginTop: '4px' }}>
            El proyecto marcado con <Star size={12} style={{ display: 'inline', color: '#f59e0b' }} /> se muestra en la sección Hero del sitio.
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={18} /> Nuevo Proyecto
        </button>
      </div>

      {/* Projects grid */}
      {loading ? (
        <p style={{ opacity: 0.5 }}>Cargando proyectos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {projects.map((p) => (
            <motion.div
              key={p.id}
              className="card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: 0, overflow: 'hidden', position: 'relative' }}
            >
              {/* Featured badge */}
              {p.isFeatured && (
                <div style={{
                  position: 'absolute', top: 12, left: 12, zIndex: 2,
                  background: '#f59e0b', color: '#fff',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
                  padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Star size={11} /> HERO
                </div>
              )}

              {/* Image placeholder */}
              <div style={{
                height: '160px',
                background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                backgroundImage: p.image ? `url(${getFileUrl(p.image)})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {!p.image && <span style={{ opacity: 0.3, fontSize: '13px' }}>Sin imagen</span>}
              </div>

              {/* Info */}
              <div style={{ padding: '16px 20px 12px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--color-primary)', textTransform: 'uppercase'
                }}>
                  {p.category}
                </span>
                <h4 style={{ marginTop: '4px', marginBottom: '8px', fontSize: '16px' }}>{p.title}</h4>

                {(p.location || p.city) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', opacity: 0.5 }}>
                    <MapPin size={13} />
                    {[p.location, p.city, p.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '8px',
                padding: '10px 16px', borderTop: '1px solid var(--glass-border)'
              }}>
                <button
                  title={p.isFeatured ? 'Quitar de Hero' : 'Marcar como Hero'}
                  className="btn-ghost"
                  style={{ padding: '6px', color: p.isFeatured ? '#f59e0b' : undefined }}
                  onClick={() => handleToggleFeatured(p)}
                >
                  {p.isFeatured ? <Star size={16} fill="#f59e0b" /> : <StarOff size={16} />}
                </button>
                <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => openEdit(p)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn-ghost" style={{ padding: '6px', color: '#ef4444' }} onClick={() => handleDelete(p.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', opacity: 0.4 }}>
              No hay proyectos registrados. Crea el primero.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              {/* Modal header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px' }}>{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Fields */}
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Título *</label>
                  <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: Remodelación Moderna en Escazú" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Categoría *</label>
                  <input className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ej: Diseño Interior" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Imagen del Proyecto *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="input-field" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="URL o sube una foto..." />
                    <label className="btn-ghost" style={{ 
                      flexShrink: 0, 
                      padding: '10px 14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      border: '1px solid var(--glass-border)'
                    }}>
                      <input type="file" hidden onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                      <Upload size={18} />
                      {uploading ? '...' : 'Subir'}
                    </label>
                  </div>
                  {form.image && (
                    <div style={{ marginTop: '8px', position: 'relative', height: '80px', width: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                      <img src={getFileUrl(form.image)} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Barrio / Zona</label>
                    <input className="input-field" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ej: Escalante" />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Ciudad</label>
                    <input className="input-field" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Ej: San José" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>País</label>
                  <input className="input-field" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="Colombia" />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px', background: form.isFeatured ? 'rgba(245, 158, 11, 0.08)' : 'var(--color-surface)', borderRadius: '8px', border: form.isFeatured ? '1px solid #f59e0b' : '1px solid var(--glass-border)' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: form.isFeatured ? '#d97706' : 'inherit' }}>
                      Mostrar en la sección Hero
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.5 }}>Se mostrará como proyecto destacado en la portada del sitio</div>
                  </div>
                </label>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px' }}>{error}</p>}

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button className="btn-ghost" style={{ border: '1px solid var(--glass-border)' }} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  <Save size={16} />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManager;
