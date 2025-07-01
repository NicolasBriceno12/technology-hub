const precios = {
    cantidad1: 15,
    cantidad2: 25
  };
  
  function cambiarCantidad(id, cambio) {
    const input = document.getElementById(id);
    let valor = parseInt(input.value);
    valor = isNaN(valor) ? 1 : valor + cambio;
    if (valor < 1) valor = 1;
    input.value = valor;
    actualizarTotales();
  }
  
  function actualizarTotales() {
    const cantidad1 = parseInt(document.getElementById('cantidad1').value);
    const cantidad2 = parseInt(document.getElementById('cantidad2').value);
    const subtotal = (cantidad1 * precios.cantidad1) + (cantidad2 * precios.cantidad2);
    const envio = 5;
    const impuestos = 0;
    const total = subtotal + envio + impuestos;
  
    document.getElementById('subtotal').innerText = `$${subtotal}`;
    document.getElementById('total').innerText = `$${total}`;
  }
  
  // Inicializar al cargar
  actualizarTotales();