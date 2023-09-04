const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
const { verificacionToken, veirficarCredencial, reportarConsulta } = require("./middlewares")
const { registrarUsuario, verificarUsuario, obtenerUsuario } = require('./consultas')

app.listen(3000, console.log("SERVER ON"))
app.use(cors())
app.use(express.json())
app.use(reportarConsulta)
require('dotenv').config()

// creación del usuario

app.post('/usuarios', async (req, res) => {
    try{
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con exito")
    }catch (error){
        res.status(500).send(error)
        console.log("Error en la ruta /usuarios")
    }

})


// inicio de sesión
 app.post("/login", veirficarCredencial, async (req, res) => {
    try {
        const {email, password} = req.body;
        const result = await verificarUsuario(email, password);
        if (!result.error) {
            const token = jwt.sign({email}, "Clave_secreta");
            console.log(token)
            res.send(token);
        } else {
            res.status(400).send(result.msg);
        }
    } catch (error) {
        res.status(500).send(error);
        console.log("Error en app.post('/login'");
    }
}) 

//

app.get("/usuarios", verificacionToken, async (req, res) => {
    try {
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1]
        const { email } = jwt.verify(token, "Clave_secreta")

        const usuarios = await obtenerUsuario()
        res.send(usuarios)
    } catch (error) {
        res.status(error.code || 500).send(error)

    }
})
















