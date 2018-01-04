var player;
var pressedKeys;

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
  game.start();
  player = new rect(game.canvas.width/2, game.canvas.height/2, 50, 50, "red");
}

function animate() {
  game.clear();
  player.update();
}

var game = {
  canvas: document.getElementById("canvas"),
  start: function() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(animate, 20);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function rect(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.jumping = false;
  this.falling = false;

  this.dx = 0;
  this.dy = 0;

  this.update = function() {
    if (pressedKeys[37]) {
      this.dx -= 5;
    }
    if (pressedKeys[38] && !this.jumping && !this.falling) {
      this.jumping = true;
      this.dy = -20;
    }
    if (pressedKeys[39]) {
      this.dx += 5;
    }

    if (pressedKeys[32] && !this.jumping && !this.falling) {
      this.jumping = true;
      this.dy = -20;
    }

    if (this.falling && this.dy == 0 && !pressedKeys[32] && !pressedKeys[38]) {
      this.falling = false;
    }
    if (this.jumping && this.dy >= 0) {
      this.jumping = false;
      this.falling = true;
    }

    this.dy += .8;
    if (this.dx > 5) {
      this.dx = 5;
    } else if (this.dx < -5) {
      this.dx = -5
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
          this.dx *= .97;
        }
      }
    }

    var ctx = game.context;

    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

/*
ctx.fillText("Welcome to the Playground", 400, 100)
*/
