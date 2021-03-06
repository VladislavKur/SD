'use strict'

const port    = process.env.port || 4000;
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
const service_pass = require('./services/pass.service.js');
const service_token   = require('./services/token.service.js');
const moment = require('moment');


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

// app.param("coleccion", (request, response, next, coleccion)=>{
//     console.log('param/api/user');
//     console.log('coleccion: ',coleccion);

//     db.user = db.collection(coleccion);
//     return next();
// });

// el servicio se puede llamar a una funcion o crearlo directamente

//GET

app.get('/api/user', (request, response, next) => { 
    db.user.find((err, coleccion) => { 
       if (err) return next(err); 
        response.json(coleccion); 
    }); 
}); 
app.get('/api/auth', (request, response, next) => { 
    //collection.map
    db.user.find((err, coleccion) => { 
        if (err) return next(err);
        var objred = coleccion.map(user => {return { 
            nombre: user.nombre,
            email : user.email 
        }});
        response.json(objred); 
    }); 
}); 
app.get( '/api/user/:id', (request, response, next) =>{
    console.log(request.params);
    console.log(request.collection);
    
    db.user.findOne({_id: id(request.params.id)}, (err, elemento) => {
        if(err) return next(err);
        response.json(elemento);
    });
});
app.get( '/api/user/:me', (request, response, next) =>{
    console.log(request.params);
    console.log(request.collection);
    
    db.user.findOne({_id: id(request.params.id)}, (err, elemento) => {
        if(err) return next(err);
        response.json(elemento);
    });
});
//POST
app.post('/api/user', auth, (request, response, next) =>{
    console.log(request.body);
    const elemento = request.body; 
 
   if (!elemento.title) { 
    response.status(400).json ({ 
     error: 'Bad data', 
     description: 'Se precisa al menos un campo <nombre>' 
       }); 
   } else { 
    db.user.save(elemento, (err, coleccionGuardada) => { 
           if(err) return next(err); 
           response.json(coleccionGuardada); 
      }); 
   } 
 });

//pasamos el ID por valor 
//PUT
app.put('/api/user/:id', auth, (request, response, next) =>{
    let elementoId = request.params.id; 
    let elementoNuevo = request.body; 
    db.user.update({_id: id(elementoId)}, 
            {$set: elementoNuevo}, {safe: true, multi: false}, (err, elementoModif) => { 
       if (err) return next(err); 
       response.json(elementoModif); 
   }); 
 }); 

//borramos por id, 
//DELETE
app.delete('/api/user/:id', auth, (request, response, next) => { 
   let elementoId = request.params.id; 
 
   db.user.remove({_id: id(elementoId)}, (err, resultado) => { 
        if (err) return next(err); 
        response.json(resultado); 
    }); 
}); 

https.createServer( OPTIONS_HTTPS, app).listen(port , () => {
    console.log(` SECURE API RESTFul CRUD ejecutandose desde https://localhost:${port}/api/user:id`);
});

app.post('/api/auth/reg', (request, response, next) =>{
    console.log(request.body);
    const elemento = request.body; 
    console.log("asdasd"); 
    if (!elemento.nombre) { 
        response.status(400).json ({ 
            error: 'Bad data', 
            description: 'Se precisa al menos un campo <nombre>' 
        }); 
    } else if (!elemento.email) { 
        response.status(400).json ({ 
            error: 'Bad data', 
            description: 'Se precisa al menos un campo <email>' 
        }); 
    } else if (!elemento.pass) { 
        response.status(400).json ({ 
            error: 'Bad data', 
            description: 'Se precisa al menos un campo <pass>' 
        }); 
    } else signUp(elemento,response);
 });

function signUp(elemento, response){
    db.user.findOne({ email: elemento.email }, (err, usuario)=>{
        if(err) return next(err);
        if(usuario ){
            response.status(400).json({});
        }else{
            service_pass.encriptar_pass(elemento.pass)
            .then(passEnc => {
               const usuario = {
                    email: elemento.email,
                    name: elemento.nombre,
                    pass: passEnc,
                    signUpDate: moment().unix(),
                    lastLogin: moment().unix()
                };
                db.user.save(usuario, (err, usuarioGuardado) => { 
                    if(err) return next(err);
                    const ctoken = service_token.creaToken(usuario);
                    response.json({
                        result: 'OK',
                        user: usuarioGuardado,
                        token: ctoken
                    });
                }); 
            });
        }
    });
}


app.post('/api/auth',  (request, response, next) =>{
    console.log(request.body);
    const elemento = request.body; 
    console.log("elemento1");
    if (!elemento.email) { 
        response.status(400).json ({ 
            error: 'Bad data', 
            description: 'Se precisa al menos un campo <email>' 
        }); 
    } else if (!elemento.pass) { 
        response.status(400).json ({ 
            error: 'Bad data', 
            description: 'Se precisa al menos un campo <pass>' 
        }); 
    } else  signIn(elemento,response);
 });
//const passNormal = "1234";
function signIn( elemento, response){
    console.log("elemento1");
    db.user.findOne({ email: elemento.email }, (err, usuario)=>{
        if(err) return next(err);
        if(!usuario ){
            console.log("elemento2");
            response.status(400).json({});
        }else{
            console.log("elemento3");
            service_pass.compare_pass( elemento.pass, usuario.pass)
            .then(valido => {
                if(valido){
                    console.log("valido");
                    //db.user.update(lastLogin)
                    const ctoken = service_token.creaToken(usuario);
                    response.json({
                        result: 'OK',
                        user: usuario,
                        token: ctoken
                    });
                }else{
                    console.log("invalido");
                    response.status(400).json({
                        result: 'NOT OK',
                    });
                }
            });
        }
    });
}













