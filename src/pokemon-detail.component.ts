import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokeService } from './poke.service';
import { PokemonFull } from './types';

@Component({
  standalone: true,
  selector: 'pokemon-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/" class="back">← Voltar</a>

    <ng-container *ngIf="pokemon as p">
      <section class="hero">
        <img [src]="artwork(p.id)" [alt]="p.name"/>
        <div>
          <h1>#{{ p.id | number:'3.0' }} • {{ p.name | titlecase }}</h1>
          <p class="types">
            <span *ngFor="let t of p.types" class="type" [attr.data-type]="t.type.name">
              {{ t.type.name | titlecase }}
            </span>
          </p>
          <p>Altura: {{ p.height/10 }} m • Peso: {{ p.weight/10 }} kg</p>
        </div>
      </section>

      <section class="stats">
        <h2>Base Stats</h2>
        <div class="stat" *ngFor="let s of p.stats">
          <span class="label">{{ s.stat.name | titlecase }}</span>
          <div class="bar">
            <div class="fill" [style.width.%]="(s.base_stat/200)*100"></div>
          </div>
          <span class="value">{{ s.base_stat }}</span>
        </div>
      </section>
    </ng-container>
  `,
  styles: [
    `
  .back{display:inline-block;margin:.5rem 0 1rem;text-decoration:none;color:var(--text)}
  .hero{
    display:grid;grid-template-columns:160px 1fr;gap:1rem;align-items:center;
    background:var(--card);border:2px solid var(--border);border-radius:16px;padding:1rem
  }
  .hero img{width:160px;height:160px;object-fit:contain;background:var(--muted-bg);border-radius:12px}
  .types{display:flex;gap:.5rem}
  .type{padding:.25rem .5rem;border-radius:999px;background:var(--border);font-size:.9rem}
  .stats{
    margin-top:1.5rem;background:var(--card);border:2px solid var(--border);border-radius:16px;padding:1rem
  }
  .stat{display:grid;grid-template-columns:120px 1fr 48px;gap:.5rem;align-items:center;margin:.25rem 0}
  .bar{height:10px;background:var(--border);border-radius:999px;overflow:hidden}
  .fill{height:100%;background:var(--success)}
`,
  ],
})
export class PokemonDetailComponent {
  pokemon?: PokemonFull;

  constructor(private route: ActivatedRoute, private api: PokeService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getPokemon(id).subscribe((p) => (this.pokemon = p));
  }

  artwork(id: number) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
}
