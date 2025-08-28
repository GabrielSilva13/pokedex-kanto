# 📖 Pokédex Angular

📘 [English version](README.en.md)

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Status](https://img.shields.io/badge/status-online-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Uma **Pokédex da 1ª geração (Kanto)** feita em Angular standalone components, consumindo a [PokeAPI](https://pokeapi.co/).  
O projeto foi construído com foco em boas práticas, UX e responsividade — perfeito para estudos ou como showcase de Angular.

👉 **[Demo Online](https://pokedex-kanto-ten.vercel.app/)**

---

## ✨ Features

- Listagem dos **151 pokémons de Kanto**
- **Busca com debounce** + normalização (ignora acentos e aceita ID ou nome parcial)
- **Dark/Light Mode** com persistência em `localStorage`
- Página de **detalhes do pokémon** (tipos, altura/peso, base stats com barra visual)
- Mensagem de **“nenhum resultado encontrado”** quando a busca não retorna nada
- **Botão “Carregar mais”** com paginação incremental
- Player de música **opcional** 🎵 (coloque sua própria trilha em `assets/music.mp3`)

---

## 🖼️ Screenshots

### Home

![Home Screenshot](https://github.com/GabrielSilva13/pokedex-kanto/blob/master/screenshots/home.png)

### Detalhes

![Detail Screenshot](https://github.com/GabrielSilva13/pokedex-kanto/blob/master/screenshots/detail.png)

---

## 🚀 Tecnologias

- [Angular 18+](https://angular.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [RxJS](https://rxjs.dev/)
- [PokeAPI](https://pokeapi.co/)

---

## 📦 Instalação & Execução

```bash
# Clone o repo
git clone https://github.com/GabrielSilva13/pokedex-angular.git

# Entre no diretório
cd pokedex-angular

# Instale dependências
npm install

# Rode em modo dev
npm start
```

App rodará em http://localhost:4200/.

---

---

## 🌑 Tema Dark/Light

Detecta automaticamente o tema do sistema na primeira execução

Alternância manual via botão no header

Persistência no localStorage

---

## 🔊 Música opcional

Adicione um arquivo .mp3 em src/assets/music.mp3

Clique no botão ▶︎ Música para tocar

⚠️ Atenção: não suba músicas com direitos autorais pro GitHub.
Use apenas trilhas livres/CC0.

---

## 🛠️ Deploy

```bash
# Você pode rodar a build com:
npm run build

```

E publicar a pasta dist/ no Vercel, Netlify, GitHub Pages ou qualquer outro serviço de hospedagem estática.

---

📜 Licença

MIT
— use livremente e divirta-se!

---

## 💡 Feito com ❤️ usando Angular e muita paixão por Pokémon.




