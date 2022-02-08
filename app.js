const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT ? process.env.PORT : 5000;

app.use(express.urlencoded());
app.use(express.json());

/*******************************************************************/
/******************** CONEXION CON LA BD ***************************/
/*******************************************************************/
const mysql = require('mysql');
const util = require('util');


const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'biblioteca',
});

conexion.connect((error) => {
    if (error) {
        console.log('ERROR:NO SE PUDO CONECTAR CON LA BASE DE DATOS.')
        throw error;
    }
    console.log('Conexion con la base de datos mysql establecida')
});

const qy = util.promisify(conexion.query).bind(conexion);

/*****************************************************************/
/******************** RUTAS CATEGORIAS ****************************/
/*****************************************************************/
/* Crear nueva categoria */
app.post('/categoria', async (req, res) => {
    try {
        if (req.body.nombre.match(/^ *$/)) {
            throw new Error("Faltan datos.");
        }

        let query = 'select * from categorias where nombre=?';
        const existeCategoria = await qy(query, req.body.nombre.toUpperCase());
        if (existeCategoria.length > 0) {
            throw new Error("Ese nombre de categoria ya existe.")
        }

        query = 'INSERT INTO categorias (nombre) VALUE (?)';
        let respuesta = await qy(query, req.body.nombre.toUpperCase());

        query = 'select * from categorias where nombre=?';
        const consultaNuevaCategoria = await qy(query, req.body.nombre.toUpperCase());

        res.status(200).send(consultaNuevaCategoria[0]);
    }

    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/***/

/* Consultar categorias */
app.get('/categoria', async (req, res) => {
    try {
        let query = 'SELECT * FROM CATEGORIAS';
        let respuesta = await qy(query);

        res.status(200).send(respuesta);
    }

    catch (e) {
        res.status(413).send([]);
    }
});
/***/

/* Consultar una categoria usando id numerico*/
app.get('/categoria/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM CATEGORIAS where id=?';
        let respuesta = await qy(query, req.params.id);

        if (respuesta.length == 0) {
            throw new Error("Categoria no encontrada.");
        }

        res.status(200).send(respuesta[0]);
    }

    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/***/

/* Borrar categoria */
app.delete('/categoria/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM libros WHERE categoria_id=?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta.length > 0) {
            throw new Error("Categoria con libros asociados, no se puede eliminar.");
        }

        query = 'SELECT * FROM categorias WHERE id=?';
        respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error("No existe la categoria indicada.");
        }

        query = 'DELETE FROM categorias WHERE id=?';
        respuesta = await qy(query, req.params.id);

        res.status(200).send({ "mensaje": "La categoria se borro correctamente." });
    }

    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/***/

/****************************************************************/
/******************** RUTAS PERSONA *******************************/
/****************************************************************/
/*  Hacerse socio de la Biblio */
app.post('/persona', async (req, res) => {
    try {
        if (req.body.alias.match(/^ *$/) || req.body.nombre.match(/^ *$/) || req.body.apellido.match(/^ *$/) || req.body.email.match(/^ *$/)) {
            throw new Error("Debe llenar todos los campos obligatorios!");
        }

        const persona = {
            alias: req.body.alias.toUpperCase(),
            nombre: req.body.nombre.toUpperCase(),
            apellido: req.body.apellido.toUpperCase(),
            email: req.body.email.toUpperCase()
        };

        let query = 'SELECT * FROM personas WHERE email=?';
        let respuesta = await qy(query, persona.email);
        if (respuesta.length > 0) {
            throw new Error("El email ya se ecuentra registrado.")
        }

        query = 'INSERT INTO personas (alias,nombre,apellido,email) VALUE (?,?,?,?)';
        respuesta = await qy(query, [persona.alias, persona.nombre, persona.apellido, persona.email]);

        query = 'SELECT * FROM personas WHERE email=?';
        respuesta = await qy(query, persona.email);

        res.status(200).send(respuesta[0]);
    }

    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});

/*consultar personas */
app.get('/persona', async (req, res) => {
    try {
        let query = 'SELECT * FROM personas';
        let respuesta = await qy(query);
        if (respuesta.length > 0) {
            res.status(200).send(respuesta);
        } else {
            res.status(200).send({ mensaje: 'No hay ninguna persona registrada.' })
        }
    }
    catch (e) {
        res.status(413).send({ mensaje: 'Error inesperado.' })
    };
});

/***/

/*consultar datos de una persona usando id numerico. */
app.get('/persona/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM personas WHERE id=?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error("No se encuentra esa persona.");
        }
        res.status(200).send(respuesta[0])

    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/***/

/*modificar persona usando id numerico*/
app.put('/persona/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM personas WHERE id=?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error("No se encuentra esa persona.");
        }
        //email no puede ser modificado
        if (req.body.alias.match(/^ *$/) || req.body.nombre.match(/^ *$/) || req.body.apellido.match(/^ *$/)) {
            throw new Error("Para modificar debe enviar nuevos alias,nombre y apellido.El email no puede ser modificado.");
        }

        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const alias = req.body.alias.toUpperCase();

        respuesta = await qy('UPDATE personas SET  nombre=?, apellido =?, alias=? WHERE id=?', [nombre, apellido, alias, req.params.id]);
        const personaModificada = await qy('SELECT * FROM personas where id=?', [req.params.id]);
        res.status(200).send(personaModificada[0]);
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});

/*Borrar persona usando id numerico*/
app.delete('/persona/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM personas WHERE id=?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error("No se encuentra esa persona.");
        }

        query = 'SELECT * FROM libros WHERE persona_id=?';
        respuesta = await qy(query, req.params.id);
        if (respuesta.length > 0) {
            throw new Error("Esa persona tiene libros asociados, no se puede eliminar.")
        }

        respuesta = await qy('DELETE FROM personas WHERE id=?', [req.params.id]);
        res.status(200).send({ mensaje: 'Persona borrada correctamente.' });
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});

/****************************************************************/
/******************** RUTAS LIBRO *******************************/
/****************************************************************/
/* Ingresar nuevo libro */
app.post('/libro', async (req, res) => {
    try {
        if (req.body.nombre.match(/^ *$/) || !req.body.categoria_id) {
            throw new Error("Nombre y Categoria son datos obligatorios.");
        }

        let descripcion = req.body.descripcion;
        if (!req.body.descripcion) {
            descripcion = "Sin descripción.";
        }

        let libro = {
            nombre: req.body.nombre.toUpperCase(),
            descripcion: descripcion.toUpperCase(),
            categoria_id: req.body.categoria_id,
            persona_id: null
        };

        if (req.body.persona_id) {
            libro.persona_id = req.body.persona_id;
        }

        const queryLibros = 'select * from libros where nombre=?';
        const existeLibro = await qy(queryLibros, [libro.nombre]);

        const queryCategoria = 'select * from categorias where id=?';
        const existeCategoria = await qy(queryCategoria, [libro.categoria_id]);

        const queryPersona = 'select * from personas where id=?';
        const existePersona = await qy(queryPersona, [libro.persona_id]);

        if (existeLibro.length > 0) {
            throw new Error("Ese libro ya existe.");
        } else if (existeCategoria.length == 0) {
            throw new Error("No existe la categoria indicada.");
        } else if (existePersona.length == 0 && req.body.persona_id) {
            throw new Error("No existe la persona indicada.");
        } else {
            let guardoLibro = 'INSERT INTO libros (nombre,descripcion,categoria_id,persona_id) VALUE (?,?,?,?)';
            let respuesta = await qy(guardoLibro, [libro.nombre, libro.descripcion, libro.categoria_id, libro.persona_id]);

            const consultarLibro = 'select * from libros where nombre=?';
            const muestroLibro = await qy(consultarLibro, [libro.nombre]);
            res.status(200).send(muestroLibro[0]);
        }
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/****/

/*consultar catalogo */
app.get('/libro', async (req, res) => {
    try {
        let query = 'select * from libros';
        const todosLosLibros = await qy(query);
        res.status(200).send(todosLosLibros);
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/****/

/*Consultar por un libro en particular usando su id numérica. */
app.get('/libro/:id', async (req, res) => {
    try {
        let query = 'select * from libros where id=?';
        const consultaLibro = await qy(query, req.params.id);

        if (consultaLibro.length == 0) {
            throw new Error("No se encuentra el libro solicitado.");
        }

        res.status(200).send(consultaLibro[0]);
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/****/


/*Modificar descripcion del libro */
app.put('/libro/:id', async (req, res) => {
    try {
        if (req.body.nombre || req.body.categoria_id || req.body.persona_id) {
            throw new Error("Solo se puede modificar la descripcion del libro.");
        }
        if (req.body.descripcion.match(/^ *$/)) {
            throw new Error("Debe mandar una nueva descripción.");
        }

        let query = 'SELECT * FROM libros where id=?';
        const existeLibro = await qy(query, req.params.id);
        if (existeLibro.length == 0) {
            throw new Error("No se econtro el libro.");
        }

        const nuevaDescripcion = req.body.descripcion.toUpperCase();
        const libro_id = req.params.id.toUpperCase();

        query = 'UPDATE libros SET descripcion=? WHERE id = ?;';
        let respuesta = await qy(query, [nuevaDescripcion, libro_id]);

        query = 'SELECT * FROM libros where id=?';
        const consultaLibro = await qy(query, libro_id);

        res.status(200).send(consultaLibro[0]);
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/****/

/*Prestar libro */
app.put('/libro/prestar/:id', async (req, res) => {
    try {

        let query = 'SELECT * FROM libros where id=?';
        const existeLibro = await qy(query, req.params.id);
        if (existeLibro.length == 0) {
            throw new Error("No se econtro el libro.");
        }

        query = 'SELECT persona_id FROM libros where id=?';
        const estaPrestado = await qy(query, req.params.id);
        if (estaPrestado[0].persona_id) {
            throw new Error("El libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva.");
        }

        query = 'SELECT * FROM personas where id=?';
        const existePersona = await qy(query, [req.body.persona_id]);
        if (existePersona.length == 0) {
            throw new Error("No se encontro la persona a la que se quiere prestar el libro.");
        }

        query = 'UPDATE libros SET persona_id=? WHERE id = ?;';
        let respuesta = await qy(query, [req.body.persona_id, req.params.id]);

        res.status(200).send({ mensaje: "El libro se presto correctamente." });
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/****/

/*Devolver libro */
app.put('/libro/devolver/:id', async (req, res) => {
    try {

        let query = 'SELECT * FROM libros WHERE id=?';
        const existeLibro = await qy(query, [req.params.id]);
        if (existeLibro.length == 0) {
            throw new Error("Ese libro no existe!");
        }
        query = 'SELECT persona_id FROM libros where id=?';
        const estaPrestado = await qy(query, [req.params.id]);
        if (!estaPrestado[0].persona_id) {
            throw new Error("Ese libro no estaba prestado!");
        }

        query = 'UPDATE libros SET persona_id=NULL WHERE id = ?';
        let respuesta = await qy(query, [req.params.id]);

        res.status(200).send({ mensaje: "Se realizó la devolución correctamente." });
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/****/

/*Borrar libro */
app.delete('/libro/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM libros where id=?';
        const existeLibro = await qy(query, req.params.id);
        if (existeLibro.length == 0) {
            throw new Error("No se encuentra ese libro.");
        }

        query = 'SELECT persona_id FROM libros where id=?';
        const estaPrestado = await qy(query, req.params.id);
        if (estaPrestado[0].persona_id) {
            throw new Error("Ese libro esta prestado, no se puede borrar!!");
        }

        query = 'DELETE FROM libros WHERE id = ?;';
        let respuesta = await qy(query, [req.params.id]);

        res.status(200).send({ mensaje: "El libro fue borrado correctamente." });
    }
    catch (e) {
        res.status(413).send({ mensaje: e.message });
    }
});
/****/

/****SERVER****/
app.listen(port, () => {
    console.log("Servidor escuchando en el puerto", port);
});


