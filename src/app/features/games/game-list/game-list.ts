import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GamesService } from '../../../core/services/games.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Game } from '../../../core/models';

@Component({
  selector: 'app-game-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss'
})
export class GameList implements OnInit {
  private gamesSvc = inject(GamesService);
  private cartSvc  = inject(CartService);
  private authSvc  = inject(AuthService);
  private toast    = inject(ToastService);

  loading  = signal(true);
  allGames = signal<Game[]>([]);
  filtered = signal<Game[]>([]);
  addingId = signal<number | null>(null);

  search   = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy   = '';

  hasFilters = computed(() =>
    !!this.search.trim() || this.minPrice !== null || this.maxPrice !== null || !!this.sortBy
  );

  ngOnInit() {
    this.gamesSvc.getAll().subscribe({
      next: r => { this.allGames.set(r.data ?? []); this.filtered.set(r.data ?? []); this.loading.set(false); },
      error: ()  => { this.toast.error('Failed to load games'); this.loading.set(false); }
    });
  }

  applyFilters() {
    let result = [...this.allGames()];
    if (this.search.trim()) {
      const s = this.search.toLowerCase();
      result = result.filter(g => g.gamesName.toLowerCase().includes(s));
    }
    if (this.minPrice !== null) result = result.filter(g => g.price >= this.minPrice!);
    if (this.maxPrice !== null) result = result.filter(g => g.price <= this.maxPrice!);
    if (this.sortBy === 'price_asc')  result.sort((a, b) => a.price - b.price);
    if (this.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    if (this.sortBy === 'name')       result.sort((a, b) => a.gamesName.localeCompare(b.gamesName));
    this.filtered.set(result);
  }

  resetFilters() {
    this.search = ''; this.minPrice = null; this.maxPrice = null; this.sortBy = '';
    this.filtered.set(this.allGames());
  }

  addToCart(game: Game) {
    if (!this.authSvc.isLoggedIn()) { this.toast.info('Sign in to add items to cart'); return; }
    this.addingId.set(game.id);
    this.cartSvc.addItem(game.id).subscribe({
      next: () => { this.toast.success(`"${game.gamesName}" added to cart`); this.addingId.set(null); },
      error: () => { this.toast.error('Failed to add item');                  this.addingId.set(null); }
    });
  }

  imgFallback(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

  truncate(text: string, max = 80) {
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}
