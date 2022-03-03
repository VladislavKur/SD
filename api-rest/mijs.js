

'use strict'

const port    = process.env.port || 3000;
const express = require('express');
const logger  = require('morgan');
const mongojs = require('mongojs'); 
const { request, response } = express;

var db = mongojs("SD");
var id = mongojs.ObjectID;  
//var db = mongojs('username:password@example.com/SD');


const app = express();  


// Declaramos los middleware 
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.param("coleccion", (request, response, next, coleccion)=>{
    console.log('param/api/:coleccion');
    console.log('coleccion: ',coleccion);

    request.coleccion = db.collection(coleccion);
    return next();
});

// el servicio se puede llamar a una funcion o crearlo directamente

app.listen(port , () => {
    console.log(` API RESTFul CRUD ejecutandose desde http//localhost:${port}/api/:coleccion:id`);
});
//GET
app.get( '/api', (request, response, next) =>{
    console.log(request.params);
    console.log(request.collection);

    db.getCollectionNames((err, colecciones) => { 
       if (err) return next(err); 
       response.json(colecciones); 
    });
   
});
 app.get('/api/:coleccion', (request, response, next) => { 
    request.coleccion.find((err, coleccion) => { 
       if (err) return next(err); 
       response.json(coleccion); 
   }); 
 }); 
app.get( '/api/:coleccion/:id', (request, response, next) =>{
    console.log(request.params);
    console.log(request.collection);
    
    request.coleccion.findOne({_id: id(request.params.id)}, (err, elemento) => {
        if(err) return next(err);
        response.json(elemento);
    });
});
//POST
app.post( '/api/:coleccion', (request, response, next) =>{
    console.log(request.body);
    const elemento = request.body; 
 
   if (!elemento.nombre) { 
    response.status(400).json ({ 
     error: 'Bad data', 
     description: 'Se precisa al menos un campo <nombre>' 
       }); 
   } else { 
    request.coleccion.save(elemento, (err, coleccionGuardada) => { 
           if(err) return next(err); 
           response.json(coleccionGuardada); 
      }); 
   } 
 })
//pasamos el ID por valor 
//PUT
app.put('/api/:coleccion/:id', (request, response, next) =>{
    let elementoId = request.params.id; 
    let elementoNuevo = request.body; 
    request.coleccion.update({_id: id(elementoId)}, 
            {$set: elementoNuevo}, {safe: true, multi: false}, (err, elementoModif) => { 
       if (err) return next(err); 
       response.json(elementoModif); 
   }); 
 }); 


//borramos por id, 
//DELETE
app.delete('/api/:coleccion/:id', (request, response, next) => { 
   let elementoId = request.params.id; 
 
   request.coleccion.remove({_id: id(elementoId)}, (err, resultado) => { 
        if (err) return next(err); 
        response.json(resultado); 
    }); 
}); 








