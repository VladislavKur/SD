'use strict'

const bcrypt = require('bcrypt');

//ENCRIPTAR PASS -- devuelve HASh con SALT

//DOCUMENTAR TOKEN

function encriptar_pass(password){

    return bcrypt.hash(password, 10);
}

function compare_pass(password, hash){
    return bcrypt.compare(password, hash);
}

module.exports = {
    encriptar_pass,
    compare_pass
}