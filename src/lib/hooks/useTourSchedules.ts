import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import type { TourSchedule } from '../database.types'

export type ScheduleInput = {
  departure_date: string
  departure_time: string
  max_capacity: number
  active: boolean
}

function normalizeTime(t: string): string {
  return t.length === 5 ? `${t}:00` : t
}

export function useTourSchedules(tourId: string | undefined) {
  const [data, setData] = useState<TourSchedule[]>([])
  const [loading, setLoading] = useState(!!tourId)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!tourId) { setLoading(false); return }

    let cancelled = false
    setLoading(true)
    setError(null)

    supabase
      .from('tour_schedules')
      .select('*')
      .eq('tour_id', tourId)
      .order('departure_date')
      .order('departure_time')
      .then(({ data: rows, error: err }) => {
        if (cancelled) return
        if (err) {
          console.error('useTourSchedules:', err)
          setError('No se pudieron cargar los horarios.')
        } else {
          setData(rows ?? [])
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [tourId, tick])

  return { data, loading, error, reload: () => setTick(t => t + 1) }
}

export async function createSchedule(
  tourId: string,
  input: ScheduleInput
): Promise<TourSchedule> {
  const { data, error } = await supabase
    .from('tour_schedules')
    .insert({
      ...input,
      departure_time: normalizeTime(input.departure_time),
      tour_id: tourId,
      booked_count: 0,
    })
    .select()
    .single()
  if (error) throw error
  return data as TourSchedule
}

export async function updateSchedule(
  id: string,
  input: Partial<ScheduleInput>
): Promise<TourSchedule> {
  const payload = { ...input }
  if (payload.departure_time) {
    payload.departure_time = normalizeTime(payload.departure_time)
  }
  const { data, error } = await supabase
    .from('tour_schedules')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as TourSchedule
}

export async function deleteSchedule(id: string): Promise<void> {
  const { count, error: countErr } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('schedule_id', id)

  if (countErr) throw countErr
  if (count && count > 0) throw new Error('TIENE_BOOKINGS')

  const { error } = await supabase.from('tour_schedules').delete().eq('id', id)
  if (error) throw error
}

export async function toggleScheduleActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('tour_schedules')
    .update({ active })
    .eq('id', id)
  if (error) throw error
}

export function isSchedulePast(s: TourSchedule): boolean {
  return new Date(`${s.departure_date}T${s.departure_time}`) < new Date()
}
