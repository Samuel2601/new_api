import axios from 'axios';
import apiResponse from '../../../helpers/sendstatus.js';

const WABOXAPP_TOKEN = process.env.WABOXAPP_TOKEN;//'TU_TOKEN_DE_API';
const WABOXAPP_UID = process.env.WABOXAPP_UID;
// Función para enviar un mensaje de WhatsApp
async function enviarMensajeWB(destinatario, customUid, mensaje) {
    try {
        const url = `https://api.waboxapp.com/send/chat`;
        const data = {
            token: WABOXAPP_TOKEN,
            uid: WABOXAPP_UID,
            to: destinatario,
            custom_uid: customUid,
            text: mensaje
        };
        const response = await axios.post(url, data);
        console.log(response.data);
        return apiResponse(200, response.data, null, null);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        return apiResponse(500, 'ERROR', null, error);
    }
}

async function consultarEstadoMensaje() {
    try {
        const url = `https://www.waboxapp.com/api/status/${WABOXAPP_UID}?token=${WABOXAPP_TOKEN}`;
        const response = await axios.get(url);
        console.log(response.data);
        return apiResponse(200, response.data, null, null);
    } catch (error) {
        console.error('Error al consultar el estado del mensaje:', error);
        return apiResponse(500, 'ERROR', null, error);
    }
}


// Ejemplo de uso
//enviarMensaje('DESTINATARIO', 'Hola, ¿cómo estás?');

export {enviarMensajeWB,consultarEstadoMensaje};