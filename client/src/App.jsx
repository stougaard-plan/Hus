import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api.js';

const CATEGORIES = ['Alle', 'Udendørs', 'Indendørs', 'VVS og Teknik', 'Sæson', 'Admin'];
const CATEGORY_ICONS = {
  'Udendørs': '\u{1F333}',
  'Indendørs': '\u{1F3E0}',
  'VVS og Teknik': '\u{1F527}',
  'Sæson': '\u{1F342}',
  'Admin': '\u{1F4CB}',
};
const VIEWS = ['opgaver', 'plan', 'historik'];

function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('husapp_auth') === '1');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [view, setView] = useState('opgaver');
  const [tasks, setTasks] = useState([]);
  const [instances, setInstances] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedTask, setSelectedTask] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Plan modal
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planTaskId, setPlanTaskId] = useState('');
  const [planDate, setPlanDate] = useState('');
  const [planAssigned, setPlanAssigned] = useState('Lasse');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [t, i, s] = await Promise.all([
        api.getTasks(),
        api.getInstances(),
        api.getStats(),
      ]);
      setTasks(t);
      setInstances(i);
      setStats(s);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  // Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.login(pin);
      sessionStorage.setItem('husapp_auth', '1');
      setAuthed(true);
      setPinError('');
    } catch {
      setPinError('Forkert PIN');
    }
  };

  if (!authed) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>{'\u{1F3E1}'} HusApp</h1>
          <p style={styles.loginSubtitle}>Kl\u00F8vervej 23, Roskilde</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              inputMode="numeric"
              placeholder="Indtast PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={styles.pinInput}
              autoFocus
            />
            {pinError && <p style={styles.error}>{pinError}</p>}
            <button type="submit" style={styles.loginBtn}>Log ind</button>
          </form>
        </div>
      </div>
    );
  }

  // Filters
  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'Alle' && t.category !== selectedCategory) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const plannedInstances = instances.filter((i) => i.status === 'planned');
  const doneInstances = instances.filter((i) => i.status === 'done');

  // Actions
  const markDone = async (instanceId) => {
    await api.updateInstance(instanceId, { status: 'done' });
    loadData();
  };

  const deleteInstance = async (instanceId) => {
    await api.deleteInstance(instanceId);
    loadData();
  };

  const planTask = async (e) => {
    e.preventDefault();
    if (!planTaskId) return;
    await api.createInstance({
      task_id: planTaskId,
      planned_date: planDate || null,
      assigned_to: planAssigned,
    });
    setShowPlanModal(false);
    setPlanTaskId('');
    setPlanDate('');
    loadData();
  };

  const openPlanForTask = (taskId) => {
    setPlanTaskId(taskId);
    setPlanDate(new Date().toISOString().split('T')[0]);
    setShowPlanModal(true);
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>{'\u{1F3E1}'} HusApp</h1>
        {stats && (
          <div style={styles.statsBar}>
            <span>{'\u{2705}'} {stats.done} udf\u00F8rt</span>
            <span>{'\u{1F4C5}'} {stats.planned} planlagt</span>
          </div>
        )}
      </header>

      {/* Nav */}
      <nav style={styles.nav}>
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              ...styles.navBtn,
              ...(view === v ? styles.navBtnActive : {}),
            }}
          >
            {v === 'opgaver' ? '\u{1F4CB}' : v === 'plan' ? '\u{1F4C5}' : '\u{2705}'}{' '}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {loading && <div style={styles.loading}>Indl\u00E6ser...</div>}

        {/* OPGAVER VIEW */}
        {view === 'opgaver' && (
          <>
            <input
              type="search"
              placeholder="S\u00F8g opgaver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />

            <div style={styles.categoryBar}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...styles.catBtn,
                    ...(selectedCategory === cat ? styles.catBtnActive : {}),
                  }}
                >
                  {cat !== 'Alle' && CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>

            <div style={styles.taskCount}>{filteredTasks.length} opgaver</div>

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                style={styles.taskCard}
                onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
              >
                <div style={styles.taskHeader}>
                  <span style={styles.taskTitle}>
                    {CATEGORY_ICONS[task.category]} {task.title}
                  </span>
                  <span style={styles.badge}>{task.frequency}</span>
                </div>
                <div style={styles.taskMeta}>
                  <span>{task.estimated_minutes} min</span>
                  {task.season && <span>{'\u{1F324}\uFE0F'} {task.season}</span>}
                  {task.child_friendly && <span>{'\u{1F476}'} B\u00F8rnevenlig</span>}
                  <span>{task.assigned_to?.join(', ')}</span>
                </div>

                {selectedTask?.id === task.id && (
                  <div style={styles.taskDetails}>
                    {task.note && <p style={styles.taskNote}>{'\u{1F4DD}'} {task.note}</p>}
                    {task.steps && task.steps.length > 0 && (
                      <div>
                        <strong>Trin:</strong>
                        <ol style={styles.stepsList}>
                          {task.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    <button
                      style={styles.planBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        openPlanForTask(task.id);
                      }}
                    >
                      {'\u{1F4C5}'} Planl\u00E6g opgave
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* PLAN VIEW */}
        {view === 'plan' && (
          <>
            <div style={styles.sectionHeader}>
              <h2>Planlagte opgaver ({plannedInstances.length})</h2>
              <button style={styles.addBtn} onClick={() => setShowPlanModal(true)}>
                + Ny
              </button>
            </div>

            {plannedInstances.length === 0 && (
              <p style={styles.empty}>Ingen planlagte opgaver. Planl\u00E6g en fra opgavelisten!</p>
            )}

            {plannedInstances.map((inst) => (
              <div key={inst.id} style={styles.instanceCard}>
                <div style={styles.instanceHeader}>
                  <span style={styles.instanceTitle}>
                    {CATEGORY_ICONS[inst.category]} {inst.title}
                  </span>
                </div>
                <div style={styles.instanceMeta}>
                  {inst.planned_date && (
                    <span>{'\u{1F4C5}'} {new Date(inst.planned_date).toLocaleDateString('da-DK')}</span>
                  )}
                  {inst.assigned_to && <span>{'\u{1F464}'} {inst.assigned_to}</span>}
                  <span>{inst.estimated_minutes} min</span>
                </div>
                <div style={styles.instanceActions}>
                  <button style={styles.doneBtn} onClick={() => markDone(inst.id)}>
                    {'\u{2705}'} Udf\u00F8rt
                  </button>
                  <button style={styles.deleteBtn} onClick={() => deleteInstance(inst.id)}>
                    {'\u{1F5D1}\uFE0F'} Slet
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* HISTORIK VIEW */}
        {view === 'historik' && (
          <>
            <h2 style={styles.sectionTitle}>Udf\u00F8rte opgaver ({doneInstances.length})</h2>

            {stats && stats.byCategory.length > 0 && (
              <div style={styles.statsGrid}>
                {stats.byCategory.map((s) => (
                  <div key={s.category} style={styles.statCard}>
                    <div style={styles.statNum}>{s.count}</div>
                    <div style={styles.statLabel}>{CATEGORY_ICONS[s.category]} {s.category}</div>
                  </div>
                ))}
              </div>
            )}

            {doneInstances.length === 0 && (
              <p style={styles.empty}>Ingen udf\u00F8rte opgaver endnu.</p>
            )}

            {doneInstances.map((inst) => (
              <div key={inst.id} style={{ ...styles.instanceCard, opacity: 0.8 }}>
                <div style={styles.instanceHeader}>
                  <span style={styles.instanceTitle}>
                    {CATEGORY_ICONS[inst.category]} {inst.title}
                  </span>
                  <span style={styles.doneBadge}>{'\u{2705}'} Udf\u00F8rt</span>
                </div>
                <div style={styles.instanceMeta}>
                  {inst.done_date && (
                    <span>{new Date(inst.done_date).toLocaleDateString('da-DK')}</span>
                  )}
                  {inst.assigned_to && <span>{'\u{1F464}'} {inst.assigned_to}</span>}
                </div>
              </div>
            ))}
          </>
        )}
      </main>

      {/* Plan Modal */}
      {showPlanModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPlanModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Planl\u00E6g opgave</h3>
            <form onSubmit={planTask}>
              <label style={styles.label}>Opgave</label>
              <select
                value={planTaskId}
                onChange={(e) => setPlanTaskId(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">V\u00E6lg opgave...</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.category}: {t.title}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Dato</label>
              <input
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Ansvarlig</label>
              <select
                value={planAssigned}
                onChange={(e) => setPlanAssigned(e.target.value)}
                style={styles.select}
              >
                <option value="Lasse">Lasse</option>
                <option value="Julie">Julie</option>
              </select>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowPlanModal(false)}>
                  Annull\u00E9r
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Planl\u00E6g
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Styles (mobile-first) ---
const styles = {
  app: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: 480,
    margin: '0 auto',
    minHeight: '100vh',
    background: '#f8fafc',
    color: '#1e293b',
  },
  // Login
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    padding: 20,
  },
  loginCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    textAlign: 'center',
    width: '100%',
    maxWidth: 320,
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  loginTitle: { fontSize: 28, margin: '0 0 4px', color: '#1e293b' },
  loginSubtitle: { color: '#64748b', margin: '0 0 24px', fontSize: 14 },
  pinInput: {
    width: '100%',
    padding: '14px',
    fontSize: 24,
    textAlign: 'center',
    border: '2px solid #e2e8f0',
    borderRadius: 12,
    outline: 'none',
    letterSpacing: 8,
    boxSizing: 'border-box',
  },
  loginBtn: {
    width: '100%',
    padding: 14,
    fontSize: 16,
    fontWeight: 600,
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    marginTop: 16,
    cursor: 'pointer',
  },
  error: { color: '#ef4444', fontSize: 14, margin: '8px 0 0' },

  // Header
  header: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#fff',
    padding: '16px 20px 12px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerTitle: { margin: 0, fontSize: 22 },
  statsBar: {
    display: 'flex',
    gap: 16,
    fontSize: 13,
    marginTop: 6,
    opacity: 0.9,
  },

  // Nav
  nav: {
    display: 'flex',
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 56,
    zIndex: 99,
  },
  navBtn: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    background: 'transparent',
    fontSize: 14,
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
  },
  navBtnActive: {
    color: '#2563eb',
    borderBottom: '2px solid #2563eb',
    fontWeight: 600,
  },

  // Main
  main: { padding: '12px 16px 80px' },
  loading: { textAlign: 'center', padding: 40, color: '#64748b' },

  // Search
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 15,
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    outline: 'none',
    marginBottom: 12,
    boxSizing: 'border-box',
  },

  // Categories
  categoryBar: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: 8,
  },
  catBtn: {
    padding: '6px 12px',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    background: '#fff',
    fontSize: 12,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    color: '#475569',
  },
  catBtnActive: {
    background: '#2563eb',
    color: '#fff',
    border: '1px solid #2563eb',
  },

  taskCount: { fontSize: 13, color: '#64748b', marginBottom: 8 },

  // Task cards
  taskCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  taskTitle: { fontWeight: 600, fontSize: 15 },
  badge: {
    background: '#eff6ff',
    color: '#2563eb',
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  taskMeta: {
    display: 'flex',
    gap: 12,
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  taskDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid #f1f5f9',
  },
  taskNote: {
    background: '#fffbeb',
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: 13,
    margin: '0 0 10px',
    color: '#92400e',
  },
  stepsList: { paddingLeft: 20, margin: '6px 0', fontSize: 13, lineHeight: 1.6 },
  planBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    marginTop: 8,
  },

  // Instance cards
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, margin: '0 0 12px' },
  addBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  instanceCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  instanceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instanceTitle: { fontWeight: 600, fontSize: 15 },
  instanceMeta: {
    display: 'flex',
    gap: 12,
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  instanceActions: {
    display: 'flex',
    gap: 8,
    marginTop: 10,
  },
  doneBtn: {
    flex: 1,
    padding: '8px 0',
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '8px 14px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    cursor: 'pointer',
  },
  doneBadge: { fontSize: 12, color: '#16a34a', fontWeight: 500 },
  empty: { textAlign: 'center', color: '#94a3b8', padding: 32 },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    background: '#fff',
    borderRadius: 10,
    padding: 12,
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  statNum: { fontSize: 24, fontWeight: 700, color: '#2563eb' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 2 },

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    background: '#fff',
    borderRadius: '16px 16px 0 0',
    padding: '24px 20px 32px',
    width: '100%',
    maxWidth: 480,
  },
  modalTitle: { margin: '0 0 16px', fontSize: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 4, marginTop: 12 },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 15,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 15,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
  },
  modalActions: { display: 'flex', gap: 8, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 1,
    padding: 12,
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default App;
