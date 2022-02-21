

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

// el servicio se puede llamar a una funcion o crearlo directamente
app.get( '/api/product', getProductController); 


app.get( '/api/product/:productID', (request, response) =>{
    response.status(200).send({products :`${request.params.productID}`});
});
app.post( '/api/product', (request, response) =>{
    console.log(request.body);
    response.status(200).send({product : request.body });
});
//pasamos el ID por valor 
app.put('/api/product/:productID', (request, response) =>{
    const id = request.params.productID;
    const nuevosDatos = request.body;
    response.status(200).send({
        msg: "Actualizando Nuevos datos",
        id: id,
        "Nuevo: " :nuevosDatos
    });
});
//borramos por id, 
app.delete('/api/product/:productID', (request,response) =>{
    const id = request.params.productID;
    
    response.status(200).send(({
        msg: "Se ha eliminado el prducto",
        product :id
    }));
});
app.listen(port , () => {
    console.log(` API RESTFul CRUD ejecutandose desde http//localhost:${port}/api/product`);
});


function getProductController(request, response){
    response.status(200).send({
        msg: "Todos los productos",
        product : []
    });
};
