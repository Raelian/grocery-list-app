# SmartList 📝
A simple, offline-first grocery and task list app with real-time sync, voice input (WIP), and shareable URLs.

🔗 [Try it live](https://raelian.github.io/grocery-list-app/)

## ✨ Features

- ✅ Works offline (Progressive Web App)
- 🔗 Share lists through a URL
- 🖥️ Mobile-friendly
- 🗣️ Voice input for adding items in English & Romanian (Google Chrome only, therefore only works on Android)

## 🛠️ Tech Stack

- React + TypeScript
- SCSS Modules
- GitHub Pages for deployment

## 📁 Folder Structure
src/
|---components/ # Reusable UI components and pages
|---locales/ # en and ro translations
|---styles/ # Reusable styles
|---types/ # Grocery list and time format
|---utils/ # Utility functions

## 🗺 Roadmap

- [x] Offline support with localStorage and localForage
- [x] Share lists via encoded URL
- [x] Voice input with quantity + unit parsing by using Web Speech API (work in progress)
- [ ] Cloud sync with Firebase (better alternative to the shared lists via encoded URL)
- [ ] Real-time collaboration
