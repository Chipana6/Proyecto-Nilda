// ============================================
// PRODUCTO.JS - Vista detalle del producto
// Página: producto.html
// ============================================

let productoActual = null;
let cantidadSeleccionada = 1;

// ---------- OBTENER ID DE URL ----------
function obtenerIdDeURL() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    return isNaN(id) ? 1 : id;
}

// ---------- RENDERIZAR PRODUCTO ----------
function renderizarProducto() {
    const id = obtenerIdDeURL();
    productoActual = Datos.getProducto(id);

    const detalle = document.getElementById('producto-detalle');
    if (!detalle) return;

    if (!productoActual) {
        detalle.innerHTML = `
            <div class="sin-resultados" style="grid-column: 1/-1;">
                <h2>Producto no encontrado</h2>
                <p style="margin: 1rem 0;">El producto que buscas no existe.</p>
                <a href="index.html#catalogo" class="btn-hero">Volver al catálogo</a>
            </div>
        `;
        return;
    }

    // Breadcrumb
    const setTexto = (id, texto) => {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    };

    setTexto('breadcrumb-categoria', capitalizar(productoActual.categoria));
    setTexto('breadcrumb-producto', productoActual.nombre);

    // Imagen principal
    const imgPrincipal = document.getElementById('imagen-principal');
    if (imgPrincipal) {
        imgPrincipal.src = productoActual.img;
        imgPrincipal.alt = productoActual.nombre;
        imgPrincipal.addEventListener('error', () => {
            imgPrincipal.style.background = '#F5DEB3';
            imgPrincipal.style.minHeight = '400px';
        }, { once: true });
    }

    // Badge nuevo
    if (productoActual.nuevo) {
        const badge = document.getElementById('badge-nuevo');
        if (badge) badge.style.display = 'inline-block';
    }

    // Info general
    setTexto('producto-categoria-badge', capitalizar(productoActual.categoria));
    setTexto('producto-nombre', productoActual.nombre);

    // Rating con estrellas
    const rating = Math.floor(productoActual.rating);
    const estrellas = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    setTexto('producto-rating-estrellas', estrellas);
    setTexto('producto-rating-numero', productoActual.rating);

    // Material
    const materialTexto = productoActual.material === 'barro' ? 'Barro Cocido' : 'Cerámica Pintada';
    setTexto('producto-material', materialTexto);

    // Precio
    setTexto('producto-precio', formatearPrecio(productoActual.precio));
    setTexto('producto-rango',
        `Rango: ${formatearPrecio(productoActual.precioMin)} – ${formatearPrecio(productoActual.precioMax)}`);

    // Descripción
    setTexto('producto-descripcion', productoActual.descripcion);

    // Alfarero
    const alfarero = Datos.getAlfarero(productoActual.alfarero);
    const alfImg = document.getElementById('alfarero-img');
    const alfNombre = document.getElementById('alfarero-nombre');
    const alfEspecialidad = document.getElementById('alfarero-especialidad');
    const alfLink = document.getElementById('alfarero-nombre-link');
    const btnVerAlf = document.getElementById('btn-ver-alfarero');

    if (alfImg) alfImg.src = alfarero.img;
    if (alfNombre) alfNombre.textContent = alfarero.nombre;
    if (alfEspecialidad) alfEspecialidad.textContent = alfarero.especialidad;
    if (alfLink) alfLink.href = `alfarero.html?id=${alfarero.id}`;
    if (btnVerAlf) btnVerAlf.href = `alfarero.html?id=${alfarero.id}`;

    // Favorito
    actualizarBotonFavorito();

    // Thumbnails
    renderizarThumbnails();
}

// ---------- THUMBNAILS ----------
function renderizarThumbnails() {
    const contenedor = document.getElementById('galeria-thumbnails');
    if (!contenedor || !productoActual) return;

    contenedor.innerHTML = [1, 2, 3, 4].map((n, i) => `
        <div class="thumbnail ${i === 0 ? 'activo' : ''}" data-src="${productoActual.img}">
            <img src="${productoActual.img}" alt="Vista ${n}"
                 onerror="this.style.background='#F5DEB3'">
        </div>
    `).join('');

    contenedor.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            contenedor.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('activo'));
            thumb.classList.add('activo');
            const imgPrinc = document.getElementById('imagen-principal');
            if (imgPrinc) imgPrinc.src = thumb.dataset.src;
        });
    });
}

// ---------- CANTIDAD ----------
function inicializarCantidad() {
    const btnSumar = document.getElementById('btn-sumar');
    const btnRestar = document.getElementById('btn-restar');

    if (btnSumar) {
        btnSumar.addEventListener('click', () => {
            cantidadSeleccionada++;
            const el = document.getElementById('cantidad-valor');
            if (el) el.textContent = cantidadSeleccionada;
        });
    }

    if (btnRestar) {
        btnRestar.addEventListener('click', () => {
            if (cantidadSeleccionada > 1) {
                cantidadSeleccionada--;
                const el = document.getElementById('cantidad-valor');
                if (el) el.textContent = cantidadSeleccionada;
            }
        });
    }
}

// ---------- AGREGAR AL CARRITO ----------
function inicializarAgregarCarrito() {
    const btn = document.getElementById('btn-agregar-carrito');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!productoActual) return;

        Carrito.agregar(productoActual, cantidadSeleccionada);
        mostrarToast(`🛒 ${cantidadSeleccionada} × ${productoActual.nombre} añadido(s)`);

        // Resetear cantidad
        cantidadSeleccionada = 1;
        const el = document.getElementById('cantidad-valor');
        if (el) el.textContent = 1;
    });
}

// ---------- FAVORITOS ----------
function actualizarBotonFavorito() {
    const btn = document.getElementById('btn-favorito-detalle');
    if (!btn || !productoActual) return;

    const esFav = Favoritos.esFavorito(productoActual.id);
    btn.textContent = esFav ? '♥' : '♡';
    btn.classList.toggle('favorito', esFav);
    btn.setAttribute('aria-pressed', esFav);
}

function inicializarFavorito() {
    const btn = document.getElementById('btn-favorito-detalle');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!productoActual) return;

        const ahoraFav = Favoritos.toggle(productoActual.id);
        actualizarBotonFavorito();
        mostrarToast(ahoraFav ? '❤️ Añadido a favoritos' : 'Eliminado de favoritos',
                     ahoraFav ? 'exito' : 'error');
    });
}

// ---------- PRODUCTOS RELACIONADOS ----------
function renderizarRelacionados() {
    const contenedor = document.getElementById('grid-relacionados');
    if (!contenedor || !productoActual) return;

    const relacionados = productos
        .filter(p => p.categoria === productoActual.categoria && p.id !== productoActual.id)
        .slice(0, 4);

    const seccion = document.querySelector('.productos-relacionados');
    if (relacionados.length === 0) {
        if (seccion) seccion.style.display = 'none';
        return;
    }

    const favoritosActuales = Storage.getFavoritos();
    contenedor.innerHTML = relacionados.map(p => {
        const alfarero = Datos.getAlfarero(p.alfarero);
        const esFav = favoritosActuales.includes(p.id);
        const nombreEscapado = escapeHtml(p.nombre);

        return `
            <article class="producto-card" data-id="${p.id}">
                <div class="producto-imagen">
                    <a href="producto.html?id=${p.id}">
                        <img src="${p.img}" alt="${nombreEscapado}" loading="lazy"
                             onerror="this.style.background='#F5DEB3'; this.alt='';">
                    </a>
                    ${p.nuevo ? '<span class="etiqueta-nuevo">Nuevo</span>' : ''}
                    <button type="button" class="corazon ${esFav ? 'favorito' : ''}"
                            data-id="${p.id}"
                            aria-label="${esFav ? 'Quitar de' : 'Añadir a'} favoritos"
                            aria-pressed="${esFav}">
                        ${esFav ? '♥' : '♡'}
                    </button>
                </div>
                <div class="producto-info">
                    <h3><a href="producto.html?id=${p.id}">${nombreEscapado}</a></h3>
                    <p class="producto-precio">${formatearPrecio(p.precio)}</p>
                    <div class="producto-rating">${p.rating}</div>
                    <div class="producto-alfarero">
                        <img src="${alfarero.img}" alt="" loading="lazy"
                             onerror="this.style.display='none'">
                        <span>Por: ${escapeHtml(alfarero.nombre)}</span>
                    </div>
                    <div class="producto-acciones">
                        <button type="button" class="btn-agregar" data-id="${p.id}"
                                aria-label="Agregar ${nombreEscapado} al carrito">🛒 Agregar</button>
                        <a href="producto.html?id=${p.id}" class="btn-ver">Ver</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Delegación
    delegar(contenedor, '.corazon', 'click', (e, btn) => {
        e.preventDefault();
        const id = parseInt(btn.dataset.id);
        Favoritos.toggle(id);
        renderizarRelacionados();
    });

    delegar(contenedor, '.btn-agregar', 'click', (e, btn) => {
        e.preventDefault();
        const id = parseInt(btn.dataset.id);
        const prod = Datos.getProducto(id);
        if (prod) {
            Carrito.agregar(prod, 1);
            mostrarToast(`🛒 ${prod.nombre} añadido`);
        }
    });
}

// ---------- INICIALIZACIÓN ----------
document.addEventListener('DOMContentLoaded', () => {
    renderizarProducto();
    renderizarRelacionados();
    inicializarCantidad();
    inicializarAgregarCarrito();
    inicializarFavorito();
    actualizarContadores();
    activarCerrarTopbar();
});