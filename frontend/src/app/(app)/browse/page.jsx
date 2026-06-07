'use client';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import { formatAge, formatIncome } from '../../../utils/format';

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Chandigarh'];

export default function Browse() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [religion, setReligion] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...(search && { search }), ...(religion && { religion }), ...(city && { city }) };
      const { data } = await api.get('/browse', { params });
      setProfiles(data.profiles);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load profiles'); }
    finally { setLoading(false); }
  }, [page, search, religion, city]);

  useEffect(() => { setPage(1); }, [search, religion, city]);
  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const findMatches = async (profileId) => {
    setLoadingMatches(true);
    try {
      const { data } = await api.get(`/matches/${profileId}`);
      setMatches(data);
    } catch { toast.error('Failed to find matches'); }
    finally { setLoadingMatches(false); }
  };

  if (selected) {
    return (
      <ProfileDetail
        profile={selected}
        matches={matches}
        loadingMatches={loadingMatches}
        onFindMatches={() => findMatches(selected._id)}
        onBack={() => { setSelected(null); setMatches([]); }}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <p className="text-sm text-gray-500">{total} profiles found · browse and connect</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input className="input flex-1" placeholder="Search by name, city, profession…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-3">
          <select className="input flex-1 sm:w-36" value={religion} onChange={e => setReligion(e.target.value)}>
            <option value="">All Religions</option>
            {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="input flex-1 sm:w-36" value={city} onChange={e => setCity(e.target.value)}>
            <option value="">All Cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">💔</p>
          <p className="text-lg font-medium">No profiles found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map(p => (
            <ProfileCard key={p._id} profile={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-1.5 px-4 text-sm disabled:opacity-40">← Prev</button>
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="btn-secondary py-1.5 px-4 text-sm disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
}

function ProfileCard({ profile, onClick }) {
  const age = formatAge(profile.dateOfBirth);
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <button onClick={onClick} className="card p-5 text-left hover:shadow-md hover:border-rose-200 transition-all w-full group">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 group-hover:text-rose-700 transition-colors truncate">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-xs text-gray-500">{age} yrs · {profile.city}</p>
          <p className="text-xs text-gray-400">{profile.religion}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-gray-600">
        {profile.designation && (
          <div className="flex items-center gap-1.5">
            <span>💼</span><span className="truncate">{profile.designation}</span>
          </div>
        )}
        {profile.income && (
          <div className="flex items-center gap-1.5">
            <span>💰</span><span>{formatIncome(profile.income)}</span>
          </div>
        )}
        {profile.diet && (
          <div className="flex items-center gap-1.5">
            <span>{['vegetarian','vegan','jain'].includes(profile.diet) ? '🥗' : '🍖'}</span>
            <span className="capitalize">{profile.diet}</span>
          </div>
        )}
      </div>

      {profile.hobbies?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {profile.hobbies.slice(0, 3).map(h => (
            <span key={h} className="bg-rose-50 text-rose-600 text-xs px-2 py-0.5 rounded-full">{h}</span>
          ))}
          {profile.hobbies.length > 3 && (
            <span className="text-xs text-gray-400">+{profile.hobbies.length - 3}</span>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-rose-600 font-medium group-hover:text-rose-700">
        View Profile →
      </div>
    </button>
  );
}

function ProfileDetail({ profile, matches, loadingMatches, onFindMatches, onBack }) {
  const age = formatAge(profile.dateOfBirth);
  const myMatch = matches.find(m => m._id === profile._id);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-rose-600 flex items-center gap-1 mb-4">
        ← Back to Browse
      </button>

      <div className="card p-5 sm:p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700 flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{age} yrs · {profile.city} · {profile.religion}</p>
            {profile.designation && <p className="text-sm text-gray-600 mt-1 truncate">💼 {profile.designation}</p>}
          </div>
        </div>
      </div>

      {profile.aboutMe && (
        <div className="card p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{profile.aboutMe}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="card p-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Personal</h4>
          <dl className="space-y-2 text-sm">
            {[['Height', profile.height ? `${profile.height} cm` : null],
              ['Marital Status', profile.maritalStatus?.replace('_', ' ')],
              ['Family Type', profile.familyType],
              ['Diet', profile.diet],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <dt className="text-gray-500 flex-shrink-0">{k}</dt>
                <dd className="text-gray-900 font-medium capitalize text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="card p-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Career</h4>
          <dl className="space-y-2 text-sm">
            {[['Income', formatIncome(profile.income)],
              ['Education', profile.educationTier],
              ['Degree', profile.degree],
            ].filter(([, v]) => v && v !== '—').map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <dt className="text-gray-500 flex-shrink-0">{k}</dt>
                <dd className="text-gray-900 font-medium capitalize text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {profile.hobbies?.length > 0 && (
        <div className="card p-5 mb-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Hobbies</h4>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map(h => (
              <span key={h} className="bg-rose-50 text-rose-700 text-xs px-3 py-1 rounded-full font-medium">{h}</span>
            ))}
          </div>
        </div>
      )}

      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">AI Compatibility Check</h3>
            <p className="text-xs text-gray-500 mt-0.5">See how compatible you are with this person</p>
          </div>
          <button onClick={onFindMatches} disabled={loadingMatches} className="btn-primary disabled:opacity-50 whitespace-nowrap">
            {loadingMatches ? 'Analysing…' : '✨ Check Match'}
          </button>
        </div>
        {matches.length > 0 && (
          myMatch ? (
            <div className="bg-rose-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-rose-600">{myMatch.score}</span>
                <div>
                  <p className="font-semibold text-gray-900">{myMatch.label}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {myMatch.reasons?.map(r => (
                      <span key={r} className="text-xs bg-white text-rose-700 px-2 py-0.5 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">This person isn&apos;t in your top matches.</p>
          )
        )}
      </div>
    </div>
  );
}
