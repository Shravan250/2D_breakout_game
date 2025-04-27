# 2D Breakout Game

A classic breakout game built with Phaser 3, featuring modern gameplay mechanics and smooth animations.

## Features

- Smooth paddle movement with mouse control
- Animated ball with wobble effect
- Brick destruction animations
- Score tracking
- Lives system (3 lives)
- Start button and game states
- Win/lose conditions
- Responsive design that scales to fit the screen

## Screenshots

![Gameplay](/img/mdn-breakout-phaser.png)

## Technologies Used

- **Phaser 3** - A fast, free, and fun open source HTML5 game framework
- **ES6 Modules** - Modern JavaScript module system for better code organization
- **HTML5 Canvas** - For rendering the game
- **JavaScript** - Core programming language

## Game Mechanics

- Control the paddle with mouse movement
- Ball bounces with realistic physics
- Different bounce angles based on where the ball hits the paddle
- Bricks are destroyed with a scaling animation
- Score increases for each brick destroyed
- Game ends when all lives are lost or all bricks are destroyed

## Project Structure

```
2D_breakout_game/
├── js/
│   ├── index.js     # Main game configuration and scene setup
│   └── helper.js    # Game mechanics and object creation
├── img/
│   ├── ball.png     # Ball sprite
│   ├── paddle.png   # Paddle sprite
│   ├── brick.png    # Brick sprite
│   ├── button.png   # Start button sprite
│   └── wobble.png   # Ball animation spritesheet
└── index.html       # Main HTML file
```

## Game Objects

- **Ball**: Features a wobble animation and maintains constant speed
- **Paddle**: Mouse-controlled with clamped movement
- **Bricks**: Destructible with animation
- **Score Display**: Shows current points
- **Lives Display**: Shows remaining lives
- **Start Button**: Initiates gameplay

## Technical Implementation

### Physics

- Constant ball velocity maintenance
- Angle calculations for paddle rebounds
- Brick collision detection with face recognition

### Animations

- Ball wobble animation using spritesheets
- Brick destruction scaling animation using tweens
- Smooth paddle movement

### State Management

- Game states (playing, game over)
- Life system
- Score tracking
- Win/lose conditions

## How to Run

1. Clone the repository
2. Serve the files using a local web server (due to ES6 modules)
3. Open in a modern web browser
4. Click the start button to begin playing

## Controls

- Move the mouse left and right to control the paddle
- Click the start button to begin the game
- Click to restart when game over

## Future Enhancements

- Multiple levels
- Power-ups
- High score system
- Sound effects
- Background music
- Different brick types
- Mobile touch support
