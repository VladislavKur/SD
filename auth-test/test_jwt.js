'use strict'


const TokenService = require('./services/tokenService');
const moment = require('moment');


//DATOS SIMULACION
const pass1 = "pass1";
const badPass= "pass2";

const usuario = {
    _id: '123456789',
    email: 'prueba@ua.es',
    name: 'nombre',
    pass: pass1,
    signUpDate: moment().unix(),
    lastLogin: moment().unix()

};

console.log(usuario);

//creamos un token

const token = TokenService.creaToken(usuario);


//verificar un token
TokenService.decodificaToken( token).then(userID =>{
    return console.log(`ID 1: ${userID}`);
}).catch(err => console.log(err));

//verificar un token erroneo
var badToken = 'e2JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
TokenService.decodificaToken(badToken).then(userID =>{
    return console.log(`ID 2: ${userID}`);
}).catch(err => console.log(err));

