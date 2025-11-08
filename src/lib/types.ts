export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone?: string | null;
  role: 'customer' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  description?: string | null;
  price_per_night: number;
  max_guests: number;
  amenities: string[];
  image_url?: string | null;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string | null;
  created_at?: string;
  updated_at?: string;
  room?: Room;
}

export interface SessionUser {
  id: string;
  email: string;
  full_name?: string;
}
