/**
 * ARCHIVO: js/producto-detalle.js
 * Lee el producto guardado en sessionStorage y rellena la página.
 */
document.addEventListener('DOMContentLoaded', () => {

    const data = sessionStorage.getItem('productoSeleccionado');
    if (!data) { window.location.href = 'index.html'; return; }

    const p = JSON.parse(data);

    // Textos básicos
    document.getElementById('pdCategoria').textContent = p.cat || '';
    document.getElementById('pdNombre').textContent = p.nombre;
    document.getElementById('pdPrecio').textContent = `$${Utils.formatPrice(p.precio)}`;
    document.title = `${p.nombre} – BDJJ Global`;

    // Precio original (si hay promoción)
    if (p.enPromocion && p.precioOriginal) {
        const el = document.getElementById('pdPrecioOriginal');
        el.textContent = `Antes: $${Utils.formatPrice(p.precioOriginal)}  −${p.descuento}%`;
        el.style.display = 'block';
    }

    // Descripción
    document.getElementById('pdDescripcion').textContent =
        p.desc || 'Sin descripción disponible.';

    // Características
    const caract = Array.isArray(p.caracteristicas) ? p.caracteristicas : [];
    const listaEl = document.getElementById('pdCaracteristicas');
    if (caract.length > 0) {
        listaEl.innerHTML = caract.map(c => `<li>✓ ${Utils.escapeHtml(c)}</li>`).join('');
    } else {
        document.getElementById('pdCaractBloque').style.display = 'none';
    }

    // Cantidad y carrito
    const qtyInput = document.getElementById('pdQty');
    document.getElementById('pdQtyMinus').addEventListener('click', () => {
        if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    });
    document.getElementById('pdQtyPlus').addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    document.getElementById('pdAddCart').addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 1;
        Carrito.agregar({ ...p, _cantidadModal: qty });
    });

    // ── Galería de imágenes ──────────────────────────────────
    const imgPrincipal = `productos/${p.imagen}.png`;
    const imgWrap = document.querySelector('.pd-hero__img-wrap');

    function construirGaleria(imagenes) {
        if (imagenes.length > 1) {
            imgWrap.innerHTML = `
                <div class="carrusel">
                    <button class="carrusel__btn carrusel__btn--prev" id="carruselPrev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <img src="${imagenes[0]}" alt="${Utils.escapeHtml(p.nombre)}" class="pd-hero__img" id="pdImagen">
                    <button class="carrusel__btn carrusel__btn--next" id="carruselNext">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="carrusel__dots">
                        ${imagenes.map((_, i) => `
                            <span class="carrusel__dot ${i === 0 ? 'active' : ''}" data-i="${i}"></span>
                        `).join('')}
                    </div>
                </div>
                <div class="carrusel__thumbs">
                    ${imagenes.map((src, i) => `
                        <img src="${src}" alt="${Utils.escapeHtml(p.nombre)}" class="carrusel__thumb ${i === 0 ? 'active' : ''}" data-i="${i}">
                    `).join('')}
                </div>
            `;

            let actual = 0;
            const imgEl = document.getElementById('pdImagen');
            const dots = document.querySelectorAll('.carrusel__dot');
            const thumbs = document.querySelectorAll('.carrusel__thumb');

            function irA(idx) {
                actual = (idx + imagenes.length) % imagenes.length;
                imgEl.src = imagenes[actual];
                dots.forEach((d, i) => d.classList.toggle('active', i === actual));
                thumbs.forEach((t, i) => t.classList.toggle('active', i === actual));
            }

            document.getElementById('carruselPrev').addEventListener('click', () => irA(actual - 1));
            document.getElementById('carruselNext').addEventListener('click', () => irA(actual + 1));
            dots.forEach(d => d.addEventListener('click', () => irA(parseInt(d.dataset.i))));
            thumbs.forEach(t => t.addEventListener('click', () => irA(parseInt(t.dataset.i))));

        } else {
            imgWrap.innerHTML = `<img src="${imagenes[0]}" alt="${Utils.escapeHtml(p.nombre)}" class="pd-hero__img" id="pdImagen">`;
        }
    }

    // Detectar extras automáticamente: reloj1.png, reloj2.png, reloj3.png...
    const imagenes = [imgPrincipal];
    let fallosConsecutivos = 0;

    function intentarSiguiente(num) {
        if (num > 10) { construirGaleria(imagenes); return; } // tope de seguridad
        const img = new Image();
        const src = `productos/${p.imagen}${num}.png`;
        img.onload = () => {
            fallosConsecutivos = 0;
            imagenes.push(src);
            intentarSiguiente(num + 1);
        };
        img.onerror = () => {
            fallosConsecutivos++;
            if (fallosConsecutivos < 2) {
                intentarSiguiente(num + 1); // intenta el siguiente por si hay salto
            } else {
                construirGaleria(imagenes); // ya no hay más
            }
        };
        img.src = src;
    }

    intentarSiguiente(1);

});