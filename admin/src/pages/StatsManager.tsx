import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit2,
  X,
  TrendingUp
} from 'lucide-react';
import api from '../api';

interface Stat {
  id: number;
  value: string;
  label: string;
  sub: string;
}

const emptyForm = {
  value: '',
  label: '',
  sub: '',
};

const StatsManager = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      setStats(res.data);
    } catch {
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const openNew = () => {
    setEditingStat(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (s: Stat) => {
    setEditingStat(s);
    setForm({
      value: s.value,
      label: s.label,
      sub: s.sub,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.value || !form.label || !form.sub) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingStat) {
        await api.patch(`/stats/${editingStat.id}`, form);
      } else {
        await api.post('/stats', form);
      }
      await fetchStats();
      setShowModal(false);
    } catch {
      setError('Error al guardar la estadística');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta estadística?')) return;
    try {
      await api.delete(`/stats/${id}`);
      setStats((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Error al eliminar la estadística');
    }
  };

  return (
    <div className="stats-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Gestión de Estadísticas</h1>
          <p style={{ opacity: 0.6 }}>Administra los contadores de éxito que se muestran en la landing page.</p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={18} />
          Añadir Estadística
        </button>
      </div>

      {loading ? (
        <p style={{ opacity: 0.5 }}>Cargando estadísticas...</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {stats.map((stat) => (
            <motion.div 
              key={stat.id} 
              className="card" 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'rgba(221, 47, 57, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-primary)'
                }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>{stat.value}</div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>{stat.label}</div>
                  <div style={{ fontSize: '13px', opacity: 0.5 }}>{stat.sub}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-ghost" style={{ padding: '8px' }} onClick={() => openEdit(stat)}><Edit2 size={18} /></button>
                <button className="btn-ghost" style={{ padding: '8px', color: '#ff4444' }} onClick={() => handleDelete(stat.id)}><Trash2 size={18} /></button>
              </div>
            </motion.div>
          ))}

          {stats.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '60px', opacity: 0.4 }}>
              No hay estadísticas registradas. Crea la primera.
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
              style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '450px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px' }}>{editingStat ? 'Editar Estadística' : 'Nueva Estadística'}</h3>
                <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Valor (ej: 15+, 100%, 12)</label>
                  <input className="input-field" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="Ej: 15+" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Etiqueta Principal</label>
                  <input className="input-field" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Ej: Años de Experiencia" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Subtexto Informativo</label>
                  <input className="input-field" value={form.sub} onChange={e => setForm({ ...form, sub: e.target.value })} placeholder="Ej: Excelencia en el mercado" />
                </div>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px' }}>{error}</p>}

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

export default StatsManager;
