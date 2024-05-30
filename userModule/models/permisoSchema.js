'use strict';
import { Schema } from "mongoose";

// Definir el esquema de permiso
const permisoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  user: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  createdAt: {type:Date, default: Date.now, require: true}
});

// Exportar el modelo de role
export default permisoSchema;