import { Component, signal, effect, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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

    <!--
      🎵 Áudio da aplicação
      IMPORTANTE: esta música sempre começa em START_OFFSET (23s) e repete a partir daí.
      Se quiser mudar o ponto inicial, altere a constante START_OFFSET no .ts.
    -->
    <audio #player [src]="musicSrc" preload="metadata"></audio>

    <main class="container">
      <router-outlet />
    </main>

    <footer class="footer">
      Feita com Angular • Dados de <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokeAPI</a>
    </footer>
  `,
  styles: [`
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
  `],
})
export class AppComponent implements AfterViewInit {
  musicSrc = 'assets/music.mp3';
  private playing = signal(false);
  isPlaying = this.playing;

  @ViewChild('player', { static: true })
  playerRef!: ElementRef<HTMLAudioElement>;

  duration = signal<number>(0); // em segundos
  current = signal<number>(0);

  // 📝 PONTO INICIAL DO ÁUDIO:
  // Este valor define a partir de qual segundo a música começa e repete.
  // Para trocar, ajuste aqui (ex.: 12, 23.5, 30, etc.).
  private static readonly START_OFFSET = 23;

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

  ngAfterViewInit() {
    const el = this.playerRef.nativeElement;

    // Duração quando os metadados carregam
    el.addEventListener('loadedmetadata', () => {
      this.duration.set(el.duration || 0);
      // já posiciona no offset assim que possível
      if (isFinite(el.duration) && el.duration > 0) {
        el.currentTime = Math.min(AppComponent.START_OFFSET, el.duration - 0.05);
      }
    });

    // Acompanhar tempo atual (opcional)
    el.addEventListener('timeupdate', () => {
      this.current.set(el.currentTime || 0);
    });

    // "Loop" manual: ao terminar, volta para START_OFFSET e toca de novo
    el.addEventListener('ended', () => {
      const endSafe = isFinite(el.duration) && el.duration > 0
        ? Math.min(AppComponent.START_OFFSET, el.duration - 0.05)
        : AppComponent.START_OFFSET;
      el.currentTime = endSafe;
      el.play().catch(err => console.error('Falha ao re-tocar áudio:', err));
    });
  }

  toggleMusic() {
    const el = this.playerRef?.nativeElement;
    if (!el) return;

    if (this.playing()) {
      el.pause();
      this.playing.set(false);
    } else {
      const jumpAndPlay = () => {
        // garante que sempre comece no offset ao dar play
        const endSafe = isFinite(el.duration) && el.duration > 0
          ? Math.min(AppComponent.START_OFFSET, el.duration - 0.05)
          : AppComponent.START_OFFSET;
        if (el.currentTime < endSafe) {
          el.currentTime = endSafe;
        }
        el.play()
          .then(() => this.playing.set(true))
          .catch(err => {
            console.error('Falha ao tocar áudio:', err);
            this.playing.set(false);
          });
      };

      // se ainda não tem metadados, espera carregar
      if (isFinite(el.duration) && el.duration > 0) {
        jumpAndPlay();
      } else {
        el.addEventListener('loadedmetadata', jumpAndPlay, { once: true });
        el.load(); // força carregamento de metadados
      }
    }
  }

  // (opcional) segue disponível caso queira tocar um trecho específico
  playSegment(start: number, end: number) {
    const el = this.playerRef.nativeElement;
    if (!el) return;

    const startPlayback = () => {
      const safeEnd = Math.min(end, el.duration || end);
      el.currentTime = start;
      el.play().catch(err => console.error('Falha ao tocar trecho:', err));

      const onTimeUpdate = () => {
        if (el.currentTime >= safeEnd) {
          el.pause();
          el.removeEventListener('timeupdate', onTimeUpdate);
          this.playing.set(false);
        }
      };
      el.addEventListener('timeupdate', onTimeUpdate);
      this.playing.set(true);
    };

    if (isFinite(el.duration) && el.duration > 0) {
      startPlayback();
    } else {
      el.addEventListener('loadedmetadata', startPlayback, { once: true });
      el.load();
    }
  }

  toggleTheme() {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private detectInitialTheme(): Theme {
    const saved = localStorage.getItem('@pokedex-dark-theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
