'use strict'

const port = process.env.PORT || 5000;

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public/'));
const server = app.listen(port, () => {
    console.log(`juego pong en http://localhost:${port}`);
});

//crear servicio tipo webSocket (en lugar de webService rest)
const socket = require('socket.io');
const io = socket(server);

io.sockets.on('connect', onConnect);

//defino el estado global del juego
function initThings() {
    let connections = [];
    let currentState = {
        players: [{}, {}],
        ball: {}
    }
}

//definimos nuestro WebSocket

function onConnect(socket) {
    console.log('OnConnect');
    if (connections.length < 1) initThings();
    connections.push(socket.id);

    if (connections.length > 2) {
        console.error('OnConnection: demasiados jugadores');
        return;
    }

    sendCounter();


    //sendCounter();
    socket.on('start', onStart);
    socket.on('updateBall', onUpdateBall);
    socket.on('updatePlayer', onUpdatePlayer);
    socket.on('disconnect', onDisconnect);
    socket.on('updateScore', onUpdateScore);

    setInterval(heartBeat, 33);

}

//Declaramos los metodos entrantes
function onStart(state) {
    console.log('OnStart ' + state);
    const index = connections[0] === state.id ? 0 : 1;
    const csp = currentState.players[index];
    csp.id = state.id;
    csp.y = state.y;
    csp.w = state.w;
    csp.h = state.h;
    csp.score = 0;
}

function onUpdateBall(state) {
    const cBall = currentState.ball;
    cBall.x = state.x;
    cBall.y = state.y;
    cBall.speed = state.speed;
    cBall.velocityX = state.velocityX;
    cBall.velocityY = state.velocityY;

};

function onDisconnect(reason, details) {
    console.log('onDisconnect: ', reason);

    const index = connections.indexOf(this.id);
    if (index >= 0) {
        connections.splice(index, 1);

        for (let i = 0, found = false; i < currentState.players.length && !found; i++) {
            if (currentState.players[i].id === this.id) {
                found = true;
                currentState.players[i] = {};
            }
        }
    }
    // initThings();
}

function onUpdatePlayer(state) {

    //buscamos que jugador es aparir de su socket ID
    for (let i = 0, found = false; i < currentState.players.length && !found; i++) {
        if (currentState.players[i].id === state.id) {
            found = true;
            currentState.players[i].y = state.y;
            //currentState.players[i].score = state.score;

        }
    }

};

function onUpdateScore(scoreIndx) {
    currentState.players[scoreIndx].score++;
    sendScoreUpdate(scoreIndx);
}
//Declaramos los metodos salientes

function sendCounter() {
    io.sockets.emit('getCounter', connections.length);
}

function heartBeat() {
    io.sockets.emit('heartBeat', currentState);
}

function sendScoreUpdate(scoreIndx) {
    io.sockets.emit('updateScore', scoreIndx);

}