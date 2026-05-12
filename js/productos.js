/**
 * ============================================================
 * ARCHIVO: js/productos.js
 * PROPÓSITO: Carga productos desde CSV, renderiza catálogo,
 * filtros, stock en vivo y buscador del navbar.
 * ============================================================
 */

const Productos = (() => {

    let productos = [];
    let stockLocal = {};
    let categoriaActiva = 'todas';

    async function cargar() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        if (CONFIG.sheets.urlCSV) {
            try {
                const res = await fetch(CONFIG.sheets.urlCSV);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                productos = parsearCSV(await res.text());
                if (productos.length === 0) throw new Error('CSV vacío');
            } catch (err) {
                console.warn('CSV no disponible:', err.message);
                productos = (CONFIG.productosDemo || []).map(p => ({ ...p }));
            }
        } else {
            productos = (CONFIG.productosDemo || []).map(p => ({ ...p }));
        }

        inicializarStock();
        renderizarFiltros();
        renderizarGrid();
        inicializarBuscador();
    }

    function inicializarStock() {
        stockLocal = {};
        productos.forEach(p => {
            stockLocal[p.nombre] = parseInt(p.unidades) || 0;

            if (!p.enPromocion && p.descuento && parseInt(p.descuento) > 0) {
                p.enPromocion = true;
                const descuento = parseInt(p.descuento);
                const precioNum = parseInt(String(p.precio).replace(/[^0-9]/g, ''));
                p.precioOriginal = p.precio;
                p.precio = Math.round(precioNum * (1 - descuento / 100)).toString();
            }

            // Normalizar características a array
            if (p.caracteristicas && typeof p.caracteristicas === 'string') {
                p.caracteristicas = p.caracteristicas.split('|').map(s => s.trim()).filter(Boolean);
            }
        });
    }

    function parsearCSV(csvText) {
        const lineas = csvText.split('\n').filter(l => l.trim());
        if (lineas.length < 2) return [];

        const headers = lineas[0].split(',').map(h => h.trim().toLowerCase());
        const out = [];

        for (let i = 1; i < lineas.length; i++) {
            const valores = dividirLineaCSV(lineas[i]);
            const p = {};
            headers.forEach((h, idx) => {
                p[h] = (valores[idx] || '').trim().replace(/^"|"$/g, '');
            });

            if (p['categoría']) p.cat = p['categoría'];
            if (p['descripción']) p.desc = p['descripción'];

            if (p.descuento && parseInt(p.descuento) > 0) {
                p.enPromocion = true;
                p.precioOriginal = p.precio;
                const descuento = parseInt(p.descuento);
                const precioNum = parseInt(String(p.precio).replace(/[^0-9]/g, ''));
                p.precio = Math.round(precioNum * (1 - descuento / 100)).toString();
            }

            if (p.caracteristicas) {
                p.caracteristicas = p.caracteristicas.split('|').map(s => s.trim()).filter(Boolean);
            }

            if (p.nombre) out.push(p);
        }
        return out;
    }

    function dividirLineaCSV(linea) {
        const res = [];
        let actual = '';
        let enComillas = false;
        for (let i = 0; i < linea.length; i++) {
            const c = linea[i];
            if (c === '"') {
                enComillas = !enComillas;
            } else if (c === ',' && !enComillas) {
                res.push(actual);
                actual = '';
            } else {
                actual += c;
            }
        }
        res.push(actual);
        return res;
    }

    function renderizarFiltros() {
        const cont = document.getElementById('categoryFilters');
        if (!cont) return;

        const catsPresentes = new Set(productos.map(p => p.cat));
        const hayPromos = productos.some(p => p.enPromocion);

        const catsMostrar = CONFIG.categorias.filter(c =>
            c.id === 'todas' ||
            (c.id === 'Promociones' && hayPromos) ||
            catsPresentes.has(c.id)
        );

        cont.innerHTML = catsMostrar.map(c => `
            <button class="filter-btn ${c.id === 'todas' ? 'active' : ''}" data-categoria="${c.id}">
                ${c.icono} ${c.nombre}
            </button>
        `).join('');

        cont.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cont.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                categoriaActiva = btn.dataset.categoria;
                renderizarGrid();
            });
        });
    }

    function renderizarGrid() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        const lista = categoriaActiva === 'todas'
            ? productos
            : categoriaActiva === 'Promociones'
                ? productos.filter(p => p.enPromocion)
                : productos.filter(p => p.cat === categoriaActiva);

        if (lista.length === 0) {
            grid.innerHTML = `<div class="error-message"><p>😔 No hay productos en esta categoría por el momento.</p></div>`;
            return;
        }

        grid.innerHTML = lista.map(p => {
            const unidades = stockLocal[p.nombre] ?? parseInt(p.unidades) ?? 99;
            const agotado = p.stock === 'Agotado' || unidades <= 0;

            return `
            <div class="product-card" data-nombre="${Utils.escapeHtml(p.nombre)}">
                <div class="product-image ${agotado ? 'agotado-overlay' : ''}">
                    ${p.imagen
                        ? `<img src="productos/${p.imagen}.png" alt="${Utils.escapeHtml(p.nombre)}" class="product-img" loading="lazy">`
                        : `<span class="product-emoji-placeholder">📦</span>`
                    }
                    <span class="product-category">${Utils.escapeHtml(p.cat)}</span>
                    ${p.enPromocion ? `<span class="badge-descuento">-${p.descuento}%</span>` : ''}
                    ${agotado ? '<span class="badge-agotado">Agotado</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${Utils.escapeHtml(p.nombre)}</h3>
                    ${p.enPromocion ? `<p class="product-price-original">$${Utils.formatPrice(p.precioOriginal)}</p>` : ''}
                    <p class="product-price">$${Utils.formatPrice(p.precio)}</p>
                    <span class="product-stock ${agotado ? 'stock-agotado' : ''}" id="stock-${p.nombre.replace(/\s+/g, '-')}">
                        ${agotado ? '❌ Agotado' : `✅ ${unidades} disponible${unidades !== 1 ? 's' : ''}`}
                    </span>
                    <button class="btn-ver-producto" data-nombre="${Utils.escapeHtml(p.nombre)}" ${agotado ? 'disabled' : ''}>
                        <i class="fas fa-eye"></i> ${agotado ? 'No disponible' : 'Ver producto'}
                    </button>
                </div>
            </div>`;
        }).join('');

        grid.querySelectorAll('.btn-ver-producto:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                const nombre = btn.dataset.nombre;
                const prod = productos.find(p => p.nombre === nombre);
                if (prod) {
                    // Guardamos el producto en sessionStorage y navegamos
                    sessionStorage.setItem('productoSeleccionado', JSON.stringify(prod));
                    window.location.href = 'producto.html';
                }
            });
        });
    }

    function descontarStock(nombreProducto) {
        if (stockLocal[nombreProducto] === undefined) return;
        stockLocal[nombreProducto] = Math.max(0, stockLocal[nombreProducto] - 1);
        const u = stockLocal[nombreProducto];
        const el = document.getElementById('stock-' + nombreProducto.replace(/\s+/g, '-'));
        if (!el) return;

        if (u <= 0) {
            el.textContent = '❌ Agotado';
            el.classList.add('stock-agotado');
            const card = el.closest('.product-card');
            const btn = card?.querySelector('.btn-ver-producto');
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-eye"></i> No disponible'; }
        } else {
            el.textContent = `✅ ${u} disponible${u !== 1 ? 's' : ''}`;
        }
    }

    /* ── Buscador del navbar ── */
    function inicializarBuscador() {
        const input = document.getElementById('navSearchInput');
        const results = document.getElementById('navSearchResults');
        const clearBtn = document.getElementById('navSearchClear');
        if (!input || !results) return;

        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            clearBtn.style.display = q ? 'flex' : 'none';
            if (!q) { results.style.display = 'none'; return; }

            const matches = productos.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                (p.desc || '').toLowerCase().includes(q) ||
                (p.cat || '').toLowerCase().includes(q)
            ).slice(0, 6);

            if (matches.length === 0) {
                results.innerHTML = `<div class="nav-search__no-result">😔 Sin resultados para "<strong>${Utils.escapeHtml(q)}</strong>"</div>`;
            } else {
                results.innerHTML = matches.map(p => `
                    <div class="nav-search__item" data-nombre="${Utils.escapeHtml(p.nombre)}">
                        ${p.imagen ? `<img src="productos/${p.imagen}" alt="${Utils.escapeHtml(p.nombre)}" class="nav-search__thumb">` : '<span class="nav-search__emoji">📦</span>'}
                        <div class="nav-search__item-info">
                            <span class="nav-search__item-name">${Utils.escapeHtml(p.nombre)}</span>
                            <span class="nav-search__item-cat">${Utils.escapeHtml(p.cat)} · $${Utils.formatPrice(p.precio)}</span>
                        </div>
                        <button class="nav-search__item-btn">Ver</button>
                    </div>
                `).join('');

                results.querySelectorAll('.nav-search__item-btn').forEach((btn, idx) => {
                    btn.addEventListener('click', () => {
                        sessionStorage.setItem('productoSeleccionado', JSON.stringify(matches[idx]));
                        window.location.href = 'producto.html';
                        results.style.display = 'none';
                        input.value = '';
                        clearBtn.style.display = 'none';
                    });
                });
            }
            results.style.display = 'block';
        });

        clearBtn?.addEventListener('click', () => {
            input.value = '';
            results.style.display = 'none';
            clearBtn.style.display = 'none';
            input.focus();
        });

        document.addEventListener('click', e => {
            if (!document.getElementById('navSearch')?.contains(e.target)) {
                results.style.display = 'none';
            }
        });
    }

    return {
        cargar,
        getProductos: () => productos,
        descontarStock
    };

})();
