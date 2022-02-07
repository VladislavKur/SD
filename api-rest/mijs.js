 
var http = require('http'); 
var server = http.createServer(); 
 
function HTTP_Response(request, response) { 
    response.writeHead(200, {'Content-Type': 'text/plain'}); 
    response.write('Hola a todas y a todos!\n'); 
    response.end(); 
} 
 
server.on('request', HTTP_Response); 
server.listen(8080); 
 
console.log('Servidor ejecutándossdsadadasd en puerto 8080...');