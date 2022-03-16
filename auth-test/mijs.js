

'use strict'


const bcrypt = require('bcrypt');


//DATOS SIMULACION
const pass1 = "pass1";
const badPass= "pass2";

bcrypt.genSalt(10, (err, salt) =>{
    console.log(` Salt 1: ${salt}`);

    bcrypt.hash(pass1 , salt, (err, hash) =>{
        if(err) console.log (err);
        else console.log(` Hash 1: ${hash}`);
    });
});

bcrypt.hash(pass1, 10, (err, hash) =>{
    if(err) console.log(err);
    else{
        console.log(` Hash 2: ${hash}`);

        bcrypt.compare(pass1, hash, (err, result) =>{
            console.log(`result 2.1 : ${result}`)
        });


        bcrypt.compare(pass1, badPass, (err, result) =>{
            console.log(`result 2.2 : ${result}`);
        });
    }
});











