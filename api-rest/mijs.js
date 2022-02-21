

'use strict'

const port    = process.env.port || 3000;
const express = require('express');
const logger  = require('morgan');
const { request, response } = express;


const app = express();  


// Declaramos los middleware 
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());

app.get( '/api/product', (request, response) =>{
    response.status(200).send({products :[]});
});
app.get( '/api/product/:productID', (request, response) =>{
    response.status(200).send({products :`${request.params.productID}`});
});
app.post( '/api/product', (request, response) =>{
    console.log(request.body);
    response.status(200).send({products :'El producto se ha recibido'});
});
app.put('/api/product/:productID', (request, response) =>{
    response.status(200).send({products :`${request.params.productID}`});
});
app.delete('/api/product/:productID', (request,response) =>{
    request.status(200).send(({products :`${request.params.productID}`}));
});
app.listen(port , () => {
    console.log(` API ejecutandose desde http//localhost:${port}/hola/Estudiantes`);
});

