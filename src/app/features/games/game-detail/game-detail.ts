import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GamesService } from '../../../core/services/games.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Game, Review } from '../../../core/models';

@Component({
  selector: 'app-game-detail',
  imports: [RouterLink, FormsModule],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss'
})
export class GameDetail implements OnInit {
  private route      = inject(ActivatedRoute);
  private gamesSvc   = inject(GamesService);
  private reviewsSvc = inject(ReviewsService);
  private cartSvc    = inject(CartService);
  auth               = inject(AuthService);
  private toast      = inject(ToastService);

  loading        = signal(true);
  reviewsLoading = signal(true);
  game           = signal<Game | null>(null);
  reviews        = signal<Review[]>([]);
  adding         = signal(false);

  qty        = 1;
  newRating  = 0;
  newComment = '';
  currentUserId = 0;

  editingReviewId: number | null = null;
  editComment = '';
  editRating = 0;

  stars = [1, 2, 3, 4, 5];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const token = this.auth.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = Number(payload['userId']);
    }

    this.gamesSvc.getById(id).subscribe({
      next: r => { this.game.set(r.data); this.loading.set(false); },
      error: ()  => this.loading.set(false)
    });

    this.reviewsSvc.getAll().subscribe({
      next: r => {
        this.reviews.set((r.data ?? []).filter((x: any) => x.gameName === this.game()?.gamesName));
        this.reviewsLoading.set(false);
      },
      error: () => this.reviewsLoading.set(false)
    });
  }

  decQty() { if (this.qty > 1)  this.qty--; }
  incQty() { if (this.qty < 99) this.qty++; }

  addToCart() {
    if (!this.auth.isLoggedIn()) { this.toast.info('Sign in to add items to cart'); return; }
    this.adding.set(true);
    this.cartSvc.addItem(this.game()!.id, this.qty).subscribe({
      next: () => { this.toast.success('Added to cart!'); this.adding.set(false); },
      error: () => { this.toast.error('Failed to add');   this.adding.set(false); }
    });
  }

  submitReview() {
    if (!this.auth.isLoggedIn()) { this.toast.info('Sign in to leave a review'); return; }
    if (this.newRating === 0) { this.toast.info('Please select a rating'); return; }

    this.reviewsSvc.create({
      boardGameId: this.game()!.id,
      rating: this.newRating,
      text: this.newComment,
      userId: this.currentUserId
    }).subscribe({
      next: r => {
        this.reviews.update(list => [r.data, ...list]);
        this.newComment = '';
        this.newRating = 0;
        this.toast.success('Review published!');
      },
      error: () => this.toast.error('Failed to publish review')
    });
  }

  deleteReview(id: number) {
    this.reviewsSvc.delete(id).subscribe({
      next: () => {
        this.reviews.update(list => list.filter(r => r.id !== id));
        this.toast.success('Review deleted');
      },
      error: () => this.toast.error('Failed to delete review')
    });
  }

  startEdit(r: any) {
    this.editingReviewId = r.id;
    this.editComment = r.text;
    this.editRating = r.rating;
  }

  cancelEdit() {
    this.editingReviewId = null;
    this.editComment = '';
    this.editRating = 0;
  }

  saveEdit(id: number) {
    this.reviewsSvc.update(id, { text: this.editComment, rating: this.editRating }).subscribe({
      next: () => {
        this.reviews.update(list => list.map(r =>
          r.id === id ? { ...r, text: this.editComment, rating: this.editRating } : r
        ));
        this.cancelEdit();
        this.toast.success('Review updated!');
      },
      error: () => this.toast.error('Failed to update review')
    });
  }

  setRating(val: number) { this.newRating = val; }
  clearRating() { this.newRating = 0; }

  imgFallback(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }
}