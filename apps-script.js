/**
 * GOOGLE APPS SCRIPT - CÓDIGO PARA PEGAR EN EL EDITOR DE GOOGLE APPS SCRIPT
 * 
 * Instrucciones:
 * 1. Abre Google Sheets con las hojas "Productos" y "Reservas"
 * 2. Ve a Extensiones > Apps Script
 * 3. Pega este código completo
 * 4. Modifica las constantes EMAIL_DESTINO y SPREADSHEET_ID
 * 5. Implementa como aplicación web (Implementar > Nueva implementación > Aplicación web)
 * 6. Ejecutar como: "Yo", Acceso: "Cualquiera"
 * 7. Copia la URL generada y pégala en CONFIG.sheets.urlWebApp en config.js
 */

// ========== CONFIGURACIÓN (MODIFICA ESTOS VALORES) ==========
const SPREADSHEET_ID = 'TU_ID_DE_SPREADSHEET_AQUI'; // El ID de tu Google Sheet
const HOJA_RESERVAS = 'Reservas';
const EMAIL_DESTINO = 'info@novatech.com'; // Correo que recibe notificaciones

/**
 * doPost - Maneja las solicitudes POST entrantes
 */
function doPost(e) {
  try {
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Validar datos requeridos
    if (!data.nombre || !data.telefono || !data.producto) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Faltan datos requeridos: nombre, teléfono o producto' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Guardar en la hoja de cálculo
    guardarReserva(data);
    
    // Enviar correo de notificación
    enviarCorreo(data);
    
    // Responder éxito
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Reserva registrada exitosamente' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Guarda la reserva en la hoja "Reservas"
 */
function guardarReserva(data) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(HOJA_RESERVAS);
  
  // Si la hoja no existe, crearla
  if (!sheet) {
    const newSheet = spreadsheet.insertSheet(HOJA_RESERVAS);
    newSheet.appendRow([
      'Fecha', 'Producto', 'Precio', 'Nombre', 'Teléfono', 
      'Dirección', 'Método de Pago', 'Estado'
    ]);
  }
  
  const targetSheet = spreadsheet.getSheetByName(HOJA_RESERVAS);
  
  // Agregar la nueva reserva
  targetSheet.appendRow([
    data.fecha || new Date().toLocaleDateString('es-CO'),
    data.producto,
    data.precio,
    data.nombre,
    data.telefono,
    data.direccion,
    data.pago,
    'Pendiente' // Estado inicial
  ]);
  
  // Ordenar por fecha (opcional)
  targetSheet.getDataRange().sort({ column: 1, ascending: false });
}

/**
 * Envía correo de notificación con formato HTML y botón de WhatsApp
 */
function enviarCorreo(data) {
  const asunto = `🔔 Nueva Reserva - ${data.producto} - ${data.nombre}`;
  
  // URL de WhatsApp directo al cliente
  const urlWhatsApp = `https://wa.me/57${data.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('¡Hola ' + data.nombre + '! Gracias por tu reserva en NovaTech. Te contactamos para confirmar los detalles de tu pedido.')}`;
  
  const cuerpoHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0F4FD1, #0A3A9E); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .body { padding: 30px; }
        .info-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .info-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .info-item:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #333; }
        .value { color: #666; }
        .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        .badge-nequi { background: #E8F5E9; color: #2E7D32; }
        .badge-contraentrega { background: #FFF3E0; color: #E65100; }
        .btn-whatsapp { display: inline-block; background: #25D366; color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 20px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚡ Nueva Reserva Recibida</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">${data.fecha || 'Fecha no especificada'}</p>
        </div>
        <div class="body">
          <div class="info-box">
            <h3 style="margin-top: 0; color: #0F4FD1;">📦 Información del Producto</h3>
            <div class="info-item">
              <span class="label">Producto:</span>
              <span class="value">${data.producto}</span>
            </div>
            <div class="info-item">
              <span class="label">Precio:</span>
              <span class="value" style="font-weight: bold; color: #0F4FD1;">$${data.precio}</span>
            </div>
            <div class="info-item">
              <span class="label">Método de Pago:</span>
              <span class="value">
                <span class="badge ${data.pago === 'Nequi' ? 'badge-nequi' : 'badge-contraentrega'}">
                  ${data.pago === 'Nequi' ? '📱 Nequi' : '🤝 Contraentrega'}
                </span>
              </span>
            </div>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #FF5C00;">👤 Datos del Cliente</h3>
            <div class="info-item">
              <span class="label">Nombre:</span>
              <span class="value">${data.nombre}</span>
            </div>
            <div class="info-item">
              <span class="label">Teléfono:</span>
              <span class="value">${data.telefono}</span>
            </div>
            <div class="info-item">
              <span class="label">Dirección:</span>
              <span class="value">${data.direccion}</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${urlWhatsApp}" class="btn-whatsapp" target="_blank">
              💬 Contactar por WhatsApp
            </a>
          </div>
        </div>
        <div class="footer">
          <p>⚡ NovaTech - Tecnología que impulsa tu mundo</p>
          <p>Este es un correo automático de notificación de reserva.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Enviar correo
  MailApp.sendEmail({
    to: EMAIL_DESTINO,
    subject: asunto,
    htmlBody: cuerpoHTML,
  });
  
  // Opcional: Enviar confirmación al cliente si tienes su correo
  // if (data.email) {
  //   enviarConfirmacionCliente(data);
  // }
}

/**
 * Función para testing
 */
function testDoPost() {
  const testData = {
    fecha: '15/05/2024',
    producto: 'Auriculares Bluetooth Pro',
    precio: '89.900',
    nombre: 'Juan Pérez',
    telefono: '3001234567',
    direccion: 'Calle 123 #45-67, Bogotá',
    pago: 'Nequi'
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(e);
  Logger.log(result.getContent());
}