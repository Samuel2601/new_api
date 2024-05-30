const accountSid = process.env.TWILIO_SID;//'AC342b92abc64d7ca3d2ef5a9ae9b8a18a';
const authToken = process.env.TWILIO_TOKEN;//'[AuthToken]';

import twilio from 'twilio';
import apiResponse from '../../../helpers/sendstatus.js';

const client = twilio(accountSid, authToken);

// Función para enviar un mensaje de WhatsApp
async function enviarMensajeWT(destinatario, mensaje) {
    console.log(accountSid,authToken);
    try {
        const message = await client.messages.create({
            from: 'whatsapp:+14155238886', // Tu número de WhatsApp de Twilio
            to: `whatsapp:${destinatario}`,
            body: mensaje
        });
        return apiResponse(201, `Mensaje enviado: ${message.sid}`, null, null);
    } catch (err) {
        return apiResponse(500, `Error al enviar el mensaje: ${err}`, null, null);
    }
}


// Ejemplo de uso
//enviarMensajeWT('DESTINATARIO', 'Hola, ¿cómo estás?');

export default enviarMensajeWT;