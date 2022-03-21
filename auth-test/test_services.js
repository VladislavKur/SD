'use strict'

const service = require('./services/pass.service');
const moment = require('moment');
const { hash } = require('bcrypt');

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

service.encriptar_pass(usuario.pass).then(hash =>{
    usuario.pass = hash;
    console.log(usuario);

    //VERIFICAMOS PASS CORRECTA
    service.compare_pass(pass1, usuario.pass).then(
        isOK =>{
           isOK ? console.log('P1: Pass Correcta') : console.log('P1: La Password no coincide');
        }).catch(err => console.log(err));

    //VERIFICAMOS PASS INCORRECTA
    service.compare_pass(badPass, usuario.pass).then(
        isOK =>{
           isOK ? console.log('P2: Pass Correcta') : console.log('P2: La Password no coincide');
        }).catch(err => console.log(err));
});
