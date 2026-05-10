/**
 * ============================================================
 * ARCHIVO: js/app.js
 * PROPÓSITO: Punto de entrada de la aplicación BDJJ Global.
 * Inicializa todos los módulos y configura la navegación,
 * el scroll de la navbar y los botones de WhatsApp.
 * ============================================================
 */

const App = (() => {

    /* ──────────────────────────────────────────────────────
       INICIALIZAR
       Se ejecuta cuando el DOM está completamente cargado.
       ────────────────────────────────────────────────────── */
    function init() {
        console.log('⚡ BDJJ Global inicializando...');

        configurarWhatsApp();    /* Asignar URLs a todos los botones WA */
        Productos.cargar();      /* Cargar y renderizar el catálogo */
        FAQ.renderizar();        /* Renderizar el acordeón de FAQ */
        configurarNavegacion();  /* Menú hamburguesa responsive */
        configurarNavbarScroll();/* Sombra de navbar al hacer scroll */

        console.log('✅ BDJJ Global listo');
    }


    /* ──────────────────────────────────────────────────────
       CONFIGURAR WHATSAPP
       Asigna la URL correcta a todos los botones de WhatsApp
       definidos en el HTML: navbar, hero y flotante.
       ────────────────────────────────────────────────────── */
    function configurarWhatsApp() {
        const url = CONFIG.whatsapp.getUrl();

        /* Botón en la barra de navegación */
        const btnNav = document.getElementById('whatsappNavBtn');
        if (btnNav) {
            btnNav.href   = url;
            btnNav.target = '_blank';
            btnNav.rel    = 'noopener noreferrer';
        }

        /* Botón "Escríbenos" en el hero */
        const btnHero = document.getElementById('whatsappHeroBtn');
        if (btnHero) {
            btnHero.href   = url;
            btnHero.target = '_blank';
            btnHero.rel    = 'noopener noreferrer';
        }

        /* Botón flotante fijo en la esquina inferior derecha */
        const btnFlotante = document.getElementById('whatsappFloat');
        if (btnFlotante) {
            btnFlotante.href   = url;
            btnFlotante.target = '_blank';
            btnFlotante.rel    = 'noopener noreferrer';
        }
    }


    /* ──────────────────────────────────────────────────────
       CONFIGURAR NAVEGACIÓN RESPONSIVE
       Controla el menú hamburguesa en móviles: abre/cierra
       el menú y lo cierra al hacer clic en un enlace.
       ────────────────────────────────────────────────────── */
    function configurarNavegacion() {
        const hamburger = document.getElementById('hamburgerBtn');
        const navLinks  = document.getElementById('navLinks');

        if (!hamburger || !navLinks) return;

        /* Abrir / cerrar menú al hacer clic en el ícono */
        hamburger.addEventListener('click', () => {
            const estaAbierto = navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', estaAbierto);
            hamburger.classList.toggle('open', estaAbierto);
        });

        /* Cerrar menú al hacer clic en cualquier enlace */
        navLinks.querySelectorAll('a').forEach(enlace => {
            enlace.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        /* Cerrar menú al hacer clic fuera de él */
        document.addEventListener('click', e => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }


    /* ──────────────────────────────────────────────────────
       CONFIGURAR SCROLL DE NAVBAR
       Añade la clase "scrolled" a la navbar cuando el usuario
       ha hecho scroll, lo que activa una sombra más pronunciada.
       ────────────────────────────────────────────────────── */
    function configurarNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const actualizarNavbar = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };

        window.addEventListener('scroll', actualizarNavbar, { passive: true });
        actualizarNavbar(); /* Ejecutar al cargar por si la página ya scrolleó */
    }


    /* ──────────────────────────────────────────────────────
       ARRANCAR
       Si el DOM ya está listo se inicializa de inmediato;
       de lo contrario espera el evento DOMContentLoaded.
       ────────────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }


    /* API pública (para debug desde la consola) */
    return { init };

})();
