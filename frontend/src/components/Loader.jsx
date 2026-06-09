'use client';

export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="premium-loader">
      <div className="spinner-ring">
        <span className="spinner-heart">♥</span>
      </div>
      <p className="text-sm font-medium text-gray-500 tracking-wide animate-pulse mt-2">{label}</p>
    </div>
  );
}
