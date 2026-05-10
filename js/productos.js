/**
 * ============================================================
 * ARCHIVO: js/productos.js
 * PROPÓSITO: Carga los productos desde Google Sheets (CSV) o
 * usa los datos demo de config.js. Renderiza el grid de tarjetas
 * y gestiona el stock en tiempo real (unidades disponibles).
 * ============================================================
 */

const Productos = (() => {

    /* ──────────────────────────────────────────────────────
       ESTADO INTERNO
       productos      → array de productos activos
       stockLocal     → objeto { nombre: unidades } para rastrear
                        unidades en tiempo real sin recargar
       categoriaActiva → filtro actual
       ────────────────────────────────────────────────────── */
    let productos      = [];
    let stockLocal     = {};
    let categoriaActiva = 'todas';


    /* ──────────────────────────────────────────────────────
       CARGAR PRODUCTOS
       Intenta obtener el CSV de Google Sheets; si falla o no
       está configurado, usa productosDemo de config.js.
       ────────────────────────────────────────────────────── */
    async function cargarProductos() {
        const grid = document.getElementById('productsGrid');

        if (CONFIG.sheets.urlCSV) {
            try {
                const response = await fetch(CONFIG.sheets.urlCSV);
                if (!response.ok) throw new Error('Error HTTP ' + response.status);

                const csvText = await response.text();
                productos = parsearCSV(csvText);

                if (productos.length === 0) throw new Error('CSV sin datos');

            } catch (error) {
                console.warn('CSV no disponible:', error.message);
                productos = [];  
            }
        } else {
            /* Clonar para no mutar el original de CONFIG */
            productos = CONFIG.productosDemo.map(p => ({ ...p }));
        }

        /* Inicializar stockLocal con las unidades de cada producto */
        inicializarStock();

        /* Pintar filtros y tarjetas */
        renderizarFiltros();
        renderizarGrid();
    }


    /* ──────────────────────────────────────────────────────
       INICIALIZAR STOCK LOCAL
       Guarda las unidades iniciales en un objeto por nombre
       de producto para controlarlas sin recargar la página.
       ────────────────────────────────────────────────────── */
    function inicializarStock() {
        stockLocal = {};
        productos.forEach(p => {
            /* Si viene del CSV puede no tener unidades; se pone 0 */
            stockLocal[p.nombre] = parseInt(p.unidades) || 0;
        });
    }


    /* ──────────────────────────────────────────────────────
       PARSEAR CSV
       Convierte texto CSV en array de objetos.
       La primera fila debe ser el encabezado con los mismos
       nombres de campo que productosDemo (nombre, cat, precio…)
       ────────────────────────────────────────────────────── */
    function parsearCSV(csvText) {
        const lineas = csvText.split('\n').filter(l => l.trim());
        if (lineas.length < 2) return [];

        const encabezados = lineas[0].split(',').map(h => h.trim().toLowerCase());
        const resultado   = [];

        for (let i = 1; i < lineas.length; i++) {
            /* Dividir respetando comas dentro de comillas */
            const valores  = dividirCSVLinea(lineas[i]);
            const producto = {};

            encabezados.forEach((col, idx) => {
                producto[col] = (valores[idx] || '').trim().replace(/^"|"$/g, '');
            });

            if (producto['categoría'])   producto.cat  = producto['categoría'];
            if (producto['descripción']) producto.desc = producto['descripción'];
            if (producto.nombre) resultado.push(producto);
            if (producto.descuento && parseInt(producto.descuento) > 0) {
                producto.enPromocion = true;
                producto.precioOriginal = producto.precio;
                const descuento = parseInt(producto.descuento);
                const precioNum = parseInt(String(producto.precio).replace(/[^0-9]/g, ''));
                producto.precio = Math.round(precioNum * (1 - descuento / 100)).toString();
            }
        }

        return resultado;
    }

    /* Divide una línea CSV respetando valores entre comillas */
    function dividirCSVLinea(linea) {
        const resultado = [];
        let actual      = '';
        let enComillas  = false;

        for (let i = 0; i < linea.length; i++) {
            const char = linea[i];
            if (char === '"') {
                enComillas = !enComillas;
            } else if (char === ',' && !enComillas) {
                resultado.push(actual);
                actual = '';
            } else {
                actual += char;
            }
        }
        resultado.push(actual);
        return resultado;
    }


    /* ──────────────────────────────────────────────────────
       RENDERIZAR FILTROS DE CATEGORÍA
       Genera los botones de filtro según CONFIG.categorias,
       mostrando solo las que tienen productos disponibles.
       ────────────────────────────────────────────────────── */
    function renderizarFiltros() {
        const contenedor = document.getElementById('categoryFilters');
        if (!contenedor) return;

        /* Categorías presentes en los productos cargados */
        const catsPresentes = new Set(productos.map(p => p.cat));

        /* Filtrar solo categorías que existen */
        const catsMostrar = CONFIG.categorias.filter(c =>
            c.id === 'todas' || catsPresentes.has(c.id)
        );

        contenedor.innerHTML = catsMostrar.map(c => `
            <button class="filter-btn ${c.id === 'todas' ? 'active' : ''}"
                    data-categoria="${c.id}">
                ${c.icono} ${c.nombre}
            </button>
        `).join('');

        /* Asignar eventos de clic */
        contenedor.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                contenedor.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                categoriaActiva = btn.dataset.categoria;
                renderizarGrid();
            });
        });
    }


    /* ──────────────────────────────────────────────────────
       RENDERIZAR GRID DE PRODUCTOS
       Filtra los productos según la categoría activa y pinta
       las tarjetas con imagen real, precio y stock en vivo.
       ────────────────────────────────────────────────────── */
    function renderizarGrid() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        /* Filtrar por categoría */
        const lista = categoriaActiva === 'todas'
            ? productos
            : categoriaActiva === 'Promociones'
                ? productos.filter(p => p.enPromocion)
                : productos.filter(p => p.cat === categoriaActiva);

        if (lista.length === 0) {
            grid.innerHTML = `
                <div class="error-message">
                    <p>😔 No hay productos en esta categoría por el momento.</p>
                </div>`;
            return;
        }

        grid.innerHTML = lista.map((producto, idx) => {
            const unidades = stockLocal[producto.nombre] ?? parseInt(producto.unidades) ?? 99;
            const agotado  = producto.stock === 'Agotado' || unidades <= 0;

            /* Imagen: usa imagen real si existe, o fondo de color de categoría */
            const imagenHTML = producto.imagen
                ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="product-img" loading="lazy">`
                : `<span class="product-emoji-placeholder">📦</span>`;

            return `
            <div class="product-card" data-nombre="${producto.nombre}">

                <!-- Imagen del producto -->
                <div class="product-image ${agotado ? 'agotado-overlay' : ''}">
                    ${imagenHTML}
                    <span class="product-category">${producto.cat}</span>
                    ${producto.enPromocion ? `<span class="badge-descuento">-${producto.descuento}%</span>` : ''}
                    ${agotado ? '<span class="badge-agotado">Agotado</span>' : ''}
                </div>

                <!-- Información del producto -->
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-price">$${formatearPrecio(producto.precio)}</p>
                    <p class="product-description">${producto.desc}</p>

                    <!-- Stock en tiempo real -->
                    <span class="product-stock ${agotado ? 'stock-agotado' : ''}"
                          id="stock-${producto.nombre.replace(/\s+/g, '-')}">
                        ${agotado
                            ? '❌ Agotado'
                            : `✅ ${unidades} unidad${unidades !== 1 ? 'es' : ''} disponible${unidades !== 1 ? 's' : ''}`
                        }
                    </span>

                    <!-- Botón de reservar -->
                    <button class="btn-reservar"
                            data-producto='${encodeURIComponent(JSON.stringify(producto))}'
                            ${agotado ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${agotado ? 'No disponible' : 'Reservar'}
                    </button>
                </div>
            </div>`;
        }).join('');

        /* Asignar eventos a los botones de reservar */
        grid.querySelectorAll('.btn-reservar:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                const data = JSON.parse(decodeURIComponent(btn.dataset.producto));
                Modal.abrir(data, () => descontarStock(data.nombre));
            });
        });
    }


    /* ──────────────────────────────────────────────────────
       DESCONTAR STOCK
       Se llama cuando se confirma una reserva exitosa.
       Reduce las unidades del producto en 1 y actualiza la
       tarjeta en pantalla sin recargar la página.
       ────────────────────────────────────────────────────── */
    function descontarStock(nombreProducto) {
        if (stockLocal[nombreProducto] === undefined) return;

        stockLocal[nombreProducto] = Math.max(0, stockLocal[nombreProducto] - 1);
        const unidades = stockLocal[nombreProducto];

        /* Actualizar texto de stock en la tarjeta correspondiente */
        const idStock = 'stock-' + nombreProducto.replace(/\s+/g, '-');
        const el = document.getElementById(idStock);
        if (!el) return;

        if (unidades <= 0) {
            /* Marcar como agotado en la interfaz */
            el.textContent    = '❌ Agotado';
            el.classList.add('stock-agotado');

            const card  = el.closest('.product-card');
            const btnRe = card?.querySelector('.btn-reservar');
            if (btnRe) {
                btnRe.disabled   = true;
                btnRe.innerHTML  = '<i class="fas fa-shopping-cart"></i> No disponible';
            }
        } else {
            el.textContent = `✅ ${unidades} unidad${unidades !== 1 ? 'es' : ''} disponible${unidades !== 1 ? 's' : ''}`;
        }
    }


    /* ──────────────────────────────────────────────────────
       FORMATEAR PRECIO
       Convierte el precio a formato colombiano: 89900 → 89.900
       ────────────────────────────────────────────────────── */
    function formatearPrecio(precio) {
        const num = parseInt(String(precio).replace(/[^0-9]/g, ''));
        if (isNaN(num)) return '0';
        return num.toLocaleString('es-CO');
    }


    /* API pública del módulo */
    return {
        cargar:      cargarProductos,
        getProductos: () => productos,
        descontarStock
    };

})();
