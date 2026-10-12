// ============================================
// CARRITO Y SISTEMA DE PAGOS - RAÍCES DE BARRO
// Página: carrito.html
// ============================================

const CONFIG = {
    ENVIO_ESTANDAR: 15,
    ENVIO_EXPRES: 30,
    DESCUENTO_MINIMO: 300,
    DESCUENTO_PORCENTAJE: 0.10
};

let metodoPago = null;
let costoEnvio = CONFIG.ENVIO_ESTANDAR;

// ---------- HELPERS ----------
const setTexto = (id, texto) => {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
};

// ---------- RENDERIZAR CARRITO ----------
function renderizarCarrito() {
    const carrito = Storage.getCarrito();
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoContenido = document.getElementById('carrito-contenido');
    const listaCarrito = document.getElementById('lista-carrito');

    if (!carritoVacio || !carritoContenido || !listaCarrito) return;

    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoContenido.style.display = 'none';
        return;
    }

    carritoVacio.style.display = 'none';
    carritoContenido.style.display = 'grid';

    listaCarrito.innerHTML = carrito.map(item => `
        <div class="item-carrito" data-id="${item.id}">
            <img src="${item.img}" alt="${escapeHtml(item.nombre)}" class="item-imagen"
                 loading="lazy" onerror="this.style.background='#F5DEB3'; this.alt='';">
            <div class="item-info">
                <h4>${escapeHtml(item.nombre)}</h4>
                <p class="item-precio">${formatearPrecio(item.precio)}</p>
                <div class="item-cantidad">
                    <button type="button" class="btn-cantidad" data-accion="restar"
                            data-id="${item.id}" aria-label="Restar cantidad">−</button>
                    <span aria-label="Cantidad">${item.cantidad}</span>
                    <button type="button" class="btn-cantidad" data-accion="sumar"
                            data-id="${item.id}" aria-label="Sumar cantidad">+</button>
                </div>
            </div>
            <button type="button" class="btn-eliminar" data-id="${item.id}"
                    aria-label="Eliminar del carrito">✕</button>
        </div>
    `).join('');

    delegar(listaCarrito, '.btn-cantidad', 'click', (e, btn) => {
        const id = parseInt(btn.dataset.id);
        const delta = btn.dataset.accion === 'sumar' ? 1 : -1;
        Carrito.cambiarCantidad(id, delta);
        renderizarCarrito();
    });

    delegar(listaCarrito, '.btn-eliminar', 'click', (e, btn) => {
        const id = parseInt(btn.dataset.id);
        Carrito.eliminar(id);
        renderizarCarrito();
        mostrarToast('Producto eliminado del carrito', 'error');
    });

    actualizarTotales();
}

// ---------- TOTALES ----------
function calcularTotales() {
    const carrito = Storage.getCarrito();
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const descuento = subtotal >= CONFIG.DESCUENTO_MINIMO
        ? subtotal * CONFIG.DESCUENTO_PORCENTAJE
        : 0;
    const total = subtotal - descuento + costoEnvio;

    return { subtotal, descuento, total };
}

function actualizarTotales() {
    const { subtotal, descuento, total } = calcularTotales();

    setTexto('subtotal', formatearPrecio(subtotal));
    setTexto('costo-envio', formatearPrecio(costoEnvio));

    const descuentoFila = document.getElementById('descuento-fila');
    if (descuentoFila) {
        if (descuento > 0) {
            descuentoFila.style.display = 'flex';
            setTexto('descuento', `- ${formatearPrecio(descuento)}`);
        } else {
            descuentoFila.style.display = 'none';
        }
    }

    setTexto('total', formatearPrecio(total));
    setTexto('qr-monto', formatearPrecio(total));
    setTexto('transferencia-monto', formatearPrecio(total));
}

// ---------- ENVÍO ----------
function inicializarEnvio() {
    document.querySelectorAll('input[name="envio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            costoEnvio = parseInt(e.target.dataset.precio);
            actualizarTotales();
        });
    });
}

// ---------- MÉTODO DE PAGO ----------
function inicializarPago() {
    document.querySelectorAll('input[name="pago"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            metodoPago = e.target.value;

            document.querySelectorAll('.opcion-pago-body').forEach(body => {
                body.classList.remove('abierto');
            });

            const opcionPadre = e.target.closest('.opcion-pago');
            const body = opcionPadre?.querySelector('.opcion-pago-body');
            if (body) body.classList.add('abierto');
            
            // El monto se actualiza automáticamente en actualizarTotales()
        });
    });
}

// ---------- VALIDAR ----------
function validarFormulario() {
    const campos = [
        { id: 'nombre', validador: Validar.nombre },
        { id: 'telefono', validador: Validar.telefono },
        { id: 'correo', validador: Validar.correo },
        { id: 'direccion', validador: Validar.direccion }
    ];

    for (const campo of campos) {
        const el = document.getElementById(campo.id);
        const error = campo.validador(el?.value);
        if (error) {
            mostrarToast(error, 'error');
            el?.focus();
            return false;
        }
    }

    if (!metodoPago) {
        mostrarToast('Selecciona un método de pago', 'error');
        return false;
    }

    return true;
}

// ---------- FINALIZAR PEDIDO ----------
function inicializarFinalizar() {
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (!btnFinalizar) return;

    btnFinalizar.addEventListener('click', () => {
        if (!validarFormulario()) return;

        const carrito = Storage.getCarrito();
        const { subtotal, descuento, total } = calcularTotales();
        const numeroPedido = generarNumeroPedido();

        const pedido = {
            numero: numeroPedido,
            fecha: formatearFecha(),
            productos: carrito,
            subtotal,
            descuento,
            costoEnvio,
            total,
            metodoPago,
            datosEnvio: {
                nombre: document.getElementById('nombre').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                correo: document.getElementById('correo').value.trim(),
                direccion: document.getElementById('direccion').value.trim()
            }
        };

        const pedidos = Storage.getPedidos();
        pedidos.push(pedido);
        Storage.setPedidos(pedidos);

        // Mostrar confirmación
        setTexto('numero-pedido', numeroPedido);
        setTexto('metodo-confirmado',
            metodoPago === 'qr' ? 'Pago con QR (Altoke)' :
            metodoPago === 'efectivo' ? 'Efectivo al recibir' :
            'Transferencia bancaria'
        );
        setTexto('total-confirmado', formatearPrecio(total));
        setTexto('direccion-confirmada', pedido.datosEnvio.direccion);

        // Ocultar carrito, mostrar confirmación
        const carritoContenido = document.getElementById('carrito-contenido');
        const titulo = document.querySelector('.carrito-titulo');
        const pasos = document.querySelector('.pasos-checkout');
        const confirmacion = document.getElementById('confirmacion');

        if (carritoContenido) carritoContenido.style.display = 'none';
        if (titulo) titulo.style.display = 'none';
        if (pasos) pasos.style.display = 'none';
        if (confirmacion) confirmacion.style.display = 'block';

        // Vaciar carrito
        Storage.setCarrito([]);
        actualizarContadores();

        mostrarToast('¡Pedido confirmado exitosamente!');
    });
}

// ---------- INICIALIZACIÓN ----------
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
    inicializarEnvio();
    inicializarPago();
    inicializarFinalizar();
    actualizarContadores();
    activarCerrarTopbar();
});