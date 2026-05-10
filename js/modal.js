/**
 * ============================================================
 * ARCHIVO: js/modal.js
 * PROPÓSITO: Maneja la apertura, cierre y envío del formulario
 * de reserva. Recibe un callback onExito para notificar al
 * módulo de productos que descuente el stock.
 * ============================================================
 */

const Modal = (() => {

    /* ──────────────────────────────────────────────────────
       REFERENCIAS AL DOM
       ────────────────────────────────────────────────────── */
    const modal      = document.getElementById('reservationModal');
    const modalBody  = document.getElementById('modalBody');
    const closeBtn   = document.getElementById('closeModal');

    /* Producto y callback activos en la reserva en curso */
    let productoActual = null;
    let callbackExito  = null;


    /* ──────────────────────────────────────────────────────
       ABRIR MODAL
       producto        → objeto del producto a reservar
       onExitoCallback → función que se llama al confirmar la reserva
       ────────────────────────────────────────────────────── */
    function abrir(producto, onExitoCallback) {
        productoActual = producto;
        callbackExito  = onExitoCallback || null;

        /* Construir el contenido del formulario */
        modalBody.innerHTML = `
            <form id="reservationForm" novalidate>

                <!-- Resumen del producto seleccionado -->
                <div class="product-summary">
                    <div class="product-summary__img-wrap">
                        ${producto.imagen
                            ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="product-summary__img">`
                            : `<span class="product-summary__emoji">📦</span>`
                        }
                    </div>
                    <div class="product-summary__info">
                        <h3>${producto.nombre}</h3>
                        <p><strong>Precio:</strong> $${formatearPrecio(producto.precio)}</p>
                        <p><strong>Categoría:</strong> ${producto.cat}</p>
                    </div>
                </div>

                <!-- Nombre completo -->
                <div class="form-group">
                    <label for="res-nombre">Nombre completo <span class="req">*</span></label>
                    <input type="text" id="res-nombre" name="nombre" required
                           placeholder="Ingresa tu nombre completo" autocomplete="name">
                </div>

                <!-- Teléfono -->
                <div class="form-group">
                    <label for="res-telefono">Teléfono <span class="req">*</span></label>
                    <input type="tel" id="res-telefono" name="telefono" required
                           placeholder="Ej: 3007709585" autocomplete="tel">
                </div>

                <!-- Dirección de entrega -->
                <div class="form-group">
                    <label for="res-direccion">Dirección de entrega <span class="req">*</span></label>
                    <input type="text" id="res-direccion" name="direccion" required
                           placeholder="Calle, barrio, ciudad" autocomplete="street-address">
                </div>

                <!-- Cantidad -->
                <div class="form-group">
                    <label for="res-cantidad">Cantidad <span class="req">*</span></label>
                    <div class="qty-control">
                        <button type="button" class="qty-btn qty-btn--minus" id="qtyMinus" aria-label="Disminuir cantidad">−</button>
                        <input type="number" id="res-cantidad" name="cantidad" value="1" min="1" max="99" required readonly class="qty-input">
                        <button type="button" class="qty-btn qty-btn--plus" id="qtyPlus" aria-label="Aumentar cantidad">+</button>
                    </div>
                </div>

                <!-- Método de pago -->
                <div class="form-group">
                    <label>Método de pago <span class="req">*</span></label>
                    <div class="payment-options">
                        <label class="payment-option">
                            <input type="radio" name="pago" value="Nequi" required>
                            <span class="payment-label">
                                <i class="fas fa-mobile-alt"></i> Nequi
                            </span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="pago" value="Daviplata" required>
                            <span class="payment-label">
                                <i class="fas fa-wallet"></i> Daviplata
                            </span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="pago" value="Contraentrega" required>
                            <span class="payment-label">
                                <i class="fas fa-hand-holding-usd"></i> Contraentrega
                            </span>
                        </label>
                    </div>
                    <!-- Cuadro especial Nequi/Daviplata -->
                    <div class="pago-instrucciones" id="pagoInstrucciones" style="display:none;">
                        <div class="pago-instrucciones__header">
                            <i class="fas fa-info-circle"></i>
                            <strong>Instrucciones de pago</strong>
                        </div>
                        <p>Realiza tu pago al número:</p>
                        <p class="pago-numero">📱 <strong>300 770 9585</strong></p>
                        <p>Luego envía el <strong>soporte / comprobante</strong> a ese mismo número por WhatsApp.</p>
                    </div>
                </div>

                <!-- Mensaje de error (se muestra si la validación falla) -->
                <div class="form-error" id="formError" style="display:none;"></div>

                <!-- Botón de confirmación -->
                <button type="submit" class="btn-primary btn-submit">
                    <i class="fas fa-check-circle"></i> Confirmar Reserva
                </button>
            </form>
        `;

        /* Escuchar el submit del formulario */
        document.getElementById('reservationForm').addEventListener('submit', manejarEnvio);

        // Mostrar instrucciones cuando eligen Nequi o Daviplata
        document.querySelectorAll('input[name="pago"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const instrucciones = document.getElementById('pagoInstrucciones');
                if (!instrucciones) return;
                const metodo = document.querySelector('input[name="pago"]:checked')?.value;
                instrucciones.style.display = (metodo === 'Nequi' || metodo === 'Daviplata') ? 'block' : 'none';
            });
        });

        // Controles de cantidad
        document.getElementById('qtyMinus')?.addEventListener('click', () => {
            const inp = document.getElementById('res-cantidad');
            if (parseInt(inp.value) > 1) inp.value = parseInt(inp.value) - 1;
        });
        document.getElementById('qtyPlus')?.addEventListener('click', () => {
            const inp = document.getElementById('res-cantidad');
            inp.value = parseInt(inp.value) + 1;
        });

        /* Mostrar el modal */
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        /* Foco en el primer campo para accesibilidad */
        setTimeout(() => document.getElementById('res-nombre')?.focus(), 100);
    }


    /* ──────────────────────────────────────────────────────
       CERRAR MODAL
       Restablece el estado del body y limpia las variables.
       ────────────────────────────────────────────────────── */
    function cerrar() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        productoActual = null;
        callbackExito  = null;
    }


    /* ──────────────────────────────────────────────────────
       MANEJAR ENVÍO DEL FORMULARIO
       Valida campos, envía a Google Apps Script si está
       configurado, y muestra la pantalla de éxito.
       ────────────────────────────────────────────────────── */
    async function manejarEnvio(event) {
        event.preventDefault();

        const submitBtn = event.target.querySelector('.btn-submit');

        /* Recopilar datos */
        const datos = {
            producto:  productoActual.nombre,
            categoria: productoActual.cat,
            precio:    formatearPrecio(productoActual.precio),
            nombre:    document.getElementById('res-nombre')?.value.trim(),
            telefono:  document.getElementById('res-telefono')?.value.trim(),
            direccion: document.getElementById('res-direccion')?.value.trim(),
            pago:      document.querySelector('input[name="pago"]:checked')?.value,
            cantidad:  parseInt(document.getElementById('res-cantidad')?.value) || 1,
            fecha:     new Date().toLocaleDateString('es-CO', {
                            day: '2-digit', month: 'long', year: 'numeric'
                       }),
        };

        /* Validación básica */
        if (!datos.nombre || !datos.telefono || !datos.direccion || !datos.pago || !datos.cantidad) {
            mostrarError('Por favor completa todos los campos obligatorios.');
            return;
        }
        if (!/^\d{7,15}$/.test(datos.telefono)) {
            mostrarError('Ingresa un teléfono válido (solo números, 7-15 dígitos).');
            return;
        }

        /* Estado de carga en el botón */
        submitBtn.disabled  = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        /* Intentar enviar a Google Sheets */
        let enviado = false;
        if (CONFIG.sheets.urlWebApp) {
            enviado = await enviarAGoogleSheets(datos);
        }

        /* Mostrar pantalla de éxito */
        mostrarExito(datos, enviado);

        /* Notificar al módulo de productos para descontar stock */
        if (typeof callbackExito === 'function') {
            callbackExito();
        }
    }


    /* ──────────────────────────────────────────────────────
       ENVIAR A GOOGLE APPS SCRIPT
       Usa mode: 'no-cors' porque Apps Script no admite CORS
       en peticiones POST de otros dominios. Se asume éxito
       si no hay error de red.
       ────────────────────────────────────────────────────── */
    async function enviarAGoogleSheets(datos) {
        try {
            await fetch(CONFIG.sheets.urlWebApp, {
                method:  'POST',
                mode:    'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(datos),
            });
            return true;
        } catch (err) {
            console.warn('No se pudo enviar al servidor:', err);
            return false;
        }
    }


    /* ──────────────────────────────────────────────────────
       PANTALLA DE ÉXITO
       Reemplaza el formulario con un resumen de la reserva.
       ────────────────────────────────────────────────────── */
    function mostrarExito(datos, enviado) {
        modalBody.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>¡Reserva Exitosa!</h3>
                <p>Gracias <strong>${datos.nombre}</strong>, tu reserva ha sido registrada.</p>

                <div class="success-details">
                    <div class="success-row">
                        <span class="success-label">Producto</span>
                        <span>${datos.producto}</span>
                    </div>
                    <div class="success-row">
                        <span class="success-label">Precio</span>
                        <span>$${datos.precio}</span>
                    </div>
                    <div class="success-row">
                        <span class="success-label">Pago</span>
                        <span>${datos.pago}</span>
                    </div>
                    <div class="success-row">
                        <span class="success-label">Teléfono</span>
                        <span>${datos.telefono}</span>
                    </div>
                    <div class="success-row">
                        <span class="success-label">Dirección</span>
                        <span>${datos.direccion}</span>
                    </div>
                </div>

                ${!enviado ? `
                <p class="success-nota">
                    ⚠️ La reserva fue guardada localmente. Nuestro equipo te contactará pronto por WhatsApp.
                </p>` : ''}

                <p style="margin-top:16px; color: var(--gris-medio); font-size:.95rem;">
                    Nos pondremos en contacto contigo por WhatsApp para coordinar la entrega.
                </p>

                <button class="btn-primary" id="btnCerrarExito" style="margin-top:24px; width:100%; justify-content:center;">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        `;

        document.getElementById('btnCerrarExito').addEventListener('click', cerrar);
    }


    /* ──────────────────────────────────────────────────────
       MOSTRAR ERROR EN FORMULARIO
       Muestra el mensaje de error dentro del formulario.
       ────────────────────────────────────────────────────── */
    function mostrarError(mensaje) {
        const errorEl = document.getElementById('formError');
        if (!errorEl) return;
        errorEl.textContent = '⚠️ ' + mensaje;
        errorEl.style.display = 'block';

        /* Ocultar automáticamente después de 5 segundos */
        setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
    }


    /* ──────────────────────────────────────────────────────
       FORMATO DE PRECIO (copia local para no depender de
       otro módulo)
       ────────────────────────────────────────────────────── */
    function formatearPrecio(precio) {
        const num = parseInt(String(precio).replace(/[^0-9]/g, ''));
        return isNaN(num) ? '0' : num.toLocaleString('es-CO');
    }


    /* ──────────────────────────────────────────────────────
       EVENTOS GLOBALES DEL MODAL
       ────────────────────────────────────────────────────── */

    /* Botón X para cerrar */
    closeBtn?.addEventListener('click', cerrar);

    /* Clic en el fondo oscuro cierra el modal */
    modal?.addEventListener('click', e => {
        if (e.target === modal) cerrar();
    });

    /* Tecla Escape cierra el modal */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) cerrar();
    });


    /* API pública */
    return { abrir, cerrar };

})();
