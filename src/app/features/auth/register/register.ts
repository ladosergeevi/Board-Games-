import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private toast  = inject(ToastService);
  private router = inject(Router);

  loading = false;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: () => { this.toast.success('Account created! Please sign in.'); this.router.navigate(['/auth/login']); },
      error: () => { this.toast.error('Registration failed. Username may already be taken.'); this.loading = false; }
    });
  }
}
