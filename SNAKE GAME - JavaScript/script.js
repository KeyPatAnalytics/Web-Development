var snake;
var apple;
var snakeGame;
var gameInPause;

window.onload = function() {

  snakeGame = new SnakeGame(900, 600, 30, 200);
  snake = new Snake([
    [6, 4],
    [5, 4],
    [4, 4],
    [4, 4],
    [2, 4]
  ], "right");
  apple = new Apple([10, 10]);
  snakeGame.init(snake, apple);
};


document.onkeydown = function handlekeyDown(e) {
  var key = e.keyCode;
  var newDirection;
  switch (key) {
    case 37:
      newDirection = "left";
      break;
    case 38:
      newDirection = "up";
      break;
    case 39:
      newDirection = "right";
      break;
    case 40:
      newDirection = "down";
      break;
    case 13:
      gameInPause = !gameInPause;
      break;
    case 32:

      snake = new Snake([
        [6, 4],
        [5, 4],
        [4, 4],
        [4, 4],
        [2, 4]
      ], "right");
      apple = new Apple([10, 10]);
      snakeGame.init(snake, apple);
      return;
    default:
      return;
  }

  snakeGame.snake.setDirection(newDirection);

};



function SnakeGame(canvasWidth, canvasHeight, blockSize, delay) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = canvasWidth;
  this.canvas.height = canvasHeight;
  this.canvas.style.border = "30px solid Gray";
  this.canvas.style.margin = "10px auto";
  this.canvas.style.backgroundColor = "#ddd";
  document.body.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
  this.blockSize = blockSize;
  this.delay = delay;
  this.snake;
  this.apple;
  this.widthInBlock = canvasWidth / blockSize;
  this.heightInBlock = canvasHeight / blockSize;
  this.score;
  var instance = this;
  var timeOut;




  this.init = function(snake, apple) {

    this.snake = snake;
    this.apple = apple;
    this.score = 0;
    gameInPause = false;
    refreshCanvas();
  };

 

  var refreshCanvas = function() {
      
      if(!gameInPause){
            instance.snake.advance();
            if (instance.checkCollision()) {
              instance.gameover();
            } else {
                  if (instance.snake.isEatingApple(instance.apple)) {
                    instance.score++;
                    instance.snake.ateApple = true;
                    do {
                      instance.apple.setNewPosition(instance.widthInBlock, instance.heightInBlock);
                    }
                    while (instance.apple.isOnSnake(instance.snake))
                  }


                  instance.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                  instance.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                  instance.drawScore();
                  instance.snake.draw(instance.ctx, instance.blockSize);
                  instance.apple.draw(instance.ctx, instance.blockSize);

            }
      }
      else { if (!instance.checkCollision()) {instance.pause();}
          
      }
          
      timeOut = setTimeout(refreshCanvas, delay);

  }

  this.checkCollision = function() {
    var wallCollision = false;
    var snakeCollision = false;
    var head = this.snake.body[0];
    var rest = this.snake.body.slice(1);
    var snakeX = head[0];
    var snakeY = head[1];
    var minX = 0;
    var minY = 0;
    var maxX = this.widthInBlock - 1;
    var maxY = this.heightInBlock - 1;
    var isNotBetweenHonrizontalWalls = snakeX < minX || snakeX > maxX;
    var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

    if (isNotBetweenHonrizontalWalls || isNotBetweenVerticalWalls) {
      wallCollision = true;
    }

    for (var i = 0; i < rest.length; i++) {
      if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
        snakeCollision = true;
      }
    }
    return wallCollision || snakeCollision;
  };

  this.gameover = function() {
    this.ctx.save();

    this.ctx.font = "bold 70px sans-serif";
    this.ctx.fillStyle = "#000";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 5;
    var centreX = this.canvas.width / 2;
    var centreY = this.canvas.height / 2;
    this.ctx.strokeText("Game Over", centreX, centreY - 180);
    this.ctx.fillText("Game Over", centreX, centreY - 180);

    this.ctx.font = "bold 30px sans-serif";
    this.ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
    this.ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
    this.ctx.restore();
  };


  this.pause = function() {
    this.ctx.save();

    this.ctx.font = "bold 70px sans-serif";
    this.ctx.fillStyle = "#000";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 5;
    var centreX = this.canvas.width / 2;
    var centreY = this.canvas.height / 2;
    this.ctx.strokeText("Pause", centreX, centreY - 180);
    this.ctx.fillText("Pause", centreX, centreY - 180);

    this.ctx.font = "bold 30px sans-serif";
    this.ctx.strokeText("Appuyer sur la touche Entrée pour continuer", centreX, centreY - 120);
    this.ctx.fillText("Appuyer sur la touche Entrée pour continuer", centreX, centreY - 120);
    this.ctx.restore();
  };


  this.drawScore = function() {
    this.ctx.save();
    this.ctx.font = "bold 200px sans-serif";
    this.ctx.fillStyle = "gray";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    var centreX = this.canvas.width / 2;
    var centreY = this.canvas.height / 2;
    this.ctx.fillText(this.score.toString(), centreX, centreY);
    this.ctx.restore();
  };

}



function Snake(body, direction) {
  this.body = body;
  this.ateApple = false;
  this.direction = direction;
  this.draw = function(ctx, blockSize) {
    ctx.save();
    ctx.fillStyle = "#ff0000";
    for (var i = 0; i < this.body.length; i++) {
      var x = this.body[i][0] * blockSize;
      var y = this.body[i][1] * blockSize;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
    ctx.restore();
  };

  this.advance = function() {
    var nextPosition = this.body[0].slice();
    switch (this.direction) {
      case "right":
        nextPosition[0] += 1;
        break;
      case "left":
        nextPosition[0] -= 1;
        break;
      case "down":
        nextPosition[1] += 1;
        break;
      case "up":
        nextPosition[1] -= 1;
        break;
      default:
        throw ("Invalid direction");

    }

    this.body.unshift(nextPosition);
    if (!this.ateApple)
      this.body.pop();
    else
      this.ateApple = false;
  };


  this.setDirection = function(newDirection) {
    var allowedDirections;
    switch (this.direction) {
      case "right":
      case "left":
        allowedDirections = ["up", "down"];
        break;
      case "down":
      case "up":
        allowedDirections = ["left", "right"];
        break;
      default:
        throw ("Invalid Direction!");
    }
    if (allowedDirections.indexOf(newDirection) > -1) {
      this.direction = newDirection;
    }
  };



  this.isEatingApple = function(appleToEat) {
    var head = this.body[0];
    if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
      return true;
    else
      return false;
  };
}



function Apple(position) {
  this.position = position;
  this.draw = function(ctx, blockSize) {
    ctx.save();
    ctx.fillStyle = "#009933";
    ctx.beginPath();
    var radius = blockSize / 2;
    var x = this.position[0] * blockSize + radius;
    var y = this.position[1] * blockSize + radius;
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
  };

  this.setNewPosition = function(widthInBlock, heightInBlock) {
    var newX = Math.round(Math.random() * (widthInBlock - 1));
    var newY = Math.round(Math.random() * (heightInBlock - 1));
    this.position = [newX, newY];
  };

  this.isOnSnake = function(snakeToCheck) {
    var isOnSnake = false;
    for (var i = 0; i < snakeToCheck.body.length; i++) {
      if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
        isOnSnake = true;
      }
    }
    return isOnSnake;
    
    
    
  };
}