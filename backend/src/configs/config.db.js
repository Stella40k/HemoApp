import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

import { DB_CONFIG } from "./config.env.js";

dotenv.config()

export const sequelize = new Sequelize(
    
)