import { useAuth } from '../../../lib/AuthContext'

export function AdminDashboard() {
  const { profile } = useAuth()
  const name = profile?.first_name ?? 'Admin'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {name}</h1>
        <p className="text-sm text-gray-500 mt-1">Panel de administración de ReservasTours</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-gray-500">Reservas hoy</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          <p className="text-xs text-gray-400 mt-1">Disponible en Sprint 8</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-gray-500">Tours activos</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          <p className="text-xs text-gray-400 mt-1">Disponible en Sprint 3</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-gray-500">Ingresos del mes</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          <p className="text-xs text-gray-400 mt-1">Disponible en Sprint 8</p>
        </div>
      </div>
    </div>
  )
}
