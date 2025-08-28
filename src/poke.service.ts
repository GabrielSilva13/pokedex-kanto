import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PokemonListItem, PokemonFull } from './types';

@Injectable({ providedIn: 'root' })
export class PokeService {
  private base = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getKantoPage(limit: number, offset: number): Observable<PokemonListItem[]> {
    return this.http
      .get<{ results: { name: string; url: string }[] }>(
        `${this.base}/pokemon?limit=${limit}&offset=${offset}`
      )
      .pipe(
        map((res) =>
          res.results.map((r) => {
            const id = Number(r.url.split('/').filter(Boolean).pop());
            return {
              id,
              name: r.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            } as PokemonListItem;
          })
        )
      );
  }

  getPokemon(idOrName: string | number): Observable<PokemonFull> {
    return this.http.get<PokemonFull>(`${this.base}/pokemon/${idOrName}`);
  }
}
