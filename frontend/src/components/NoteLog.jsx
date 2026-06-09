'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { formatDate } from '../utils/format';

const NOTE_TYPES = ['general', 'call', 'meeting', 'email'];
const typeIcon = { general: '📝', call: '📞', meeting: '🤝', email: '✉️' };
const typeColor = {
  general: 'bg-gray-100 text-gray-700',
  call: 'bg-blue-100 text-blue-700',
  meeting: 'bg-purple-100 text-purple-700',
  email: 'bg-amber-100 text-amber-700',
};

export default function NoteLog({ customerId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [type, setType] = useState('general');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState('general');

  const fetchNotes = async () => {
    try {
      const { data } = await api.get(`/notes/${customerId}`);
      setNotes(data);
    } catch { toast.error('Failed to load notes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotes(); }, [customerId]);

  const handleAdd = async e => {
    e.preventDefault();
    if (!content.trim()) return;
    setAdding(true);
    try {
      await api.post('/notes', { customerId, content: content.trim(), type });
      setContent('');
      setType('general');
      await fetchNotes();
      toast.success('Note added');
    } catch { toast.error('Failed to add note'); }
    finally { setAdding(false); }
  };

  const handleEdit = async (id) => {
    try {
      await api.patch(`/notes/${id}`, { content: editContent, type: editType });
      setEditingId(null);
      await fetchNotes();
      toast.success('Note updated');
    } catch { toast.error('Failed to update note'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      await fetchNotes();
      toast.success('Note deleted');
    } catch { toast.error('Failed to delete note'); }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditContent(note.content);
    setEditType(note.type);
  };

  return (
    <div className="space-y-4">
      {/* Add Note */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Add Interaction Note</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {NOTE_TYPES.map(t => (
              <button type="button" key={t}
                onClick={() => setType(t)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                  type === t ? typeColor[t] + ' border-transparent' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                {typeIcon[t]} {t}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your note here… (call outcome, meeting summary, follow-up action)"
            rows={3}
            className="input resize-none"
          />
          <button type="submit" disabled={adding || !content.trim()} className="btn-primary">
            {adding ? 'Adding…' : '+ Add Note'}
          </button>
        </form>
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading notes…</div>
      ) : notes.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No interaction notes yet</div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note._id} className="card p-4">
              {editingId === note._id ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {NOTE_TYPES.map(t => (
                      <button type="button" key={t}
                        onClick={() => setEditType(t)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                          editType === t ? typeColor[t] + ' border-transparent' : 'bg-white border-gray-200 text-gray-500'
                        }`}>
                        {typeIcon[t]} {t}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={3} className="input resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(note._id)} className="btn-primary text-sm py-1.5">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary text-sm py-1.5">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${typeColor[note.type]}`}>
                        {typeIcon[note.type]} {note.type}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(note.createdAt)}</span>
                      {note.updatedAt !== note.createdAt && <span className="text-xs text-gray-400">(edited)</span>}
                    </div>
                    <div className="flex gap-1 self-end sm:self-auto">
                      <button
                        onClick={() => startEdit(note)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-rose-600 font-medium px-2.5 py-1.5 rounded-md hover:bg-rose-50 transition-colors border border-gray-200 hover:border-rose-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors border border-red-100 hover:border-red-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
