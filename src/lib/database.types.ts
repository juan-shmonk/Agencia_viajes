// Tipos de tus tablas en Supabase
// Los irás expandiendo conforme uses más tablas

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  rol: 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string | null;
  display_order: number;
  created_at: string;
}

export interface Tour {
  id: string;
  title: string;
  location: string;
  description: string | null;
  duration: string;
  category_id: string | null;
  best_seller: boolean;
  cover_image: string | null;
  images: string[];
  included: string[];
  rating: number;
  reviews_count: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourItineraryDay {
  id: string;
  tour_id: string;
  day: number;
  title: string;
  description: string | null;
}

export interface TourRate {
  id: string;
  tour_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourSchedule {
  id: string;
  tour_id: string;
  departure_date: string; // ISO date
  departure_time: string; // "HH:MM:SS"
  max_capacity: number;
  booked_count: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  tour_id: string;
  schedule_id: string;
  rate_id: string;
  travelers: number;
  unit_price: number;
  total_price: number;
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nationality: string | null;
  marketing_consent: boolean;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  confirmation_email_sent_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  comment: string;
  avatar_image: string | null;
  tour_id: string | null;
  featured: boolean;
  created_at: string;
}