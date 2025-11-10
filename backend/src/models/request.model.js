import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    // quien necesita la sangre (ID del paciente o familiar)
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // familiar se registra como 'community_member'
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    institutionReceiving: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true, // Hospital donde se necesita
    },
    bloodTypeNeeded: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["normal", "urgent", "critical"],
      default: "normal",
      index: true,
    },
    quantityNeeded: {
      // Ej: unidades, para las métricas de demanda
      type: Number,
      required: true,
    },
    location: {
      // GeoJSON opcional para alertas de proximidad a otros donantes
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] },
    },
    status: {
      type: String,
      enum: ["active", "fulfilled", "canceled"],
      default: "active",
    },
  },
  { timestamps: true }
);
bloodRequestSchema.index({ "location.coordinates": "2dsphere" }); //para la busqueda por proximidad

export const BloodRequestModel = mongoose.model(
  "BloodRequest",
  bloodRequestSchema
);
