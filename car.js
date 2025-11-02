/**
 * =================================================================
 * SCRIPT DEL CARRITO DE COMPRAS - IDOS (VERSIÓN CORREGIDA Y ROBUSTA)
 * =================================================================
 * Este archivo maneja toda la lógica para el carrito de compras.
 * SOLUCIONADO: El problema que impedía añadir productos al carrito.
 * =================================================================
 */

// Se ejecuta cuando todo el contenido de la página ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
});

/**
 * Muestra una notificación emergente (toast) para confirmar al usuario
 * que un producto fue añadido al carrito.
 * @param {string} productName - El nombre del producto añadido.
 */
function showToast(productName) {
    const toastElement = document.getElementById('added-to-cart-toast');
    if (!toastElement) return;
    
    const toastBody = toastElement.querySelector('.toast-body');
    toastBody.textContent = `"${productName}" se ha añadido al carrito.`;
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

/**
 * Función principal para añadir un producto al carrito.
 * Es llamada por el botón "Añadir al Carrito" de cada producto.
 * @param {HTMLElement} button - El botón que fue presionado.
 */
function addToCart(button) {
    // 1. OBTENER LA TARJETA DEL PRODUCTO
    const card = button.closest('.card');
    if (!card) {
        console.error("No se pudo encontrar la tarjeta del producto.");
        return;
    }

    // 2. OBTENER LA INFORMACIÓN DEL PRODUCTO (A PRUEBA DE ERRORES)
    const productName = card.querySelector('.card-title').innerText;
    const quantityInput = card.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);
    
    // ===== INICIO DE LA SOLUCIÓN CLAVE =====
    // Esta parte busca el precio de forma segura para evitar que el script se rompa.
    let priceElement = card.querySelector('.price-value'); // Intenta buscar el precio en el diseño "boleto".
    if (!priceElement) {
        priceElement = card.querySelector('.card-price'); // Si no lo encuentra, busca en el diseño antiguo.
    }

    // Si después de buscar en ambos sitios no encuentra el precio, detiene y avisa.
    if (!priceElement) {
        console.error("Elemento de precio ('price-value' o 'card-price') no encontrado en la tarjeta:", card);
        alert("Error: No se pudo obtener el precio del producto.");
        return;
    }
    const productPrice = parseFloat(priceElement.innerText.replace('S/ ', ''));
    // ===== FIN DE LA SOLUCIÓN CLAVE =====

    const productId = card.getAttribute('data-id');
    const selectedSizeInput = card.querySelector('input[type="radio"]:checked');
    
    if (!selectedSizeInput) {
        alert('Por favor, selecciona una talla antes de añadir al carrito.');
        return;
    }
    const productSize = card.querySelector(`label[for="${selectedSizeInput.id}"]`).innerText;
    
    // 3. CREAR UN ID ÚNICO PARA EL ITEM (PRODUCTO + TALLA)
    const itemId = `${productId}-${productSize}`;

    if (isNaN(quantity) || quantity <= 0) {
        alert('Por favor, selecciona una cantidad válida.');
        return;
    }

    // 4. GESTIONAR EL CARRITO
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === itemId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({ id: itemId, name: productName, price: productPrice, quantity: quantity, size: productSize });
    }

    // 5. ACTUALIZAR Y NOTIFICAR
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    quantityInput.value = 1;
    showToast(productName);
}

/**
 * Actualiza el contador numérico sobre el ícono del carrito.
 */
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounter = document.getElementById('cart-counter');

    if (cartCounter) {
        if (totalItems > 0) {
            cartCounter.innerText = totalItems;
            cartCounter.style.display = 'block';
        } else {
            cartCounter.style.display = 'none';
        }
    }
}

/**
 * Dibuja el contenido del carrito dentro del modal.
 */
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center my-4">Tu carrito está vacío.</p>';
        cartTotalElement.innerText = 'S/ 0.00';
        checkoutButton.disabled = true;
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                <div>
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">
                        S/ ${item.price.toFixed(2)} | Talla: <span class="fw-bold" style="color: #333;">${item.size}</span>
                    </small>
                </div>
                <div class="d-flex align-items-center">
                    <input type="number" class="form-control form-control-sm" style="width: 60px;" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                    <button class="btn btn-danger btn-sm ms-2" onclick="removeFromCart('${item.id}')"><i class="bi bi-trash"></i></button>
                </div>
            </div>`;
    });

    cartTotalElement.innerText = `S/ ${total.toFixed(2)}`;
    checkoutButton.disabled = false;
}

/**
 * Actualiza la cantidad de un producto directamente desde el carrito.
 */
function updateQuantity(itemId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === itemId);

    if (productIndex > -1) {
        const quantity = parseInt(newQuantity);
        if (quantity > 0) {
            cart[productIndex].quantity = quantity;
        } else {
            cart.splice(productIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartIcon();
    }
}

/**
 * Elimina un producto del carrito.
 */
function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartIcon();
}

/**
 * Prepara los datos para el pago y abre el modal de Yape.
 */
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('yape-total-price').innerText = `Total a Pagar: S/ ${total.toFixed(2)}`;
    
    let productList = cart.map(item => `${item.quantity}x ${item.name} (Talla: ${item.size})`).join('\n');
    const whatsappMessage = `¡Hola IDOS! 👋 Quisiera comprar los siguientes productos por un total de S/ ${total.toFixed(2)}:\n\n${productList}\n\nAdjuntaré mi constancia de pago Yape. ¡Gracias!`;
    document.getElementById('yape-whatsapp-link').setAttribute('href', `https://wa.me/51916796360?text=${encodeURIComponent(whatsappMessage)}`);
    
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (cartModal) {
        cartModal.hide();
    }
    const yapeModal = new bootstrap.Modal(document.getElementById('yapeModal'));
    yapeModal.show();
}

// ASIGNAR EVENTO AL MODAL DEL CARRITO
const cartModalElement = document.getElementById('cartModal');
if (cartModalElement) {
    cartModalElement.addEventListener('show.bs.modal', renderCart);
}