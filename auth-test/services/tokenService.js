'use strict'


const jwt = require('jwt-simple');
const moment = require('moment');

const SECRETO = require('../config').secret;
const EXP_TIME = require('../config').tokenExpTempo;

//Crear token
//DEVUELVE TOKEN JWT
//FORMATO
// HEADER.PAYLOAD.VERIFY_SIGNATURE

//DONDE:
//      HEADER (objeto JSON con el ....){
//    algo
//}

function creaToken (user){
    const payload ={
        sub: user._id,
        iat:moment().unix(),
        exp:moment().add(EXP_TIME, 'minutes').unix()
    };

    return jwt.encode(payload, SECRETO);
}