// script.js

// Este script contiene la lógica para la integración de Google Sign-In
// y la funcionalidad de la barra de navegación que cambia con el scroll.

/**
 * Función para manejar la respuesta de credenciales de Google.
 * Esta función es llamada automáticamente por la biblioteca de Google
 * cuando un usuario inicia sesión o se registra con su cuenta de Google.
 * @param {Object} response - Objeto que contiene el token de ID de Google (JWT).
 */
function handleCredentialResponse(response) {
    // Aquí puedes enviar el token de ID de Google (response.credential)
    // a tu servidor para verificar y autenticar al usuario de forma segura.
    console.log("Encoded JWT ID token: " + response.credential);

    // ===================================================================
    // *** IMPORTANTE: La verificación del token DEBE hacerse en tu servidor ***
    // ===================================================================
    // El siguiente código es solo un ejemplo de cómo podrías decodificarlo
    // en el cliente para propósitos de depuración o para mostrar información básica.
    // No confíes en esta decodificación del lado del cliente para la seguridad.
    try {
        const token = response.credential;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const profile = JSON.parse(jsonPayload);
        console.log("Datos del usuario de Google (decodificado en cliente):", profile);

        // Aquí es donde deberías enviar 'response.credential' a tu backend
        // para un registro o inicio de sesión seguro en tu aplicación.
        // Ejemplo (pseudo-código, necesitas una API de backend):
        /*
        fetch('/api/google-auth', { // Endpoint de tu API para manejar la autenticación de Google
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log('Inicio de sesión/registro con Google exitoso:', data.message);
                // Redirigir al usuario a una página de bienvenida o dashboard
                // window.location.href = '/dashboard.html';
                alert('¡Bienvenido, ' + profile.name + '!'); // Solo para demostración
            } else {
                console.error('Error al procesar la autenticación de Google:', data.message);
                alert('Hubo un problema al iniciar sesión con Google.');
            }
        })
        .catch(error => {
            console.error('Error en la llamada al backend para Google Auth:', error);
            alert('Error de red o servidor al intentar autenticar con Google.');
        });
        */

        // Por ahora, solo mostraremos una alerta simple en el cliente como prueba
        alert('¡Inicio de sesión o registro con Google exitoso para: ' + profile.email + '!');

    } catch (error) {
        console.error("Error al decodificar el token JWT de Google:", error);
        alert("Ocurrió un error al procesar el inicio de sesión con Google.");
    }
}


// Lógica para la barra de navegación que cambia de color al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navbar');
    // Si la navbar ya existe y no es null
    if (nav) {
        window.addEventListener('scroll', () => { 
            // Añade o quita la clase 'scrolled' basándose en la posición del scroll
            window.scrollY > 50 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled'); 
        });
    } else {
        console.warn("Elemento con clase 'navbar' no encontrado. La funcionalidad de scroll de la navbar no se aplicará.");
    }

    // Aquí puedes añadir cualquier otra lógica JavaScript que sea específica de tu sitio
    // y que no esté en `car.js` o en otros archivos.
});