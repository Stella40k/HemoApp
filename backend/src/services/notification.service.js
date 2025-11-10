import { userModel } from "../models/user.model.js";

export class NotificationService {
  static async notifyCompatibleDonors(requestData) {
    const { bloodTypeNeeded, priority, location } = requestData;
    const compatibleTypes = this.getCompatibleTypes(bloodTypeNeeded);

    let query = {
      //match para las sangres compatibles
      "profile.bloodType": { $in: compatibleTypes },
      accountStatus: "verified",
      donationStatus: "active",
      // filtra a los donantes que estan en periodo de aplazamiento
      "medicalProfile.temporaryDeferral": false,
    };
    //filtro geoespacial para solicitudes urgentes
    if (location && (priority === "urgent" || priority === "critical")) {
      query.location = {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: location.coordinates,
          },
          $maxDistance: 20000, // 20 km para urgencias
        },
      };
    }
    //busco el donante
    const donorsToNotify = await userModel
      .find(query)
      .select("email notificationPreferences");
    const message = this.createAlertMessage(
      bloodTypeNeeded,
      priority,
      requestData.institutionReceiving
    );
    const isEmergency = priority === "critical";

    console.log(
      `[NOTIF] Encontrados ${donorsToNotify.length} donantes compatibles. Prioridad: ${priority}`
    );
    //envio la noti
    donorsToNotify.forEach((donor) => {
      console.log(`[ALERTA] Enviando a ${donor.email}`);
    });
    return donorsToNotify.length;
  }
  //para el mensaje de alerta
  static createAlertMessage(type, priority, institution) {
    return `ALERTA ${priority.toUpperCase()}: ¡Se necesita sangre ${type} con urgencia en el ${institution}!`;
  }
  static getCompatibleTypes(requestedType) {
    // Lógica de compatibilidad real, simplificada para este ejemplo:
    if (requestedType === "O-")
      return ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    return [requestedType]; // Por simplicidad, solo pide el mismo tipo por ahora
  }
}

//parte del codigo viejo
const sendNotification = (userId, message, isEmergency) => {
  const user = user.findById(userId);
  if (isEmergency) {
    // Ignora preferencias, envía siempre.
    return pushNotification(user, message);
  }
  if (
    user.notificationPreferences.isActive === true &&
    user.notificationPreferences.frequency !== "never"
  ) {
    // Aplica lógica de frecuencia y envía si corresponde.
    return pushNotification(user, message);
  }
};
