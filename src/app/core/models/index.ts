export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface Game {
  id: number;
  gamesName: string;
  description: string;
  price: number;
  imglink: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CartItem {
  cartItemId: number;
  gameId: number;
  gamesName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  imglink: string;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  grandTotal: number;
}

export interface LoginDto    { username: string; password: string; }
export interface RegisterDto { username: string; password: string; }
export interface LoginResponse { token: string; }

export interface Review {
  id: number;
  gameId: number;
  gameName: string;
  userId: number;
  username: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface CreateReviewDto { 
  boardGameId: number; 
  rating: number; 
  text: string;
  userId: number;
}

export interface GameFormDto { 
  gamesName: string; 
  description: string; 
  price: number; 
  imglink: string; 
}