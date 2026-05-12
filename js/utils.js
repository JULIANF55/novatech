/**
 * ============================================================
 * ARCHIVO: js/utils.js
 * PROPÓSITO: Helpers globales y componentes compartidos
 * (navbar, footer, whatsapp) para evitar duplicar HTML.
 * ============================================================
 */

const Utils = (() => {

    function formatPrice(precio) {
        const num = parseInt(String(precio).replace(/[^0-9]/g, ''));
        return isNaN(num) ? '0' : num.toLocaleString('es-CO');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getPageName() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    }

    function getWhatsAppUrl(mensaje) {
        return CONFIG.whatsapp.getUrl(mensaje);
    }

    /* ── RENDERIZAR NAVBAR ── */
    function renderNavbar() {
        const root = document.getElementById('navbar-root');
        if (!root) return;
        const current = getPageName();
        const isIndex = current === '' || current === 'index.html';

        root.innerHTML = `
            <nav class="navbar" id="navbar" role="navigation" aria-label="Navegación principal">
                <div class="container nav-container">
                    <a href="${isIndex ? '#inicio' : 'index.html'}" class="logo" aria-label="BDJJ Global inicio">
                        <span class="logo-icon">⚡</span>
                        <span class="logo-text">BDJJ<span class="logo-highlight">Global</span></span>
                    </a>

                    ${isIndex ? `
                    <div class="nav-search" id="navSearch">
                        <div class="nav-search__inner">
                            <i class="fas fa-search nav-search__icon"></i>
                            <input type="text" id="navSearchInput" class="nav-search__input"
                                   placeholder="¿Qué estás buscando?" autocomplete="off" aria-label="Buscar productos">
                            <button class="nav-search__clear" id="navSearchClear" aria-label="Limpiar búsqueda" style="display:none;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="nav-search__results" id="navSearchResults" style="display:none;"></div>
                    </div>` : ''}

                    <ul class="nav-links" id="navLinks">
                        <li><a href="${isIndex ? '#catalogo' : 'index.html#catalogo'}" class="nav-link ${isIndex ? 'active' : ''}">Productos</a></li>
                        <li><a href="nosotros.html" class="nav-link ${current === 'nosotros.html' ? 'active' : ''}">Nosotros</a></li>
                        <li><a href="faq.html" class="nav-link ${current === 'faq.html' ? 'active' : ''}">FAQ</a></li>
                        <li>
                            <a href="#" class="btn-whatsapp-nav" id="whatsappNavBtn"
                               target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                WhatsApp
                            </a>
                        </li>
                    </ul>

                    <button class="hamburger" id="hamburgerBtn"
                            aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="navLinks">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>
        `;

        const hamburger = document.getElementById('hamburgerBtn');
        const navLinks  = document.getElementById('navLinks');
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', open);
            hamburger.classList.toggle('open', open);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', e => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ── RENDERIZAR FOOTER ── */
    function renderFooter() {
        const root = document.getElementById('footer-root');
        if (!root) return;

        root.innerHTML = `
            <footer class="footer" aria-label="Pie de página">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-brand">
                            <div class="logo">
                                <span class="logo-icon">⚡</span>
                                <span class="logo-text">BDJJ<span class="logo-highlight">Global</span></span>
                            </div>
                            <p>Tecnología que impulsa tu mundo. Reserva los mejores productos con la tranquilidad del pago contraentrega, Daviplata o Nequi.</p>
                        </div>
                        <div class="footer-links">
                            <h4>Enlaces rápidos</h4>
                            <ul>
                                <li><a href="index.html#catalogo">Productos</a></li>
                                <li><a href="nosotros.html">Nosotros</a></li>
                                <li><a href="faq.html">FAQ</a></li>
                            </ul>
                        </div>
                        <div class="footer-contact">
                            <h4>Contacto</h4>
                            <ul>
                                <li>
                                    <i class="fas fa-envelope" aria-hidden="true"></i>
                                    <a href="mailto:${CONFIG.correo}" style="color:inherit;text-decoration:none;">${CONFIG.correo}</a>
                                </li>
                                <li>
                                    <i class="fab fa-whatsapp" aria-hidden="true"></i>
                                    <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;">
                                        +57 ${CONFIG.whatsapp.numero.replace('57','')}
                                    </a>
                                </li>
                                <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Bogotá, Colombia</li>
                            </ul>
                        </div>
                        <div class="footer-social">
                            <h4>Síguenos</h4>
                            <div class="social-icons">
                                <a href="#" class="social-icon" aria-label="Facebook"><i class="fab fa-facebook" aria-hidden="true"></i></a>
                                <a href="#" class="social-icon" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
                                <a href="https://www.tiktok.com/@bdjj_global" class="social-icon" aria-label="TikTok"><i class="fab fa-tiktok" aria-hidden="true"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2026 BDJJ Global. Todos los derechos reservados. Hecho con ❤️ en Colombia.</p>
                    </div>
                </div>
            </footer>
        `;
    }

    /* ── RENDERIZAR WHATSAPP FLOTANTE ── */
    function renderWhatsAppFloat() {
        const root = document.getElementById('whatsapp-root');
        if (!root) return;

        root.innerHTML = `
            <a href="${getWhatsAppUrl()}" class="whatsapp-float" id="whatsappFloat"
               target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span class="whatsapp-float__tooltip" aria-hidden="true">¡Escríbenos!</span>
            </a>
        `;
    }

    return {
        formatPrice,
        escapeHtml,
        getPageName,
        getWhatsAppUrl,
        renderNavbar,
        renderFooter,
        renderWhatsAppFloat
    };

})();
