// ============================================
// ALFARERO-PAGE.JS - Perfil individual
// Página: alfarero.html
// ============================================

let alfareroActual = null;

function obtenerIdDeURL() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    return isNaN(id) ? 1 : id;
}

function renderizarPerfil() {
    const id = obtenerIdDeURL();
    alfareroActual = alfareros.find(a => a.id === id);

    const perfilHero = document.getElementById('perfil-hero');
    if (!perfilHero) return;

    if (!alfareroActual) {
        perfilHero.innerHTML = `
            <div class="sin-resultados" style="grid-column: 1/-1;">
                <h2>Alfarero no encontrado</h2>
                <p style="margin: 1rem 0;">El alfarero que buscas no existe.</p>
                <a href="alfareros.html" class="btn-hero">Ver todos los alfareros</a>
            </div>
        `;
        return;
    }

    // Breadcrumb y título de sección
    const bc = document.getElementById('breadcrumb-alfarero');
    const tituloProd = document.getElementById('nombre-alfarero-productos');
    if (bc) bc.textContent = alfareroActual.nombre;
    if (tituloProd) tituloProd.textContent = alfareroActual.nombre;

    const numProductos = Datos.contarProductosPorAlfarero(alfareroActual.id);
    const nombreEscapado = escapeHtml(alfareroActual.nombre);

    perfilHero.innerHTML = `
        <div class="perfil-imagen">
            <img src="${alfareroActual.img}" alt="${nombreEscapado}"
                 onerror="this.style.background='#F5DEB3'; this.alt='🏺';">
        </div>
        <div class="perfil-info">
            <span class="perfil-badge">${escapeHtml(alfareroActual.especialidad)}</span>
            <h1>${nombreEscapado}</h1>
            <p class="perfil-ubicacion">📍 ${escapeHtml(alfareroActual.ubicacion)}</p>
            <p class="perfil-bio">${escapeHtml(alfareroActual.bio)}</p>

            <div class="perfil-stats">
                <div class="stat-box">
                    <strong>${numProductos}</strong>
                    <small>Productos</small>
                </div>
                <div class="stat-box">
                    <strong>+${alfareroActual.experiencia}</strong>
                    <small>Años de experiencia</small>
                </div>
                <div class="stat-box">
                    <strong>100%</strong>
                    <small>Hecho a mano</small>
                </div>
            </div>

            <div class="perfil-acciones">
                <a href="index.html#catalogo" class="btn-primario-lg">
                    🛒 Ver todos los productos
                </a>
                <a href="https://wa.me/59170000000?text=Hola,%20quiero%20consultar%20sobre%20los%20productos%20de%20${encodeURIComponent(alfareroActual.nombre)}"
                   target="_blank" rel="noopener"
                   class="btn-whatsapp">
                    📱 Contactar por WhatsApp
                </a>
            </div>
        </div>
    `;

    renderizarProductosAlfarero();
}

function renderizarProductosAlfarero() {
    const contenedor = document.getElementById('grid-productos-alfarero');
    if (!contenedor || !alfareroActual) return;

    const productosAlfarero = Datos.getProductosPorAlfarero(alfareroActual.id);

    if (productosAlfarero.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-resultados" style="grid-column: 1/-1;">
                <p>Este alfarero aún no tiene productos publicados.</p>
            </div>
        `;
        return;
    }

    const favoritosActuales = Storage.getFavoritos();
    contenedor.innerHTML = productosAlfarero.map(p => {
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
                    <div class="producto-acciones">
                        <button type="button" class="btn-agregar" data-id="${p.id}"
                                aria-label="Agregar ${nombreEscapado} al carrito">🛒 Agregar</button>
                        <a href="producto.html?id=${p.id}" class="btn-ver">Ver</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    delegar(contenedor, '.corazon', 'click', (e, btn) => {
        e.preventDefault();
        e.stopPropagation();
        Favoritos.toggle(parseInt(btn.dataset.id));
        renderizarProductosAlfarero();
    });

    delegar(contenedor, '.btn-agregar', 'click', (e, btn) => {
        e.preventDefault();
        const prod = Datos.getProducto(parseInt(btn.dataset.id));
        if (prod) {
            Carrito.agregar(prod, 1);
            mostrarToast(`🛒 ${prod.nombre} añadido`);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarPerfil();
    actualizarContadores();
    activarCerrarTopbar();
});