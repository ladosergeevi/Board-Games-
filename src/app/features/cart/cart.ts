import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cart    = inject(CartService);
  toast   = inject(ToastService);
  private router = inject(Router);

  loading = false;

  ngOnInit() {
    this.loading = true;
    this.cart.load().subscribe({
      next:  () => (this.loading = false),
      error: () => { this.toast.error('Failed to load cart'); this.loading = false; }
    });
  }

  changeQty(cartItemId: number, qty: number) {
    if (qty < 1 || qty > 99) return;
    this.cart.updateItem(cartItemId, qty).subscribe({
      error: () => this.toast.error('Failed to update quantity')
    });
  }

  removeItem(cartItemId: number) {
    this.cart.removeItem(cartItemId).subscribe({
      next:  () => this.toast.success('Item removed'),
      error: () => this.toast.error('Failed to remove item')
    });
  }

  clearCart() {
    if (!confirm('Clear the entire cart?')) return;
    this.cart.clear().subscribe({
      next:  () => this.toast.info('Cart cleared'),
      error: () => this.toast.error('Failed to clear cart')
    });
  }

  checkout() {
    this.cart.clear().subscribe({
      next: () => {
        this.toast.success('Order placed successfully!');
        this.router.navigate(['/']);
      },
      error: () => this.toast.error('Failed to place order')
    });
  }

  plural(n: number) {
    return n === 1 ? '1 item' : `${n} items`;
  }
}