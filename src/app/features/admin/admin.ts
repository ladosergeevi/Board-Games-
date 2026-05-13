import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GamesService } from '../../core/services/games.service';
import { ToastService } from '../../core/services/toast.service';
import { Game } from '../../core/models';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  private gamesSvc = inject(GamesService);
  private toast    = inject(ToastService);
  private fb       = inject(FormBuilder);

  loading    = signal(true);
  submitting = signal(false);
  games      = signal<Game[]>([]);
  editingId  = signal<number | null>(null);

  form = this.fb.group({
    gamesName:   ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', Validators.required],
    price:       [null as number | null, [Validators.required, Validators.min(1), Validators.max(1000)]],
    imglink:     ['']
  });

  get previewUrl() { return this.form.get('imglink')?.value || ''; }

  ngOnInit() {
    this.gamesSvc.getAll().subscribe({
      next: r => { this.games.set(r.data ?? []); this.loading.set(false); },
      error: ()  => this.loading.set(false)
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    const dto = this.form.value as any;

    const req = this.editingId()
      ? this.gamesSvc.update(this.editingId()!, dto)
      : this.gamesSvc.create(dto);

    req.subscribe({
      next: r => {
        if (this.editingId()) {
          this.games.update(gs => gs.map(g => g.id === this.editingId() ? r.data : g));
          this.toast.success('Game updated');
        } else {
          this.games.update(gs => [...gs, r.data]);
          this.toast.success('Game added');
        }
        this.form.reset();
        this.editingId.set(null);
        this.submitting.set(false);
      },
      error: () => { this.toast.error('Save failed'); this.submitting.set(false); }
    });
  }

  startEdit(game: Game) {
    this.editingId.set(game.id);
    this.form.patchValue({ gamesName: game.gamesName, description: game.description, price: game.price, imglink: game.imglink });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() { this.editingId.set(null); this.form.reset(); }

  deleteGame(game: Game) {
    if (!confirm(`Delete "${game.gamesName}"?`)) return;
    this.gamesSvc.delete(game.id).subscribe({
      next:  () => { this.games.update(gs => gs.filter(g => g.id !== game.id)); this.toast.success('Game deleted'); },
      error: () => this.toast.error('Failed to delete game')
    });
  }

  imgFallback(e: Event)   { (e.target as HTMLImageElement).style.display = 'none'; }
  previewError(e: Event)  { (e.target as HTMLImageElement).style.display = 'none'; }
}
