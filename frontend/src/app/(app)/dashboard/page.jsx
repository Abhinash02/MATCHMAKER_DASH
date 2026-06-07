'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import { formatAge, formatIncome, statusColor, genderIcon } from '../../../utils/format';

export default function Dashboard() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, ...(search && { search }), ...(gender && { gender }), ...(status && { status }) };
      const { data } = await api.get('/customers', { params });
      setCustomers(data.customers);
      setPages(data.pages);
      setTotal(data.total);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  }, [page, search, gender, status]);

  useEffect(() => { api.get('/stats').then(r => setStats(r.data)).catch(() => {}); }, []);
  useEffect(() => { setPage(1); }, [search, gender, status]);
  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this profile?')) return;
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Profile deleted');
      fetchCustomers();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Manage your matchmaking clients</p>
        <Link href="/customers/new" className="btn-primary flex items-center gap-1.5 text-sm">
          <span>+</span> <span className="hidden sm:inline">New Profile</span><span className="sm:hidden">New</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Clients', value: stats.total ?? '—', color: 'rose' },
          { label: 'Active', value: stats.active ?? '—', color: 'emerald' },
          { label: 'Matched', value: stats.matched ?? '—', color: 'blue' },
          { label: 'Matches Sent', value: stats.totalMatchesSent ?? '—', color: 'purple' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <input
          className="input flex-1 min-w-48"
          placeholder="Search by name, city, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input w-36" value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select className="input w-36" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="matched">Matched</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="card overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-lg mb-2">No profiles found</p>
            <Link href="/customers/new" className="text-rose-600 text-sm font-medium">Create the first one →</Link>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Name', 'Age / City', 'Status', 'Designation', 'Matches', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => (
                <tr key={c._id} onClick={() => router.push(`/customers/${c._id}`)}
                  className="hover:bg-rose-50/30 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-gray-400">{genderIcon(c.gender)} {c.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <p>{formatAge(c.dateOfBirth)} yrs</p>
                    <p className="text-xs text-gray-400">{c.city}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <p>{c.designation || '—'}</p>
                    <p className="text-xs text-gray-400">{formatIncome(c.income)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-700 font-semibold">{c.matchesSent || 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => router.push(`/customers/${c._id}/edit`)}
                        className="text-xs text-gray-500 hover:text-rose-600 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors">
                        Edit
                      </button>
                      <button onClick={e => handleDelete(c._id, e)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <p>{total} total profiles</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-1 px-3 text-xs disabled:opacity-40">← Prev</button>
              <span className="py-1 px-3">Page {page} of {pages}</span>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="btn-secondary py-1 px-3 text-xs disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
