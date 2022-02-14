

'use strict'

const port = process.env.port || 3000;
const { request, response } = require('express');
const express = require('express');
const logger = require('morgan');

const app = express();  
app.use(logger('dev'));

// Declaramos los middleware 
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());

/*app.get('/hola/:Estudiantes', (request, response) => {
    response.status(200).send({ mensaje: `Hola ${request.params.Estudiantes} desde SD`})

});*/

app.get( '/api/products', (request, response) =>{
    response.status(200).send({products :[]});
});
app.get( '/api/products/:productID', (request, response) =>{
    response.status(200).send({products :`${request.params.productID}`});
});
app.post( '/api/products', (request, response) =>{
    console.log(request.body);
    response.status(200).send({products :'El producto se ha recibido'});
});
app.put('/api/products/:productID', (request, response) =>{
    response.status(200).send({products :`${request.params.productID}`});
});
app.delete('/api/products/:productID', (request,response) =>{
    request.status(200).send(({products :`${request.params.productID}`}));
});
app.listen(port , () => {
    console.log(` API ejecutandose desde hhtp//localhost:${port}/hola/Estudiantes`);
});

