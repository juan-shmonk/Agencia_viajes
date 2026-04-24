import { supabase } from '../lib/supabase'
import type { Profile, UserRole } from '../lib/types/database'

export const usersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Profile[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Profile
  },

  async updateRole(id: string, role: UserRole) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Profile
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Profile
  },

  async getStats() {
    const { data, error } = await supabase.from('profiles').select('role, created_at')
    if (error) throw error
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    return {
      total: data.length,
      admins: data.filter(p => p.role === 'admin').length,
      customers: data.filter(p => p.role === 'customer').length,
      guides: data.filter(p => p.role === 'guide').length,
      newThisMonth: data.filter(p => p.created_at >= thisMonth).length,
    }
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return usersService.getById(user.id)
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}
