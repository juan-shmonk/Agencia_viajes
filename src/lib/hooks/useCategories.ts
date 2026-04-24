import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import type { Category } from '../database.types'

export function useCategories() {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('display_order')
      .then(({ data: rows, error: err }) => {
        if (err) {
          console.error('useCategories:', err)
          setError('No se pudieron cargar las categorías.')
        } else {
          setData(rows ?? [])
        }
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
