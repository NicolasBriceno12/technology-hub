const bcrypt = require("bcryptjs");
const db = require("../config/db");

// Controlador de registro
exports.register = async (req, res) => {
    const { 
        nombres, 
        apellidos, 
        nombre_usuario, 
        correo, 
        contraseña, 
        fecha_nacimiento, 
        ciudad, 
        direccion, 
        telefono,
        tipo_documento,
        numero_documento
    } = req.body;

    // Validar campos obligatorios
    if (!nombres || !apellidos || !nombre_usuario || !correo || !contraseña || !fecha_nacimiento || !ciudad) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben ser completados" });
    }

    try {
        // Verificar si el usuario ya existe (por correo o nombre de usuario)
        db.query(
            "SELECT * FROM usuarios WHERE correo = ? OR nombre_usuario = ?", 
            [correo, nombre_usuario], 
            async (err, results) => {
                if (err) {
                    console.error("Error en la consulta:", err);
                    return res.status(500).json({ error: "Error interno del servidor" });
                }

                if (results.length > 0) {
                    const existingUser = results[0];
                    if (existingUser.correo === correo) {
                        return res.status(400).json({ error: "El correo ya está registrado" });
                    }
                    if (existingUser.nombre_usuario === nombre_usuario) {
                        return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
                    }
                }

                // Verificar si el número de documento ya existe (si se proporciona)
                if (numero_documento) {
                    db.query(
                        "SELECT * FROM usuarios WHERE numero_documento = ?", 
                        [numero_documento], 
                        async (err, docResults) => {
                            if (err) {
                                console.error("Error verificando documento:", err);
                                return res.status(500).json({ error: "Error interno del servidor" });
                            }

                            if (docResults.length > 0) {
                                return res.status(400).json({ error: "El número de documento ya está registrado" });
                            }

                            // Proceder con el registro
                            await insertarUsuario();
                        }
                    );
                } else {
                    // Proceder con el registro sin verificar documento
                    await insertarUsuario();
                }

                async function insertarUsuario() {
                    try {
                        // Encriptar contraseña
                        const hashedPassword = await bcrypt.hash(contraseña, 10);

                        // Formatear fecha de nacimiento
                        const fechaFormateada = new Date(fecha_nacimiento).toISOString().split('T')[0];

                        // Valores por defecto
                        const id_rol = 2; // Asumiendo que 2 es usuario normal
                        const id_presupuesto = null; // Se puede asignar después

                        // Insertar nuevo usuario
                        db.query(
                            `INSERT INTO usuarios (
                                id_rol, 
                                id_presupuesto, 
                                nombres, 
                                apellidos, 
                                nombre_usuario, 
                                contraseña, 
                                fecha_nacimiento, 
                                ciudad, 
                                direccion, 
                                correo, 
                                telefono,
                                tipo_documento,
                                numero_documento
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                id_rol,
                                id_presupuesto,
                                nombres,
                                apellidos,
                                nombre_usuario,
                                hashedPassword,
                                fechaFormateada,
                                ciudad,
                                direccion || null,
                                correo,
                                telefono || null,
                                tipo_documento || null,
                                numero_documento || null
                            ],
                            (err, result) => {
                                if (err) {
                                    console.error("Error al insertar usuario:", err);
                                    return res.status(500).json({ error: "Error al registrar usuario" });
                                }
                                res.status(201).json({ 
                                    mensaje: "Registro exitoso",
                                    usuario_id: result.insertId 
                                });
                            }
                        );
                    } catch (error) {
                        console.error("Error al hashear contraseña:", error);
                        return res.status(500).json({ error: "Error interno del servidor" });
                    }
                }
            }
        );
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador de login
exports.login = (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
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
            const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            // Login exitoso
            return res.status(200).json({ 
                mensaje: "Login exitoso", 
                usuario: {
                    id: user.id_usuarios,
                    nombres: user.nombres,
                    apellidos: user.apellidos,
                    nombre_usuario: user.nombre_usuario,
                    correo: user.correo,
                    id_rol: user.id_rol
                }
            });
        } catch (error) {
            console.error("Error al comparar contraseñas:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    });
};