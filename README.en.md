# 📖 Pokédex Angular

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Status](https://img.shields.io/badge/status-online-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A **Pokédex for the first 151 Pokémon (Kanto region)** built with Angular standalone components and the [PokeAPI](https://pokeapi.co/).  
Designed with best practices, UX care, and responsive layout.

👉 **[Live Demo](https://YOUR-DEPLOY-LINK.com)**

---

## ✨ Features

- List of the **151 Kanto Pokémon**
- **Debounced search** (supports ID or name, accent-insensitive)
- **Dark/Light mode** with persistence in `localStorage`
- Pokémon **detail page** (types, height/weight, base stats with bars)
- **Empty state message** when no results are found
- **"Load more" pagination**
- Optional **music player** 🎵 (custom `.mp3` in `assets/music.mp3`)

---

## 🚀 Tech Stack

- [Angular 18+](https://angular.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [RxJS](https://rxjs.dev/)
- [PokeAPI](https://pokeapi.co/)

---

## 📦 Setup

```bash
# Clone the repo
git clone https://github.com/GabrielSilva13/pokedex-angular.git

cd pokedex-angular

# Install dependencies
npm install

# Run in dev mode
npm start
```

App will be available at http://localhost:4200/.

---

## 🌑 Dark/Light Theme

Detects system preference on first load

Manual toggle via header button

Saved in localStorage

---

## 🔊 Music (optional)

Add a file at src/assets/music.mp3

Press the ▶︎ Music button to play

⚠️ Please use only copyright-free / CC0 music

---

## 🛠️ Deployment

```bash

  npm run build

```

Deploy the dist/ folder to Vercel, Netlify, GitHub Pages, etc.

---

## 📜 License

MIT
— free to use and modify.

---

## 💡 Built with ❤️ using Angular and a passion for Pokémon.
