import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.html'
})
export class ToastContainer {
  toastSvc = inject(ToastService);
}
