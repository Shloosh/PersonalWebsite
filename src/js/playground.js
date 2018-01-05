var game;
var pressedKeys;
var gravity, friction;
var moveSpeed, jumpHeight;
var player;
var blocks;

window.addEventListener("keydown", function(e) {
  if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 32) {
    e.preventDefault();
  }
  pressedKeys[e.keyCode] = true;
});
window.addEventListener("keyup", function(e) {
  delete pressedKeys[e.keyCode];
});

function startGame() {
  pressedKeys = {};
  gravity = .8;
  friction = .97;
  moveSpeed = 10;
  jumpHeight = 20;

  game = new Game(document.getElementById("canvas"));
  game.start();

  player = new Player(game.canvas.width/2, game.canvas.height/2, 50, 50, "red");

  blocks = [];
  blocks.push(new Rect(100, 100, 50, 50, "green"));
  blocks.push(new Rect(game.canvas.width-100, 100, 50, 50, "blue"));
  //block = new Rect(100, 100, 50, 50, "green");
  //block2 = new Rect(game.canvas.width-100, 100, 50, 50, "blue");
}

class Game {
  constructor(canvas) {
    var self = this;

    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    // Map locations for scrolling
    this.x = 0;
    this.y = 0;

    this.leftScroll = this.canvas.width*.25;
    this.rightScroll = this.canvas.width*.75;

    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      self.mouseX = e.clientX - rect.left - self.x;
      self.mouseY = e.clientY - rect.top - self.y;
    }, false);

    this.canvas.addEventListener('mousedown', function(e) {
      var blockSize = 50;
      var blockX = Math.round((self.mouseX-blockSize/2)/blockSize)*blockSize;
      var blockY = Math.round((self.mouseY-blockSize/2)/blockSize)*blockSize;
      blocks.push(new Rect(blockX, blockY, blockSize, blockSize, "black"));
    });
  }

  start() {
    var self = this;
    self.interval = setInterval(function() { self.animate(); }, 20);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  animate() {
    this.clear();
    player.update();
    blocks.forEach(function (block) { block.update(); });
  }
}

class Rect {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;

    this.xMid = this.x+this.width/2;
    this.yMid = this.y+this.height/2;

    this.dx = 0;
    this.dy = 0;
  }

  update() {
    var ctx = game.context;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x+game.x, this.y+game.y, this.width, this.height);
  }
}

class Player extends Rect {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);

    this.jumping = false;
    this.falling = false;
  }

  update() {
    if (pressedKeys[37]) {
      this.dx -= moveSpeed;
    }
    if (pressedKeys[38] && !this.jumping && !this.falling) {
      this.jumping = true;
      this.dy = -jumpHeight;
    }
    if (pressedKeys[39]) {
      this.dx += moveSpeed;
    }

    if (pressedKeys[32] && !this.jumping && !this.falling) {
      this.jumping = true;
      this.dy = -jumpHeight;
    }

    if (this.falling && this.dy == 0 && !pressedKeys[32] && !pressedKeys[38]) {
      this.falling = false;
    }
    if (this.jumping && this.dy >= 0) {
      this.jumping = false;
      this.falling = true;
    }

    this.dy += gravity;
    if (this.dx > moveSpeed) {
      this.dx = moveSpeed;
    } else if (this.dx < -moveSpeed) {
      this.dx = -moveSpeed;
    }

    this.x += this.dx;
    this.y += this.dy;

    if (this.y+this.height >= game.canvas.height) {
      this.y = game.canvas.height-this.height;
      this.dy = 0;

      if (this.dx != 0 && (this.dx > 0 || this.dx < 0)) {
        if (Math.abs(this.dx) < .1) {
          this.dx = 0;
        } else {
          this.dx *= friction;
        }
      }
    }

    this.xMid = this.x+this.width/2;
    this.yMid = this.y+this.height/2;

    if (this.xMid < game.leftScroll) {
      game.x += game.leftScroll-this.xMid;
      this.x = game.leftScroll-this.width/2;
    } else if (this.xMid > game.rightScroll) {
      game.x += game.rightScroll-this.xMid;
      this.x = game.rightScroll-this.width/2;
    }

    var ctx = game.context;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    /*
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.xMid, this.yMid, 1, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(game.leftScroll, 0);
    ctx.lineTo(game.leftScroll, game.canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(game.rightScroll, 0);
    ctx.lineTo(game.rightScroll, game.canvas.height);
    ctx.stroke();
    */
  }
}
