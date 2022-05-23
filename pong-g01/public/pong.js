const { send } = require("express/lib/response");

//DECLARACIONES
const FONT_COLOR = 'WHITE';
const FONT_SIZE = "45px";
const FONT_FAMILY = "impact";

const FRAME_PER_SECOND = 50;
const remotePLayer_LVL = 0.1;

const NUM_BALLS = 5;
const BALL_COLOR = 'WHITE';
const BALL_RADIOUS = 10;
const BALL_DELTATIME = 0.5;
const BALL_VELOCITY = 5;

const BG_COLOR = 'BLACK';

const PADDLE_RIGHT_COLOR = 'WHITE';
const PADDLE_LEFT_COLOR = 'WHITE';
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
let localPlayer;
let remotePLayer;

//SOCKET HELPER -----------------------------------------------------------------------!
const WEBSOCKET_SERVER = 'http://localhost:5000';
const LOCAL_PLAYER_COLOR = "RED";

let socket;
let localPlayerIndex;
let remotePlayerIndex;

// EMISION DE ENEVENTOS

function sendBallStatus() {
    const ballStatus = {
        x: ball.x,
        y: ball.y,
        speed: ball.speed,
        velocityX: ball.velocityX,
        velocityY: ball.velocityY
    }
    socket.emit('updateBall', ballStatus);
}

function sendLocalPlayerStatus(canal = 'updatePlayer') {
    const playerStatus = {
        y: localPlayer.y,
        id: localPlayer.id,
        w: localPlayer.w,
        h: localPlayer.h //,
            //score: localPlayer.score
    }
    socket.emit(canal, playerStatus)
}

function sendUpdateScore(scoreIndx) {
    socket.emit('updateScore', scoreIndx);
}
// EVENTOS ENTRANTES

function onHeartBeat(state) {
    //actualizamos el estado del jugador remoto

    remotePLayer.y = state.players[remotePlayerIndex].y;

    //actalizamos el estado de la pelota
    ball.x = state.ball.x;
    ball.y = state.ball.y;
    ball.speed = state.ball.speed;
    ball.velocityX = state.ball.velocityX;
    ball.velocityY = state.ball.velocityY;
}

function onUpdateScore(scoreIndx) {
    // si es el jugador que recibe el tanto, reajusto la pelota 
    if (scoreIndx === 1 && localPlayer.x === 0 || scoreIndx === 0 && localPlayer.x !== 0) {
        newBall();
    }
    scoreIndx === 0 ? playerA.score++ : playerB.score++;
}



function setPlayer(serverCounter) {
    function registerPlayer(local, remoto, localIndx, remoteIndx) {
        localPlayer = local;
        remotePLayer = remote;
        localPlayerIndex = localIndx;
        remoteIndx = remoteIndx;

        localPlayer.id = socket.id;
        localPlayer.color = LOCAL_PLAYER_COLOR;
        localPlayer.y = cvs.height / 2 - localPlayer.height / 2;
        localPlayer.score = 0;

        sendLocalPlayerStatus('start');
    }

    switch (serverCounter) {
        case 1: // si es la primera llamada, somos nosotros
            registerPlayer(playerA, playerB, 0, 1);
            drawText("Esperando Rival... ", cvs.width / 4, cvs.height / 2, "GREEN");
            break;
        case 2: // si es la segunda llamada, ya hay alguien registrado
            if (playerA.id === undefined) {
                registerPlayer(playerB, playerA, 1, 0);
            }

            //AMBOS JUGADORES 
            console.log('COMENZAMOS EL JUEGO ');
            newBall();
            sendBallStatus();
            socket.on('heartBeat', onHeartBeat);
            initgameLoop();
            break;
    }

}
// iniciamos la conexion
function initServerConnection() {
    socket = io.connect(WEBSOCKET_SERVER);
    socket.on('getCounter', setPlayer);
    socket.on('updateScore', onUpdateScore);
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

function drawBoard() {
    clearCanvas();

    drawNet();

    drawPaddle(playerA);
    drawPaddle(playerB);

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
    drawText(localPlayer.score, localPlayer.x === 0 ? 1.5 : 3.5 * (cvs.width / 4), cvs.height / 5);
    drawText(remotePLayer.score, remotePLayer.x === 0 ? 1.5 : 3.5 * (cvs.width / 4), cvs.height / 5);
}

function drawPaddle(paddle) {
    drawRect(paddle.x, paddle.y, paddle.w, paddle.h, paddle.color);
}

function drawBall() {
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function isGameOver() {
    return localPlayer.score >= NUM_BALLS || remotePLayer.score >= NUM_BALLS;
}

function endGame() {
    console.log("GAME OVER");

    drawText("GAMEOVER", cvs.width / 3, cvs.height / 2, "BLUE", 150);
    stopGameLoop();
    sendBallStatus();
    sendLocalPlayerStatus();
    setTimeout(() => { socket.disconnect(); }, 100);

}

function render() {
    clearCanvas();

    drawNet();
    drawScore();
    drawPaddle(localPlayer);
    drawPaddle(remotePLayer);


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

    //pause(1000);

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

/* function updateremotePLayer() {
    remotePLayer.y = (ball.y - (remotePLayer.h / 2)) * (1 - remotePLayer_LVL);

} */

function update() {
    // console.log("actualizando...");
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    //updateremotePLayer();
    //si golpea los bordes ,rebota
    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }


    //Verificamos si la bola golpea la pala
    let whatPlayer = (ball.x < cvs.width / 2) ? playerA : playerB;
    let escalar = false;
    /*     if (whatPlayer.h < PADDLE_HEIGHT - 70) {
            console.log("a");
            escalar = 1;
        }
        if (whatPlayer.h > PADDLE_HEIGHT + 30) {
            escalar = -1;
        } */
    //whatPlayer.h += (escalar * 3);
    console.log(whatPlayer.h);
    //console.log(whatPlayer);
    if (collision(ball, whatPlayer)) {
        let colliderPoint = ball.y - (whatPlayer.y + whatPlayer.h / 2);
        colliderPoint = colliderPoint / (whatPlayer.h / 2)
        const angleRad = (colliderPoint * Math.PI / 4);

        //calculamos la nueva direccion  en el eje X
        const direccion = (ball.x < cvs.width / 2) ? 1 : -1;

        //modificamos la velocidad de la pelota
        angulo = ball.y < whatPlayer.y ? -1 : 1;
        ball.velocityX = direccion * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * (angulo * Math.sin(angleRad));

        ball.speed += BALL_DELTATIME;
    } else {

        if (ball.x - ball.radius < 0) {
            if (localPlayerIndex === 1) {
                newBall();
                sendBallStatus();
                sendUpdateScore(localPlayerIndex);
            }

        } else if (ball.x + ball.radius > cvs.width) {
            if (localPlayerIndex === 0) {
                newBall();
                sendBallStatus();
                sendUpdateScore(localPlayerIndex);
            }
        }
    }
    sendLocalPlayerStatus();
    sendBallStatus();
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
    drawBoard();
    initServerConnection();
    initPaddleMovement();
}

play();