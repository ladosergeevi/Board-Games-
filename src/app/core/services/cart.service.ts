import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ApiResponse, Cart } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly url = `${environment.apiUrl}/cart`;

  readonly cart      = signal<Cart | null>(null);
  readonly itemCount = computed(() => this.cart()?.items.reduce((s, i) => s + i.quantity, 0) ?? 0);

  constructor(private http: HttpClient) {}

  load()     { return this.http.get<ApiResponse<Cart>>(this.url).pipe(tap(r => this.cart.set(r.data))); }

  addItem(gameId: number, quantity = 1) {
    return this.http.post<ApiResponse<Cart>>(`${this.url}/items`, { gameId, quantity })
      .pipe(tap(r => this.cart.set(r.data)));
  }

  updateItem(cartItemId: number, quantity: number) {
    return this.http.put<ApiResponse<Cart>>(`${this.url}/items/${cartItemId}`, { quantity })
      .pipe(tap(r => this.cart.set(r.data)));
  }

  removeItem(cartItemId: number) {
    return this.http.delete<ApiResponse<Cart>>(`${this.url}/items/${cartItemId}`)
      .pipe(tap(r => this.cart.set(r.data)));
  }

  clear() {
    return this.http.delete<ApiResponse<null>>(this.url).pipe(tap(() => this.cart.set(null)));
  }
}
