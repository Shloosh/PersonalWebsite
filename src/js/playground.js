var ball;

function startGame() {
  game.start();
  ball = new rect(game.canvas.width/2, game.canvas.height/2, 50, "red");
}

function animate() {
  game.clear();
  ball.update();
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

function rect(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;

  this.dx = Math.ceil(Math.random()*21)-11;
  this.dy = Math.ceil(Math.random()*21)-11;

  this.update = function() {
    if (this.x+this.dx < 0+r || this.x+this.dx > game.canvas.width-this.r) {
      this.dx *= -1;
    }
    if (this.y+this.dy < 0+r || this.y+this.dy > game.canvas.height-this.r) {
      this.dy *= -1;
    }

    this.x += this.dx;
    this.y += this.dy;

    var ctx = game.context;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.fill();
  }
}

/*
ctx.fillText("Welcome to the Playground", 400, 100)
*/
