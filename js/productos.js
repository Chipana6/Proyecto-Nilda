// ============================================
// PRODUCTOS DE RAÍCES DE BARRO
// Catálogo basado en Alfarería de Quillacollo
// ============================================

const productos = [
    // ===== VAJILLAS =====
    { 
        id: 1, 
        nombre: "Plato artesanal decorado", 
        precio: 40, 
        precioMin: 25, 
        precioMax: 55,
        categoria: "vajillas", 
        material: "barro", 
        alfarero: 4, 
        img: "img/productos/Plato artesanal decorado.jpg", 
        rating: 4.5, 
        nuevo: true,
        descripcion: "Unidad; acabado y diámetro variables"
    },
    { 
        id: 2, 
        nombre: "Fuente o plato grande", 
        precio: 72, 
        precioMin: 45, 
        precioMax: 100,
        categoria: "vajillas", 
        material: "barro", 
        alfarero: 4, 
        img: "img/productos/Fuente o plato grande.jpg", 
        rating: 4.7, 
        nuevo: false,
        descripcion: "Pieza para mesa o decoración"
    },
    { 
        id: 3, 
        nombre: "Juego de vajilla artesanal (4 piezas)", 
        precio: 185, 
        precioMin: 120, 
        precioMax: 250,
        categoria: "vajillas", 
        material: "barro", 
        alfarero: 1, 
        img: "img/productos/Juego de vajilla artesanal.jpg", 
        rating: 5.0, 
        nuevo: true,
        descripcion: "Precio estimado por conjunto; consultar composición"
    },

    // ===== FIGURAS =====
    { 
        id: 4, 
        nombre: "Figura pequeña de animal", 
        precio: 25, 
        precioMin: 15, 
        precioMax: 35,
        categoria: "figuras", 
        material: "barro", 
        alfarero: 3, 
        img: "img/productos/Figura pequeña de animal.jpg", 
        rating: 4.6, 
        nuevo: false,
        descripcion: "Figura decorativa modelada en barro"
    },
    { 
        id: 5, 
        nombre: "Figura artesanal mediana", 
        precio: 57, 
        precioMin: 35, 
        precioMax: 80,
        categoria: "figuras", 
        material: "barro", 
        alfarero: 3, 
        img: "img/productos/Figura artesanal mediana.jpg", 
        rating: 4.8, 
        nuevo: false,
        descripcion: "Animal, personaje o motivo ornamental"
    },
    { 
        id: 6, 
        nombre: "Figura grande pintada", 
        precio: 115, 
        precioMin: 70, 
        precioMax: 160,
        categoria: "figuras", 
        material: "ceramica", 
        alfarero: 5, 
        img: "img/productos/Figura grande pintada.jpg", 
        rating: 5.0, 
        nuevo: true,
        descripcion: "La foto muestra variedad de piezas, no una referencia única"
    },

    // ===== FLOREROS =====
    { 
        id: 7, 
        nombre: "Florero pequeño de cerámica", 
        precio: 42, 
        precioMin: 25, 
        precioMax: 60,
        categoria: "floreros", 
        material: "ceramica", 
        alfarero: 2, 
        img: "img/productos/Florero pequeño de cerámica.jpg", 
        rating: 4.4, 
        nuevo: false,
        descripcion: "Aproximadamente 15-25 cm, según diseño"
    },
    { 
        id: 8, 
        nombre: "Florero mediano decorado", 
        precio: 80, 
        precioMin: 50, 
        precioMax: 110,
        categoria: "floreros", 
        material: "ceramica", 
        alfarero: 2, 
        img: "img/productos/Florero mediano decorado.jpg", 
        rating: 4.7, 
        nuevo: true,
        descripcion: "Acabado pintado, esmaltado o natural"
    },
    { 
        id: 9, 
        nombre: "Florero grande ornamental", 
        precio: 160, 
        precioMin: 100, 
        precioMax: 220,
        categoria: "floreros", 
        material: "ceramica", 
        alfarero: 2, 
        img: "img/productos/Florero grande ornamental.jpg", 
        rating: 5.0, 
        nuevo: false,
        descripcion: "Tamaño y trabajo artesanal influyen en el precio"
    },

    // ===== JARRONES =====
    { 
        id: 10, 
        nombre: "Jarrón tradicional de barro", 
        precio: 60, 
        precioMin: 35, 
        precioMax: 85,
        categoria: "jarrones", 
        material: "barro", 
        alfarero: 1, 
        img: "img/productos/Jarrón tradicional de barro.jpg", 
        rating: 4.6, 
        nuevo: false,
        descripcion: "Pieza utilitaria o decorativa"
    },
    { 
        id: 11, 
        nombre: "Jarrón pintado artesanal", 
        precio: 110, 
        precioMin: 70, 
        precioMax: 150,
        categoria: "jarrones", 
        material: "ceramica", 
        alfarero: 4, 
        img: "img/productos/Jarrón pintado artesanal.jpg", 
        rating: 4.9, 
        nuevo: true,
        descripcion: "Decoración y terminación variables"
    },
    { 
        id: 12, 
        nombre: "Jarrón grande para decoración", 
        precio: 190, 
        precioMin: 120, 
        precioMax: 260,
        categoria: "jarrones", 
        material: "barro", 
        alfarero: 4, 
        img: "img/productos/Jarrón grande para decoración.jpg", 
        rating: 5.0, 
        nuevo: false,
        descripcion: "Consultar medidas y transporte"
    },

    // ===== TAZAS =====
    { 
        id: 13, 
        nombre: "Taza pintada de Huayculi", 
        precio: 108, 
        precioMin: 108, 
        precioMax: 108,
        categoria: "tazas", 
        material: "ceramica", 
        alfarero: 2, 
        img: "img/productos/Taza pintada de Huayculi.jpg", 
        rating: 5.0, 
        nuevo: true,
        descripcion: "Precio publicado en Quick Experience"
    },
    { 
        id: 14, 
        nombre: "Taza de barro artesanal sencilla", 
        precio: 32, 
        precioMin: 20, 
        precioMax: 45,
        categoria: "tazas", 
        material: "barro", 
        alfarero: 5, 
        img: "img/productos/Taza de barro artesanal sencilla.jpg", 
        rating: 4.4, 
        nuevo: false,
        descripcion: "Referencia estimada, no precio verificado"
    },

    // ===== POCILLOS =====
    { 
        id: 15, 
        nombre: "Pocillo individual de cerámica", 
        precio: 25, 
        precioMin: 15, 
        precioMax: 35,
        categoria: "pocillos", 
        material: "ceramica", 
        alfarero: 1, 
        img: "img/productos/Pocillo individual de cerámica.jpg", 
        rating: 4.5, 
        nuevo: false,
        descripcion: "Pequeño recipiente para bebidas o servicio"
    },
    { 
        id: 16, 
        nombre: "Juego de 4 pocillos artesanales", 
        precio: 97, 
        precioMin: 65, 
        precioMax: 130,
        categoria: "pocillos", 
        material: "ceramica", 
        alfarero: 4, 
        img: "img/productos/Juego de 4 pocillos artesanales.jpg", 
        rating: 4.8, 
        nuevo: true,
        descripcion: "Estimación por juego; incluye variación por acabado"
    }
];