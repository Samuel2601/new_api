"use strict";
import fs from "fs";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import ejs from "ejs";
import handlebars from "handlebars";
import { Model } from "../../models/exporSchema.js";

const mail_confirmar_session = async function (email) {
  try {
    var readHTMLFile = function (path, callback) {
      fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
        if (err) {
          throw err;
          callback(err);
        } else {
          callback(null, html);
        }
      });
    };

    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "incorp.odoo1@gmail.com",
          pass: "vnixbyewlzmrqchw",
        },
      })
    );
    const usuario = await Model.User.findOne({ email: email });
    if (usuario) {
      const min = 100;
      const max = 9999;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      const verificationCode = String(randomNum).padStart(4, "0");

      // Guardar el código de verificación en el usuario
      usuario.verificationCode = verificationCode;
      await usuario.save();
      readHTMLFile(
        process.cwd() + "/userModule/mailModule/mails/email_verif.html",
        (err, html) => {
          let rest_html = ejs.render(html, {
            numverf: verificationCode,
            usuario: usuario,
          });

          var template = handlebars.compile(rest_html);
          var htmlToSend = template({ op: true });

          var mailOptions = {
            from: "incorp.odoo1@gmail.com",
            sender: "noreply@miempresa.com",
            to: usuario.email,
            subject: "Tu código de un solo uso",
            priority: "high",
            text: `Aquí está tu código de verificación: ${verificationCode}`,
            html: htmlToSend,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
              console.log("Email sent: " + info.response);
              return "Revisa tu corrreo, te hemos enviado un codigo de validadicón.";
            } else {
              console.error(error);
              return "Algo salio mal";
            }
          });
        }
      );
    }
  } catch (error) {
    console.error(error);
    return "Algo salio mal";
  }
};
export { mail_confirmar_session };
