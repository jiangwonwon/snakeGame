const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const unit = 20;

const rows = canvas.height / unit;
const columns = canvas.width / unit;
//蛇的初始位置
let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: snake[0].x - unit,
    y: snake[0].y,
  };

  snake[2] = {
    x: snake[1].x - unit,
    y: snake[1].y,
  };

  snake[3] = {
    x: snake[2].x - unit,
    y: snake[2].y,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * columns) * unit;
    this.y = Math.floor(Math.random() * rows) * unit;
  }
  //畫出食物
  drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  //確保食物不會出現在蛇身上
  pickALocation() {
    let overlapping = false;
    let newX;
    let newY;

    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX === snake[i].x && newY === snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      newX = Math.floor(Math.random() * columns) * unit;
      newY = Math.floor(Math.random() * rows) * unit;
      changeDirection(newX, newY);
    } while (overlapping);

    this.x = newX;
    this.y = newY;
  }
}

class badFruit {
  constructor() {
    this.x = Math.floor(Math.random() * columns) * unit;
    this.y = Math.floor(Math.random() * rows) * unit;
  }
  //畫出有毒食物
  drawbadFruit() {
    ctx.fillStyle = "purple";
    ctx.fillRect(this.x, this.y, unit, unit);
    ctx.strokeStyle = "darkpurple";
    ctx.strokeRect(this.x, this.y, unit, unit);
  }
  //確保有毒食物不會出現在蛇和Fruit身上
  pickALocation() {
    let badOverlapping = false;
    let badNewX;
    let badNewY;
    function badCheckOverlap(badNewX, badNewY) {
      for (let i = 0; i < snake.length; i++) {
        if (
          (badNewX === snake[i].x && badNewY === snake[i].y) ||
          (badNewX === fruit.x && badNewY === fruit.y)
        ) {
          badOverlapping = true;
          return;
        } else {
          badOverlapping = false;
        }
      }
    }

    do {
      badNewX = Math.floor(Math.random() * columns) * unit;
      badNewY = Math.floor(Math.random() * rows) * unit;
      changeDirection(badNewX, badNewY);
    } while (badOverlapping);

    this.x = badNewX;
    this.y = badNewY;
  }
}

//初始設定
createSnake();
let fruit = new Fruit();
let badfruit = new badFruit();
window.addEventListener("keydown", changeDirection);
//蛇的移動方向
let d = "Right";
function changeDirection(event) {
  //   console.log(event);
  if (event.key === "ArrowLeft" && d !== "Right") {
    d = "Left";
    // console.log("Left");
  } else if (event.key === "ArrowUp" && d !== "Down") {
    d = "Up";
    // console.log("Up");
  } else if (event.key === "ArrowRight" && d !== "Left") {
    d = "Right";
    // console.log("Right");
  } else if (event.key === "ArrowDown" && d !== "Up") {
    d = "Down";
    // console.log("Down");
  }

  window.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadhighestScore();
let score = 0;
document.getElementById("score").innerHTML = "目前分數: " + score;
document.getElementById("highestScore").innerHTML = "最高分數: " + highestScore;

function draw() {
  //檢查蛇頭是否碰到身體
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }
  //畫布背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //畫出食物和有毒食物
  fruit.drawFruit();
  badfruit.drawbadFruit();

  console.log("Drawing...");
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "green";
    }
    ctx.strokeStyle = "darkgreen";
    //邊界穿越
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //移動蛇
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d === "Left") {
    snakeX -= unit;
  } else if (d === "Up") {
    snakeY -= unit;
  } else if (d === "Right") {
    snakeX += unit;
  } else if (d === "Down") {
    snakeY += unit;
  }
  //新增蛇頭
  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  //吃到食物
  if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
    fruit.pickALocation();
    score += 10;
    saveHighestScore(score);
    document.getElementById("score").innerHTML = "目前分數: " + score;
    document.getElementById("highestScore").innerHTML =
      "最高分數: " + highestScore;
    snake.unshift(newHead);
  } else if (snake[0].x === badfruit.x && snake[0].y === badfruit.y) {
    badfruit.pickALocation();
    score -= 10;
    saveHighestScore(score);
    document.getElementById("score").innerHTML = "目前分數: " + score;
    // document.getElementById("highestScore").innerHTML =
    //   "最高分數: " + highestScore;
    snake.unshift(newHead);
    snake.pop();
    snake.pop();
  } else {
    snake.pop();
    snake.unshift(newHead);
  }

  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadhighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function saveHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
