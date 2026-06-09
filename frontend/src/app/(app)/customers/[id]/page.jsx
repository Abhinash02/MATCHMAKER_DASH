'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../../../api/client';
import { formatAge, formatIncome, formatDate, matchBadgeClass, statusColor } from '../../../../utils/format';
import NoteLog from '../../../../components/NoteLog';
import MatchCard from '../../../../components/MatchCard';
import Loader from '../../../../components/Loader';

export default function CustomerDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [notesCount, setNotesCount] = useState(0);
  const [hasNewNote, setHasNewNote] = useState(false);

  useEffect(() => {
    api.get(`/customers/${id}`).then(r => setCustomer(r.data)).catch(() => toast.error('Profile not found')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    api.get(`/notes/${id}`).then(r => {
      setNotesCount(r.data.length);
      const now = new Date();
      const hasRecent = r.data.some(n => {
        const diffHours = (now - new Date(n.createdAt).getTime()) / (1000 * 60 * 60);
        return diffHours < 24;
      });
      setHasNewNote(hasRecent);
    }).catch(() => {});
  }, [id, activeTab]);

  const loadMatches = async () => {
    setLoadingMatches(true);
    setActiveTab('matches');
    try {
      const { data } = await api.get(`/matches/${id}`);
      setMatches(data);
    } catch { toast.error('Failed to load matches'); }
    finally { setLoadingMatches(false); }
  };

  const handleSendMatch = async (match, introEmail) => {
    try {
      const updated = await api.post(`/matches/${id}`, {
        matchedProfileId: match._id,
        score: match.score,
        label: match.label,
        introEmail,
      });
      setCustomer(updated.data);
      toast.success(`Match sent to ${match.firstName} ${match.lastName}!`);
      setActiveTab('sent');
    } catch { toast.error('Failed to send match'); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this profile permanently?')) return;
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Profile deleted');
      router.push('/dashboard');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="card p-12 max-w-5xl mx-auto mt-6"><Loader label="Loading profile…" /></div>;
  if (!customer) return <div className="p-12 text-center text-gray-400">Profile not found</div>;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'matches', label: 'Find Matches' },
    { id: 'sent', label: `Sent Matches (${customer.sentMatches?.length || 0})` },
    { id: 'notes', label: 'Interaction Log' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:text-rose-600 flex items-center gap-1 mb-4">
        ← Back to Dashboard
      </Link>

      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl font-bold">
              {customer.firstName[0]}{customer.lastName[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{customer.firstName} {customer.lastName}</h1>
              <p className="text-gray-500 text-sm">{formatAge(customer.dateOfBirth)} yrs · {customer.city}{customer.country !== 'India' ? `, ${customer.country}` : ''}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(customer.status)}`}>{customer.status}</span>
                <span className="text-xs text-gray-400 capitalize">{customer.gender}</span>
                <span className="text-xs text-gray-400">{customer.religion}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('notes')}
              className={`btn-secondary text-sm flex items-center gap-1.5 relative transition-all ${
                hasNewNote
                  ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold ring-2 ring-rose-100'
                  : ''
              }`}
            >
              <span>💬 Logs</span>
              {notesCount > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                  hasNewNote ? 'bg-rose-600 text-white animate-pulse' : 'bg-gray-100 text-gray-600'
                }`}>
                  {notesCount}
                </span>
              )}
              {hasNewNote && (
                <>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-600 rounded-full border border-white" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-600 rounded-full border border-white animate-ping" />
                </>
              )}
            </button>
            <Link href={`/customers/${id}/edit`} className="btn-secondary text-sm">Edit</Link>
            <button onClick={handleDelete} className="btn-danger text-sm">Delete</button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 mb-4">
        {tabs.map(tab => (
          <button key={tab.id}
            onClick={() => tab.id === 'matches' ? loadMatches() : setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-rose-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-4">
          {customer.aboutMe && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{customer.aboutMe}</p>
            </div>
          )}
          {customer.partnerExpectations && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Partner Expectations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{customer.partnerExpectations}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoSection title="Personal Details" fields={[
              ['Date of Birth', formatDate(customer.dateOfBirth)],
              ['Age', `${formatAge(customer.dateOfBirth)} years`],
              ['Height', customer.height ? `${customer.height} cm` : '—'],
              ['Marital Status', customer.maritalStatus?.replace('_', ' ')],
              ['Mother Tongue', customer.motherTongue],
              ['Languages', (customer.languagesKnown || []).join(', ') || '—'],
              ['Siblings', customer.siblings ?? '—'],
            ]} />
            <InfoSection title="Contact" fields={[
              ['Email', customer.email],
              ['Phone', customer.phone],
              ['City', customer.city],
              ['Country', customer.country],
            ]} />
            <InfoSection title="Career & Education" fields={[
              ['Designation', customer.designation],
              ['Company', customer.currentCompany],
              ['Income', formatIncome(customer.income)],
              ['Degree', customer.degree],
              ['College', customer.undergraduateCollege],
              ['Education Tier', customer.educationTier],
            ]} />
            <InfoSection title="Values & Lifestyle" fields={[
              ['Religion', customer.religion],
              ['Caste', customer.caste],
              ['Manglik', customer.manglik],
              ['Family Type', customer.familyType],
              ['Diet', customer.diet],
              ['Smoking', customer.smoking],
              ['Drinking', customer.drinking],
            ]} />
            <InfoSection title="Preferences" fields={[
              ['Want Kids', customer.wantKids],
              ['Have Kids', customer.haveKids],
              ['Open to Relocate', customer.openToRelocate],
              ['Open to Pets', customer.openToPets],
            ]} />
            {customer.hobbies?.length > 0 && (
              <div className="card p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                  {customer.hobbies.map(h => (
                    <span key={h} className="bg-rose-50 text-rose-700 text-xs px-3 py-1 rounded-full font-medium">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div>
          {loadingMatches ? (
            <div className="card p-12"><Loader label="Finding best matches with AI…" /></div>
          ) : matches.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No matches found</div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">Top {matches.length} matches ranked by compatibility score</p>
              {matches.map(m => <MatchCard key={m._id} match={m} client={customer} onSend={handleSendMatch} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div>
          {!customer.sentMatches?.length ? (
            <div className="p-12 text-center text-gray-400">No matches sent yet</div>
          ) : (
            <div className="space-y-3">
              {customer.sentMatches.map(m => (
                <div key={m._id} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                        {m.matchedName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{m.matchedName}</p>
                        <p className="text-xs text-gray-400">{formatDate(m.sentAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{m.score}</span>
                      <span className={matchBadgeClass(m.label)}>{m.label}</span>
                    </div>
                  </div>
                  {m.introEmail && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 italic">
                      "{m.introEmail}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && <NoteLog customerId={id} />}
    </div>
  );
}

function InfoSection({ title, fields }) {
  return (
    <div className="card p-5">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{title}</h3>
      <dl className="space-y-2">
        {fields.map(([label, value]) => value && value !== '—' && (
          <div key={label} className="flex justify-between text-sm">
            <dt className="text-gray-500">{label}</dt>
            <dd className="text-gray-900 font-medium text-right capitalize">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
