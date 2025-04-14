var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballColor = "grey";
var ballRadius = 10;

/*var rowcolors = ["grey", "black", "#2a2a2a"];*/
var coffeeBeanImg = new Image();
coffeeBeanImg.src = "./img/coffeeBean.png";



var paddlecolor = "#8b8b8b";

//updated
var gameStarted = false;
var countdown = 3;
var isPaused = false;
var pauseImage = new Image();
pauseImage.src = "./img/pause.png";

//timer
var gameTime = 0;
var timerInterval;
var timerRunning = false;

//bricks
var bricks = [];


var currentLevel = "medium"; // default level
var levelSettings = {
    easy: {
        ballSpeed: 1.5,
        paddleWidth: 100,
        brickRows: 3
    },
    medium: {
        ballSpeed: 2,
        paddleWidth: 75,
        brickRows: 4
    },
    hard: {
        ballSpeed: 3,
        paddleWidth: 50,
        brickRows: 5
    },
    special: {
        ballRadius: 30,
        brickRows: 5,
        paddleWidth: 100,
        ballSpeed: 2
        
    }
};


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddlecolor;
    ctx.fill();
    ctx.strokeStyle = "red";  // Add border for visibility
    ctx.stroke();
    ctx.closePath();
    console.log("Drawing paddle at:", paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

// Brick setup
var brickRowCount = levelSettings[currentLevel].brickRows;
var brickColumnCount = 10;
var brickWidth = 60;
var brickHeight = 40;
var brickPadding = 2;
var brickOffsetTop = 40;
var brickOffsetLeft = 40;

/*var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1 
        };
    }
}*/

//brick with image 

function initBricks() {
    bricks = [];
    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {
                x: 0,
                y: 0,
                status: 1,
                img: coffeeBeanImg  // Use the single preloaded image
            };
        }
    }
}

// Drawing bricks
/*function drawBricks() {

    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fill();
                ctx.closePath();

                var random = Math.floor(Math.random() * rowcolors.length);
                for (i = 0; i < random; i++) {
                    ctx.fillStyle = rowcolors[i]; //barvanje vrstic
                }
            }
        }
    }
}*/

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                if (coffeeBeanImg.complete) {
                    ctx.drawImage(coffeeBeanImg, brickX, brickY, brickWidth, brickHeight);
                } else {
                    // Fallback to rectangle if image not loaded
                    ctx.fillStyle = "#8B4513"; // Brown color
                    ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                }
            }
        }
    }
}

// Collision detection with bricks
/*function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0; // Brick is destroyed
                    score++;
                    // In collisionDetection function - win condition
                    if (score == brickRowCount * brickColumnCount) {
                        manageTimer('stop');
                        const minutes = Math.floor(gameTime / 60);
                        const seconds = gameTime % 60;
                        const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        
                        Swal.fire({
                            title: 'YOU WIN!',
                            html: `
                                <div style="margin-bottom: 20px;">CONGRATULATIONS!</div>
                                <div>Score: ${score}</div>
                                <div>Time: ${formattedTime}</div>
                            `,
                            icon: 'success',
                            confirmButtonText: 'Play Again',
                            customClass: {
                                confirmButton: 'swal-confirm-button'
                            },
                            buttonsStyling: false
                        }).then((result) => {
                            document.location.reload();
                        });
                    }
                }
            }
        }
    }
}*/

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                // You could make the hitbox slightly smaller than the image
                var hitboxPadding = 5;
                if (x > b.x + hitboxPadding &&
                    x < b.x + brickWidth - hitboxPadding &&
                    y > b.y + hitboxPadding &&
                    y < b.y + brickHeight - hitboxPadding) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    // In collisionDetection function - win condition
                    if (score == brickRowCount * brickColumnCount) {
                        manageTimer('stop');
                        const minutes = Math.floor(gameTime / 60);
                        const seconds = gameTime % 60;
                        const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                        Swal.fire({
                            title: 'YOU WIN!',
                            html: `
                                                    <div style="">CONGRATULATIONS!</div>
                                                    <div>Score: ${score}</div>
                                                    <div>Time: ${formattedTime}</div>
                                                `,
                            icon: 'success',
                            confirmButtonText: 'PLAY AGAIN',
                            customClass: {
                                confirmButton: 'swal-confirm-button'
                            },
                            buttonsStyling: false
                        }).then((result) => {
                            document.location.reload();
                        });
                    }
                }
            }
        }
    }
}

var score = 0;
function drawScore() {
    ctx.font = "16px Times New Roman";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 8, 20);
}

// Mouse control for paddle
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function draw() {
    if (!gameStarted || isPaused) {
        if (isPaused) {
            // In your draw function where you display the pause image:
            var displayWidth = 100; // Your desired width
            var displayHeight = 100; // Your desired height
            var imgX = (canvas.width - displayWidth) / 2;
            var imgY = (canvas.height - displayHeight) / 2;
            ctx.drawImage(pauseImage, imgX, imgY, displayWidth, displayHeight);
        }
        return;
    }


    //special
    if (specialMode) {
        if(score == 0){
            paddleWidth = 100;
            ballSpeed = 2;
            ballRadius = 30;
        }
        if(score == 10){
            paddleWidth = 70;
            ballSpeed = 3;
            ballRadius = 20;
        }
        if(score == 20){
            paddleWidth = 50;
            ballSpeed = 4;
            ballRadius = 10;
        }
        if(score == 30){
            paddleWidth = 30;
            ballSpeed = 5;
            ballRadius = 5;
        }
        if(score == 40){
            paddleWidth = 10;
            ballSpeed = 6;
            ballRadius = 20;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    collisionDetection();

    x += dx;
    y += dy;

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    }

    if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            if (gameStarted) {
                gameStarted = false;
                manageTimer('stop');
                const minutes = Math.floor(gameTime / 60);
                const seconds = gameTime % 60;
                const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                Swal.fire({
                    title: 'GAME OVER!',
                    html: `
                        Better luck next time!
                        <div>Score: ${score}</div>
                        <div>Time: ${formattedTime}</div>
                    `,
                    icon: 'error',
                    confirmButtonText: 'PLAY AGAIN',
                    customClass: {
                        confirmButton: 'swal-confirm-button'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    document.location.reload();
                });
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
}

//Start button and countdown
document.addEventListener("DOMContentLoaded", function () {
    var levelSelection = document.getElementById("levelSelection");
    var startButton = document.getElementById("startButton");
    var startScreen = document.getElementById("startScreen");
    var countdownElement = document.getElementById("countdown");

    // Level selection buttons
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentLevel = this.dataset.level;
            specialMode = (currentLevel === "special");
            
            // Apply level settings
            dx = levelSettings[currentLevel].ballSpeed;
            dy = -levelSettings[currentLevel].ballSpeed;
            paddleWidth = levelSettings[currentLevel].paddleWidth;
            brickRowCount = levelSettings[currentLevel].brickRows;
            
            // Reinitialize bricks
            initBricks();
            
            // Hide level selection and show start screen
            levelSelection.style.display = "none";
            startScreen.style.display = "flex";
        });
    });

    startButton.addEventListener("click", function () {
        startButton.style.display = "none";
        countdownElement.style.display = "block";
    
        var countdownInterval = setInterval(function () {
            countdownElement.textContent = countdown;
            countdown--;
    
            if (countdown < 0) {
                clearInterval(countdownInterval);
                startScreen.style.display = "none";
                gameStarted = true;
                
                // Moved timer start here (after countdown ends)
                manageTimer('start'); // Now starts only when countdown finishes
                
                draw();
            }
        }, 1000);
    });

    // Initialize game
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = levelSettings[currentLevel].ballSpeed;
    dy = -levelSettings[currentLevel].ballSpeed;
    paddleWidth = levelSettings[currentLevel].paddleWidth;
});

// Add this event listener with your other event listeners
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 32) { // Spacebar
        isPaused = !isPaused;
        if (isPaused) {
            if (timerRunning) manageTimer('stop');
        } else {
            if (gameStarted && !timerRunning) manageTimer('start');
            if (gameStarted) requestAnimationFrame(draw);
        }
    }
});

//timer
function manageTimer(action) {
    if (action === 'start') {
        gameTime = 0;
        timerRunning = true;
        updateTimerDisplay();
        timerInterval = setInterval(function () {
            gameTime++;
            updateTimerDisplay();
        }, 1000);
    } else if (action === 'stop') {
        clearInterval(timerInterval);
        timerRunning = false;
    }
}

function updateTimerDisplay() {
    var minutes = Math.floor(gameTime / 60);
    var seconds = gameTime % 60;
    document.getElementById('timerDisplay').textContent =
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds;
}



draw();