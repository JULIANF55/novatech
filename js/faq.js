/**
 * ============================================================
 * ARCHIVO: js/faq.js
 * PROPÓSITO: Renderiza el acordeón de preguntas frecuentes
 * usando los datos definidos en CONFIG.faq (config.js).
 * Para agregar o editar preguntas, edita CONFIG.faq.
 * ============================================================
 */

const FAQ = (() => {

    /* ──────────────────────────────────────────────────────
       RENDERIZAR FAQ
       Genera el HTML del acordeón y asigna los eventos de
       apertura y cierre de cada pregunta.
       ────────────────────────────────────────────────────── */
    function renderizar() {
        const contenedor = document.getElementById('faqContainer');
        if (!contenedor) return;

        /* Si no hay preguntas configuradas, mostrar mensaje */
        if (!CONFIG.faq || CONFIG.faq.length === 0) {
            contenedor.innerHTML = `
                <p style="text-align:center; color:var(--gris-medio);">
                    No hay preguntas frecuentes disponibles.
                </p>`;
            return;
        }

        /* Generar HTML de cada item del acordeón */
        contenedor.innerHTML = CONFIG.faq.map((item, index) => `
            <div class="faq-item ${index === 0 ? 'active' : ''}">

                <!-- Pregunta (botón que activa el acordeón) -->
                <div class="faq-question" data-index="${index}" role="button"
                     aria-expanded="${index === 0}" tabindex="0">
                    <span>${item.pregunta}</span>
                    <span class="faq-icon" aria-hidden="true">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                </div>

                <!-- Respuesta (se muestra al activar) -->
                <div class="faq-answer" role="region">
                    <p>${item.respuesta}</p>
                </div>
            </div>
        `).join('');

        /* ──────────────────────────────────────────────────
           EVENTOS DEL ACORDEÓN
           Al hacer clic en una pregunta:
           - Si está activa, se cierra.
           - Si no, se cierran todas y se abre la elegida.
           ────────────────────────────────────────────────── */
        contenedor.querySelectorAll('.faq-question').forEach(pregunta => {
            /* Evento de clic */
            pregunta.addEventListener('click', () => alternar(pregunta));

            /* Accesibilidad: también responde a Enter y Space */
            pregunta.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    alternar(pregunta);
                }
            });
        });
    }


    /* ──────────────────────────────────────────────────────
       ALTERNAR ITEM
       Cierra todos los ítems y abre el seleccionado (salvo
       que ya estuviera abierto, en cuyo caso lo cierra).
       ────────────────────────────────────────────────────── */
    function alternar(pregunta) {
        const item     = pregunta.parentElement;
        const estaActivo = item.classList.contains('active');

        /* Cerrar todos */
        document.querySelectorAll('.faq-item').forEach(fi => {
            fi.classList.remove('active');
            fi.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        /* Abrir el elegido si no estaba activo */
        if (!estaActivo) {
            item.classList.add('active');
            pregunta.setAttribute('aria-expanded', 'true');
        }
    }


    /* API pública */
    return { renderizar };

})();
