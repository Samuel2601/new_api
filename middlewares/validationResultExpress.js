"use strict";
import { validationResult } from "express-validator";
import pkg from "jwt-simple";
import moment from "moment";
import { Model } from "../userModule/models/exporSchema.js";
var secret = "examplekey";

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "NoHeadersError" });
  }
  var token1 = req.headers.authorization.replace(/^Bearer\s/, ""); // Esto elimina 'Bearer ' al principio
  var token = token1.replace(/['"]+/g, "");
  var segment = token.split(".");
  if (segment.length != 3) {
    return res.status(403).send({ message: "InvalidToken" });
  } else {
    try {
      var payload = pkg.decode(token, secret);

      if (payload.exp <= moment().unix()) {
        return res.status(403).send({ message: "TokenExpirado" });
      }
      req.user = payload;
    } catch (error) {
      console.error(error);
      return res.status(403).send({ message: "InvalidToken" });
    }
  }
  next();
};

export const permissUser = (funcion) => async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Algo salió mal." });
  }
  if (
    !(
      (await checkPermiss({ user: req.user.sub, funcion })) ||
      (await checkPermissRol({ rol: req.user.role, funcion }))
    )
  ) {
    return res.status(404).json({ message: "Sin Permisos" });
  }
  next();
};

const checkPermissRol = async function (data) {
  const { rol, funcion } = data;
  const permiso = await Model.Permiso.findOne({ name: funcion });
  if (!permiso) {
    return false; // Si no se encuentra el permiso, retorna false
  }

  const role = await Model.Role.findOne({
    _id: rol,
    permisos: permiso._id,
  });
  return !!role; // Devuelve true si se encontró el rol con el permiso, de lo contrario false
};

const checkPermiss = async function (data) {
  const { user, funcion } = data;
  const permiso = await Model.Permiso.findOne({ name: funcion, user: user });
  if (permiso) {
    return true;
  } else {
    return false;
  }
};
export const createToken = async function (user, time, tipo) {
  var payload = {
    sub: user._id,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment()
      .add(time || 3, tipo || "hours")
      .unix(),
  };
  if (user.dni) {
    payload.dni = user.dni;
  }
  console.log("payload creado:", payload);
  return pkg.encode(payload, secret);
};
