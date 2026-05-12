/**
 * ============================================================
 * ARCHIVO: js/config.js
 * PROPÓSITO: Única fuente de verdad de BDJJ Global.
 * ============================================================
 */

const CONFIG = {

    /* ── WHATSAPP ── */
    whatsapp: {
        numero: '573228546837',
        mensaje: '¡Hola! Quiero información sobre sus productos.',
        getUrl: function (mensajePersonalizado) {
            const texto = encodeURIComponent(mensajePersonalizado || this.mensaje);
            return `https://wa.me/${this.numero}?text=${texto}`;
        }
    },

    /* ── GOOGLE SHEETS ── */
    sheets: {
        urlCSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOayVsY2f_IYvFnBKt2iNvpNvGLgFsllsq6SglLZbV2PnRhRagWAeTlvoRhr-aI0MID-6BCWVZ95jG/pub?gid=0&single=true&output=csv',
        urlWebApp: 'https://script.google.com/macros/s/AKfycbwoa1bBfq068rHSjV6eXYMNJY-ZJna697_4CuIb0qxvVjeqYF2XLc1UvIerta0vECil/exec'
    },

    /* ── CONTACTO ── */
    correo: 'julianforero55555@gmail.com',

    /* ── EQUIPO ── */
    equipo: [
        {
            nombre: 'Brandon Martínez',
            rol: 'Co-fundador · Marketing & Estrategia Comercial',
            bio: 'Encargado de la estrategia comercial y el posicionamiento de la marca. Su enfoque está en atraer nuevos clientes, fortalecer la presencia de BDJJ Global y generar oportunidades de crecimiento.',
            whatsapp: '3104874938',
            foto: 'recursos/brandon.png'
        },
        {
            nombre: 'David Camacho',
            rol: 'Co-fundador · Finanzas & Operaciones',
            bio: 'Experto en gestión financiera y administrativa. Garantiza la salud económica del negocio y la eficiencia en cada proceso operativo.',
            whatsapp: '3168712103',
            foto: 'recursos/david.png'
        },
        {
            nombre: 'Jhon Camacho',
            rol: 'Co-fundador · Ventas & Atención al Cliente',
            bio: 'Especialista en ventas y relaciones con el cliente. Su misión es asegurar que cada comprador viva la mejor experiencia de principio a fin.',
            whatsapp: '3014150819',
            foto: 'recursos/jhon.png'
        },
        {
            nombre: 'Julian Forero',
            rol: 'Co-fundador & CEO · Tecnología',
            bio: 'Apasionado por la innovación y el mundo tech. Lidera la visión de BDJJ Global, la selección de productos de vanguardia y el desarrollo de la plataforma.',
            whatsapp: '3007709585',
            foto: 'recursos/julian.png'
        },
    ],

    /* ── CATEGORÍAS ── */
    categorias: [
        { id: 'todas', nombre: 'Todas', icono: '🛍️' },
        { id: 'Promociones', nombre: 'Promociones', icono: '🔥' },
        { id: 'Teclados', nombre: 'Teclados', icono: '⌨️' },
        { id: 'Relojes', nombre: 'Relojes', icono: '⌚' },
        { id: 'Intercomunicador', nombre: 'Intercomunicador', icono: '🖥️' },
        { id: 'Celulares', nombre: 'Celulares', icono: '📱' },
        { id: 'Audifonos', nombre: 'Audifonos', icono: '🎧' }
    ],

    /* ── MÉTODOS DE PAGO ── */
    metodosPago: [
        { id: 'nequi', nombre: 'Nequi', icono: '📱', tipo: 'digital', instrucciones: 'Realiza tu pago al número <strong>300 770 9585</strong>. Luego envía el comprobante a ese mismo número por WhatsApp.' },
        { id: 'daviplata', nombre: 'Daviplata', icono: '💜', tipo: 'digital', instrucciones: 'Realiza tu pago al número <strong>300 770 9585</strong> por Daviplata. Envía el capture por WhatsApp al mismo número.' },
        { id: 'bancolombia', nombre: 'Bancolombia a la Mano', icono: '🏦', tipo: 'digital', instrucciones: 'Transfiere a la cuenta Bancolombia a la Mano del número <strong>300 770 9585</strong>. Envía el soporte por WhatsApp.' },
        { id: 'transferencia', nombre: 'Transferencia Bancaria', icono: '📲', tipo: 'digital', instrucciones: 'Solicita los datos bancarios por WhatsApp una vez confirmada tu reserva.' },
        { id: 'contraentrega', nombre: 'Contraentrega', icono: '🤝', tipo: 'fisico', instrucciones: null },
    ],

    /* ── UBICACIONES (Ciudad → Localidad → Barrio) ── */
    ubicaciones: {
        'Bogotá D.C.': {
            'Usaquén': ['Unicentro', 'Cedritos', 'Santa Bárbara', 'Toberín', 'El Codito'],
            'Chapinero': ['El Lago', 'Marly', 'Quinta Camacho', 'Rosales', 'Chapinero Alto'],
            'Santa Fe': ['La Candelaria', 'San Victorino', 'Las Aguas', 'Centro Internacional'],
            'San Cristóbal': ['20 de Julio', 'Sosiego', 'Villa Mayor', 'San Blas'],
            'Usme': ['Usme Centro', 'Comuneros', 'Danubio', 'Alpes'],
            'Tunjuelito': ['Tunjuelito', 'Ismael Perdomo', 'Venecia', 'San Benito'],
            'Bosa': ['Bosa Centro', 'La Libertad', 'San Bernardino', 'El Corzo'],
            'Kennedy': ['Kennedy Central', 'Castilla', 'Timiza', 'Patio Bonito', 'Bavaria'],
            'Fontibón': ['Fontibón Centro', 'Zona Franca', 'Ciudad Salitre', 'Modelia'],
            'Engativá': ['Engativá Centro', 'Minuto de Dios', 'Santa Helenita', 'Boyacá Real'],
            'Suba': ['Suba Centro', 'Niza', 'Tibabuyes', 'La Floresta', 'El Rincón'],
            'Barrios Unidos': ['Los Andes', 'Doce de Octubre', 'San Fernando', 'Estrada'],
            'Teusaquillo': ['Park Way', 'Galerías', 'Quinta Paredes', 'La Esmeralda'],
            'Los Mártires': ['Santa Isabel', 'Paloquemao', 'Fátima', 'San Victorino'],
            'Antonio Nariño': ['Restrepo', 'San Antonio', 'Villa Mayor', 'Ciudad Jardín'],
            'Puente Aranda': ['Puente Aranda', 'Zona Industrial', 'Gorgonzola', 'Trébol'],
            'La Candelaria': ['La Candelaria Centro', 'La Concordia', 'Egipto'],
            'Rafael Uribe Uribe': ['Rafael Uribe', 'Quiroga', 'San José', 'Claret'],
            'Ciudad Bolívar': ['Madelena', 'Lucero', 'Tesoro', 'José Antonio Galán'],
            'Sumapaz': ['Sumapaz Centro', 'San Juan de Sumapaz']
        }
    },

    /* ── FAQ ── */
    faq: [
        {
            pregunta: '¿Cómo funciona la reserva?',
            respuesta: 'Elige el producto que te interesa, haz clic en "Ver producto", revisa los detalles y luego "Agregar al carrito". Completa tus datos y selecciona tu método de pago. Nuestro equipo se contactará contigo para confirmar.'
        },
        {
            pregunta: '¿Cuáles son los métodos de pago?',
            respuesta: 'Aceptamos Nequi, Daviplata, Bancolombia a la Mano, transferencia bancaria, pago contraentrega y tarjeta de crédito/débito (datáfono).'
        },
        {
            pregunta: '¿Cuánto tiempo tarda la entrega?',
            respuesta: 'En Bogotá entregamos en 24 a 48 horas hábiles. Para otras ciudades de Colombia, el tiempo es de 2 a 5 días hábiles según la ubicación.'
        },
        {
            pregunta: '¿Los productos tienen garantía?',
            respuesta: '¡Sí! Todos nuestros productos cuentan con garantía oficial del fabricante. Además, ofrecemos soporte técnico directo por WhatsApp durante los primeros 30 días.'
        },
        {
            pregunta: '¿Puedo cancelar mi reserva?',
            respuesta: 'Puedes cancelar tu reserva antes de que se confirme el envío. Solo contáctanos por WhatsApp y gestionamos la cancelación sin problema.'
        },
        {
            pregunta: '¿Cómo sé que mi reserva fue exitosa?',
            respuesta: 'Al confirmar, verás una pantalla de éxito con el resumen de tu reserva. También puedes consultar el estado escribiéndonos por WhatsApp en cualquier momento.'
        }
    ],

    /* ── PRODUCTOS DEMO (fallback si CSV falla) ── */
    productosDemo: []

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
