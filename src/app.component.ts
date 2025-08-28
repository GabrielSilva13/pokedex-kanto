import { Component, signal, effect } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">
        <span class="pokeball">●</span> Pokédex
      </a>

      <div class="spacer"></div>

      <button class="icon-btn" (click)="toggleTheme()" [attr.aria-label]="'Trocar tema'">
        {{ theme() === 'dark' ? '🌙' : '🌞' }} Tema
      </button>

      <button class="music-btn" (click)="toggleMusic()">
        {{ isPlaying() ? '⏸︎ Música' : '▶︎ Música' }}
      </button>
    </header>

    <audio #player [src]="musicSrc" loop></audio>

    <main class="container">
      <router-outlet />
    </main>

    <footer class="footer">
      Feita com Angular • Dados de <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokeAPI</a>
    </footer>
  `,
  styles: [
    `
    .topbar{
      position:sticky;top:0;z-index:10;display:flex;gap:.5rem;align-items:center;
      padding:.75rem 1rem;background:var(--accent);color:white;border-bottom:4px solid var(--accent-strong)
    }
    .brand{font-weight:800;text-decoration:none;color:white;letter-spacing:.5px}
    .pokeball{display:inline-block;margin-right:.5rem}
    .spacer{flex:1}
    .icon-btn,.music-btn{
      border:0;background:#212121;color:#fff;padding:.5rem .75rem;border-radius:8px;cursor:pointer;
    }
    .container{max-width:1024px;margin:1rem auto;padding:0 1rem}
    .footer{margin:3rem 0 1rem;text-align:center;color:var(--muted)}
    .footer a{color:inherit}
  `,
  ],
})
export class AppComponent {
  musicSrc = 'assets/music.mp3';
  private playing = signal(false);
  isPlaying = this.playing;

  // THEME
  theme = signal<Theme>(this.detectInitialTheme());

  constructor() {
    effect(() => {
      const t = this.theme();
      const root = document.documentElement;
      root.classList.remove('theme-dark');
      if (t === 'dark') root.classList.add('theme-dark');
      // persistência
      localStorage.setItem('@pokedex-dark-theme', t);
    });
  }

  toggleMusic() {
    const el = document.querySelector('audio') as HTMLAudioElement | null;
    if (!el) return;
    if (this.playing()) {
      el.pause();
      this.playing.set(false);
    } else {
      el.play()
        .then(() => this.playing.set(true))
        .catch(() => {});
    }
  }

  toggleTheme() {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private detectInitialTheme(): Theme {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia?.(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark ? 'dark' : 'light';
  }
}
