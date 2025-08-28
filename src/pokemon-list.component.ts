import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokeService } from './poke.service';
import { PokemonListItem } from './types';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'pokemon-list',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="controls">
      <input
        type="search"
        placeholder="Buscar por nome ou #ID…"
        [ngModel]="query()"
        (ngModelChange)="search$.next($event)"
        class="search"/>
    </section>

    <section *ngIf="filtered().length; else empty" class="grid">
      <article *ngFor="let p of filtered()" class="card">
        <a [routerLink]="['/pokemon', p.id]" class="card-link" aria-label="Ver detalhes">
          <img [src]="p.image" [alt]="p.name" loading="lazy"/>
          <div class="meta">
            <span class="id">#{{ p.id | number:'3.0' }}</span>
            <h3 class="name">{{ p.name | titlecase }}</h3>
          </div>
        </a>
      </article>
    </section>

    <ng-template #empty>
      <div class="empty" *ngIf="query(); else loadingOrInitial">
        Nenhum Pokémon encontrado para <strong>"{{ query() }}"</strong>.
      </div>
      <ng-template #loadingOrInitial>
        <div class="empty">Digite um nome ou #ID para buscar.</div>
      </ng-template>
    </ng-template>

    <div class="actions" *ngIf="showLoadMore()">
      <button (click)="loadMore()">Carregar mais</button>
    </div>
  `,
  styles: [
    `
   .controls{display:flex;justify-content:center;margin:1rem 0}
   .search{
     width:min(640px,100%);padding:.75rem 1rem;border:2px solid var(--border);
     border-radius:10px;font-size:1rem;background:var(--card);color:var(--text)
   }
   .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem}
   .card{
     background:var(--card);border:2px solid var(--border);border-radius:16px;overflow:hidden;
     transition:transform .12s, box-shadow .12s
   }
   .card:hover{transform:translateY(-2px);box-shadow:var(--shadow)}
   .card-link{display:block;color:inherit;text-decoration:none}
   img{width:100%;aspect-ratio:1/1;object-fit:contain;background:var(--muted-bg)}
   .meta{display:flex;justify-content:space-between;align-items:center;padding:.5rem .75rem}
   .id{font-variant-numeric:tabular-nums;color:var(--muted)}
   .name{margin:0;font-size:1rem}
   .actions{display:flex;justify-content:center;margin:1.5rem 0}
   .actions button{
     border:0;background:var(--accent);color:#fff;padding:.75rem 1rem;border-radius:10px;cursor:pointer;font-weight:700
   }
   .empty{display:flex;justify-content:center;align-items:center;min-height:160px;color:var(--muted)}
 `,
  ],
})
export class PokemonListComponent {
  private pageSize = 30;
  private loaded = signal<PokemonListItem[]>([]);
  private offset = signal(0);
  private allLoaded = signal(false);

  hasMore = signal(true);

  // busca
  query = signal('');
  search$ = new Subject<string>();

  constructor(private api: PokeService) {
    this.loadMore();

    // debounce da busca (300ms) + normalização
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((v) => {
        const val = this.normalize(v);
        this.query.set(val);
        // se começou a buscar e ainda não carregamos tudo, carregue o resto
        if (val && !this.allLoaded()) this.loadAllKanto();
      });

    // controle do "carregar mais"
    effect(() => {
      if (this.loaded().length >= 151) {
        this.hasMore.set(false);
        this.allLoaded.set(true);
      }
    });
  }

  // lista filtrada (começa-com > contém) com acentos normalizados
  filtered = computed(() => {
    const q = this.query();
    if (!q) return this.loaded();

    return this.loaded().filter((p) => {
      const name = this.normalize(p.name);
      const starts = name.startsWith(q);
      const contains = name.includes(q);
      const byId = String(p.id) === q;
      return byId || starts || contains;
    });
  });

  showLoadMore = computed(
    () => this.hasMore() && !this.query() && this.filtered().length > 0
  );

  loadMore() {
    if (!this.hasMore()) return;
    this.api.getKantoPage(this.pageSize, this.offset()).subscribe((list) => {
      const next = [...this.loaded(), ...list].slice(0, 151);
      this.loaded.set(next);
      this.offset.set(this.offset() + this.pageSize);
      if (next.length >= 151) {
        this.hasMore.set(false);
        this.allLoaded.set(true);
      }
    });
  }

  // quando houver busca, garante os 151 carregados
  private loadAllKanto() {
    if (this.allLoaded()) return;
    const fetchNext = () => {
      if (this.loaded().length >= 151) {
        this.hasMore.set(false);
        this.allLoaded.set(true);
        return;
      }
      this.api.getKantoPage(this.pageSize, this.offset()).subscribe((list) => {
        const next = [...this.loaded(), ...list].slice(0, 151);
        this.loaded.set(next);
        this.offset.set(this.offset() + this.pageSize);
        if (next.length < 151) fetchNext();
        else {
          this.hasMore.set(false);
          this.allLoaded.set(true);
        }
      });
    };
    fetchNext();
  }

  // remove acentos e normaliza para lower-case
  private normalize(s: string) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
