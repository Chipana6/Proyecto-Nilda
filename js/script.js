// ============================================
// SCRIPT PRINCIPAL - RAÍCES DE BARRO
// Página: index.html
// ============================================

// ---------- ESTADO ----------
let filtrosActivos = {
    categoria: [],
    material: [],
    precioMin: null,
    precioMax: null,
    alfarero: 'todos',
    busqueda: '',
    orden: 'recientes'
};

// ---------- REFERENCIAS DOM ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- ICONOS SVG (con tamaños) ----------
const SVG = {
    corazon: (relleno) => `
        <svg viewBox="0 0 24 24" fill="${relleno ? 'currentColor' : 'none'}"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
             width="18" height="18">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    `,
    carrito: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
             width="14" height="14">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
    `,
    pin: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
             width="14" height="14">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>
    `,
    jarron: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
             width="40" height="40">
            <path d="M8 3h8l-1 3c2.5 1.5 4 4 4 7 0 4.5-3.5 8-8 8s-8-3.5-8-8c0-3 1.5-5.5 4-7L8 3z"/>
            <path d="M7 10c3 1 7 1 10 0"/>
            <path d="M6.5 14c3.5 1 7.5 1 11 0"/>
        </svg>
    `
};

// ---------- RENDERIZAR PRODUCTOS ----------
function renderizarProductos() {
    const gridProductos = $('#grid-productos');
    if (!gridProductos) return;

    let lista = [...productos];

    // Filtros
    if (filtrosActivos.categoria.length > 0) {
        lista = lista.filter(p => filtrosActivos.categoria.includes(p.categoria));
    }
    if (filtrosActivos.material.length > 0) {
        lista = lista.filter(p => filtrosActivos.material.includes(p.material));
    }
    if (filtrosActivos.alfarero !== 'todos') {
        lista = lista.filter(p => p.alfarero === parseInt(filtrosActivos.alfarero));
    }
    if (filtrosActivos.precioMin !== null) {
        lista = lista.filter(p => p.precio >= filtrosActivos.precioMin);
    }
    if (filtrosActivos.precioMax !== null) {
        lista = lista.filter(p => p.precio <= filtrosActivos.precioMax);
    }
    if (filtrosActivos.busqueda) {
        const texto = filtrosActivos.busqueda.toLowerCase();
        lista = lista.filter(p =>
            p.nombre.toLowerCase().includes(texto) ||
            Datos.getAlfarero(p.alfarero).nombre.toLowerCase().includes(texto)
        );
    }

    // Ordenamiento
    const ordenamientos = {
        'precio-asc': (a, b) => a.precio - b.precio,
        'precio-desc': (a, b) => b.precio - a.precio,
        'nombre': (a, b) => a.nombre.localeCompare(b.nombre),
        'recientes': (a, b) => b.id - a.id
    };
    lista.sort(ordenamientos[filtrosActivos.orden] || ordenamientos['recientes']);

    // Render vacío
    if (lista.length === 0) {
        gridProductos.innerHTML = `
            <div class="sin-resultados">
                <p>No se encontraron productos con esos filtros.</p>
                <button type="button" onclick="limpiarFiltros()">Restablecer filtros</button>
            </div>
        `;
        const cont = $('#contador-productos');
        if (cont) cont.textContent = '0 productos encontrados';
        return;
    }

    // Render productos
    const favoritosActuales = Storage.getFavoritos();
    gridProductos.innerHTML = lista.map(p => {
        const alfarero = Datos.getAlfarero(p.alfarero);
        const esFav = favoritosActuales.includes(p.id);
        const nombreEscapado = escapeHtml(p.nombre);

        return `
            <article class="producto-card" data-id="${p.id}">
                <div class="producto-imagen">
                    <a href="producto.html?id=${p.id}" aria-label="Ver ${nombreEscapado}">
                        <img src="${p.img}" alt="${nombreEscapado}" loading="lazy"
                             onerror="this.style.background='#F5DEB3'; this.alt='';">
                    </a>
                    ${p.nuevo ? '<span class="etiqueta-nuevo">Nuevo</span>' : ''}
                    <button type="button" class="corazon ${esFav ? 'favorito' : ''}"
                            data-id="${p.id}"
                            aria-label="${esFav ? 'Quitar de' : 'Añadir a'} favoritos"
                            aria-pressed="${esFav}">
                        ${SVG.corazon(esFav)}
                    </button>
                </div>
                <div class="producto-info">
                    <h3>
                        <a href="producto.html?id=${p.id}">${nombreEscapado}</a>
                    </h3>
                    <p class="producto-precio">${formatearPrecio(p.precio)}</p>
                    <div class="producto-rating">${p.rating}</div>
                    <div class="producto-alfarero">
                        <img src="${alfarero.img}" alt="" loading="lazy"
                             onerror="this.style.display='none'">
                        <span>Por: ${escapeHtml(alfarero.nombre)}</span>
                    </div>
                    <div class="producto-acciones">
                        <button type="button" class="btn-agregar" data-id="${p.id}"
                                aria-label="Agregar ${nombreEscapado} al carrito">
                            ${SVG.carrito}
                            Agregar
                        </button>
                        <a href="producto.html?id=${p.id}" class="btn-ver">Ver</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    const cont = $('#contador-productos');
    if (cont) cont.textContent = `Mostrando ${lista.length} de ${productos.length} productos`;

    // Delegación de eventos
    delegar(gridProductos, '.corazon', 'click', (e, btn) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const ahoraFav = Favoritos.toggle(id);
        const prod = Datos.getProducto(id);
        mostrarToast(
            ahoraFav ? `${prod.nombre} en favoritos` : 'Eliminado de favoritos',
            ahoraFav ? 'exito' : 'error'
        );
        renderizarProductos();
    });

    delegar(gridProductos, '.btn-agregar', 'click', (e, btn) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const prod = Datos.getProducto(id);
        if (prod) {
            Carrito.agregar(prod, 1);
            mostrarToast(`${prod.nombre} añadido al carrito`);
        }
    });
}

// ---------- RENDERIZAR ALFAREROS ----------
function renderizarAlfareros() {
    const gridAlfareros = $('#grid-alfareros');
    if (!gridAlfareros) return;

    gridAlfareros.innerHTML = alfareros.map(a => `
        <article class="alfarero-card">
            <div class="alfarero-imagen">
                <img src="${a.img}" alt="${escapeHtml(a.nombre)}" loading="lazy"
                     onerror="this.style.display='none'">
            </div>
            <div class="alfarero-info">
                <h3>${escapeHtml(a.nombre)}</h3>
                <p class="alfarero-especialidad">${escapeHtml(a.especialidad)}</p>
                <p class="alfarero-ubicacion">
                    ${SVG.pin}
                    ${escapeHtml(a.ubicacion)}
                </p>
                <p class="alfarero-productos">${Datos.contarProductosPorAlfarero(a.id)} productos</p>
                <a href="alfarero.html?id=${a.id}" class="btn-ver-alfarero">Ver Perfil</a>
            </div>
        </article>
    `).join('');
}

// ---------- FILTROS ----------
function inicializarFiltros() {
    const buscador = $('#buscador');
    const ordenarPor = $('#ordenar-por');
    const filtroAlfareroSelect = $('#filtro-alfarero');
    const precioMin = $('#precio-min');
    const precioMax = $('#precio-max');
    const btnLimpiar = $('#limpiar-filtros');

    $$('input[data-filtro]').forEach(input => {
        input.addEventListener('change', () => {
            const tipo = input.dataset.filtro;
            if (input.checked) {
                filtrosActivos[tipo].push(input.value);
            } else {
                filtrosActivos[tipo] = filtrosActivos[tipo].filter(v => v !== input.value);
            }
            renderizarProductos();
        });
    });

    if (buscador) {
        buscador.addEventListener('input', debounce((e) => {
            filtrosActivos.busqueda = e.target.value;
            renderizarProductos();
        }, 250));
    }

    if (ordenarPor) {
        ordenarPor.addEventListener('change', (e) => {
            filtrosActivos.orden = e.target.value;
            renderizarProductos();
        });
    }

    if (filtroAlfareroSelect) {
        filtroAlfareroSelect.addEventListener('change', (e) => {
            filtrosActivos.alfarero = e.target.value;
            renderizarProductos();
        });
    }

    if (precioMin) {
        precioMin.addEventListener('input', (e) => {
            filtrosActivos.precioMin = e.target.value ? parseInt(e.target.value) : null;
            renderizarProductos();
        });
    }

    if (precioMax) {
        precioMax.addEventListener('input', (e) => {
            filtrosActivos.precioMax = e.target.value ? parseInt(e.target.value) : null;
            renderizarProductos();
        });
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFiltros);
    }
}

// ---------- LIMPIAR FILTROS ----------
function limpiarFiltros() {
    filtrosActivos = {
        categoria: [],
        material: [],
        precioMin: null,
        precioMax: null,
        alfarero: 'todos',
        busqueda: '',
        orden: 'recientes'
    };

    $$('input[data-filtro]').forEach(i => i.checked = false);

    ['precio-min', 'precio-max', 'filtro-alfarero', 'ordenar-por', 'buscador'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === 'filtro-alfarero') el.value = 'todos';
        else if (id === 'ordenar-por') el.value = 'recientes';
        else el.value = '';
    });

    renderizarProductos();
    mostrarToast('Filtros restablecidos');
}

// ---------- CARGAR ALFAREROS EN SELECT ----------
function cargarSelectAlfareros() {
    const select = $('#filtro-alfarero');
    if (!select) return;

    alfareros.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = a.nombre;
        select.appendChild(opt);
    });
}

// ---------- INICIALIZACIÓN ----------
document.addEventListener('DOMContentLoaded', () => {
    cargarSelectAlfareros();
    renderizarProductos();
    renderizarAlfareros();
    actualizarContadores();
    activarCerrarTopbar();
    inicializarFiltros();
});