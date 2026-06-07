'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'New Profile', href: '/customers/new', icon: '+' },
];

const userNav = [
  { label: 'Browse', href: '/browse', icon: '♥' },
];

function HamburgerIcon({ open }) {
  return (
    <div className="flex flex-col justify-center gap-1.5 w-5 h-5">
      <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
      <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
      <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
    </div>
  );
}

function Sidebar({ nav, user, pathname, onClose, onLogout }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">T</div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">TDC Matchmaker</p>
            <p className="text-xs text-gray-400">The Date Crew</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 p-1">✕</button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(item => (
          <Link key={item.href} href={item.href} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith(item.href)
                ? 'bg-rose-50 text-rose-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <button onClick={onLogout} className="text-gray-400 hover:text-red-500 text-sm p-1" title="Logout">⏻</button>
        </div>
      </div>
    </aside>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = user?.role === 'user' ? userNav : adminNav;
  const handleLogout = () => { logout(); router.push('/login'); };

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Page title from nav
  const currentNav = nav.find(n => pathname.startsWith(n.href));
  const pageTitle = currentNav?.label ?? '';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar nav={nav} user={user} pathname={pathname} onLogout={handleLogout} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-50 shadow-xl">
            <Sidebar nav={nav} user={user} pathname={pathname} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Right side: header + content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile/Desktop header */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <HamburgerIcon open={false} />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900 text-sm sm:text-base">{pageTitle}</h1>
          </div>
          {/* Welcome + user pill */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Welcome, <span className="font-semibold text-gray-900">{user?.name?.split(' ')[0]}</span>
            </span>
            <div className="w-7 h-7 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition-colors" title="Logout">⏻</button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
