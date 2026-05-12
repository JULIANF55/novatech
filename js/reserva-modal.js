/**
 * ============================================================
 * ARCHIVO: js/reserva-modal.js
 * PROPÓSITO: Formulario de reserva con selects dependientes
 * (ciudad → localidad → barrio) y método de pago desplegable.
 * ============================================================
 */

const ReservaModal = (() => {

    let modal = null;
    let body = null;
    let productoActual = null;
    let callbackExito = null;

    function crearEstructura() {
        if (document.getElementById('reservaModal')) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal-reserva" id="reservaModal" role="dialog" aria-modal="true" aria-labelledby="rmTitle">
                <div class="modal-reserva__content">
                    <div class="modal-reserva__header">
                        <h2 class="modal-reserva__title" id="rmTitle">Completar Reserva</h2>
                        <button class="modal-reserva__close" id="rmClose" aria-label="Cerrar">&times;</button>
                    </div>
                    <div class="modal-reserva__body" id="rmBody"></div>
                </div>
            </div>
        `);

        document.getElementById('rmClose').addEventListener('click', cerrar);
        document.getElementById('reservaModal').addEventListener('click', e => {
            if (e.target === e.currentTarget) cerrar();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) cerrar();
        });
    }

    function abrir(producto, onExito) {
        crearEstructura();
        modal = document.getElementById('reservaModal');
        body = document.getElementById('rmBody');
        productoActual = producto;
        callbackExito = onExito;

        const precioNum = parseInt(String(producto.precio).replace(/[^0-9]/g, ''));
        const cantidad = producto._cantidadCarrito || producto._cantidadModal || 1;
        const ciudades = Object.keys(CONFIG.ubicaciones || {});
        const total = precioNum * cantidad;

        body.innerHTML = `
            <form id="reservaForm" novalidate>
                <div class="product-summary">
                    <div class="product-summary__img-wrap">
                        ${producto.imagen
                            ? `<img src="productos/${producto.imagen}.png" alt="${Utils.escapeHtml(producto.nombre)}" class="product-summary__img">`
                            : `<span class="product-summary__emoji">📦</span>`
                        }
                    </div>
                    <div class="product-summary__info">
                        <h3>${Utils.escapeHtml(producto.nombre)}</h3>
                        <p><strong>Precio unitario:</strong> $${Utils.formatPrice(producto.precio)}</p>
                        <p><strong>Cantidad:</strong> ${cantidad}</p>
                        <p><strong>Total:</strong> <span style="color:var(--naranja);font-weight:700;">$${Utils.formatPrice(total)}</span></p>
                    </div>
                </div>

                <div class="form-group">
                    <label for="rm-nombre">Nombre completo <span class="req">*</span></label>
                    <input type="text" id="rm-nombre" required placeholder="Tu nombre completo" autocomplete="name">
                </div>

                <div class="form-group">
                    <label for="rm-telefono">Teléfono <span class="req">*</span></label>
                    <input type="tel" id="rm-telefono" required placeholder="Ej: 3228546837" autocomplete="tel">
                </div>

                <div class="form-group">
                    <label for="rm-correo">Correo electrónico <span style="color:var(--gris-medio);font-weight:400;">(opcional)</span></label>
                    <input type="email" id="rm-correo" placeholder="tu@correo.com" autocomplete="email">
                </div>

                <div class="form-row form-row--3">
                    <div class="form-group">
                        <label for="rm-ciudad">Ciudad <span class="req">*</span></label>
                        <select id="rm-ciudad" required>
                            <option value="">Selecciona...</option>
                            ${ciudades.map(c => `<option value="${Utils.escapeHtml(c)}">${Utils.escapeHtml(c)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="rm-localidad">Localidad <span class="req">*</span></label>
                        <select id="rm-localidad" required disabled>
                            <option value="">Selecciona ciudad primero</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="rm-barrio">Barrio <span class="req">*</span></label>
                        <select id="rm-barrio" required disabled>
                            <option value="">Selecciona localidad primero</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="rm-direccion">Dirección específica <span class="req">*</span></label>
                    <input type="text" id="rm-direccion" required placeholder="Calle, carrera, número, apto, torre..." autocomplete="street-address">
                </div>

                <div class="form-group">
                    <label for="rm-pago">Método de pago <span class="req">*</span></label>
                    <select id="rm-pago" required>
                        <option value="">Selecciona...</option>
                        ${CONFIG.metodosPago.map(m => `<option value="${m.id}">${m.icono} ${m.nombre}</option>`).join('')}
                    </select>
                    <div class="pago-instrucciones" id="rm-pago-instrucciones" style="display:none;"></div>
                </div>

                <div class="form-error" id="rm-error" style="display:none;"></div>

                <button type="submit" class="btn-primary btn-submit">
                    <i class="fas fa-check-circle"></i> Confirmar Reserva
                </button>
            </form>
        `;

        const selCiudad = document.getElementById('rm-ciudad');
        const selLocalidad = document.getElementById('rm-localidad');
        const selBarrio = document.getElementById('rm-barrio');
        const selPago = document.getElementById('rm-pago');
        const instrucciones = document.getElementById('rm-pago-instrucciones');

        selCiudad.addEventListener('change', () => {
            const ciudad = selCiudad.value;
            selLocalidad.innerHTML = '<option value="">Selecciona...</option>';
            selBarrio.innerHTML = '<option value="">Selecciona localidad primero</option>';
            selBarrio.disabled = true;

            if (ciudad && CONFIG.ubicaciones[ciudad]) {
                Object.keys(CONFIG.ubicaciones[ciudad]).forEach(loc => {
                    selLocalidad.innerHTML += `<option value="${Utils.escapeHtml(loc)}">${Utils.escapeHtml(loc)}</option>`;
                });
                selLocalidad.disabled = false;
            } else {
                selLocalidad.disabled = true;
            }
        });

        selLocalidad.addEventListener('change', () => {
            const ciudad = selCiudad.value;
            const localidad = selLocalidad.value;
            selBarrio.innerHTML = '<option value="">Selecciona...</option>';

            if (ciudad && localidad && CONFIG.ubicaciones[ciudad]?.[localidad]) {
                CONFIG.ubicaciones[ciudad][localidad].forEach(b => {
                    selBarrio.innerHTML += `<option value="${Utils.escapeHtml(b)}">${Utils.escapeHtml(b)}</option>`;
                });
                selBarrio.disabled = false;
            } else {
                selBarrio.disabled = true;
            }
        });

        selPago.addEventListener('change', () => {
            const metodo = CONFIG.metodosPago.find(m => m.id === selPago.value);
            if (metodo && metodo.instrucciones) {
                instrucciones.innerHTML = `
                    <div class="pago-instrucciones__header">
                        <i class="fas fa-info-circle"></i>
                        <strong>Instrucciones — ${metodo.nombre}</strong>
                    </div>
                    <p>${metodo.instrucciones}</p>
                `;
                instrucciones.style.display = 'block';
            } else {
                instrucciones.style.display = 'none';
            }
        });

        document.getElementById('reservaForm').addEventListener('submit', manejarEnvio);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('rm-nombre')?.focus(), 100);
    }

    async function manejarEnvio(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('.btn-submit');
        const errorEl = document.getElementById('rm-error');

        const nombre = document.getElementById('rm-nombre').value.trim();
        const telefono = document.getElementById('rm-telefono').value.trim();
        const correo = document.getElementById('rm-correo').value.trim();
        const ciudad = document.getElementById('rm-ciudad').value;
        const localidad = document.getElementById('rm-localidad').value;
        const barrio = document.getElementById('rm-barrio').value;
        const direccion = document.getElementById('rm-direccion').value.trim();
        const pagoId = document.getElementById('rm-pago').value;
        const cantidad = productoActual._cantidadCarrito || productoActual._cantidadModal || 1;

        if (!nombre || !telefono || !ciudad || !localidad || !barrio || !direccion || !pagoId) {
            mostrarError('Completa todos los campos obligatorios.');
            return;
        }
        if (!/^\d{7,15}$/.test(telefono)) {
            mostrarError('Ingresa un teléfono válido (solo números, 7-15 dígitos).');
            return;
        }

        const metodoPago = CONFIG.metodosPago.find(m => m.id === pagoId);
        const precioNum = parseInt(String(productoActual.precio).replace(/[^0-9]/g, ''));
        const total = precioNum * cantidad;

        const datos = {
            producto: productoActual.nombre,
            categoria: productoActual.cat,
            precio: Utils.formatPrice(productoActual.precio),
            precioTotal: Utils.formatPrice(total),
            nombre,
            telefono,
            correo,
            ciudad,
            localidad,
            barrio,
            direccionCompleta: `${direccion}, ${barrio}, ${localidad}, ${ciudad}`,
            direccion,
            pago: metodoPago.nombre,
            cantidad,
            fecha: new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' })
        };

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        let enviado = false;
        if (CONFIG.sheets.urlWebApp) {
            enviado = await enviarAGoogleSheets(datos);
        }

        mostrarExito(datos, enviado);
        if (typeof callbackExito === 'function') callbackExito();
    }

    async function enviarAGoogleSheets(datos) {
        try {
            const params = new URLSearchParams();
            Object.entries(datos).forEach(([k, v]) => params.append(k, v));
            await fetch(`${CONFIG.sheets.urlWebApp}?${params.toString()}`, { method: 'GET', mode: 'no-cors' });
            return true;
        } catch (err) {
            console.warn('Error enviando a Sheets:', err);
            return false;
        }
    }

    function mostrarExito(datos, enviado) {
        body.innerHTML = `
            <div class="success-message">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h3>¡Reserva Exitosa!</h3>
                <p>Gracias <strong>${Utils.escapeHtml(datos.nombre)}</strong>, tu reserva ha sido registrada.</p>
                <div class="success-details">
                    <div class="success-row"><span class="success-label">Producto</span><span>${Utils.escapeHtml(datos.producto)}</span></div>
                    <div class="success-row"><span class="success-label">Total</span><span>$${datos.precioTotal}</span></div>
                    <div class="success-row"><span class="success-label">Pago</span><span>${Utils.escapeHtml(datos.pago)}</span></div>
                    <div class="success-row"><span class="success-label">Entrega</span><span>${Utils.escapeHtml(datos.direccionCompleta)}</span></div>
                    <div class="success-row"><span class="success-label">Teléfono</span><span>${Utils.escapeHtml(datos.telefono)}</span></div>
                </div>
                ${!enviado ? `<p class="success-nota">⚠️ La reserva fue guardada localmente. Nuestro equipo te contactará pronto.</p>` : ''}
                <button class="btn-primary" id="rmCerrarExito" style="margin-top:24px;width:100%;justify-content:center;">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        `;
        document.getElementById('rmCerrarExito').addEventListener('click', cerrar);
    }

    function mostrarError(msg) {
        const el = document.getElementById('rm-error');
        el.textContent = '⚠️ ' + msg;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 5000);
    }

    function cerrar() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        productoActual = null;
        callbackExito = null;
    }

    return { abrir, cerrar };

})();
