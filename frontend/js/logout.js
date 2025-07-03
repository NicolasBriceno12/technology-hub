// logout.js
document.addEventListener('DOMContentLoaded', () => {
// Eliminar todos los datos del usuario almacenados
localStorage.clear();
// Redireccionar al login
window.location.href = './login.html';
});