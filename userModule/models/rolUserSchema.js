'use strict';
import { Schema } from "mongoose";

// Definir el esquema de role
const roleuserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permisos: [{ type: Schema.Types.ObjectId, ref: 'permiso' }],
  createdAt: {type:Date, default: Date.now, require: true}
});

// Exportar el modelo de role
export default roleuserSchema;