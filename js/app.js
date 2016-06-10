// Enemies our player must avoid
var Enemy = function () {
// Variables applied to each of our instances go here,
// we've provided one for you to get started

// The image/sprite for our enemies, this uses
// a helper we've provided to easily load images

    this.width = 90;
    this.height = 80;
    this.maxSpeed = 200;
    this.minSpeed = 50;
    this.xStartOptions = [];
    this.yStartOptions = [];
    for (var i = -3; i < 5; i++) {
        this.xStartOptions.push(i * X_STEP);
    }
    for (var j = 1; j < 5; j++) {
        this.yStartOptions.push(j * Y_STEP);
    }
    this.startX();
    this.startY();
    this.setSpeed();
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (!gamestate.paused) {
        this.x += dt * this.speed * gamestate.speed;
    }
    if (this.x > X_RIGHT) {
        this.x = -3 * X_STEP;
        this.startY();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
