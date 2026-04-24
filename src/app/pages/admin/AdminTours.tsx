import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { toursService } from '../../../services/toursService'
import type { Tour, TourCategory } from '../../../lib/types/database'

const CATEGORIES: TourCategory[] = ['Playa', 'Cenotes', 'Arqueológico', 'Eco-Aventura', 'Islas', 'Acuático', 'Nocturno']

const CATEGORY_COLORS: Record<TourCategory, string> = {
  Playa: 'bg-cyan-100 text-cyan-700',
  Cenotes: 'bg-blue-100 text-blue-700',
  Arqueológico: 'bg-amber-100 text-amber-700',
  'Eco-Aventura': 'bg-green-100 text-green-700',
  Islas: 'bg-teal-100 text-teal-700',
  Acuático: 'bg-indigo-100 text-indigo-700',
  Nocturno: 'bg-purple-100 text-purple-700',
}

export function AdminTours() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TourCategory | 'all'>('all')

  async function load() {
    setLoading(true)
    try {
      const data = await toursService.getAll(true)
      setTours(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function toggleActive(tour: Tour) {
    await toursService.toggleActive(tour.id, !tour.is_active)
    setTours(prev => prev.map(t => t.id === tour.id ? { ...t, is_active: !t.is_active } : t))
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este tour permanentemente?')) return
    await toursService.delete(id)
    setTours(prev => prev.filter(t => t.id !== id))
  }

  const filtered = filter === 'all' ? tours : tours.filter(t => t.category === filter)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-sm text-gray-500">{tours.length} tours registrados</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          Nuevo tour
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
        >
          Todos ({tours.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = tours.filter(t => t.category === cat).length
          if (count === 0) return null
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${filter === cat ? 'bg-gray-900 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Map size={32} className="mx-auto mb-2 opacity-30" />
            <p>No hay tours en esta categoría</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Tour</th>
                <th className="px-4 py-3 hidden md:table-cell">Categoría</th>
                <th className="px-4 py-3 hidden md:table-cell">Duración</th>
                <th className="px-4 py-3 hidden lg:table-cell">Capacidad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(tour => (
                <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {tour.is_featured && <Star size={14} className="text-yellow-400 fill-yellow-400 shrink-0" />}
                      <div>
                        <p className="font-medium text-gray-900 leading-tight">{tour.title}</p>
                        <p className="text-xs text-gray-400">{tour.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[tour.category]}`}>
                      {tour.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                    {tour.duration_hours ? `${tour.duration_hours}h` : '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                    {tour.max_capacity} personas
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${tour.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {tour.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(tour)}
                        title={tour.is_active ? 'Desactivar' : 'Activar'}
                        className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {tour.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        title="Editar"
                        className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id)}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Map(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  )
}
