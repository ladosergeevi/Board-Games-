import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private id = 0;

  success(msg: string) { this.push(msg, 'success'); }
  error(msg: string)   { this.push(msg, 'error');   }
  info(msg: string)    { this.push(msg, 'info');     }

  private push(message: string, type: Toast['type'], ms = 3200) {
    const id = ++this.id;
    this.toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), ms);
  }
}
