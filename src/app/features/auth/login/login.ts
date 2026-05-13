import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private cart   = inject(CartService);
  private toast  = inject(ToastService);
  private router = inject(Router);
  private cdr    = inject(ChangeDetectorRef);

  loading = false;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.cdr.detectChanges();
    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.cart.load().subscribe();
        this.toast.success('Welcome back!');
        this.router.navigate(['/']);
      },
      error: () => {
        this.toast.error('Invalid username or password');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}