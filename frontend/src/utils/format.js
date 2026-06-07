export function formatAge(dob) {
  if (!dob) return '—';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function formatIncome(income) {
  if (!income) return '—';
  if (income >= 10000000) return `₹${(income / 10000000).toFixed(1)} Cr/yr`;
  if (income >= 100000) return `₹${(income / 100000).toFixed(1)} L/yr`;
  return `₹${income.toLocaleString('en-IN')}/yr`;
}

export function statusColor(status) {
  const map = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-yellow-100 text-yellow-700',
    matched: 'bg-blue-100 text-blue-700',
    inactive: 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-500';
}

export function genderIcon(gender) {
  return gender === 'male' ? '♂' : gender === 'female' ? '♀' : '⚧';
}

export function matchBadgeClass(label) {
  if (label?.includes('Exceptional')) return 'badge-exceptional';
  if (label?.includes('High')) return 'badge-high';
  if (label?.includes('Good')) return 'badge-good';
  return 'badge-possible';
}

export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
