import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Trash2, Edit3, Check, X, ChevronDown,
  Users, Clock, CheckCircle2, XCircle, BarChart3, RefreshCw,
  AlertTriangle, Filter, ChevronUp, Eye, Bot, LogOut
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

/* ─── Status Badge ─── */
function StatusBadge({ status, onClick }) {
  const config = {
    pending: { bg: 'rgba(250,204,21,0.12)', color: '#facc15', border: 'rgba(250,204,21,0.25)', label: 'Pending' },
    approved: { bg: 'rgba(6,214,160,0.12)', color: '#06d6a0', border: 'rgba(6,214,160,0.25)', label: 'Approved' },
    rejected: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)', label: 'Rejected' },
  };
  const c = config[status] || config.pending;
  return (
    <button
      onClick={onClick}
      className="admin-status-badge"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      <span className="admin-status-dot" style={{ background: c.color }}></span>
      {c.label}
    </button>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="admin-stat-card"
    >
      <div className="admin-stat-icon" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </motion.div>
  );
}

/* ─── Edit Modal ─── */
function EditModal({ booking, onClose, onSave }) {
  const [form, setForm] = useState({
    name: booking.name || '',
    email: booking.email || '',
    phone: booking.phone || '',
    company: booking.company || '',
    role: booking.role || '',
    useCase: booking.useCase || '',
    teamSize: booking.teamSize || '',
    guests: booking.guests || 1,
    checkInDate: booking.checkInDate ? new Date(booking.checkInDate).toISOString().split('T')[0] : '',
    status: booking.status || 'pending',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onSave();
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25 }}
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-modal-title">Edit Application</h3>
            <p className="admin-modal-subtitle">ID: #{booking.id}</p>
          </div>
          <button onClick={onClose} className="admin-icon-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Full name" />
            </div>
            <div className="admin-form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="Email" />
            </div>
            <div className="admin-form-group">
              <label>Company</label>
              <input name="company" value={form.company} onChange={handleChange} className="input-field" placeholder="Company" />
            </div>
            <div className="admin-form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field" style={{ colorScheme: 'dark' }}>
                <option value="">Select role</option>
                <option value="engineer">Engineer / Developer</option>
                <option value="pm">Product Manager</option>
                <option value="exec">Executive / C-Suite</option>
                <option value="ops">Operations</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Team Size</label>
              <select name="teamSize" value={form.teamSize} onChange={handleChange} className="input-field" style={{ colorScheme: 'dark' }}>
                <option value="">Select size</option>
                <option value="1-10">1–10 people</option>
                <option value="11-50">11–50 people</option>
                <option value="51-200">51–200 people</option>
                <option value="200+">200+ people</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field" style={{ colorScheme: 'dark' }}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="admin-form-group admin-form-full">
              <label>Use Case</label>
              <input name="useCase" value={form.useCase} onChange={handleChange} className="input-field" placeholder="Primary use case" />
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
              <span className="relative z-10 flex items-center gap-2">
                {saving ? (
                  <><RefreshCw size={16} className="admin-spin" /> Saving...</>
                ) : (
                  <><Check size={16} /> Save Changes</>
                )}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── View Details Modal ─── */
function ViewModal({ booking, onClose }) {
  const roleLabels = { engineer: 'Engineer / Developer', pm: 'Product Manager', exec: 'Executive / C-Suite', ops: 'Operations', other: 'Other' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25 }}
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-modal-title">Application Details</h3>
            <p className="admin-modal-subtitle">ID: #{booking.id}</p>
          </div>
          <button onClick={onClose} className="admin-icon-btn">
            <X size={20} />
          </button>
        </div>

        <div className="admin-view-details">
          <div className="admin-detail-row">
            <span className="admin-detail-label">Full Name</span>
            <span className="admin-detail-value">{booking.name}</span>
          </div>
          <div className="admin-detail-row">
            <span className="admin-detail-label">Email</span>
            <span className="admin-detail-value">{booking.email}</span>
          </div>
          <div className="admin-detail-row">
            <span className="admin-detail-label">Company</span>
            <span className="admin-detail-value">{booking.company || '—'}</span>
          </div>
          <div className="admin-detail-row">
            <span className="admin-detail-label">Role</span>
            <span className="admin-detail-value">{roleLabels[booking.role] || booking.role || '—'}</span>
          </div>
          <div className="admin-detail-row">
            <span className="admin-detail-label">Team Size</span>
            <span className="admin-detail-value">{booking.teamSize || '—'}</span>
          </div>
          <div className="admin-detail-row">
            <span className="admin-detail-label">Use Case</span>
            <span className="admin-detail-value">{booking.useCase || '—'}</span>
          </div>
          <div className="admin-detail-row">
            <span className="admin-detail-label">Status</span>
            <StatusBadge status={booking.status} />
          </div>
          <div className="admin-detail-row">
            <span className="admin-detail-label">Submitted</span>
            <span className="admin-detail-value">{new Date(booking.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="admin-modal-actions">
          <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
            <span className="relative z-10">Close</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Delete Confirmation ─── */
function DeleteConfirm({ count, onConfirm, onCancel, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-modal-overlay"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="admin-modal admin-modal-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-delete-content">
          <div className="admin-delete-icon">
            <AlertTriangle size={32} />
          </div>
          <h3 className="admin-modal-title">Confirm Deletion</h3>
          <p className="admin-delete-text">
            Are you sure you want to delete {count} application{count > 1 ? 's' : ''}? This action cannot be undone.
          </p>
          <div className="admin-delete-actions">
            <button onClick={onCancel} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px' }}>
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading} className="admin-btn-danger">
              {loading ? (
                <><RefreshCw size={16} className="admin-spin" /> Deleting...</>
              ) : (
                <><Trash2 size={16} /> Delete</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   ██  ADMIN DASHBOARD  ██
   ═══════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, recentWeek: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [selected, setSelected] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = useCallback(async () => {
    try {
      const params = new URLSearchParams({ search, sortBy, order: sortOrder, status: statusFilter });
      const res = await fetch(`${API_URL}/bookings?${params}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch data', 'error');
    }
  }, [search, sortBy, sortOrder, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchBookings(), fetchStats()]);
      setLoading(false);
    };
    load();
  }, [fetchBookings, fetchStats]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(col);
      setSortOrder('DESC');
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selected.length === bookings.length) {
      setSelected([]);
    } else {
      setSelected(bookings.map(b => b.id));
    }
  };

  const handleDelete = async (ids) => {
    setDeleting(true);
    try {
      if (ids.length === 1) {
        await fetch(`${API_URL}/bookings/${ids[0]}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_URL}/bookings/bulk-delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });
      }
      showToast(`${ids.length} application${ids.length > 1 ? 's' : ''} deleted`);
      setSelected([]);
      setDeleteConfirm(null);
      fetchBookings();
      fetchStats();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
    setDeleting(false);
  };

  const handleBulkStatus = async (status) => {
    try {
      await fetch(`${API_URL}/bookings/bulk-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected, status }),
      });
      showToast(`${selected.length} application${selected.length > 1 ? 's' : ''} marked as ${status}`);
      setSelected([]);
      fetchBookings();
      fetchStats();
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  const handleStatusUpdateInline = async (id, status) => {
    try {
      await fetch(`${API_URL}/bookings/bulk-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id], status }),
      });
      showToast(`Application marked as ${status}`);
      fetchBookings();
      fetchStats();
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  const handleStatusCycle = async (booking) => {
    const order = ['pending', 'approved', 'rejected'];
    const next = order[(order.indexOf(booking.status) + 1) % order.length];
    try {
      await fetch(`${API_URL}/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, status: next }),
      });
      fetchBookings();
      fetchStats();
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ChevronDown size={14} className="admin-sort-icon-inactive" />;
    return sortOrder === 'ASC' ? <ChevronUp size={14} className="admin-sort-icon" /> : <ChevronDown size={14} className="admin-sort-icon" />;
  };

  const roleLabels = { engineer: 'Engineer', pm: 'PM', exec: 'Executive', ops: 'Operations', other: 'Other' };

  return (
    <div className="admin-root">
      {/* ── Top Bar ── */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-header-left">
            <button onClick={() => navigate('/')} className="admin-back-btn">
              <ArrowLeft size={18} />
            </button>
            <div className="admin-header-brand">
              <div className="admin-brand-icon">
                <Bot size={18} />
              </div>
              <span className="admin-brand-text">
                Nex<span className="gradient-text">Ω</span> Admin
              </span>
            </div>
          </div>
          <div className="admin-header-right">
            <button onClick={() => { fetchBookings(); fetchStats(); }} className="admin-refresh-btn">
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('nex_admin_auth');
                navigate('/admin');
              }} 
              className="admin-action-btn admin-action-delete"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* ── Page Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-page-title"
        >
          <h1>Application Dashboard</h1>
          <p>Manage and review all submitted applications</p>
        </motion.div>

        {/* ── Stats Cards ── */}
        <div className="admin-stats-grid">
          <StatCard icon={<Users size={22} />} label="Total Applications" value={stats.total} color="#7c5cfc" delay={0.1} />
          <StatCard icon={<Clock size={22} />} label="Pending Review" value={stats.pending} color="#facc15" delay={0.15} />
          <StatCard icon={<CheckCircle2 size={22} />} label="Approved" value={stats.approved} color="#06d6a0" delay={0.2} />
          <StatCard icon={<XCircle size={22} />} label="Rejected" value={stats.rejected} color="#ef4444" delay={0.25} />
          <StatCard icon={<BarChart3 size={22} />} label="This Week" value={stats.recentWeek} color="#818cf8" delay={0.3} />
        </div>

        {/* ── Toolbar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="admin-toolbar"
        >
          <div className="admin-toolbar-left">
            <div className="admin-search-box">
              <Search size={16} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
              />
              {search && (
                <button onClick={() => setSearch('')} className="admin-search-clear">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="admin-filter-group">
              <Filter size={14} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Bulk actions */}
          <AnimatePresence>
            {selected.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="admin-bulk-actions"
              >
                <span className="admin-bulk-count">{selected.length} selected</span>
                <button onClick={() => handleBulkStatus('approved')} className="admin-bulk-btn admin-bulk-approve">
                  <Check size={14} /> Approve
                </button>
                <button onClick={() => handleBulkStatus('rejected')} className="admin-bulk-btn admin-bulk-reject">
                  <X size={14} /> Reject
                </button>
                <button onClick={() => setDeleteConfirm(selected)} className="admin-bulk-btn admin-bulk-delete">
                  <Trash2 size={14} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-table-wrapper"
        >
          {loading ? (
            <div className="admin-loading">
              <RefreshCw size={32} className="admin-spin" style={{ color: '#7c5cfc' }} />
              <p>Loading applications...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="admin-empty">
              <Users size={48} style={{ color: '#3f3f46' }} />
              <h3>No applications found</h3>
              <p>Applications submitted through the website will appear here.</p>
            </div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="admin-th-check">
                      <input
                        type="checkbox"
                        checked={selected.length === bookings.length && bookings.length > 0}
                        onChange={toggleSelectAll}
                        className="admin-checkbox"
                      />
                    </th>
                    <th onClick={() => handleSort('id')} className="admin-th-sortable">
                      ID <SortIcon col="id" />
                    </th>
                    <th onClick={() => handleSort('name')} className="admin-th-sortable">
                      Name <SortIcon col="name" />
                    </th>
                    <th onClick={() => handleSort('email')} className="admin-th-sortable">
                      Email <SortIcon col="email" />
                    </th>
                    <th onClick={() => handleSort('company')} className="admin-th-sortable">
                      Company <SortIcon col="company" />
                    </th>
                    <th>Role</th>
                    <th>Team Size</th>
                    <th onClick={() => handleSort('status')} className="admin-th-sortable">
                      Status <SortIcon col="status" />
                    </th>
                    <th onClick={() => handleSort('createdAt')} className="admin-th-sortable">
                      Submitted <SortIcon col="createdAt" />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {bookings.map((b, i) => (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.02 }}
                        className={`admin-tr ${selected.includes(b.id) ? 'admin-tr-selected' : ''}`}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selected.includes(b.id)}
                            onChange={() => toggleSelect(b.id)}
                            className="admin-checkbox"
                          />
                        </td>
                        <td className="admin-td-id">#{b.id}</td>
                        <td className="admin-td-name">
                          <div className="admin-avatar">{b.name?.charAt(0)?.toUpperCase()}</div>
                          {b.name}
                        </td>
                        <td className="admin-td-email">{b.email}</td>
                        <td>{b.company || '—'}</td>
                        <td>{roleLabels[b.role] || b.role || '—'}</td>
                        <td>{b.teamSize || '—'}</td>
                        <td>
                          <StatusBadge status={b.status} onClick={() => handleStatusCycle(b)} />
                        </td>
                        <td className="admin-td-date">
                          {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>
                          <div className="admin-actions">
                            {b.status !== 'approved' && (
                              <button onClick={() => handleStatusUpdateInline(b.id, 'approved')} className="admin-action-btn" style={{ background: 'rgba(6,214,160,0.1)', color: '#06d6a0' }} title="Approve">
                                <Check size={15} />
                              </button>
                            )}
                            {b.status !== 'rejected' && (
                              <button onClick={() => handleStatusUpdateInline(b.id, 'rejected')} className="admin-action-btn" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }} title="Reject">
                                <X size={15} />
                              </button>
                            )}
                            <button onClick={() => setViewBooking(b)} className="admin-action-btn admin-action-view" title="View Details">
                              <Eye size={15} />
                            </button>
                            <button onClick={() => setEditBooking(b)} className="admin-action-btn admin-action-edit" title="Edit">
                              <Edit3 size={15} />
                            </button>
                            <button onClick={() => setDeleteConfirm([b.id])} className="admin-action-btn admin-action-delete" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* ── Results Count ── */}
        {!loading && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="admin-results-count"
          >
            Showing {bookings.length} application{bookings.length !== 1 ? 's' : ''}
          </motion.div>
        )}
      </main>

      {/* ── Modals ── */}
      <AnimatePresence>
        {editBooking && (
          <EditModal
            booking={editBooking}
            onClose={() => setEditBooking(null)}
            onSave={() => {
              setEditBooking(null);
              showToast('Application updated successfully');
              fetchBookings();
              fetchStats();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewBooking && (
          <ViewModal
            booking={viewBooking}
            onClose={() => setViewBooking(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <DeleteConfirm
            count={deleteConfirm.length}
            loading={deleting}
            onCancel={() => setDeleteConfirm(null)}
            onConfirm={() => handleDelete(deleteConfirm)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`admin-toast ${toast.type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}
          >
            {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
