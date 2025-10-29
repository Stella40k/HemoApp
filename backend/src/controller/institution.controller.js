import { InstitutionModel } from "../models/institution.model.js";
import { userModel } from "../models/user.model.js";

export const requireInstitution = async (req, resizeBy, next)=>{
    try {
        if(req.user.role !== "institution"){
            return res.status(403).json({
                ok: false,
                msg: "Acceso denegado. Se requiere ser una institucion para este recurso"
            })
        }
        next();
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error interno en el servidor. Usuario no autorizado"
        })
    }
}
export const getMyInstitution = async(req, res)=>{
    try {
        const institution = await InstitutionModel.findOne({
            user: req.user.id
        }).populate("user", "email userName");

        if (!institution) {
            return res.status(404).json({
                ok: false,
                msg: "Institución no encontrada"
            });
        };
        res.status(200).json({
            ok: true,
            data: institution
        });
    } catch (error) {
        console.log("Error al buscar institucion", error)
        res.status(500).json({
            ok: false,
            msg: "Error interno en el servidor"
        });
    }
};
export const updateMyInstitution = async(req, res)=>{
    try {
        const { legalName, tradeName, address, location, services, schedule, description } = req.body;

        const institution = await InstitutionModel.findOneAndUpdate(
            { user: req.user.id },
            { legalName, tradeName, address, location, services, schedule, description },
            { new: true }
        ).populate("user", "email userName");
        if (!institution) {
            return res.status(404).json({
                ok: false,
                msg: "Institución no encontrada"
            });
        }
        res.status(200).json({
            ok: true,
            data: institution
        });
    } catch (error) {
        console.log("Error al actualizar institucion", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno en el servidor"
        });
    }
};
export const getPublicInstitutions = async(req, res)=>{
    try {
        
    } catch (error) {
        
    }
}