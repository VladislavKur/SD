//DECLARACIONES
const FONT_COLOR = 'WHITE';
const FONT_SIZE = "45px";
const FONT_FAMILY = "impact";

const FRAME_PER_SECOND = 50;
const COMPUTER_LVL = 0.1;

const NUM_BALLS = 5;
const BALL_COLOR = 'WHITE';
const BALL_RADIOUS = 10;
const BALL_DELTATIME = 0.5;
const BALL_VELOCITY = 5;

const BG_COLOR = 'BLACK';

const PADDLE_RIGHT_COLOR = 'WHITE';
const PADDLE_LEFT_COLOR = 'RED';
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;

const NET_COLOR = 'WHITE';
const NET_WIDTH = 4;
const NET_HEIGHT = 10;
const NET_PADDING = 15;

// recuperamos el canvas
const cvs = document.getElementById("pong_canvas");
const ctx = cvs.getContext('2d');

// OBJETOS DEL JUEGO

const playerA = {
    x: 0,
    y: cvs.height / 2 - PADDLE_HEIGHT / 2,
    w: PADDLE_WIDTH,
    h: PADDLE_HEIGHT,
    color: PADDLE_LEFT_COLOR,
    score: 0
}
const playerB = {
    x: cvs.width - PADDLE_WIDTH,
    y: cvs.height / 2 - PADDLE_HEIGHT / 2,
    w: PADDLE_WIDTH,
    h: PADDLE_HEIGHT,
    color: PADDLE_RIGHT_COLOR,
    score: 0
}
const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: BALL_RADIOUS,
    speed: BALL_VELOCITY,
    velocityX: BALL_VELOCITY,
    velocityY: BALL_VELOCITY
}
const net = {
        x: cvs.width / 2 - NET_WIDTH / 2,
        y: 0,
        width: NET_WIDTH,
        height: NET_HEIGHT,
        padding: NET_PADDING,
        color: NET_COLOR
    }
    //DECLARACION DE LOS JUGADORES
var localPlayer;
var computer;

function setPlayer() {

    localPlayer = playerA;
    computer = playerB;

}


//HELPERS basicos para el canvas
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

}

function drawText(text, x, y, color = FONT_COLOR, fontSize = FONT_SIZE, fontFamily = FONT_FAMILY) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.fillText(text, x, y);
}

//HELPERS basicos  jugadores

function clearCanvas() {
    drawRect(0, 0, cvs.width, cvs.height, BG_COLOR);
}

function drawNet() {
    for (let i = 0; i < cvs.height; i += net.padding) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawScore() {
    drawText(localPlayer.score, 1.5 * (cvs.width / 4), cvs.height / 5);
    drawText(computer.score, 2.5 * (cvs.width / 4), cvs.height / 5);
}

function drawPaddle(paddle) {
    drawRect(paddle.x, paddle.y, paddle.w, paddle.h, paddle.color);
}

function drawBall() {
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function isGameOver() {
    return localPlayer.score >= NUM_BALLS || computer.score >= NUM_BALLS;
}

function endGame() {
    console.log("GAME OVER");

    drawText("GAMEOVER", cvs.width / 3, cvs.height / 2, "BLUE", 150);
    stopGameLoop();
}

function render() {
    clearCanvas();

    drawNet();
    drawScore();
    drawPaddle(localPlayer);
    drawPaddle(computer);


    if (isGameOver()) {
        endGame();
    } else drawBall();



}


function pause(ms) {
    stopGameLoop();
    setTimeout(() => {
        initgameLoop();
    }, ms);
}


function newBall() {
    // console.log("TANTO!");
    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;
    const direccion = ball.velocityX > 0 ? -1 : 1;
    ball.velocityX = direccion * BALL_VELOCITY;
    ball.velocityY = BALL_VELOCITY;
    ball.speed = BALL_VELOCITY;

    pause(1000);

}

function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;

}

function updateComputer() {
    computer.y = (ball.y - (computer.h / 2)) * (1 - COMPUTER_LVL);

}

function update() {
    // console.log("actualizando...");
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    updateComputer();
    //si golpea los bordes ,rebota
    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    //Verificamos si la bola golpea la pala
    let whatPlayer = (ball.x < cvs.width / 2) ? playerA : playerB;
    //console.log(whatPlayer);
    if (collision(ball, whatPlayer)) {
        let colliderPoint = ball.y - (whatPlayer.y + whatPlayer.h / 2);
        colliderPoint = colliderPoint / (whatPlayer.h / 2)
        const angleRad = (colliderPoint * Math.PI / 4);

        //calculamos la nueva direccion  en el eje X
        const direccion = (ball.x < cvs.width / 2) ? 1 : -1;

        //modificamos la velocidad de la pelota
        angulo = ball.y < whatPlayer.y ? 1 : -1;
        ball.velocityX = direccion * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * (angulo * Math.sin(angleRad));

        ball.speed += BALL_DELTATIME;
    } else {

        if (ball.x - ball.radius < 0) {
            computer.score++;
            newBall();

        } else if (ball.x + ball.radius > cvs.width) {
            localPlayer.score++;
            newBall();
        }
    }

}

function gameLoop() {
    update();
    render();
}
let gameLoopId;

function stopGameLoop() {
    clearInterval(gameLoopId);
}

function initgameLoop() {
    gameLoopId = setInterval(gameLoop, 1000 / FRAME_PER_SECOND);
}

function updateLocalPlayerPos(event) {
    const rect = cvs.getBoundingClientRect();
    localPlayer.y = event.clientY - localPlayer.h / 2 - rect.top;
}

function initPaddleMovement() {
    cvs.addEventListener('mousemove', updateLocalPlayerPos);
}



function play() {
    setPlayer();
    initPaddleMovement();
    initgameLoop();
}

play();