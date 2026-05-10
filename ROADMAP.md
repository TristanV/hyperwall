# HyperWall — Roadmap : Déploiement Android & Navigateur

> **Objectif :** Transformer HyperWall (jeu Casse-Brique en HTML5/Canvas vanilla) en une application facile à lancer sur **navigateur web** (desktop & mobile) et **Android natif**, sans refonte majeure du gameplay.

---

## Vue d'ensemble

```
Phase 1 — Mobile Web Ready        [Sprint 1-2]  ~2 semaines
Phase 2 — PWA installable          [Sprint 3]    ~1 semaine
Phase 3 — Android natif (Capacitor)[Sprint 4-5]  ~2 semaines
Phase 4 — Qualité & Distribution   [Sprint 6]    ~1 semaine
```

---

## Phase 1 — Mobile Web Ready

> Rendre le jeu pleinement jouable sur navigateur mobile (smartphone, tablette).

### Objectifs
- Canvas responsive s'adaptant à toutes les tailles d'écran
- Contrôles tactiles (touch/swipe) en remplacement des touches clavier
- Empêcher le scroll accidentel et le zoom du navigateur pendant le jeu
- Orientation paysage forcée ou gérée proprement

### Critères de succès
- Le jeu est jouable à 100% sur Chrome Mobile (Android 10+) sans clavier
- Aucun saut ou redimensionnement brusque du canvas lors de la rotation
- Le score et les niveaux fonctionnent identiquement au desktop

---

## Phase 2 — Progressive Web App (PWA)

> Permettre l'installation du jeu depuis le navigateur, sans passer par un store.

### Objectifs
- Fichier `manifest.json` avec icônes, couleurs, orientation
- Service Worker avec stratégie cache-first (hors-ligne possible)
- Icônes multi-résolution (192px, 512px, maskable)
- Prompt d'installation automatique sur Android Chrome

### Critères de succès
- Score Lighthouse PWA ≥ 90
- Le jeu se lance hors-ligne après première visite
- Icône visible sur l'écran d'accueil Android après installation

---

## Phase 3 — Android Natif via Capacitor

> Empaqueter l'application web en APK/AAB Android avec Capacitor.js.

### Objectifs
- Intégration Capacitor dans le projet (config, plugins de base)
- Build Android fonctionnel avec Android Studio
- Gestion des permissions Android (orientation, plein écran)
- Mode plein écran immersif (masquage barre de statut)
- Icône et splash screen aux normes Android

### Critères de succès
- APK installable sur un appareil Android physique ou émulateur
- Aucune régression de gameplay par rapport à la version web
- Splash screen et icône correspondant à l'identité visuelle retro du jeu

---

## Phase 4 — Qualité & Distribution

> Préparer une release propre pour partage ou publication.

### Objectifs
- Audit de performance et optimisation (minification, assets)
- Tests sur plusieurs appareils (petits/grands écrans, Android versions)
- Documentation mise à jour (README, instructions de build)
- Script de build automatisé (makefile ou npm scripts)
- Option : publication sur GitHub Pages (version navigateur)
- Option : préparation Google Play Store (AAB signé, fiche store)

### Critères de succès
- Build reproductible en une commande
- README expliquant les deux chemins de déploiement (web & Android)
- Aucun bug critique sur les 3 derniers niveaux du jeu

---

## Stack technique retenu

| Besoin                  | Solution                          | Justification                              |
|-------------------------|-----------------------------------|--------------------------------------------|  
| Contrôles tactiles      | API Touch Events native           | Zéro dépendance, déjà en vanilla JS        |
| PWA                     | Web App Manifest + Service Worker | Standard web, pas de framework requis      |
| Packaging Android       | **Capacitor.js** (Ionic)          | Wrapping le plus léger pour HTML5 Canvas   |
| Build tooling           | npm scripts + Capacitor CLI       | Simple, documenté, gratuit                 |
| Hébergement web         | GitHub Pages                      | Gratuit, intégré au repo                   |

> **Pourquoi Capacitor plutôt que Cordova ou React Native ?**  
> Capacitor est la solution moderne la plus simple pour wrapper une appli web HTML5/Canvas existante sans la réécrire. Il génère un projet Android Studio standard, ce qui facilite la signature et le déploiement sur le Play Store.

---

## Jalons (Milestones)

| Milestone | Livrable                              | Date cible   |
|-----------|---------------------------------------|--------------|
| M1        | Jeu jouable sur mobile web (tactile)  | Sprint 2     |
| M2        | PWA installable, score Lighthouse ≥90 | Sprint 3     |
| M3        | APK fonctionnel sur Android physique  | Sprint 5     |
| M4        | Release publique (GitHub Pages + APK) | Sprint 6     |

---

*Dernière mise à jour : 2026-05-10*
