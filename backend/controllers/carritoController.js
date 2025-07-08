const pool = require('../db');
const nodemailer = require('nodemailer');
const fs = require('fs');
const pdf = require('html-pdf');

exports.crearVenta = async (req, res) => {
  const { carrito, metodo_pago, correo } = req.body;

  try {
    const [metodo] = await pool.query('SELECT id_metodo_pago FROM metodo_pago WHERE metodo_pago = ?', [metodo_pago]);
    const id_metodo_pago = metodo[0]?.id_metodo_pago || 1;

    const subTotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const iva = subTotal * 0.19;
    const total = subTotal + iva;

    const [ventaResult] = await pool.query(
      'INSERT INTO venta (id_usuarios, id_metodo_pago, unidades, sub_total, iva, total, fecha) VALUES (?, ?, ?, ?, ?, ?, CURDATE())',
      [1, id_metodo_pago, carrito.length, subTotal, iva, total]
    );
    const id_venta = ventaResult.insertId;

    for (const item of carrito) {
      await pool.query(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)',
        [id_venta, item.id_producto, item.cantidad, item.precio * item.cantidad]
      );
    }

    // Crear HTML de la factura
    const htmlFactura = `
      <h1>Factura - TechnologyHub</h1>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
      <p>Método de pago: ${metodo_pago}</p>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr>
        ${carrito.map(item => `
          <tr>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio}</td>
            <td>$${item.precio * item.cantidad}</td>
          </tr>
        `).join('')}
      </table>
      <p><strong>Subtotal:</strong> $${subTotal}</p>
      <p><strong>IVA (19%):</strong> $${iva}</p>
      <p><strong>Total:</strong> $${total}</p>
    `;

    // Crear PDF
    const pdfPath = `factura_${id_venta}.pdf`;
    pdf.create(htmlFactura).toFile(pdfPath, async (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al generar el PDF' });

      // Enviar por correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tu_correo@gmail.com',       // reemplaza con tu correo
          pass: 'tu_contraseña_app'          // genera una contraseña de app en Gmail
        }
      });

      const mailOptions = {
        from: 'TechnologyHub <tu_correo@gmail.com>',
        to: correo,
        subject: 'Factura de compra - TechnologyHub',
        text: 'Adjunto encontrará la factura de su compra.',
        attachments: [{ filename: 'factura.pdf', path: pdfPath }]
      };

      await transporter.sendMail(mailOptions);
      fs.unlinkSync(pdfPath); // borra el PDF temporal
      res.status(200).json({ mensaje: 'Compra registrada y factura enviada al correo' });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar la venta' });
  }
};
