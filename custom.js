var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

var ballX = canvas.width / 2;
var ballY = canvas.height -50;
var ballRadius = 7;
var dx = 3;
var dy = -dx + 1;
var paddleHeight = 10;
var paddleWidth = 76;
var paddleX = canvas.width / 2 - paddleWidth / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 70;
var brickHeight = 20;
var brickPadding = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 35;
var bricks = [];
var score = 0;
const scoreDisplay = document.querySelector(".high-score");
const buttonLeft = document.querySelector('.button-left');
const buttonRight = document.querySelector('.button-right');
const btnReset = document.querySelector('.reset');
var  highscore = parseInt(localStorage.getItem("highScore"));

function generateBricks(){
	for(var c=0;c<brickColumnCount;c++){
		bricks[c] = [];
		for(var r=0;r<brickRowCount;r++){
			bricks[c][r] = {x: 0, y: 0, status: 1};
		}
	}
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

if(isNaN(highscore)){
	highscore = 0;
}

scoreDisplay.innerHTML = 'High Score : '+ highscore;

buttonLeft.addEventListener('click', function(){
	paddleX -= 40
	if(paddleX < 0){
		paddleX = 0;
	}
});

buttonRight.addEventListener('click', function(){
	paddleX += 40
	if(paddleX + paddleWidth > canvas.width){
		paddleX = canvas.width - paddleWidth;
	}
});

btnReset.addEventListener('click', function(){
	reset();
	localStorage.setItem('highScore', 0);
	scoreDisplay.innerHTML = 'High Score : '+ highscore;
})

function keyDownHandler(e){
	if(e.key == 'Right' || e.key == 'ArrowRight'){
		rightPressed = true;
	} else if(e.key == 'Left' || e.key == 'ArrowLeft'){
		leftPressed = true;
	}
}

function keyUpHandler(e){
	if(e.key == 'Right' || e.key == 'ArrowRight'){
		rightPressed = false;
	} else if(e.key == 'Left' || e.key == 'ArrowLeft'){
		leftPressed = false;
	}
}

function drawBricks(){
	for(var c=0;c<brickColumnCount;c++){
		for( var r=0;r<brickRowCount;r++){
			if(bricks[c][r].status == 1){
				var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = '#230c33';
				ctx.closePath();
				ctx.fill();
			}
		}
	}
}

function collisionDetection(){
	for(var c=0;c<brickColumnCount;c++){
		for(var r=0;r<brickRowCount;r++){
			var b = bricks[c][r];
			if(b.status == 1){
				if(ballX >= b.x && ballX <= b.x + brickWidth && ballY >= b.y && ballY <= b.y + brickHeight){
					dy *= -1;
					b.status = 0;
					score++;
				}
			}
		}
	}
}

function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#230c33";
	ctx.fillText("Score: " + score, 8, 20);
}

function movePaddle(){
	if(rightPressed){
		paddleX +=7;
		if(paddleX + paddleWidth >= canvas.width){
			paddleX = canvasWidth - paddleWidth;
		}
	} else if(leftPressed){
		paddleX -= 7;
		if(paddleX < 0){
			paddleX = 0;
		}
	}
}

function ball(){
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2, true);
	ctx.fillStyle = '#230c33';
	ctx.closePath();
	ctx.fill();
}

function paddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#230c33';
	ctx.closePath();
	ctx.fill();
}

function reset(){
	generateBricks();
	
	ballX = canvas.width / 2;
	ballY = canvas.height -50;
	ballRadius = 7;
	dx = 3;
	dy = -dx + 1;
	paddleHeight = 10;
	paddleWidth = 76;
	paddleX = canvas.width / 2 - paddleWidth / 2;
	rightPressed = false;
	leftPressed = false;
	
	paddle();
	ball();
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ball();
	paddle();
	movePaddle();
	drawBricks()
	collisionDetection();
	levelUp();
	drawScore();
	
	ballX += dx;
	ballY += dy;
	
	if(ballX + ballRadius > canvas.width || ballX + ballRadius < 0){
		dx *= -1;
	}
	
	if(ballY + ballRadius > canvas.height || ballY + ballRadius < 0){
		dy *= -1;
	}
	
	if(ballY + ballRadius > canvas.height){
		if(score > parseInt(localStorage.getItem('highScore'))){
			localStorage.setItem('highScore', score.toString());
			scoreDisplay.innerHTML = 'High Score : '+ score;
		}
		score = 0;
		reset();
	}
	
	if(ballX >= paddleX && ballX <= paddleX + paddleWidth && ballY + ballRadius >= canvas.height - paddleHeight){
		dy *= -1;
	}
	
	
	requestAnimationFrame(draw);
}

function levelUp(){
	if(score % 15 == 0 && score != 0){
		generateBricks();
	}
}

generateBricks();
draw();