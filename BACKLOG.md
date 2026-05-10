# HyperWall — Backlog Produit

> Ce backlog liste toutes les tâches de la roadmap sous forme d'items actionnables, organisés par phase et priorité.
> **Convention de statut :** `[ ]` À faire · `[~]` En cours · `[x]` Terminé

---

## Phase 1 — Mobile Web Ready

### 1.1 Canvas Responsive

- [ ] **P1-01** Refactoriser la taille du canvas avec `resizeCanvas()` appelé sur `resize` + `orientationchange`
  - Stocker `BASE_W` / `BASE_H` comme résolution logique (ex. 480×720)
  - Appliquer un `scale()` sur le contexte Canvas pour adapter au viewport réel
  - Recalculer les positions de la raquette, balles et briques après chaque redimensionnement
- [ ] **P1-02** Ajouter les méta-tags HTML pour mobile dans `index.html`
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  ```
- [ ] **P1-03** Bloquer le scroll et le zoom pendant le jeu
  ```js
  canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  ```
- [ ] **P1-04** Gérer les deux orientations : paysage (gameplay) et portrait (menu)
  - Afficher un message "Tournez votre écran" si portrait pendant le gameplay

### 1.2 Contrôles Tactiles

- [ ] **P1-05** Implémenter le déplacement de la raquette au toucher
  - `touchstart` : enregistrer `startX`
  - `touchmove` : déplacer la raquette proportionnellement au delta X du doigt
  - `touchend` : arrêter le déplacement
- [ ] **P1-06** Implémenter le lancer de balle (SPACE → tap)
  - Simple `touchstart` sur le canvas en état `waiting` déclenche le lancer
- [ ] **P1-07** Ajouter des boutons UI tactiles sur l'écran pour les actions non-jeu
  - Bouton Son (existant, vérifier taille ≥ 44px)
  - Bouton Pause (nouveau)
  - Bouton Recommencer (game over)
- [ ] **P1-08** Tester les contrôles sur Chrome DevTools (simulation touch) et un vrai smartphone

### 1.3 UI & Style Mobile

- [ ] **P1-09** Vérifier que le canvas ne dépasse pas hors de l'écran (overflow hidden, fond noir)
- [ ] **P1-10** Augmenter la taille de la police du score et HUD pour lisibilité sur petits écrans
- [ ] **P1-11** S'assurer que les boutons Son/Musique sont accessibles sans gêner le gameplay

---

## Phase 2 — Progressive Web App (PWA)

### 2.1 Web App Manifest

- [ ] **P2-01** Créer `manifest.json` à la racine
  ```json
  {
    "name": "HyperWall — Arcade Games",
    "short_name": "HyperWall",
    "start_url": "/",
    "display": "fullscreen",
    "orientation": "landscape",
    "background_color": "#000000",
    "theme_color": "#00ffff",
    "icons": [
      { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
      { "src": "icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
    ]
  }
  ```
- [ ] **P2-02** Lier le manifest dans `index.html` : `<link rel="manifest" href="manifest.json">`
- [ ] **P2-03** Créer le dossier `icons/` avec les 3 icônes (192px, 512px, 512px maskable)
  - Style retro neon cohérent avec l'esthétique du jeu (brique cyan sur fond noir)

### 2.2 Service Worker

- [ ] **P2-04** Créer `sw.js` avec stratégie cache-first
  - Mettre en cache : `index.html`, `game.js`, `style.css`, `rooms/config.json`, icônes
  - Servir depuis le cache si réseau indisponible
- [ ] **P2-05** Enregistrer le Service Worker dans `index.html`
  ```js
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
  ```
- [ ] **P2-06** Gérer la mise à jour du cache lors des nouvelles versions (versioning du cache)

### 2.3 Validation PWA

- [ ] **P2-07** Auditer avec Lighthouse (Chrome DevTools) → viser ≥ 90 en PWA
- [ ] **P2-08** Tester l'installation depuis Chrome Android (prompt "Ajouter à l'écran d'accueil")
- [ ] **P2-09** Vérifier le fonctionnement hors-ligne après installation

---

## Phase 3 — Android Natif via Capacitor

### 3.1 Setup Capacitor

- [ ] **P3-01** Initialiser npm dans le projet : `npm init -y`
- [ ] **P3-02** Installer Capacitor CLI et core :
  ```bash
  npm install @capacitor/core @capacitor/cli
  npx cap init HyperWall com.hyperwall.game --web-dir .
  ```
- [ ] **P3-03** Ajouter la plateforme Android :
  ```bash
  npm install @capacitor/android
  npx cap add android
  ```
- [ ] **P3-04** Vérifier que `capacitor.config.json` pointe correctement sur `webDir: "."`

### 3.2 Configuration Android

- [ ] **P3-05** Configurer le mode plein écran immersif dans `android/app/src/main/res/values/styles.xml`
- [ ] **P3-06** Forcer l'orientation paysage dans `AndroidManifest.xml`
  ```xml
  android:screenOrientation="landscape"
  ```
- [ ] **P3-07** Créer les ressources splash screen (`android/app/src/main/res/drawable/`)
  - Fond noir avec logo HyperWall neon
- [ ] **P3-08** Remplacer les icônes Android par défaut par les icônes du jeu
  - Utiliser les icônes créées en P2-03, adaptées aux tailles Android (mipmap)

### 3.3 Build & Test Android

- [ ] **P3-09** Synchroniser les fichiers web vers Android :
  ```bash
  npx cap sync android
  ```
- [ ] **P3-10** Ouvrir Android Studio et builder l'APK debug :
  ```bash
  npx cap open android
  ```
- [ ] **P3-11** Installer et tester l'APK sur un émulateur Android (API 30+)
- [ ] **P3-12** Installer et tester l'APK sur un appareil physique Android
- [ ] **P3-13** Corriger les bugs spécifiques Android (viewport, audio, performance)

### 3.4 Plugins Capacitor (optionnels)

- [ ] **P3-14** (Optionnel) Ajouter `@capacitor/haptics` pour retour vibration sur collision
- [ ] **P3-15** (Optionnel) Ajouter `@capacitor/status-bar` pour masquer la barre de statut

---

## Phase 4 — Qualité & Distribution

### 4.1 Performance & Optimisation

- [ ] **P4-01** Minifier `game.js` et `style.css` pour la production (via `esbuild` ou `terser`)
- [ ] **P4-02** Auditer les performances avec Lighthouse → viser LCP < 2s, CLS = 0
- [ ] **P4-03** Vérifier le framerate sur appareils Android milieu de gamme (60fps stable)

### 4.2 Tests Multi-appareils

- [ ] **P4-04** Tester sur écran 4" (petit smartphone)
- [ ] **P4-05** Tester sur écran 6.5" (grand smartphone)
- [ ] **P4-06** Tester sur tablette 10" (orientation paysage)
- [ ] **P4-07** Tester sur Android 10, 12 et 14

### 4.3 Documentation & Build

- [ ] **P4-08** Mettre à jour `README.md` avec les nouvelles instructions de déploiement
  - Section "Déployer comme PWA"
  - Section "Builder l'APK Android"
- [ ] **P4-09** Créer `Makefile` ou `package.json` scripts pour automatiser :
  - `npm run build` → sync capacitor
  - `npm run serve` → serveur local de dev
  - `npm run android` → ouvre Android Studio

### 4.4 Distribution Web — GitHub Pages

- [ ] **P4-10** Activer GitHub Pages sur la branche `main` depuis les Settings du repo
- [ ] **P4-11** Vérifier l'URL publique : `https://tristanv.github.io/hyperwall/`
- [ ] **P4-12** Ajouter l'URL de démo dans le README et la description GitHub

### 4.5 Distribution Android (optionnel)

- [ ] **P4-13** (Optionnel) Générer un AAB signé pour le Google Play Store
- [ ] **P4-14** (Optionnel) Créer un compte Google Play Developer et soumettre l'appli
- [ ] **P4-15** (Optionnel) Rédiger la fiche store (description, captures d'écran, catégorie)

---

## Récapitulatif des priorités

| ID      | Tâche clé                              | Phase | Priorité  |
|---------|----------------------------------------|-------|-----------|
| P1-01   | Canvas responsive avec scale()         | 1     | 🔴 Critique |
| P1-05   | Contrôles tactiles raquette            | 1     | 🔴 Critique |
| P1-06   | Lancer balle au tap                    | 1     | 🔴 Critique |
| P2-01   | manifest.json                          | 2     | 🟠 Haute   |
| P2-04   | Service Worker cache-first             | 2     | 🟠 Haute   |
| P3-01   | Init npm + Capacitor                   | 3     | 🟠 Haute   |
| P3-09   | Build & sync Android                   | 3     | 🟠 Haute   |
| P4-10   | GitHub Pages                           | 4     | 🟡 Moyenne |
| P3-14   | Haptics (vibration)                    | 3     | 🟢 Bonus   |
| P4-13   | Publication Play Store                 | 4     | 🟢 Bonus   |

---

*Dernière mise à jour : 2026-05-10*
