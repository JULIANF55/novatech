/**
 * ============================================================
 * ARCHIVO: js/config.js
 * PROPÓSITO: Configuración centralizada de BDJJ Global.
 * EDITA ESTE ARCHIVO para cambiar teléfono, correo, productos,
 * categorías, FAQ y URLs de Google Sheets.
 * ============================================================
 */

const CONFIG = {

    /* ──────────────────────────────────────────────────────
       WHATSAPP
       Número de contacto principal (con código de país, sin +)
       ────────────────────────────────────────────────────── */
    whatsapp: {
        numero: '573228546837',
        mensaje: '¡Hola! Quiero información sobre sus productos.',

        /* Construye la URL completa para abrir WhatsApp */
        getUrl: function (mensajePersonalizado) {
            const texto = encodeURIComponent(mensajePersonalizado || this.mensaje);
            return `https://wa.me/${this.numero}?text=${texto}`;
        }
    },


    /* ──────────────────────────────────────────────────────
       GOOGLE SHEETS
       urlCSV    → hoja de productos publicada como CSV
       urlWebApp → script que recibe las reservas
       Deja vacío ('') para usar los productos demo de abajo.
       ────────────────────────────────────────────────────── */
    sheets: {
        urlCSV:    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOayVsY2f_IYvFnBKt2iNvpNvGLgFsllsq6SglLZbV2PnRhRagWAeTlvoRhr-aI0MID-6BCWVZ95jG/pub?gid=0&single=true&output=csv',
        urlWebApp: 'https://script.google.com/macros/s/AKfycbwoa1bBfq068rHSjV6eXYMNJY-ZJna697_4CuIb0qxvVjeqYF2XLc1UvIerta0vECil/exec'
    },


    /* ──────────────────────────────────────────────────────
       EQUIPO FUNDADOR
       foto      → ruta relativa a la imagen del miembro
       whatsapp  → número sin código de país (se usa directo)
       ────────────────────────────────────────────────────── */
    equipo: [
        {
            nombre:    'Brandon Martínez',
            rol:       'Co-fundador · Marketing & Estrategia Comercial',
            bio:       'Encargado de la estrategia comercial y el posicionamiento de la marca. Su enfoque está en atraer nuevos clientes, fortalecer la presencia de BDJJ Global y generar oportunidades de crecimiento.',
            whatsapp:  '3104874938',
            foto:      'recursos/brandon.png'
        },
        {
            nombre:    'David Camacho',
            rol:       'Co-fundador · Finanzas & Operaciones',
            bio:       'Experto en gestión financiera y administrativa. Garantiza la salud económica del negocio y la eficiencia en cada proceso operativo.',
            whatsapp:  '3168712103',
            foto:      'recursos/david.png'
        },
        {
            nombre:    'Jhon Camacho',
            rol:       'Co-fundador · Ventas & Atención al Cliente',
            bio:       'Especialista en ventas y relaciones con el cliente. Su misión es asegurar que cada comprador viva la mejor experiencia de principio a fin.',
            whatsapp:  '3014150819',
            foto:      'recursos/jhon.png'
        },
        {
            nombre:    'Julian Forero',
            rol:       'Co-fundador & CEO · Tecnología',
            bio:       'Apasionado por la innovación y el mundo tech. Lidera la visión de BDJJ Global, la selección de productos de vanguardia y el desarrollo de la plataforma.',
            whatsapp:  '3007709585',
            foto:      'recursos/julian.png'
        },
    ],

    /* ──────────────────────────────────────────────────────
       CATEGORÍAS
       id     → debe coincidir con el campo "cat" del producto
       nombre → texto visible en los filtros
       icono  → emoji del botón de filtro
       ────────────────────────────────────────────────────── */
    categorias: [
        { id: 'todas',      nombre: 'Todas',       icono: '🛍️' },
        { id: 'Promociones',  nombre: 'Promociones',  icono: '🔥' },
        { id: 'Teclados',      nombre: 'Teclados',        icono: '⌨️' },
        { id: 'Relojes',  nombre: 'Relojes',    icono: '⌚' },
        { id: 'Intercomunicador',nombre: 'Intercomunicador',  icono: '🖥️' },
        { id: 'Celulares',      nombre: 'Celulares',        icono: '📱' },
        { id: 'Audifonos',  nombre: 'Audifonos',    icono: '🎧' }
    ],


    /* ──────────────────────────────────────────────────────
       PREGUNTAS FRECUENTES
       Agrega o edita objetos { pregunta, respuesta } aquí.
       ────────────────────────────────────────────────────── */
    faq: [
        {
            pregunta:  '¿Cómo funciona la reserva?',
            respuesta: 'Elige el producto que te interesa, haz clic en "Reservar", completa tus datos y selecciona tu método de pago: Nequi, Daviplata o contraentrega. Nuestro equipo se contactará contigo para confirmar los detalles.'
        },
        {
            pregunta:  '¿Cuáles son los métodos de pago?',
            respuesta: 'Aceptamos pago por Nequi, Daviplata (transferencia inmediata) y contraentrega (pagas al recibir el producto). Próximamente más opciones de pago.'
        },
        {
            pregunta:  '¿Cuánto tiempo tarda la entrega?',
            respuesta: 'En Bogotá entregamos en 24 a 48 horas hábiles. Para otras ciudades de Colombia, el tiempo es de 2 a 5 días hábiles según la ubicación.'
        },
        {
            pregunta:  '¿Los productos tienen garantía?',
            respuesta: '¡Sí! Todos nuestros productos cuentan con garantía oficial del fabricante. Además, ofrecemos soporte técnico directo por WhatsApp durante los primeros 30 días.'
        },
        {
            pregunta:  '¿Puedo cancelar mi reserva?',
            respuesta: 'Puedes cancelar tu reserva antes de que se confirme el envío. Solo contáctanos por WhatsApp y gestionamos la cancelación sin problema.'
        },
        {
            pregunta:  '¿Cómo sé que mi reserva fue exitosa?',
            respuesta: 'Al confirmar, verás una pantalla de éxito con el resumen de tu reserva. También puedes consultar el estado escribiéndonos por WhatsApp en cualquier momento.'
        }
    ],


    /* ──────────────────────────────────────────────────────
       CONTACTO
       ────────────────────────────────────────────────────── */
    correo: 'julianforero55555@gmail.com',

};

/* Exportar para entornos Node.js (pruebas, etc.) */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
