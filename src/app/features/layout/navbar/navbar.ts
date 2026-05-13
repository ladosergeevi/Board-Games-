import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  auth     = inject(AuthService);
  cart     = inject(CartService);
  menuOpen = signal(false);

  @HostListener('document:keydown.escape')
  onEsc() { this.menuOpen.set(false); }

  closeMenu() { this.menuOpen.set(false); }
  toggleMenu() { this.menuOpen.update(v => !v); }
}
