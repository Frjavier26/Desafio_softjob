const jwt = require("jsonwebtoken")


const verificacionToken = (req, res, next) => {
    
    const token = req.header("Authorization").split("Bearer ")[1]
    if (!token) throw { code: 401, message: "Debe incluir el token en las cabeceras (Authorization)" }

    const tokenValido = jwt.verify(token, "Clave_secreta")
    if (!tokenValido) throw { code: 401, message: "El token es inválido" }
    const { email } = jwt.decode(token)
    console.log("Solicitud enviada por " + email);
    next()
}

const veirficarCredencial = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        res.send({message: "Credenciales invalidas"})
    }
    next()
}

const reportarConsulta = (req, res, next) => {
    console.log(
    `Fecha de consulta ${new Date()}
    Consulta recibida en ${req.method} ${req.url}`)
    next()
}


module.exports = { verificacionToken, veirficarCredencial, reportarConsulta }