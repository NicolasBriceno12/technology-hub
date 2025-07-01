const bcrypt = require("bcryptjs");
const db = require("../config/db");

// Controlador de registro
exports.register = async (req, res) => {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        // Verificar si el usuario ya existe
        db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "El correo ya está registrado" });
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            // Insertar nuevo usuario
            db.query(
                "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)",
                [nombre, correo, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error("Error al insertar usuario:", err);
                        return res.status(500).json({ error: "Error al registrar usuario" });
                    }
                    res.status(201).json({ mensaje: "Registro exitoso" });
                }
            );
        });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador de login
exports.login = (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: "Por favor ingrese correo y contraseña" });
    }

    // Verificar si el usuario existe
    db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const user = results[0];

        try {
            // Comparar contraseñas
            const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            // Login exitoso
            return res.status(200).json({ 
                mensaje: "Login exitoso", 
                usuario: {
                    id: user.id,
                    nombre: user.nombre,
                    correo: user.correo
                }
            });
        } catch (error) {
            console.error("Error al comparar contraseñas:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    });
};