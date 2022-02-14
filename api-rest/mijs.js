 
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

const { response } = require('express');

const port = process.env.port || 8888;
const express = require('express');
const res = require('express/lib/response');
const app = express();

app.get('/hola/:Estudiantes', (request, response) => {
    res.status(200).send ({ mensaje: `Hola ${req.params.prueba} desde SD`})
    response.send('Holita... esto funciona');

});
app.listen(8080, () => {
    console.log(` API ejecutandose desde hhtp//localhost:${port}/hola/Estudiantes`);
});
