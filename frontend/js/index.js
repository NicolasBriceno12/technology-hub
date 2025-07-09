document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/productos")
    .then(res => res.json())
    .then(productos => {
      productos.forEach(producto => {
        const categoriaId = producto.categoria.replaceAll(" ", "_"); // Coincide con el id del div
        const contenedor = document.getElementById(categoriaId);
        if (contenedor) {
          contenedor.innerHTML += `
            <div class="productos">
              <img src="${producto.imagen}" alt="${producto.nombre}" />
              <p class="descripcion">${producto.descripcion}</p>
              <p class="precio">$${producto.precio}</p>
              <button class="boton-carrito">
                <span>Añadir al carrito</span>
                <img src="img/Imagenes/iconoCarrito.png" alt="carrito" />
              </button>
            </div>
          `;
        }
      });
    })
    .catch(err => console.error("Error al cargar productos:", err));
});