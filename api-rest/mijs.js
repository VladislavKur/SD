

'use strict'

const port = process.env.port || 3000;
const express = require('express');

const app = express();

app.get('/hola/:Estudiantes', (request, response) => {
    response.status(200).send({ mensaje: `Hola ${request.params.Estudiantes} desde SD`})

});
app.listen(port , () => {
    console.log(` API ejecutandose desde hhtp//localhost:${port}/hola/Estudiantes`);
});
