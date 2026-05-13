import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/games/game-list/game-list').then(m => m.GameList)
  },
  {
    path: 'games/:id',
    loadComponent: () => import('./features/games/game-detail/game-detail').then(m => m.GameDetail)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cart/cart').then(m => m.Cart)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin').then(m => m.Admin)
  },
  { path: '**', redirectTo: '' }
];
