const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
    host: 'localhost',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    allowExitOnIdle: true
})

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada

    const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
    const values = [email, password, rol, lenguage]
    try {
        await pool.query(consulta, values)
    }catch (error){
        console.log(error)
    }
}

const verificarUsuario = async (email, password) => {

    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    console.log(consulta)

    try {

        const {rows: [usuario], rowCount} = await pool.query(consulta, values);

        if (rowCount == 1) {
            const passworsEncriptada = usuario.password;
            const passwordCorrecta = bcrypt.compareSync(password, passworsEncriptada);

            if (passwordCorrecta){
                console.log("validado!");
                return {error:false, msg: "Usuario correcto"};
            } else {
                console.log("falso !");
                return {error:true, msg: "Usuario o contraseña inválido"};
            }

        } else {
            return {error:true, msg: "Usuario o contraseña inválido"};
            
        }

    } catch (error) {
        console.log(error);
        return {error:true, msg: "Hubo un error inesperado"};
    }

}
const obtenerUsuario = async (email) =>{
    const { rows: usuarios } = await pool.query("SELECT * FROM usuarios")
    console.log("Usuarios en funcion de BD: ", usuarios)
    return usuarios
}


module.exports = { registrarUsuario, verificarUsuario, obtenerUsuario }


