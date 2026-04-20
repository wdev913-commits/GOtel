export interface Hotel {
  id: number;
  name: string;
  location: string;
  stars: number;
  score: number;
  reviews: number;
  price: number;
  old_price?: number;
  badge?: string;
  description: string;
  amenities?: string[];
  tags?: string[];
  image_url?: string;
}

export interface Room {
  id: number;
  hotel: number;
  hotel_name?: string;
  room_number: string;
  room_type: string;
  price: number;
  is_available: boolean;
}

export interface Booking {
  id?: number;
  room: number;
  room_info?: Room;
  hotel_name?: string;
  check_in: string;
  check_out: string;
  guests?: number;
  total_price?: number;
  user?: number;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}
