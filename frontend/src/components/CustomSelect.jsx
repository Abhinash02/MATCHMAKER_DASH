'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import ReactCountryFlag from 'react-country-flag';

export default function CustomSelect({
  value,
  onChange,
  options,          // [{ value, label, isoCode? }]
  placeholder = 'Select…',
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find(o => o.value === value);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector('[data-selected="true"]');
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [open]);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) setOpen(v => !v); }}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg border bg-white text-left transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed border-gray-100 text-gray-400' : 'cursor-pointer border-gray-200 hover:border-rose-400'}
          ${open ? 'border-rose-500 ring-2 ring-rose-500 ring-opacity-30' : 'focus:outline-none focus:ring-2 focus:ring-rose-500'}
        `}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1 truncate">
          {selected ? (
            <>
              {selected.isoCode && (
                <ReactCountryFlag
                  countryCode={selected.isoCode}
                  svg
                  style={{ width: '1.25em', height: '1.25em', borderRadius: '2px', flexShrink: 0 }}
                />
              )}
              <span className="truncate text-gray-900">{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-400 truncate">{placeholder}</span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[220px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type to search…"
                className="bg-transparent text-sm text-gray-700 outline-none flex-1 placeholder-gray-400 min-w-0"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')}
                  className="text-gray-400 hover:text-gray-600 leading-none text-xs flex-shrink-0">✕</button>
              )}
            </div>
          </div>

          {/* Options list */}
          <ul ref={listRef} className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No results for "{query}"</li>
            ) : (
              filtered.map(opt => (
                <li key={opt.value}>
                  <button
                    type="button"
                    data-selected={opt.value === value}
                    onClick={() => handleSelect(opt)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors
                      ${opt.value === value ? 'bg-rose-50 text-rose-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {opt.isoCode && (
                      <ReactCountryFlag
                        countryCode={opt.isoCode}
                        svg
                        style={{ width: '1.25em', height: '1.25em', borderRadius: '2px', flexShrink: 0 }}
                      />
                    )}
                    <span className="truncate flex-1">{opt.label}</span>
                    {opt.value === value && (
                      <svg className="w-4 h-4 text-rose-500 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
