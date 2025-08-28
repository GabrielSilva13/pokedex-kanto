export interface PokemonListItem {
  id: number;
  name: string;
  image: string;
}

export interface PokemonFull {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: any;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}
