import Player from './player.js';
import Projectile from './projectile.js';
import Asteroid from './asteroid.js';
import { circleCollision, circleTriangleCollision } from './collision.js';

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isPaused = false;

const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 },
});

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
};

const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.97;
const PROJECTILE_SPEED = 3;

const projectiles = [];
const asteroids = [];

// Function to handle generating asteroids
function generateAsteroids() {
    const index = Math.floor(Math.random() * 4);
    let x, y;
    let vx, vy;
    let radius = 50 * Math.random() + 10;

    switch (index) {
        case 0:
            x = 0 - radius;
            y = Math.random() * canvas.height;
            vx = 1;
            vy = 0;
            break;
        case 1:
            x = Math.random() * canvas.width;
            y = canvas.height + radius;
            vx = 0;
            vy = -1;
            break;
        case 2:
            x = canvas.width + radius;
            y = Math.random() * canvas.height;
            vx = -1;
            vy = 0;
            break;
        case 3:
            x = Math.random() * canvas.width;
            y = 0 - radius;
            vx = 0;
            vy = 1;
            break;
    }

    asteroids.push(
        new Asteroid({
            position: { x: x, y: y },
            velocity: { x: vx, y: vy },
            radius,
        })
    );
}

// Add setInterval to periodically generate asteroids
const asteroidInterval = setInterval(generateAsteroids, 3000);

// Add clearInterval when game is over
function gameOver() {
    console.log("Game Over!");
    clearInterval(asteroidInterval);
    // Additional game over logic...
}

// Animation loop
function animate() {
    if (!isPaused) {
        requestAnimationFrame(animate);
        c.fillStyle = "black";
        c.fillRect(0, 0, canvas.width, canvas.height);

        player.update();

        // Update and draw projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
            projectile.update();

            // Remove projectiles that are out of bounds
            if (
                projectile.position.x + projectile.radius < 0 ||
                projectile.position.x - projectile.radius > canvas.width ||
                projectile.position.y - projectile.radius > canvas.height ||
                projectile.position.y + projectile.radius < 0
            ) {
                projectiles.splice(i, 1);
            }
        }

        // Handle projectile-asteroid collisions
        handleProjectileAsteroidCollision();

        // Update and draw asteroids
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const asteroid = asteroids[i];
            asteroid.update();

            // Check for collision with player
            if (circleTriangleCollision(asteroid, player.getVertices())) {
                console.log("GAME OVER");
                cancelAnimationFrame(animationId);
                clearInterval(asteroidInterval);
            }

            // Remove asteroids that are out of bounds
            if (
                asteroid.position.x + asteroid.radius < 0 ||
                asteroid.position.x - asteroid.radius > canvas.width ||
                asteroid.position.y - asteroid.radius > canvas.height ||
                asteroid.position.y + asteroid.radius < 0
            ) {
                asteroids.splice(i, 1);
            }
        }

        // Handle player movement
        handlePlayerMovement();

        // Draw player
        player.draw(c);
    }
}

// Function to handle player movement
function handlePlayerMovement() {
    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED;
        player.velocity.y = Math.sin(player.rotation) * SPEED;
    } else if (!keys.w.pressed) {
        player.velocity.x *= FRICTION;
        player.velocity.y *= FRICTION;
    }

    if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
    else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
}

// Function to handle projectile-asteroid collisions
function handleProjectileAsteroidCollision() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];

        for (let j = asteroids.length - 1; j >= 0; j--) {
            const asteroid = asteroids[j];

            if (circleCollision(asteroid, projectile)) {
                asteroids.splice(j, 1);
                projectiles.splice(i, 1);
            }
        }
    }
}

// Start the animation loop
animate();

// Event listeners for keyboard input
window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyW":
            keys.w.pressed = true;
            break;
        case "KeyA":
            keys.a.pressed = true;
            break;
        case "KeyD":
            keys.d.pressed = true;
            break;
        case "Space":
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + Math.cos(player.rotation) * 30,
                        y: player.position.y + Math.sin(player.rotation) * 30,
                    },
                    velocity: {
                        x: Math.cos(player.rotation) * PROJECTILE_SPEED,
                        y: Math.sin(player.rotation) * PROJECTILE_SPEED,
                    },
                })
            );
            break;
        case "KeyG":
            togglePause();
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "KeyW":
            keys.w.pressed = false;
            break;
        case "KeyA":
            keys.a.pressed = false;
            break;
        case "KeyD":
            keys.d.pressed = false;
            break;
    }
});

// Toggle pause function
function togglePause() {
    isPaused = !isPaused;

    if (!isPaused) {
        animate();
    }
}