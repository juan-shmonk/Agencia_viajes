import { useState, useEffect } from 'react'
import { Plus, Trash2, Star } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Skeleton } from '../../components/ui/skeleton'
import type { Testimonial } from '../../../lib/database.types'

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: '',
    featured: true,
  })

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    setTestimonials((data ?? []) as Testimonial[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('testimonials').insert({ ...form })
    setForm({ name: '', location: '', rating: 5, comment: '', featured: true })
    await load()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await supabase.from('testimonials').delete().eq('id', id)
    setTestimonials(prev => prev.filter(t => t.id !== id))
  }

  async function handleToggleFeatured(t: Testimonial) {
    await supabase.from('testimonials').update({ featured: !t.featured }).eq('id', t.id)
    setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, featured: !x.featured } : x))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Testimonios</h1>
        <p className="text-sm text-gray-500 mt-0.5">{testimonials.length} testimonio{testimonials.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCreate} className="bg-white rounded-xl border p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Nuevo testimonio</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="t-name">Nombre</Label>
            <Input id="t-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="t-location">Ubicación</Label>
            <Input id="t-location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="t-comment">Comentario</Label>
          <textarea
            id="t-comment"
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            required
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                  <Star className={`w-5 h-5 ${n <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
              className="accent-primary"
            />
            Destacado en Home
          </label>
        </div>
        <Button type="submit" disabled={saving}>
          <Plus size={16} className="mr-1" />
          {saving ? 'Guardando…' : 'Agregar testimonio'}
        </Button>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl border divide-y">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 m-4 rounded-lg" />)
        ) : testimonials.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">No hay testimonios todavía.</p>
        ) : (
          testimonials.map(t => (
            <div key={t.id} className="flex items-start gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">{t.name}</span>
                  {t.location && <span className="text-xs text-gray-400">· {t.location}</span>}
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{t.comment}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleFeatured(t)}
                  className={`text-xs px-2 py-1 rounded-full border font-medium transition-colors ${
                    t.featured
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'text-gray-400 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t.featured ? 'Destacado' : 'Destacar'}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
