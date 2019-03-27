var game;
var pressedKeys;
var gravity, friction, airFriction;
var moveSpeed, jumpHeight;
var player;
var blocks;

function resizeCanvas(mediaQuery) {
  if (mediaQuery.matches) { // If media query matches\
    document.getElementById("canvas").setAttribute("width", "300");
    document.getElementById("canvas").setAttribute("height", "200");
    startGame();
  } else {
    document.getElementById("canvas").setAttribute("width", "900");
    document.getElementById("canvas").setAttribute("height", "600");
    startGame();
  }
}
document.addEventListener("DOMContentLoaded", function(event) { 
  var mediaQuery = window.matchMedia("(max-width: 767px)")
  resizeCanvas(mediaQuery) // Call listener function at run time
  mediaQuery.addListener(resizeCanvas) // Attach listener function on state changes
});

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
  friction = .5;
  airFriction = .9;
  moveSpeed = 10;
  jumpHeight = 20;

  game = new Game(document.getElementById("canvas"));
  game.start();

  player = new Player(game.canvas.width/2, game.canvas.height/2, game.canvas.width/18, game.canvas.height/12, "red");

  blocks = [];
  blocks.push(new Rect(100, 100, game.canvas.width/18, game.canvas.height/12, "green"));
  blocks.push(new Rect(game.canvas.width-100, 100, game.canvas.width/18, game.canvas.height/12, "blue"));
  //blocks.push(new Rect(0, game.canvas.height-100, game.canvas.width, 50, "black"));
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

    this.leftScroll = this.canvas.width*.4;
    this.rightScroll = this.canvas.width*.6;
    this.topScroll = this.canvas.height*.25;
    this.bottomScroll = this.canvas.height*.75;

    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      self.mouseX = e.clientX - rect.left - self.x;
      self.mouseY = e.clientY - rect.top - self.y;
    }, false);

    this.mouseDown = false;
    this.canvas.addEventListener('mousedown', function(e) {
      self.mouseDown = true;
    });
    this.canvas.addEventListener('mouseup', function(e) {
      self.mouseDown = false;
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

    if (this.mouseDown) {
      var blockSize = game.canvas.width/18;
      var newBlockX = Math.round((this.mouseX-blockSize/2)/blockSize)*blockSize;
      var newBlockY = Math.round((this.mouseY-blockSize/2)/blockSize)*blockSize;
      var blockExists = false;

      blocks.forEach(function(block) {
        if (newBlockX == block.x && newBlockY == block.y) {
          blockExists = true;
        }
      });

      if (!blockExists) {
        blocks.push(new Rect(newBlockX, newBlockY, blockSize, blockSize, "black"));
      }
    }

    blocks.forEach(function (block) { block.update(); });
    player.update();
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

    this.xMid = this.x+this.width/2;
    this.yMid = this.y+this.height/2;

    var self = this;
    blocks.forEach(function (block) {
      var blockXMid = block.xMid + game.x;
      var blockYMid = block.yMid + game.y;

      var selfLeft = self.xMid-self.width/2;
      var selfRight = self.xMid+self.width/2;
      var selfTop = self.yMid-self.height/2;
      var selfBottom = self.yMid+self.height/2;
      var blockLeft = blockXMid-block.width/2;
      var blockRight = blockXMid+block.width/2;
      var blockTop = blockYMid-block.height/2;
      var blockBottom = blockYMid+block.height/2;

      /*
      var betweenBlockY = (selfBottom >= blockTop && selfBottom <= blockBottom) || (selfTop >= blockTop && selfTop <= blockBottom);
      var betweenBlockX = (selfLeft <= blockRight && selfLeft >= blockLeft) || (selfRight <= blockRight && selfRight >= blockLeft);
      */

      // AABB collision test
      if (selfRight > blockLeft && selfLeft < blockRight &&
          selfBottom > blockTop && selfTop < blockBottom) {
        var m = (blockYMid-self.yMid)/(blockXMid-self.xMid);
        var b = self.yMid-m*self.xMid;

        console.log("m: " + m + ", b: " + b);

        ///*
        if (Math.abs(self.yMid-blockYMid) > Math.abs(self.xMid-blockXMid)) {
          if (self.yMid < blockYMid) {
            self.y = blockTop-self.height;
          } else {
            self.y = blockBottom;
          }
          self.dy = 0;
        } else {
          if (self.xMid > blockXMid) {
            self.x = blockRight;
          } else {
            self.x = blockLeft-self.width;
          }
          self.dx = 0;
        }
        //*/
      }

      /*
      if (Math.abs((block.xMid+game.x)-self.xMid) < (block.width/2 + self.width/2) && Math.abs((block.yMid+game.y)-self.yMid) < (block.height/2 + self.height/2)) {
        if (Math.abs((block.xMid+game.x)-self.xMid) < (block.width/2 + self.width/2)) {
          if (self.xMid < block.xMid) {
            self.x = (block.x+game.x)-self.x;
          } else {
            self.x = (block.x+game.x)+block.width;
          }
          self.dx = 0;
        }
        if (Math.abs((block.yMid+game.y)-self.yMid) < (block.height/2 + self.height/2)) {
          if (self.yMid < block.yMid) {
            self.y = (block.y+game.y)-self.y;
          } else {
            self.y = (block.y+game.y)+block.height;
          }
          self.dy = 0;
        }
      }
      */
    });

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
    } else {
      this.dx *= airFriction;
    }

    // Add easing to scroll
    if (this.xMid < game.leftScroll) {
      var ease = (game.leftScroll-this.xMid)/20;
      game.x += ease;
      this.x += ease;
      //game.x += game.leftScroll-this.xMid;
      //this.x = game.leftScroll-this.width/2;
    } else if (this.xMid > game.rightScroll) {
      var ease = (game.rightScroll-this.xMid)/20;
      game.x += ease;
      this.x += ease;
      //game.x += game.rightScroll-this.xMid;
      //this.x = game.rightScroll-this.width/2;
    }

    /*
    if (this.yMid < game.topScroll) {
      game.y += game.topScroll-this.yMid;
      this.y = game.topScroll-this.height/2;
    } else if (this.yMid > game.bottomScroll) {
      game.y += game.bottomScroll-this.yMid;
      this.y = game.bottomScroll-this.height/2;
    }
    */

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
