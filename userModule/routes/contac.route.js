import express from "express";
import enviarMensajeWT from "../contacModule/controllers/twilio-ws-bot.js";
import {
  enviarMensajeWB,
  consultarEstadoMensaje,
} from "../contacModule/controllers/waboxapp-ws-bot.js";
import {
  WhatsAppOriginValidations,
  WhatsAppValidations,
} from "../validations/validations.js";
import { validationResultExpress } from "../../middlewares/validationResultExpress.js";
import sendWhatsAppMessage from "../contacModule/controllers/whatsapp.controller.js";

const router = express.Router();

/**
 * @swagger
 * /enviarMensajeWT:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a un usuario iniciar sesión en el sistema.
 *     tags: [CONTACT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destinatario:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: '+593995767887'
 *               mensaje:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: Hola
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso.
 *       '400':
 *         description: Error en la solicitud debido a validaciones fallidas.
 *       '500':
 *         description: Error interno en el servidor.
 */

router.post(
  "/enviarMensajeWT",
  WhatsAppValidations,
  validationResultExpress,
  async (req, res) => {
    try {
      const { destinatario, mensaje } = req.body;
      const { status, message, data, error } = await enviarMensajeWT(
        destinatario,
        mensaje
      );
      res.status(status).json({ message, data, error });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "ERROR", error: error });
    }
  }
);

/**
 * @swagger
 * /enviarMensajeWB:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a un usuario iniciar sesión en el sistema.
 *     tags: [CONTACT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destinatario:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: '+593995767887'
 *               mensaje:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: Hola
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso.
 *       '400':
 *         description: Error en la solicitud debido a validaciones fallidas.
 *       '500':
 *         description: Error interno en el servidor.
 */

router.post(
  "/enviarMensajeWB",
  WhatsAppValidations,
  validationResultExpress,
  async (req, res) => {
    try {
      const { destinatario, customUid, mensaje } = req.body;
      const { status, message, data, error } = await enviarMensajeWB(
        destinatario,
        customUid,
        mensaje
      );
      res.status(status).json({ message, data, error });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "ERROR", error: error });
    }
  }
);

/**
 * @swagger
 * /enviarWhatsApp:
 *   post:
 *     summary: Enviar mensaje de WhatsApp
 *     description: Permite enviar un mensaje a un determinado usuario a través de WhatsApp.
 *     tags: [WhatsApp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destinatario:
 *                 type: string
 *                 description: Número de teléfono del destinatario en formato internacional.
 *                 example: '+593995767887'
 *               mensaje:
 *                 type: string
 *                 description: Mensaje a enviar.
 *                 example: 'Hola, ¿cómo estás?'
 *               template_name:
 *                 type: string
 *                 description: Nombre de la plantilla a utilizar.
 *                 example: 'hello_world'
 *               template_language:
 *                 type: string
 *                 description: Lenguaje de la plantilla.
 *                 example: 'es_MX'
 *               template_values:
 *                 type: object
 *                 description: Valores de la plantilla en formato JSON.
 *                 example: { "Location name": "Juan", "Address": "Mexico" }
 *     responses:
 *       '200':
 *         description: Mensaje enviado correctamente.
 *       '400':
 *         description: Error en la solicitud debido a validaciones fallidas.
 *       '500':
 *         description: Error interno en el servidor.
 */


router.post(
  "/enviarWhatsApp",
  WhatsAppOriginValidations,
  validationResultExpress,
  async (req, res) => {
    try {
      const {
        destinatario,
        mensaje,
        template_name,
        template_language,
        template_values,
      } = req.body;
      const { status, message, data, error } = await sendWhatsAppMessage(
        process.env.WHATSAPPS_TOKEN,
        process.env.WHATSAPPS_IDTELEFONO,
        destinatario,
        mensaje,
        template_name,
        template_language,
        template_values
      );
      res.status(status).json({ message, data, error });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "ERROR", error: error });
    }
  }
);

export default router;
