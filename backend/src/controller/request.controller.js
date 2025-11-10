import { BloodRequestModel } from "../models/request.model.js";
import { NotificationService } from "../services/notification.service.js"; // Para alertas

export const createBloodRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      requester: req.user._id,
    };
    const institutionExists = await InstitutionModel.findById(
      requestData.institutionReceiving
    );
    if (
      !institutionExists ||
      institutionExists.validationStatus !== "approved"
    ) {
      return res.status(404).json({
        ok: false,
        msg: "El hospital receptor no fue encontrado o no está aprobado en HemoApp.",
      });
    }

    const newRequest = await BloodRequestModel.create(requestData); //solicitud p/bd

    let donorsNotified = 0;

    if (
      newRequest.priority === "urgent" ||
      newRequest.priority === "critical"
    ) {
      // Llama al servicio que contiene la lógica de Blood Match y GeoJSON
      donorsNotified = await NotificationService.notifyCompatibleDonors(
        newRequest
      );
    }

    res.status(201).json({
      ok: true,
      msg: "Solicitud de sangre registrada. Se buscaron donantes compatibles y cercanos.",
      alertInfo: `Alerta enviada a ${donorsNotified} donantes compatibles.`,
      data: newRequest,
    });
  } catch (error) {
    console.error("error al crear solicitud de sangre:", error);
    res.status(500).json({
      ok: false,
      msg: `Error interno al procesar la solicitud: ${error.message}`,
    });
  }
};
