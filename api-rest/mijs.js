 
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
const express = require('express');
const app = express();
app.get('/hola', (request, response) => {
    response.send('Holita... esto funciona');

});
app.listen(8080, () => {
    console.log("console log");
})