import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiResponse, LoginDto, LoginResponse, RegisterDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'bg_token';

  readonly isLoggedIn = signal(this.hasToken());
  readonly isAdmin    = signal(this.checkAdmin());

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginDto) {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, dto)
      .pipe(tap(res => {
        // Backend returns token directly (not wrapped) — handle both cases
        const token = (res as any)?.token ?? res?.data?.token;
        if (token) {
          localStorage.setItem(this.TOKEN_KEY, token);
          this.isLoggedIn.set(true);
          this.isAdmin.set(this.checkAdmin());
        }
      }));
  }

  register(dto: RegisterDto) {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, dto);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    this.router.navigate(['/']);
  }

  getToken() { return localStorage.getItem(this.TOKEN_KEY); }

  private hasToken() { return !!localStorage.getItem(this.TOKEN_KEY); }

  private checkAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const p = JSON.parse(atob(token.split('.')[1]));
      const role = p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? p['role'];
      return role === 'Admin';
    } catch { return false; }
  }
}
