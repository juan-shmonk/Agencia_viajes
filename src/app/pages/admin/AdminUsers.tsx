import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { usersService } from '../../../services/usersService'
import type { Profile, UserRole } from '../../../lib/types/database'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  customer: 'Cliente',
  guide: 'Guía',
}

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700',
  customer: 'bg-blue-100 text-blue-700',
  guide: 'bg-green-100 text-green-700',
}

export function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await usersService.getAll()
        setUsers(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleRoleChange(id: string, role: UserRole) {
    await usersService.updateRole(id, role)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
  }

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (search) {
      const s = search.toLowerCase()
      return (
        (u.full_name ?? '').toLowerCase().includes(s) ||
        (u.phone ?? '').includes(s)
      )
    }
    return true
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-sm text-gray-500">{users.length} usuarios registrados</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los roles</option>
          {(Object.keys(ROLE_LABELS) as UserRole[]).map(r => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p>No se encontraron usuarios</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3 hidden md:table-cell">Teléfono</th>
                <th className="px-4 py-3 hidden lg:table-cell">Nacionalidad</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3 hidden md:table-cell">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(user.full_name ?? 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name ?? 'Sin nombre'}</p>
                        <p className="text-xs text-gray-400 font-mono">{user.id.slice(0, 12)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                    {user.phone ?? '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                    {user.nationality ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 ${ROLE_COLORS[user.role]}`}
                    >
                      {(Object.keys(ROLE_LABELS) as UserRole[]).map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">
                    {new Date(user.created_at).toLocaleDateString('es-MX', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
