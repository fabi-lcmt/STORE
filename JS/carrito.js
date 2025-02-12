let productos = [];

async function cargarProductos() {
    try {
        const response = await fetch('JS/productos.json'); // Ruta al archivo JSON
        productos = await response.json();
        console.log("Productos cargados:", productos);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Llamar a la función para cargar los productos
cargarProductos();

let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(productoCarrito => {
            // Buscar el producto en el JSON
            const producto = productos.find(p => p.id === productoCarrito.id);

            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${productoCarrito.imagen}" alt="${productoCarrito.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${productoCarrito.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${productoCarrito.cantidad}</p>
                    <button class="carrito-producto-disminuir" data-id="${productoCarrito.id}">-</button>
                    <button class="carrito-producto-aumentar" data-id="${productoCarrito.id}">+</button>
                    <small>Stock disponible: ${producto ? producto.stock : "N/A"}</small>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${productoCarrito.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${productoCarrito.precio * productoCarrito.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${productoCarrito.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarBotonesCantidad();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

function actualizarBotonesCantidad() {
    const botonesAumentar = document.querySelectorAll(".carrito-producto-aumentar");
    const botonesDisminuir = document.querySelectorAll(".carrito-producto-disminuir");

    botonesAumentar.forEach(boton => {
        boton.addEventListener("click", aumentarCantidad);
    });

    botonesDisminuir.forEach(boton => {
        boton.addEventListener("click", disminuirCantidad);
    });
}

function disminuirCantidad(event) {
    const id = event.target.dataset.id;
    const productoCarrito = productosEnCarrito.find(producto => producto.id === id);
    const producto = productos.find(p => p.id === id); // Buscar el producto en el JSON

    if (productoCarrito && producto) {
        if (productoCarrito.cantidad > 1) {
            productoCarrito.cantidad--; // Disminuir la cantidad
        } else {
            // Si la cantidad es 1, eliminar el producto del carrito
            productosEnCarrito = productosEnCarrito.filter(p => p.id !== id);
        }

        // Actualizar la interfaz y el localStorage
        cargarProductosCarrito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }
}

async function aumentarCantidad(event) {
    const id = event.target.dataset.id;
    const productoCarrito = productosEnCarrito.find(producto => producto.id === id);

    // Buscar el producto en el JSON
    const producto = productos.find(p => p.id === id);

    if (producto && productoCarrito) {
        if (productoCarrito.cantidad < producto.stock) {
            productoCarrito.cantidad++;
            cargarProductosCarrito();
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        } else {
            // Mostrar un mensaje de error si no hay suficiente stock
            Toastify({
                text: "No hay suficiente stock disponible",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                },
                offset: {
                    x: '1.5rem',
                    y: '1.5rem'
                },
                onClick: function() {}
            }).showToast();
        }
    }
}


cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right,  #0b7dd4, #5ccbe9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
          },
        onClick: function(){} 
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    console.log(productosEnCarrito);

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            console.log(productosEnCarrito);
            cargarProductosCarrito();
        }
      })
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
async function comprarCarrito() {
    try {
        // Enviar una solicitud para actualizar el stock de cada producto
        for (const productoCarrito of productosEnCarrito) {
            const producto = productos.find(p => p.id === productoCarrito.id);
            if (producto) {
                producto.stock -= productoCarrito.cantidad; // Actualizar el stock
            }
        }

        // Limpiar el carrito después de la compra
        productosEnCarrito.length = 0;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        // Mostrar mensaje de compra exitosa
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");

    } catch (error) {
        console.error("Error al realizar la compra:", error);
        Toastify({
            text: "Error al realizar la compra. Inténtalo de nuevo.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            },
            offset: {
                x: '1.5rem',
                y: '1.5rem'
            },
            onClick: function() {}
        }).showToast();
    }
}