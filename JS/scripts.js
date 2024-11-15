/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

let cart = [];

function addToCart(product) {
    const index = cart.findIndex(item => item.name === product.name);
    if (index !== -1) {
        // Si el producto ya está en el carrito, aumenta la cantidad
        cart[index].quantity += product.quantity;
    } else {
        // Si no, agrégalo como nuevo
        cart.push(product);
    }
    updateCartDisplay();
    updateCartCount();
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item');
        itemRow.innerHTML = `
            <p>${item.name}</p>
            <p>Precio: Bs ${item.price}</p>
            <div class="item-quantity">
                <button class="btn btn-primary" onclick="increaseQuantity(${index})">+</button>
                <span>${item.quantity}</span>
                <button class="btn btn-danger" onclick="decreaseQuantity(${index})">-</button>
            </div>
            <p>Subtotal: Bs${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartContainer.appendChild(itemRow);
        total += item.price * item.quantity;
    });

    // Añadir el total
    const totalRow = document.createElement('div');
    totalRow.classList.add('cart-total');
    totalRow.innerHTML = `<h5>Total: Bs ${total.toFixed(2)}</h5>`;
    cartContainer.appendChild(totalRow);

    // Añadir el botón para enviar a WhatsApp
    const whatsappButton = document.createElement('button');
    whatsappButton.classList.add('btn', 'btn-success', 'mt-3');
    whatsappButton.innerText = 'Enviar Pedido a WhatsApp';
    whatsappButton.onclick = () => sendToWhatsApp(total);
    cartContainer.appendChild(whatsappButton);
}



function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Event listener para los botones "Agregar al carrito"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const name = event.target.dataset.name;
        const price = parseFloat(event.target.dataset.price);
        const quantity = parseInt(event.target.dataset.quantity);
        addToCart({ name, price, quantity });
    });
});


function sendToWhatsApp(total) {
    const phoneNumber = '+59162804426'; // Reemplaza con tu número de WhatsApp, en formato internacional
    let message = 'Lista de productos en el carrito:\n';

    cart.forEach(item => {
        message += `- ${item.name}: Bs ${item.price} x ${item.quantity} = Bs${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\nTotal: Bs${total.toFixed(2)}`;

    // Codifica el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abre WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCartDisplay();
    updateCartCount();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        // Elimina el producto si la cantidad llega a 0
        cart.splice(index, 1);
    }
    updateCartDisplay();
    updateCartCount();
}
