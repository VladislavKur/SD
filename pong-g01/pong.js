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
const BALL_VELOCIDAD = 5;

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
    speed: BALL_VELOCIDAD,
    velocityX: BALL_VELOCIDAD,
    velocityY: BALL_VELOCIDAD
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

localPlayer = playerA;
computer = playerB;


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
        drawRect(net.x, net.y, net.witdh, net.height, net.color);
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

function render() {
    clearCanvas();

    drawNet();
    drawScore();
    drawPaddle(localPlayer);
    drawPaddle(computer);
    drawBall();



}

function pause(ms) {
    const currentTime = new Date().getTime();
    while (currentTime + ms >= new Date().getTime()) {

    }
}

function newBall() {
    // console.log("TANTO!");
    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;
    const direccion = ball.velocityX > 0 ? -1 : 1;
    ball.velocityX = direccion * BALL_VELOCIDAD;
    ball.velocityY = BALL_VELOCIDAD;
    ball.speed = BALL_VELOCIDAD;

    pause(4000);

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
        const angleRad = colliderPoint * Math.PI / 4;

        //calculamos la nueva direccion  en el eje X
        const direccion = (ball.x < cvs.width / 2) ? 1 : -1;

        //modificamos la velocidad de la pelota
        ball.velocityX = direccion * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

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

function loopGame() {
    update();
    render();
}

function initLoopGame() {
    setInterval(loopGame, 1000 / FRAME_PER_SECOND);
}

function play() {
    initLoopGame();
}

play();