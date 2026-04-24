import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import type { Testimonial } from '../database.types'

export interface TestimonialsFilter {
  featured?: boolean
  limit?: number
}

export function useTestimonials(filter?: TestimonialsFilter) {
  const [data, setData] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filterFeatured = filter?.featured
  const filterLimit    = filter?.limit

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        let query = supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })

        if (filterFeatured !== undefined) query = query.eq('featured', filterFeatured)
        if (filterLimit) query = query.limit(filterLimit)

        const { data: rows, error: err } = await query
        if (err) throw err
        if (!cancelled) setData(rows ?? [])
      } catch (e) {
        console.error('useTestimonials:', e)
        if (!cancelled) setError('No se pudieron cargar los testimonios.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [filterFeatured, filterLimit])

  return { data, loading, error }
}
