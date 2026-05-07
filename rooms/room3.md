# Room 3 - Speed Challenge

**Difficulté:** Hard  
**Description:** Les balles s'accélèrent! Vitesse progressive quand tu casses les briques.

## Layout

```
- 6 rangées de 8 briques
- Briques bonus (25%): MULTI, PADDLE, STICKY (glu)
- Briques malus (15%): TOUGH (2 touches), ARMORED (3 touches)
- Accélération progressive de la balle
```

## Configuration JSON

```json
{
  "name": "Speed Challenge",
  "difficulty": 3,
  "rows": 6,
  "bricksPerRow": 8,
  "ballSpeed": 5,
  "paddleWidth": 90,
  "speedIncrement": 0.5,
  "speedIncrement.maxSpeed": 10,
  "specialBricks": [
    {"type": "MULTI", "chance": 0.12},
    {"type": "PADDLE", "chance": 0.08},
    {"type": "STICKY", "chance": 0.05},
    {"type": "TOUGH", "chance": 0.10},
    {"type": "ARMORED", "chance": 0.05}
  ]
}
```

## Astuces

- La brique STICKY colle la balle à la raquette (appuie SPACE pour relancer)
- Les briques ARMORED nécessitent 3 touches
- Les briques MULTI et PADDLE sont très utiles ici
