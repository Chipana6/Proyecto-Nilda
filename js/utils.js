// ============================================
// UTILS.JS - Funciones compartidas
// Raíces de Barro
// ============================================

// ============================================
// STORAGE - Gestión de localStorage
// ============================================
const Storage = {
    CLAVE_FAVORITOS: 'favoritos_barro',
    CLAVE_CARRITO: 'carrito_barro',
    CLAVE_PEDIDOS: 'pedidos_barro',

    getFavoritos() {
        try {
            return JSON.parse(localStorage.getItem(this.CLAVE_FAVORITOS)) || [];
        } catch {
            return [];
        }
    },

    setFavoritos(favoritos) {
        localStorage.setItem(this.CLAVE_FAVORITOS, JSON.stringify(favoritos));
    },

    getCarrito() {
        try {
            return JSON.parse(localStorage.getItem(this.CLAVE_CARRITO)) || [];
        } catch {
            return [];
        }
    },

    setCarrito(carrito) {
        localStorage.setItem(this.CLAVE_CARRITO, JSON.stringify(carrito));
    },

    getPedidos() {
        try {
            return JSON.parse(localStorage.getItem(this.CLAVE_PEDIDOS)) || [];
        } catch {
            return [];
        }
    },

    setPedidos(pedidos) {
        localStorage.setItem(this.CLAVE_PEDIDOS, JSON.stringify(pedidos));
    }
};

// ============================================
// DATOS - Acceso a productos y alfareros
// ============================================
const Datos = {
    getAlfarero(id) {
        return (typeof alfareros !== 'undefined' && alfareros.find(a => a.id === id)) ||
               { nombre: 'Anónimo', img: '', especialidad: '', ubicacion: '', bio: '' };
    },

    getProducto(id) {
        return (typeof productos !== 'undefined' && productos.find(p => p.id === id)) || null;
    },

    getProductosPorAlfarero(alfareroId) {
        if (typeof productos === 'undefined') return [];
        return productos.filter(p => p.alfarero === alfareroId);
    },

    contarProductosPorAlfarero(alfareroId) {
        return this.getProductosPorAlfarero(alfareroId).length;
    }
};

// ============================================
// FORMATO
// ============================================
function formatearPrecio(precio) {
    return `Bs. ${Number(precio).toFixed(2)}`;
}

function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearFecha(fecha = new Date()) {
    return fecha.toLocaleString('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generarNumeroPedido() {
    return '#' + String(Date.now()).slice(-6);
}

// ============================================
// SEGURIDAD - Escape HTML contra XSS
// ============================================
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// VALIDACIONES
// ============================================
const Validar = {
    nombre(valor) {
        const limpio = (valor || '').trim();
        if (limpio.length < 3) return 'El nombre debe tener al menos 3 caracteres';
        if (limpio.length > 60) return 'El nombre es demasiado largo';
        return '';
    },

    correo(valor) {
        const limpio = (valor || '').trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!limpio) return 'El correo es obligatorio';
        if (!regex.test(limpio)) return 'Ingresa un correo válido';
        return '';
    },

    telefono(valor) {
        const limpio = (valor || '').trim();
        const regex = /^[0-9+\-\s()]{7,15}$/;
        if (!limpio) return 'El teléfono es obligatorio';
        if (!regex.test(limpio)) return 'Ingresa un teléfono válido';
        return '';
    },

    direccion(valor) {
        const limpio = (valor || '').trim();
        if (limpio.length < 5) return 'La dirección es demasiado corta';
        return '';
    }
};

// ============================================
// UI - Toasts, contadores, topbar
// ============================================
function mostrarToast(mensaje, tipo = 'exito') {
    const contenedor = document.getElementById('toast-container');
    if (!contenedor) return;

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = mensaje;
    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function actualizarContadores() {
    const favoritos = Storage.getFavoritos();
    const carrito = Storage.getCarrito();

    const contFav = document.getElementById('contador-favoritos');
    const contCart = document.getElementById('contador-carrito');

    if (contFav) contFav.textContent = favoritos.length;
    if (contCart) {
        contCart.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    }
}

function activarCerrarTopbar() {
    const btn = document.getElementById('cerrar-topbar');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const topbar = document.querySelector('.top-bar');
        if (topbar) topbar.style.display = 'none';
    });
}

// ============================================
// CARRITO - Operaciones
// ============================================
const Carrito = {
    agregar(producto, cantidad = 1) {
        const carrito = Storage.getCarrito();
        const existente = carrito.find(item => item.id === producto.id);

        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                img: producto.img,
                cantidad: cantidad
            });
        }

        Storage.setCarrito(carrito);
        actualizarContadores();
        return true;
    },

    eliminar(id) {
        const carrito = Storage.getCarrito().filter(item => item.id !== id);
        Storage.setCarrito(carrito);
        actualizarContadores();
    },

    cambiarCantidad(id, delta) {
        const carrito = Storage.getCarrito();
        const item = carrito.find(i => i.id === id);
        if (!item) return false;

        item.cantidad += delta;

        if (item.cantidad <= 0) {
            this.eliminar(id);
            return true;
        }

        Storage.setCarrito(carrito);
        actualizarContadores();
        return true;
    }
};

// ============================================
// FAVORITOS - Operaciones
// ============================================
const Favoritos = {
    toggle(id) {
        const favoritos = Storage.getFavoritos();
        const idx = favoritos.indexOf(id);

        if (idx > -1) {
            favoritos.splice(idx, 1);
            Storage.setFavoritos(favoritos);
            actualizarContadores();
            return false; // Ya no es favorito
        } else {
            favoritos.push(id);
            Storage.setFavoritos(favoritos);
            actualizarContadores();
            return true; // Ahora es favorito
        }
    },

    esFavorito(id) {
        return Storage.getFavoritos().includes(id);
    }
};

// ============================================
// DEBOUNCE - Para búsquedas
// ============================================
function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ============================================
// DELEGACIÓN DE EVENTOS
// ============================================
function delegar(contenedor, selector, evento, callback) {
    if (!contenedor) return;
    contenedor.addEventListener(evento, (e) => {
        const target = e.target.closest(selector);
        if (target && contenedor.contains(target)) {
            callback(e, target);
        }
    });
}