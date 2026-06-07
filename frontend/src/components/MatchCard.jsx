'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { formatAge, formatIncome, matchBadgeClass } from '../utils/format';

export default function MatchCard({ match, client, onSend }) {
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [intro, setIntro] = useState('');
  const [loadingIntro, setLoadingIntro] = useState(false);

  const generateIntro = async () => {
    setLoadingIntro(true);
    try {
      const { data } = await api.post('/ai/generate-intro', { client, match });
      setIntro(data.intro);
    } catch { toast.error('Failed to generate intro'); }
    finally { setLoadingIntro(false); }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await onSend(match, intro);
    } finally { setSending(false); }
  };

  const scoreColor = match.score >= 85 ? 'text-emerald-600' : match.score >= 70 ? 'text-blue-600' : match.score >= 55 ? 'text-yellow-600' : 'text-gray-500';

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700 flex items-center justify-center font-bold">
            {match.firstName[0]}{match.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{match.firstName} {match.lastName}</p>
            <p className="text-xs text-gray-500">{formatAge(match.dateOfBirth)} yrs · {match.city} · {match.designation}</p>
            <p className="text-xs text-gray-400">{formatIncome(match.income)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${scoreColor}`}>{match.score}</span>
            <span className={matchBadgeClass(match.label)}>{match.label}</span>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline">
            {expanded ? 'Hide details ↑' : 'View details ↓'}
          </button>
        </div>
      </div>

      {/* Reasons */}
      {match.reasons?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {match.reasons.map(r => (
            <span key={r} className="bg-rose-50 text-rose-700 text-xs px-2 py-0.5 rounded-full">{r}</span>
          ))}
        </div>
      )}

      {/* Expanded */}
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
            <span><strong>Religion:</strong> {match.religion || '—'}</span>
            <span><strong>Diet:</strong> {match.diet || '—'}</span>
            <span><strong>Kids:</strong> {match.wantKids || '—'}</span>
            <span><strong>Family:</strong> {match.familyType || '—'}</span>
            <span><strong>Education:</strong> {match.educationTier || '—'}</span>
            <span><strong>Height:</strong> {match.height ? `${match.height}cm` : '—'}</span>
          </div>

          {/* AI Intro */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500">AI Intro Email</p>
              <button onClick={generateIntro} disabled={loadingIntro}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium disabled:opacity-50 flex items-center gap-1">
                {loadingIntro ? '✨ Generating…' : '✨ Generate with AI'}
              </button>
            </div>
            <textarea
              value={intro}
              onChange={e => setIntro(e.target.value)}
              placeholder="Click 'Generate with AI' or write a custom intro…"
              rows={3}
              className="input text-xs resize-none"
            />
          </div>

          <button onClick={handleSend} disabled={sending}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {sending ? 'Sending…' : '💌 Send Match'}
          </button>
        </div>
      )}
    </div>
  );
}
