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
//    {
//      "alg": "HS256",
//      "typ": "JWT"
//    }
//      PAYLOAD{
//        "sub": "1234567890",
//        "name": "John Doe",
//        "iat": 1516239022
//      }
//     VERIFY SIGNATURE
//      HMACSHA256(
//      base64UrlEncode(header) + "." +
//      base64UrlEncode(payload),
//    
//      )    
//}

function creaToken (user){
    const payload ={
        sub: user._id,
        iat:moment().unix(),
        exp:moment().add(EXP_TIME, 'minutes').unix()
    };

    return jwt.encode(payload, SECRETO);
};

//Devuelve el identificador del usuario
function decodificaToken(token){ //MIN 56 vid
    return new Promise((resolve, reject) =>{
        try{
            const payload = jwt.decode(token, SECRETO, true);
                if(payload.exp <= moment().unix()){
                    reject({
                        status: 401,
                        msg: 'El token a expirado'
                    });
                }
                console.log(payload);
                resolve(payload.sub);
        }catch{
            reject({
                status: 500,
                msg: 'El token no es valido'
            });
        }
    });
};

module.exports = {
    creaToken,
    decodificaToken
};