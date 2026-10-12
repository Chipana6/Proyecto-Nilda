// ============================================
// ALFAREROS-PAGE.JS - Listado de alfareros
// Página: alfareros.html
// ============================================

function renderizarAlfarerosFull() {
    const contenedor = document.getElementById('grid-alfareros-full');
    if (!contenedor) return;

    contenedor.innerHTML = alfareros.map(a => {
        const numProductos = Datos.contarProductosPorAlfarero(a.id);
        return `
            <article class="alfarero-card-full">
                <div class="alfarero-imagen-full">
                    <img src="${a.img}" alt="${escapeHtml(a.nombre)}" loading="lazy"
                         onerror="this.style.display='none'">
                    <div class="alfarero-imagen-fallback" aria-hidden="true">🏺</div>
                </div>
                <div class="alfarero-info-full">
                    <h3>${escapeHtml(a.nombre)}</h3>
                    <p class="alfarero-especialidad-full">${escapeHtml(a.especialidad)}</p>
                    <p class="alfarero-ubicacion-full">📍 ${escapeHtml(a.ubicacion)}</p>
                    <p class="alfarero-bio">${escapeHtml(a.bio)}</p>
                    <div class="alfarero-stats">
                        <span class="stat-item">
                            <strong>${numProductos}</strong>
                            <small>productos</small>
                        </span>
                        <span class="stat-item">
                            <strong>+${a.experiencia}</strong>
                            <small>años exp.</small>
                        </span>
                    </div>
                    <a href="alfarero.html?id=${a.id}" class="btn-ver-alfarero-full">
                        Ver perfil completo →
                    </a>
                </div>
            </article>
        `;
    }).join('');

    const totalEl = document.getElementById('total-alfareros');
    if (totalEl) totalEl.textContent = alfareros.length;
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarAlfarerosFull();
    actualizarContadores();
    activarCerrarTopbar();
});