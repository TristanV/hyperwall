# Room 2 - Brick Madness

**Difficulté:** Medium  
**Description:** Introduction aux briques spéciales. 30% bonus, 10% malus.

## Layout

```
- 5 rangées de 8 briques
- Mélange de briques standard et spéciales
- Briques bonus (30%): MULTI (3 balles), PADDLE (agrandissement)
- Briques malus (10%): TOUGH (2 touches)
```

## Configuration JSON

```json
{
  "name": "Brick Madness",
  "difficulty": 2,
  "rows": 5,
  "bricksPerRow": 8,
  "ballSpeed": 4.5,
  "paddleWidth": 100,
  "specialBricks": [
    {"type": "MULTI", "chance": 0.15},
    {"type": "PADDLE", "chance": 0.15},
    {"type": "TOUGH", "chance": 0.10}
  ]
}
```

## Astuces

- Les briques MULTI créent 3 balles
- Les briques PADDLE agrandissent temporairement la raquette
- Les briques TOUGH nécessitent 2 touches pour être cassées
