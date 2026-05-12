/**
 * ============================================================
 * ARCHIVO: js/faq.js
 * PROPÓSITO: Acordeón de preguntas frecuentes.
 * ============================================================
 */

const FAQ = (() => {

    function renderizar() {
        const contenedor = document.getElementById('faqContainer');
        if (!contenedor) return;

        if (!CONFIG.faq || CONFIG.faq.length === 0) {
            contenedor.innerHTML = `<p style="text-align:center;color:var(--gris-medio);">No hay preguntas frecuentes disponibles.</p>`;
            return;
        }

        contenedor.innerHTML = CONFIG.faq.map((item, index) => `
            <div class="faq-item ${index === 0 ? 'active' : ''}">
                <div class="faq-question" data-index="${index}" role="button" aria-expanded="${index === 0}" tabindex="0">
                    <span>${Utils.escapeHtml(item.pregunta)}</span>
                    <span class="faq-icon" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
                </div>
                <div class="faq-answer" role="region">
                    <p>${Utils.escapeHtml(item.respuesta)}</p>
                </div>
            </div>
        `).join('');

        contenedor.querySelectorAll('.faq-question').forEach(pregunta => {
            pregunta.addEventListener('click', () => alternar(pregunta));
            pregunta.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    alternar(pregunta);
                }
            });
        });
    }

    function alternar(pregunta) {
        const item = pregunta.parentElement;
        const activo = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(fi => {
            fi.classList.remove('active');
            fi.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        if (!activo) {
            item.classList.add('active');
            pregunta.setAttribute('aria-expanded', 'true');
        }
    }

    return { renderizar };

})();
