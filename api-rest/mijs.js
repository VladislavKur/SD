 
/*var http = require('http'); 
var server = http.createServer(); 
 
function HTTP_Response(request, response) { 
    response.writeHead(200, {'Content-Type': 'text/plain'}); 
    response.write('Hola a todas y a todos!\n'); 
    response.end(); 
} 
 
server.on('request', HTTP_Response); 
server.listen(8080); 
 
console.log('Servidor ejecutándossdsadadasd en puerto 8080...');
*/

'use strict'

const port = process.env.port || 8888;
const express = require('express');

const app = express();

app.get('/hola/:Estudiantes', (request, response) => {
    response.status(200).send({ mensaje: `Hola ${request.params.Estudiantes} desde SD`})

});
app.listen(port , () => {
    console.log(` API ejecutandose desde hhtp//localhost:${port}/hola/Estudiantes`);
});
