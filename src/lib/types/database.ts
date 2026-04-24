export type UserRole = 'admin' | 'customer' | 'guide'
export type TourCategory = 'Playa' | 'Cenotes' | 'Arqueológico' | 'Eco-Aventura' | 'Islas' | 'Acuático' | 'Nocturno'
export type TourDifficulty = 'fácil' | 'moderado' | 'difícil'
export type PriceType = 'adult' | 'child' | 'group' | 'private'
export type Currency = 'USD' | 'MXN'
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partial'
export type PaymentMethod = 'stripe' | 'cash' | 'transfer' | 'paypal'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  nationality: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Tour {
  id: string
  slug: string
  title: string
  short_description: string | null
  description: string | null
  category: TourCategory
  location: string
  departure_point: string | null
  duration_hours: number | null
  max_capacity: number
  min_age: number
  difficulty: TourDifficulty
  includes: string[] | null
  excludes: string[] | null
  what_to_bring: string[] | null
  images: string[] | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface TourPrice {
  id: string
  tour_id: string
  label: string
  type: PriceType
  currency: Currency
  amount: number
  min_pax: number
  valid_from: string | null
  valid_to: string | null
  is_active: boolean
  created_at: string
}

export interface TourAvailability {
  id: string
  tour_id: string
  date: string
  start_time: string
  spots_total: number
  spots_booked: number
  is_available: boolean
  notes: string | null
}

export interface Reservation {
  id: string
  reservation_code: string
  user_id: string | null
  tour_id: string
  availability_id: string | null
  guests_adult: number
  guests_child: number
  total_amount: number | null
  currency: Currency
  status: ReservationStatus
  payment_status: PaymentStatus
  contact_name: string
  contact_email: string
  contact_phone: string | null
  special_requests: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
  tour?: Tour
  profile?: Profile
}

export interface Payment {
  id: string
  reservation_id: string
  amount: number
  currency: string
  method: PaymentMethod | null
  status: string
  stripe_payment_intent: string | null
  receipt_url: string | null
  notes: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> }
      tours: { Row: Tour; Insert: Omit<Tour, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Tour> }
      tour_prices: { Row: TourPrice; Insert: Omit<TourPrice, 'id' | 'created_at'>; Update: Partial<TourPrice> }
      tour_availability: { Row: TourAvailability; Insert: Omit<TourAvailability, 'id'>; Update: Partial<TourAvailability> }
      reservations: { Row: Reservation; Insert: Omit<Reservation, 'id' | 'reservation_code' | 'created_at' | 'updated_at'>; Update: Partial<Reservation> }
      payments: { Row: Payment; Insert: Omit<Payment, 'id' | 'created_at'>; Update: Partial<Payment> }
    }
  }
}
