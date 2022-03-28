'use strict'

const port    = process.env.port || 3000;
const https   = require('https');
const fs      = require('fs');

const OPTIONS_HTTPS ={
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')

}
const express = require('express');
const logger  = require('morgan');
const mongojs = require('mongojs'); 
const cors    = require('cors');
const service = require('./services/pass.service.js');
const token   = require('./services/token.service.js');


var db = mongojs("User");
var id = mongojs.ObjectID;  
//var db = mongojs('username:password@example.com/SD');


const app = express();  

// Declaramos los middleware 
    //METODOS DE SEGURIDAD
var auth = (request, response, next) => { 
  if(request.headers.token === "password1234") { 
      return next(); 
  } else { 
      return next(new Error("No autorizado")); 
  }; 
};

var allowCrossTokenHeader = (request, response, next) => { 
    response.header("Access-Control-Allow-Headers", "*"); 
    return next(); 
};

var allowCrossTokenOrigin = (request, response, next) => { 
    response.header("Access-Control-Allow-Origin", "*"); 
    return next(); 
};

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//para evitar errores en el servidor de cruces
app.use(cors()); 
app.use(allowCrossTokenHeader); 
app.use(allowCrossTokenOrigin);

app.param("coleccion", (request, response, next, coleccion)=>{
    console.log('param/api/:coleccion');
    console.log('coleccion: ',coleccion);

    request.coleccion = db.collection(coleccion);
    return next();
});

// el servicio se puede llamar a una funcion o crearlo directamente

//GET
app.get( '/api/coleccion', (request, response, next) =>{
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
app.post('/api/:coleccion', auth, (request, response, next) =>{
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
app.put('/api/:coleccion/:id', auth, (request, response, next) =>{
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
app.delete('/api/:coleccion/:id', auth, (request, response, next) => { 
   let elementoId = request.params.id; 
 
   request.coleccion.remove({_id: id(elementoId)}, (err, resultado) => { 
        if (err) return next(err); 
        response.json(resultado); 
    }); 
}); 

https.createServer( OPTIONS_HTTPS, app).listen(port , () => {
    console.log(` SECURE API RESTFul CRUD ejecutandose desde https://localhost:${port}/api/:coleccion:id`);
});

var password = 1234;
function signUp(){
    service.encriptar_pass(password);
}











