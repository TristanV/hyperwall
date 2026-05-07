# Room 4 - Chaos Mode

**Difficulté:** Very Hard  
**Description:** Chaos complet! Beaucoup de briques spéciales, beaucoup d'accélération.

## Layout

```
- 6 rangées de 10 briques (60 briques au total)
- Briques bonus (30%): MULTI, PADDLE, STICKY, SLOW (ralentit la balle)
- Briques malus (20%): TOUGH (2 touches), ARMORED (3 touches)
- Accélération rapide de la balle
```

## Configuration JSON

```json
{
  "name": "Chaos Mode",
  "difficulty": 4,
  "rows": 6,
  "bricksPerRow": 10,
  "ballSpeed": 5.5,
  "paddleWidth": 80,
  "speedIncrement": 0.75,
  "speedIncrement.maxSpeed": 12,
  "specialBricks": [
    {"type": "MULTI", "chance": 0.15},
    {"type": "PADDLE", "chance": 0.08},
    {"type": "STICKY", "chance": 0.07},
    {"type": "SLOW", "chance": 0.05},
    {"type": "TOUGH", "chance": 0.12},
    {"type": "ARMORED", "chance": 0.08}
  ]
}
```

## Astuces

- La brique SLOW réduit la vitesse de la balle
- Essaie de casser les briques MULTI pour multiplier tes balles
- Les STICKY sont tes amis pour reprendre le contrôle
