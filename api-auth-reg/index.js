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
 
   if (!elemento.nombre) { 
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
 app.post('/api/auth', auth, (request, response, next) =>{
    console.log(request.body);
    const elemento = request.body; 
 
   if (!elemento.nombre) { 
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
app.post('/api/reg', auth, (request, response, next) =>{
    console.log(request.body);
    const elemento = request.body; 
 
    if (!elemento.nombre) { 
        response.status(400).json ({ 
        error: 'Bad data', 
        description: 'Se precisa al menos un campo <nombre>' 
        }); 
    }else { 
        db.user.save(elemento, (err, coleccionGuardada) => { 
           if(err) return next(err);
           var usu = signUp(elemento.nombre,elemento.email, elemento.password);
           elemento.password = usu.pass;
           elemento.token    = usu.token;
           response.json(usu);
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

function signUp(nombreusu, emailusu, pass){

    var passEnc = service.encriptar_pass(pass);
    //hacer post de nombre, email y passEnc
   //app.post(nombre, email, passEnc);
   const ctoken = TokenService.creaToken(usuario);
   const usuario = {
        email: emailusu,
        name: nombreusu,
        pass: pass1,
        signUpDate: moment().unix(),
        lastLogin: moment().unix(),
        token: ctoken
    };
    //PREGUNTAR COMO SE HARIA LA PETICION POST CON EL OBJETO USUARIO
   return usuario;
}

function signIn( email, pass){
    //recuperar con get email y passEnc 
    //comparar pass con passENc
   
    var a = service.compare_pass(pass, passEnc);

     /*
    var sign = false;
    var usu = app.get(/api/user);
    usu.forEach(element =>{
        if(element.email == email && a == true{
            sign = true;
        } 
    }
    */
    
    

}










