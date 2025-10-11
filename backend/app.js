import express from 'express';
import cors from 'cors';
import { envs } from './src/config/config.env.js';
import { connectDB } from './src/config/config.db.js';

const app = express();

app.use(express.json());
app.use(cors());

const PORT = envs.PORT

app.listen(PORT, () => {
    connectDB();
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
