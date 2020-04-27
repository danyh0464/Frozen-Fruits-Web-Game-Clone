var canvas, canvasContext;
var ballX = 500;
var ballY = 1;
const BALL_NORMAL_SPEED_X = 7;
const BALL_NORMAL_SPEED_Y = 5;
const BALL_ACCELERATION = 1.5;
var ballSpeedX = 0;
var ballSpeedY = BALL_NORMAL_SPEED_Y;
const BALL_SIZE = 40;
const BLOCK_SIZE = 80;
const ballColor = 'green.png'; // this is the color you begin with
var bouncingOffWall = false;
var keys = [];
// audio files
var bounceSound;
var ball_image, bg_image;
function areColliding(x1, y1, size1, x2, y2, size2) {
  if (((x1 >= x2 && x1 <= x2 + size2) // the left-up corner of the first object is between the up corners for the second
    && (y1 >= y2 && y1 <= y2 + size2)) || // the left-up corner of the first object is between the left corners for the second

    ((x1 + size1 >= x2 && x1 + size1 <= x2 + size2)
      && (y1 >= y2 && y1 <= y2 + size2)) ||

    ((x1 >= x2 && x1 <= x2 + size2)
      && (y1 + size1 >= y2 && y1 + size1 <= y2 + size2)) ||

    ((x1 + size1 >= x2 && x1 + size1 <= x2 + size2)
      && (y1 + size1 >= y2 && y1 + size1 <= y2 + size2))

    ||

    ((x2 >= x1 && x2 <= x1 + size1)
      && (y2 >= y1 && y2 <= y1 + size1)) ||

    ((x2 + size2 >= x1 && x2 + size2 <= x1 + size1)
      && (y2 >= y1 && y2 <= y1 + size1)) ||

    ((x2 >= x1 && x2 <= x1 + size1)
      && (y2 + size2 >= y1 && y2 + size2 <= y1 + size1)) ||

    ((x2 + size2 >= x1 && x2 + size2 <= x1 + size1)
      && (y2 + size2 >= y1 && y2 + size2 <= y1 + size1)))
    return true;
  else
    return false;
}
function areCollidingAtCorners(x1, y1, size1, x2, y2, size2) {
  if (x1 == x2 + size1 && y1 == y2 + size2)
    return true;
  else
    return false;
}
function openFullscreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) { /* Firefox */
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) { /* IE/Edge */
    canvas.msRequestFullscreen();
  }
}
function handleKeys() {
  if (!bouncingOffWall) {

    if (keys[39]) {
      // if you're pressingright arrow
      ballSpeedX = BALL_NORMAL_SPEED_X;
    }
    if (keys[37]) {
      // if you're pressing left arrow      

      ballSpeedX = -BALL_NORMAL_SPEED_X;
    }
    if (keys[32]) {
      //if you're pressing spacebar
      if (ballSpeedY < 0)
        ballSpeedY = -BALL_NORMAL_SPEED_Y * BALL_ACCELERATION;
      else if (ballSpeedY > 0)
        ballSpeedY = BALL_NORMAL_SPEED_Y * BALL_ACCELERATION;
      if (ballSpeedX < 0)
        ballSpeedX = -BALL_NORMAL_SPEED_X * BALL_ACCELERATION;
      else if (ballSpeedX > 0)
        ballSpeedX = BALL_NORMAL_SPEED_X * BALL_ACCELERATION;
    }
    if ((!keys[39] && !keys[37]) || (keys[39] == true && keys[37] == true))
      ballSpeedX = 0;

    if (!keys[32]) {
      if (ballSpeedY < 0)
        ballSpeedY = -BALL_NORMAL_SPEED_Y;
      else
        ballSpeedY = BALL_NORMAL_SPEED_Y;
      if (ballSpeedX < 0)
        ballSpeedX = -BALL_NORMAL_SPEED_X;
      else if (ballSpeedX > 0)
        ballSpeedX = BALL_NORMAL_SPEED_X;
    }

  }
}
window.onload = function () {
  const framesPerSecond = 60;
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  ball_image = new Image();
  ball_image.src = './img/ball/' + ballColor;
  bg_image = new Image();
  bg_image.src = './img/backgrounds/1.jpg';
  bounceSound = new Audio('./audio/bounce.mp3')

  canvas.addEventListener('mousedown', openFullscreen);
  document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
  });
  setInterval(function () {

    moveEverything();
    handleKeys();
    drawEverything();


  }, 1000 / framesPerSecond);

}
function moveEverything() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballY >= canvas.height - BALL_SIZE || ballY <= 0) {
    ballSpeedY = -ballSpeedY;
    bounceSound.play();
  }

  if (ballX <= 0 && ballSpeedX < 0) {
    ballSpeedX = BALL_NORMAL_SPEED_X;
    bouncingOffWall = true;
    bounceSound.play();
  }
  else if (ballX >= canvas.width - BALL_SIZE && ballSpeedX > 0) {
    ballSpeedX = -BALL_NORMAL_SPEED_X;
    bouncingOffWall = true;
    bounceSound.play();
  }
  else if (ballX >= 1.5 * BALL_SIZE && ballSpeedX > 0) {
    bouncingOffWall = false;
    ballSpeedX = BALL_NORMAL_SPEED_X;

  }
  else if (ballX <= canvas.width - 2.5 * BALL_SIZE && ballSpeedX < 0) {
    bouncingOffWall = false;
    ballSpeedX = -BALL_NORMAL_SPEED_X;
  }
  if (areCollidingAtCorners(ballX, ballY, BALL_SIZE, 100, 100, BLOCK_SIZE))
    ball_image.src = './img/ball/green.png';
  else if (areColliding(ballX, ballY, BALL_SIZE, 100, 100, BLOCK_SIZE)) {
    ball_image.src = './img/ball/red.png';

    if ((ballY >= 100 && ballY <= 100 + BLOCK_SIZE) || ballY <= 100) {
      ballSpeedY = -ballSpeedY;

    }

    if ((ballX <= 100 + BLOCK_SIZE && ballSpeedX < 0) || (ballX >= 100 - BALL_SIZE && ballSpeedX > 0)) {
      ballSpeedX = -ballSpeedX * 1.5;
      bouncingOffWall = true;
    }

    bounceSound.play();
  }
}

function drawEverything() {

  // painting the canvas with black
  //colorRect(0,0,canvas.width,canvas.height,'black');

  canvasContext.drawImage(bg_image, 0, 0, canvas.width, canvas.height);
  colorRect(100, 100, BLOCK_SIZE, BLOCK_SIZE, 'Red');
  canvasContext.drawImage(ball_image, ballX, ballY, BALL_SIZE, BALL_SIZE);
}
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}