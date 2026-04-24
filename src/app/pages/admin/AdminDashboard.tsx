import { useEffect, useState } from 'react'
import { Map, CalendarCheck, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { reservationsService } from '../../../services/reservationsService'
import { toursService } from '../../../services/toursService'
import { usersService } from '../../../services/usersService'

interface Stats {
  reservations: Awaited<ReturnType<typeof reservationsService.getDashboardStats>>
  tours: Awaited<ReturnType<typeof toursService.getStats>>
  users: Awaited<ReturnType<typeof usersService.getStats>>
}

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [reservations, tours, users] = await Promise.all([
          reservationsService.getDashboardStats(),
          toursService.getStats(),
          usersService.getStats(),
        ])
        setStats({ reservations, tours, users })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border h-28" />
        ))}
      </div>
    )
  }

  if (!stats) return null

  const { reservations, tours, users } = stats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general de la plataforma</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Ingresos este mes"
          value={`$${reservations.monthRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="USD — reservaciones pagadas"
          color="bg-green-500"
        />
        <StatCard
          icon={CalendarCheck}
          label="Reservaciones totales"
          value={reservations.total}
          sub={`${reservations.confirmed} confirmadas`}
          color="bg-blue-500"
        />
        <StatCard
          icon={Map}
          label="Tours activos"
          value={tours.active}
          sub={`${tours.total} en total`}
          color="bg-purple-500"
        />
        <StatCard
          icon={Users}
          label="Usuarios registrados"
          value={users.total}
          sub={`+${users.newThisMonth} este mes`}
          color="bg-orange-500"
        />
      </div>

      {/* Reservation breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Estado de reservaciones</h2>
          <div className="space-y-3">
            {[
              { icon: Clock, label: 'Pendientes', value: reservations.pending, color: 'text-yellow-500' },
              { icon: CheckCircle, label: 'Confirmadas', value: reservations.confirmed, color: 'text-blue-500' },
              { icon: TrendingUp, label: 'Completadas', value: reservations.completed, color: 'text-green-500' },
              { icon: XCircle, label: 'Canceladas', value: reservations.cancelled, color: 'text-red-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={color} />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Tours por categoría</h2>
          <div className="space-y-3">
            {Object.entries(tours.byCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-blue-100 rounded-full w-24">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(count / tours.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-4">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users breakdown */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Usuarios por rol</h2>
        <div className="flex gap-6">
          {[
            { label: 'Clientes', value: users.customers, color: 'bg-blue-100 text-blue-700' },
            { label: 'Administradores', value: users.admins, color: 'bg-red-100 text-red-700' },
            { label: 'Guías', value: users.guides, color: 'bg-green-100 text-green-700' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`px-4 py-2 rounded-lg ${color}`}>
              <p className="text-xs font-medium">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
