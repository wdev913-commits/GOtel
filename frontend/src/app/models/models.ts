export interface Hotel {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  stars: number;
  image: string | null;
  created_at: string;
  avg_rating: number | null;
  rooms_count: number;
}

export interface Room {
  id: number;
  hotel: number;
  hotel_name: string;
  title: string;
  price: string;
  capacity: number;
  is_available: boolean;
  image: string | null;
}

export interface Booking {
  id: number;
  user: number;
  room: number;
  room_title: string;
  hotel_name: string;
  user_name: string;
  check_in: string;
  check_out: string;
  created_at: string;
}

export interface Review {
  id: number;
  user: number;
  hotel: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface HotelFilter {
  city?: string;
  stars?: number | string;
  min_price?: number | string;
  max_price?: number | string;
  capacity?: number | string;
  available?: boolean;
}
