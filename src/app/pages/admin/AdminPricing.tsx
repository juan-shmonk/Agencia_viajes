import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react'
import { pricingService } from '../../../services/pricingService'
import { toursService } from '../../../services/toursService'
import type { TourPrice, Tour, PriceType, Currency } from '../../../lib/types/database'

const TYPE_LABELS: Record<PriceType, string> = {
  adult: 'Adulto',
  child: 'Niño',
  group: 'Grupo',
  private: 'Privado',
}

const TYPE_COLORS: Record<PriceType, string> = {
  adult: 'bg-blue-100 text-blue-700',
  child: 'bg-green-100 text-green-700',
  group: 'bg-purple-100 text-purple-700',
  private: 'bg-orange-100 text-orange-700',
}

interface PriceWithTour extends TourPrice {
  tour?: { id: string; title: string; slug: string }
}

export function AdminPricing() {
  const [prices, setPrices] = useState<PriceWithTour[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [tourFilter, setTourFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    tour_id: '',
    label: '',
    type: 'adult' as PriceType,
    currency: 'USD' as Currency,
    amount: '',
    min_pax: '1',
  })

  async function load() {
    setLoading(true)
    try {
      const [p, t] = await Promise.all([
        pricingService.getAll(false),
        toursService.getAll(true),
      ])
      setPrices(p as PriceWithTour[])
      setTours(t)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este precio?')) return
    await pricingService.delete(id)
    setPrices(prev => prev.filter(p => p.id !== id))
  }

  async function handleToggle(price: TourPrice) {
    const updated = await pricingService.toggleActive(price.id, !price.is_active)
    setPrices(prev => prev.map(p => p.id === price.id ? { ...p, ...updated } : p))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await pricingService.create({
      tour_id: form.tour_id,
      label: form.label,
      type: form.type,
      currency: form.currency,
      amount: parseFloat(form.amount),
      min_pax: parseInt(form.min_pax),
    })
    setShowForm(false)
    setForm({ tour_id: '', label: '', type: 'adult', currency: 'USD', amount: '', min_pax: '1' })
    load()
  }

  const filtered = tourFilter === 'all' ? prices : prices.filter(p => p.tour_id === tourFilter)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Precios</h1>
          <p className="text-sm text-gray-500">{prices.length} precios configurados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo precio
        </button>
      </div>

      {/* New price form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Agregar precio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Tour *</label>
              <select
                required
                value={form.tour_id}
                onChange={e => setForm(f => ({ ...f, tour_id: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un tour</option>
                {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Etiqueta *</label>
              <input
                required
                type="text"
                placeholder="ej. Adulto, Niño (4-12)"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Tipo *</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as PriceType }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(Object.keys(TYPE_LABELS) as PriceType[]).map(t => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Moneda *</label>
              <select
                value={form.currency}
                onChange={e => setForm(f => ({ ...f, currency: e.target.value as Currency }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD (Dólares)</option>
                <option value="MXN">MXN (Pesos)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Precio *</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Mín. personas</label>
              <input
                type="number"
                min="1"
                value={form.min_pax}
                onChange={e => setForm(f => ({ ...f, min_pax: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar precio
            </button>
          </div>
        </form>
      )}

      {/* Filter by tour */}
      <div>
        <select
          value={tourFilter}
          onChange={e => setTourFilter(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los tours</option>
          {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <DollarSign size={32} className="mx-auto mb-2 opacity-30" />
            <p>No hay precios configurados</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Tour</th>
                <th className="px-4 py-3">Etiqueta</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3 hidden md:table-cell">Mín. Pax</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(price => (
                <tr key={price.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">
                    {price.tour?.title ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{price.label}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[price.type]}`}>
                      {TYPE_LABELS[price.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    ${price.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {price.currency}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">{price.min_pax}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(price)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors
                        ${price.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {price.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Editar"
                        className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(price.id)}
                        title="Eliminar"
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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
