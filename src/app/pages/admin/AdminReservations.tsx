import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { reservationsService } from '../../../services/reservationsService'
import type { Reservation, ReservationStatus, PaymentStatus } from '../../../lib/types/database'

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
  no_show: 'No presentó',
}

const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  no_show: 'bg-gray-100 text-gray-500',
}

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  unpaid: 'bg-red-50 text-red-600',
  paid: 'bg-green-50 text-green-600',
  refunded: 'bg-gray-100 text-gray-500',
  partial: 'bg-orange-50 text-orange-600',
}

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'Sin pagar',
  paid: 'Pagado',
  refunded: 'Reembolsado',
  partial: 'Parcial',
}

export function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all')
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await reservationsService.getAll()
        setReservations(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleStatusChange(id: string, status: ReservationStatus) {
    await reservationsService.updateStatus(id, status)
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    )
  }

  async function handlePaymentChange(id: string, payment_status: PaymentStatus) {
    await reservationsService.updatePaymentStatus(id, payment_status)
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, payment_status } : r)
    )
  }

  const filtered = reservations.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (paymentFilter !== 'all' && r.payment_status !== paymentFilter) return false
    if (search) {
      const s = search.toLowerCase()
      return (
        r.contact_name.toLowerCase().includes(s) ||
        r.contact_email.toLowerCase().includes(s) ||
        r.reservation_code.toLowerCase().includes(s)
      )
    }
    return true
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reservaciones</h1>
        <p className="text-sm text-gray-500">{reservations.length} reservaciones totales</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ReservationStatus | 'all')}
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value as PaymentStatus | 'all')}
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los pagos</option>
          {(Object.keys(PAYMENT_LABELS) as PaymentStatus[]).map(s => (
            <option key={s} value={s}>{PAYMENT_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p>No se encontraron reservaciones</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3 hidden md:table-cell">Tour</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Pax</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Pago</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.reservation_code}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{r.contact_name}</p>
                      <p className="text-xs text-gray-400">{r.contact_email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                      {(r as Reservation & { tour?: { title: string } }).tour?.title ?? r.tour_id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                      {r.guests_adult}A {r.guests_child > 0 && `+ ${r.guests_child}N`}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell font-medium text-gray-900">
                      {r.total_amount
                        ? `$${r.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${r.currency}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={e => handleStatusChange(r.id, e.target.value as ReservationStatus)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 ${STATUS_COLORS[r.status]}`}
                      >
                        {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.payment_status}
                        onChange={e => handlePaymentChange(r.id, e.target.value as PaymentStatus)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 ${PAYMENT_COLORS[r.payment_status]}`}
                      >
                        {(Object.keys(PAYMENT_LABELS) as PaymentStatus[]).map(s => (
                          <option key={s} value={s}>{PAYMENT_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
