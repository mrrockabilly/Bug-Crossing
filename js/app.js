const gameTimer = 40000;
const bugs = 4;
const lengthX = 101;
const lengthY = 83;

var startingPositionX = 2 * lengthX;
var startingPositionY = 5 * lengthY;
var minPlayerX = 0;
var minPlayerY = -40;
var maxPlayerX = 4 * lengthX;
var maxPlayerY = 5 * lengthY;
var playerPrevXPos;
var playerPrevYPos;
var enemyMaxX = 5 * lengthY;

var collectables = [
  ['images/Gem Blue.png', 30],
  ['images/Gem Green.png', 30],
  ['images/Gem Orange.png', 30],
  ['images/Heart.png', 10],
  ['images/Star.png', 10],
  ['images/Rock.png', 0],
  ['images/Key.png', 10],
  ['images/Selector.png', 50]
];

var collectableYAdjust = 20; 
var numberOfCollectables = 3; 

var Enemy = function (startX, startY) {
  this.sprite = 'images/enemy-bug.png';
  this.x = startX;
  this.y = startY;
  this.speed = Math.floor((Math.random() * 100) + 100); // speed  between 100 and 200
};

Enemy.prototype.update = function (dt) {
  if (this.x > enemyMaxX) {
    this.x = -(Math.floor((Math.random() * 5) + 1) * lengthX);
    this.y = Math.floor((Math.random() * 3) + 1) * lengthY;
  } else {
    this.x = this.x + (this.speed * dt);
  }
};

Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Collectible = function (img, points, xPos, yPos) {
  this.sprite = img;
  this.points = points;
  this.x = xPos;
  this.y = yPos;
  this.fading = false;
  this.toDestroy = false;
};

Collectible.prototype.render = function () {
  if (this.toDestroy) {
    this.remove();
  } else {
    if (this.fading) { ctx.globalAlpha = 0.5; }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.globalAlpha = 1;
  }
};

Collectible.prototype.remove = function () {
  canvasCollectibles.splice(canvasCollectibles.indexOf(this), 1);
};

Collectible.prototype.disappear = function (fadeTime) {
  var that = this;
  var destroyTime = fadeTime + 2000;

  setTimeout(function () {
    that.fading = true;
  }, fadeTime);

  setTimeout(function () {
    that.toDestroy = true;
  }, destroyTime);
};

Collectible.prototype.move = function () {
  var that = this;
  var EXPIRE_TIME = 5000;

  setTimeout(function () {
    setInterval(function () {
      if (that.y < 415) {
        that.y = that.y + 1;
      } else {
        clearInterval();
        that.disappear(0);
      }
    }, 1);
  }, EXPIRE_TIME);
};


var Player = function () {
  this.setSprite();
  this.x = startingPositionX;
  this.y = startingPositionY;
  this.score = 0;
};

Player.prototype.setSprite = function () {
  this.sprite = 'images/char-cat-girl.png';
};

Player.prototype.update = function (dt) {
  if (this.y <= 0) {
    this.score += 20;
    this.reset(this.score);
    placeCollectiblesOnCanvas();
  }
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {

  switch (key) {
    case 'left':
      var leftPos = this.x - lengthX;
      if (leftPos >= minPlayerX) {
        this.x = leftPos;
      };
      break;
    case 'up': 
      var upPos = this.y - lengthY;
      if (upPos >= minPlayerY) {
        this.y = upPos;
      };
      break;
    case 'right':
      var rightPos = this.x + lengthX;
      if (rightPos <= maxPlayerX) {
        this.x = rightPos;
      };
      break;
    case 'down': 
      var downPos = this.y + lengthY;
      if (downPos <= maxPlayerY) {
        this.y = downPos;
      };
      break;
    default:
  }
};

Player.prototype.reset = function (score) {
  this.x = startingPositionX;
  this.y = startingPositionY;
  this.score = score;
  var scoreEl = document.getElementById('score');
  scoreEl.innerHTML = this.score;
};

Player.prototype.collect = function (score) {
  this.score += score;
};

var allEnemies;

function placeEnemiesOnCanvas() {
  allEnemies = [];
  for (let i = 0; i < bugs; i++) {
    var startX = -(Math.floor((Math.random() * 5) + 1) * lengthX);
    var startY = Math.floor((Math.random() * 3) + 1) * lengthY;
    allEnemies.push(new Enemy(startX, startY));
  }
}

function removeEnemiesFromCanvas() {
  allEnemies = [];
}

var allCollectibles;  
var canvasCollectibles;

function placeCollectiblesOnCanvas() {
  allCollectibles = [];
  canvasCollectibles = [];
  collectables.forEach(function (collectible) {
    allCollectibles.push(collectible);
  });
  var positions = []
  var xPos, yPos;
  var playCollectibleImgPoints = [];

  for (let x = 0; x < numberOfCollectables; x++) {
    var index = Math.floor(Math.random() * allCollectibles.length);
    playCollectibleImgPoints.push(allCollectibles[index]);
    allCollectibles.splice(index, 1);
  }

  for (let i = 0; i < playCollectibleImgPoints.length; i++) {
    xPos = Math.floor((Math.random() * 5) + 0) * lengthX;
    yPos = (Math.floor((Math.random() * 3) + 1) * lengthY) - collectableYAdjust;
    if (positions.length != 0) {
      var position = checkPosition(positions, xPos, yPos);
      xPos = position[0];
      yPos = position[1];
    };
    canvasCollectibles.push(new Collectible(playCollectibleImgPoints[i][0], playCollectibleImgPoints[i][1], xPos, yPos));
    positions.push([xPos, yPos]);
  }

  function checkPosition(positions, xPos, yPos) {
    for (let j = 0; j < positions.length; j++) {
      if ((xPos == positions[j][0]) && (yPos == positions[j][1])) {
        xPos = Math.floor((Math.random() * 5) + 0) * lengthX;
        yPos = (Math.floor((Math.random() * 3) + 1) * lengthY) - collectableYAdjust;
        return checkPosition(positions, xPos, yPos);
      }
    }
    return [xPos, yPos];
  }

  for (let i = 0; i < canvasCollectibles.length; i++) {
    if ((canvasCollectibles[i].sprite).indexOf("Gem") > -1) {
      canvasCollectibles[i].disappear(3000);
    }
  }

  for (let i = 0; i < canvasCollectibles.length; i++) {
    if ((canvasCollectibles[i].sprite).indexOf("Selector") > -1) {
      canvasCollectibles[i].move();
    }
  }
}

function removeCollectiblesFromCanvas() {
  canvasCollectibles = [];
}

var player = new Player();

function activateKeys() {
  console.log("activateKeys");
  document.addEventListener('keyup', keyFunction);
}

function deactivateKeys() {
  console.log("deactivateKeys");
  document.removeEventListener('keyup', keyFunction);
}

function keyFunction(e) {
  playerPrevXPos = player.x;
  playerPrevYPos = player.y;
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
}


var timerEl = document.getElementById('timer');
var timer;
var gameInterval;
var gameSound;

function gameStart() {
  player.render();
  gameSound = new Audio('sounds/retroArcadeMusic.mp3');
  gameSound.play();
  activateKeys();
  placeEnemiesOnCanvas();
  timer = gameTimer / 1000;
  timerEl.innerHTML = timer;
  gameInterval = setInterval(function () {
    timer -= 1;
    timerEl.innerHTML = timer;
  }, 1000);
}

function gameStop() {
  gameSound.pause();
  deactivateKeys();
  removeEnemiesFromCanvas();
  timerEl.innerHTML = 0;
  clearInterval(gameInterval);
  player.reset(0);
  removeCollectiblesFromCanvas();
}
