import { NavLink, Outlet, useNavigate, Navigate } from 'react-router'
import { LayoutDashboard, Map, CalendarCheck, MessageSquare, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../../lib/AuthContext'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/tours', icon: Map, label: 'Tours' },
  { to: '/admin/reservas', icon: CalendarCheck, label: 'Reservas' },
  { to: '/admin/testimonios', icon: MessageSquare, label: 'Testimonios' },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { session, isAdmin, loading, signOut, profile } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  const adminName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
    : 'Admin'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col
          transform transition-transform duration-200
          md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <span className="font-bold text-lg tracking-tight">ReservasTours</span>
          <button
            className="md:hidden p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700 space-y-1">
          <p className="px-3 text-xs text-gray-400 truncate">{adminName}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-4 gap-3 shrink-0">
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm text-gray-500">Panel de Administración</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
