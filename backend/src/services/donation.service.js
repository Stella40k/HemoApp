import {userMdel} from "../models/user.model.js"

const getPeopleHelper = (donationType) =>{
    switch(donationType){
        case "blood": return 3; 
        case "plasma": return 1;
        case "platelets": return 1;
        default: return 1;
    }
};
export class DonationService{
    static async confitmDonation(userId, type){
        const helpCount = await userMdel.findByIdAndUpdate(
            userId,{
                $in:{
                    "medicalProfile.totalDonations": 1,
                    "medicalProfile.peopleHelpedEstimate": helpCount
                },
                $set: {
                    "medicalProfile.lastDonationDate": new Date(),
                    "medicalProfile.temporaryDeferral": true //para aplazar temporalmente
                }
            },
            {new: true}
        ).select("medicalProfile.totalDonations medicalProfile.peopleHelpedEstimate");
        if(updateUSer){
            console.log(`Donacion confirmada para ${userId}. Personas ayudadas: ${updateUSer.medicalProfile.peopleHelpedEstimate}`);
        }
        return updateUSer
    }
}