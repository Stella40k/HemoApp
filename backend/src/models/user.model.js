import mongoose from "mongoose";

export const UserModel = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
            primaryKey: true,
    autoIncrement: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail:true
        }
    },
    passwordHash:{
        type: DataTypes.STRING,
        allowNull: false
    },
    emailVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    bloodType:{
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: true
    },
    location:{
        type: DataTypes.STRING,
        allowNull: true
    },
    notificationPreference:{
        type: DataTypes.JSON,
        defaultValue:{ urgentAlert: true, reminder: true }
    },
    //para el estado de actividad
    status:{
        type: DataTypes.ENUM('Donando', 'Descansando'),
        defaultValue: 'Descansando'
    },
    inactivetyReason:{
        type: DataTypes.STRING,
        allowNull: true //ver como hacer para saber la razon, si poner q se elija o q escriban
    }
},{
    tableName: 'users',
    timestamps: true
});