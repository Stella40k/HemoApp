import { DonationModel } from "../models/donation.model.js";
import {DonationService } from "../services/donation.service.js"

//es para registrar al usuario su intencion de donar
export const registerDonationIntention = async(req, res)=>{
    try {
        const {institutionId, type = "blood"} = req.body;

        const newIntention = new DonationModel({
            donor: req.user._id,
            institution: institutionId,
            type: type,
            status: "pending"
        });
        await newIntention.save();
        res.status(201).json({
            ok: true,
            msg: "Intención de donación registrada. Recibirás una notificación con los próximos pasos.",
            data: newIntention
        });
    } catch (error) {
        console.log("Error al registrar intención de donación", error);
        res.status(500).json({
            ok: false,
            msg: "Error al registrar la intención."
        });
    }
};
export const confirmDonation = async(req, res) =>{
    try {
        const {donationId} = req.params;
        const donation = await DonationModel.findById(donationId);
        
        if (!donation) {
            return res.status(404).json({
                ok: false,
                msg: "Donación no encontrada"
            });
        }
        if(donation.institution.toString() !== req.user.institutionId.toString()){
            return res.status(403).json({
                ok: false,
                msg: "No tienes permiso para confirma esta donacion."
            });
        }
        if(donation.status === "confirmed"){
            return res.status(403).json({
                ok: false,
                msg: "La donacion ya fue confirmada."
            });
        }
        //actualizacion para el estado e historial de la donacion
        donation.status = "confirmed";
        donation.confirmedBy = req.user._id; 
        donation.donationDate = new Date();
        await donation.save();

        //para las metricas
        const updatedUser = await DonationService.confirmDonation(donation.donor, donation.type);

        res.status(200).json({
            ok: true,
            msg: "Donación confirmada exitosamente. Las métricas del donante han sido actualizadas.",
            data: { 
                donation: donation,
                peopleHelped: updatedUser.medicalProfile.peopleHelpedEstimate 
            }
        });
    } catch (error) {
        console.log("Error al confirmar la donación", error);
        res.status(500).json({
            ok: false,
            msg: "Error al confirmar la donación"
        });
    }
}