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
        configurarBuscador();   /* Buscador de productos en la navbar */
        Carrito.inicializar(); /* Configurar carrito de compras flotante */

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
        const hero   = document.getElementById('inicio');
        if (!navbar || !hero) return;
    
        /* Ajusta el padding del hero según la altura real de la navbar */
        function ajustarHero() {
            const alturaNavbar = navbar.offsetHeight;
            hero.style.paddingTop = (alturaNavbar + 30) + 'px';
        }
    
        ajustarHero();
        window.addEventListener('resize', ajustarHero);
    
        const actualizarNavbar = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
    
        window.addEventListener('scroll', actualizarNavbar, { passive: true });
        actualizarNavbar();
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

    /* ──────────────────────────────────────────────────────
       CONFIGURAR BUSCADOR DEL NAVBAR
       ────────────────────────────────────────────────────── */
    function configurarBuscador() {
        const input    = document.getElementById('navSearchInput');
        const results  = document.getElementById('navSearchResults');
        const clearBtn = document.getElementById('navSearchClear');
        if (!input || !results) return;

        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            clearBtn.style.display = q ? 'flex' : 'none';

            if (!q) { results.style.display = 'none'; return; }

            const productos = Productos.getProductos();
            const matches   = productos.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                (p.desc  || '').toLowerCase().includes(q) ||
                (p.cat   || '').toLowerCase().includes(q)
            ).slice(0, 6);

            if (matches.length === 0) {
                results.innerHTML = `<div class="nav-search__no-result">😔 Sin resultados para "<strong>${q}</strong>"</div>`;
            } else {
                results.innerHTML = matches.map(p => `
                    <div class="nav-search__item" data-nombre="${p.nombre}">
                        ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" class="nav-search__thumb">` : '<span class="nav-search__emoji">📦</span>'}
                        <div class="nav-search__item-info">
                            <span class="nav-search__item-name">${p.nombre}</span>
                            <span class="nav-search__item-cat">${p.cat} · $${parseInt(String(p.precio).replace(/[^0-9]/g,'')).toLocaleString('es-CO')}</span>
                        </div>
                        <button class="nav-search__item-btn">Reservar</button>
                    </div>
                `).join('');
            }
            results.style.display = 'block';

            results.querySelectorAll('.nav-search__item-btn').forEach((btn, idx) => {
                btn.addEventListener('click', () => {
                    Modal.abrir(matches[idx], () => Productos.descontarStock(matches[idx].nombre));
                    results.style.display = 'none';
                    input.value = '';
                    clearBtn.style.display = 'none';
                });
            });
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

    /* API pública (para debug desde la consola) */
    return { init };

})();
