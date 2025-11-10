# Documentación del Proyecto HemoApp Backend

## Estructura del Proyecto

```
backend/
├── app.js                 # Archivo principal de la aplicación
├── package.json          # Dependencias y scripts
└── src/
    ├── config/           # Configuraciones
    │   ├── config.db.js  # Configuración de la base de datos
    │   └── config.env.js # Variables de entorno
    ├── controller/       # Controladores    │   └── auth.controller.js
    ├── helpers/          # Funciones auxiliares
    │   ├── bcrypt.helper.js
    │   └── jwt.helper.js
    ├── middlewares/      # Middlewares
    │   ├── auth.middleware.js
    │   ├── rateLimiter.middleware.js
    │   └── validations/
    │       └── auth.validation.js
    ├── models/          # Modelos de datos
    │   └── user.model.js
    ├── routes/          # Rutas
    │   ├── auth.routes.js
    │   └── index.js
    └── services/        # Servicios
        ├── email.service.js
        └── registration.service.js
```

## Contenido de los Archivos Principales

### 1. app.js

```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envs } from "./src/config/config.env.js";
import { connectDB } from "./src/config/config.db.js";
import { routes } from "./src/routes/index.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: envs.FRONTEND_URL, credentials: true }));

app.use("/api", routes);

const PORT = envs.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
```

### 2. package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "main": "app.js",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.3",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.6.3",
    "nodemailer": "^6.9.7"
  }
}
```

### 3. src/config/config.env.js

```javascript
import dotenv from "dotenv";
dotenv.config();

export const envs = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
};
```

### 4. src/routes/auth.routes.js

```javascript
import express from "express";
import {
  register,
  login,
  getMyProfile,
  logout,
  verifyEmail,
  refreshToken,
} from "../controller/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validations/auth.validation.js";
import {
  authRateLimite,
  loginRateLimite,
} from "../middlewares/rateLimiter.middleware.js";

const authRouter = express.Router();

// Rutas públicas
authRouter.post("/auth/register", authRateLimite, registerValidation, register);
authRouter.post("/auth/login", loginRateLimite, loginValidation, login);
authRouter.get("/auth/verify-email/:token", verifyEmail);
authRouter.post("/auth/refresh-token", refreshToken);

// Rutas protegidas
authRouter.get("/auth/me", authenticateToken, getMyProfile);
authRouter.post("/auth/logout", authenticateToken, logout);

export default authRouter;
```

### 5. src/models/user.model.js

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "institution"],
    default: "user",
  },
  accountStatus: {
    type: String,
    enum: ["pending", "verified", "suspended"],
    default: "pending",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  refreshToken: {
    type: String,
    select: false,
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0,
  },
  lastLogout: Date,
  Token: String,
});

export const userModel = mongoose.model("User", userSchema);
```

### 6. src/helpers/jwt.helper.js

```javascript
import jwt from "jsonwebtoken";
import { envs } from "../config/config.env.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    envs.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const generateTokenRefresh = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    envs.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token, isRefreshToken = false) => {
  try {
    return jwt.verify(
      token,
      isRefreshToken ? envs.JWT_REFRESH_SECRET : envs.JWT_SECRET
    );
  } catch (error) {
    throw new Error("Token inválido");
  }
};
```

### 7. src/middlewares/auth.middleware.js

```javascript
import { verifyToken } from "../helpers/jwt.helper.js";
import { userModel } from "../models/user.model.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "No hay token de autenticación",
      });
    }

    const decoded = verifyToken(token);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Token inválido - Usuario no existe",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token inválido",
    });
  }
};
```

### 8. src/services/email.service.js

```javascript
import nodemailer from "nodemailer";
import { envs } from "../config/config.env.js";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.EMAIL_HOST,
      port: envs.EMAIL_PORT,
      secure: false,
      auth: {
        user: envs.EMAIL_USER,
        pass: envs.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(to, token) {
    const verificationUrl = `${envs.BACKEND_URL}/auth/verify-email/${token}`;
    const mailOptions = {
      from: `HemoApp <${envs.EMAIL_USER}>`,
      to: to,
      subject: "Verifica tu identidad! Valida si sos vos",
      html: this.getVerificationTemplate(verificationUrl),
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado a: ${to}`);
      return true;
    } catch (error) {
      console.log("No se pudo enviar el email de verificación", error);
    }
  }

  getVerificationTemplate(verificationUrl) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e74c3c;">¡Bienvenido a HemoApp!</h1>
            <p>Estás a un paso de unirte a nuestra comunidad de donantes.</p>
            <p>Haz clic en el siguiente enlace para verificar tu email:</p>
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 12px 24px; background-color: #e74c3c; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
                Verificar Email
            </a>
            <p><em>Si no solicitaste este registro, puedes ignorar este mensaje.</em></p>
        </div>
        `;
  }
}

export const emailService = new EmailService();
```

## Variables de Entorno Requeridas (.env)

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
JWT_REFRESH_SECRET=tu_secreto_refresh
EMAIL_USER=tu_email
EMAIL_PASS=tu_password
EMAIL_HOST=smtp.tu_proveedor.com
EMAIL_PORT=587
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000/api
NODE_ENV=development
```

## Flujo de Autenticación

1. **Registro**

   - POST /api/auth/register
   - Valida datos
   - Crea usuario
   - Envía email de verificación

2. **Verificación de Email**

   - GET /api/auth/verify-email/:token
   - Verifica token
   - Activa cuenta
   - Redirige al frontend

3. **Login**

   - POST /api/auth/login
   - Valida credenciales
   - Genera tokens
   - Establece cookies seguras

4. **Logout**

   - POST /api/auth/logout
   - Requiere autenticación
   - Limpia tokens y cookies
   - Actualiza estado en DB

5. **Refresh Token**
   - POST /api/auth/refresh-token
   - Verifica refresh token
   - Genera nuevos tokens
   - Actualiza cookies

## Seguridad Implementada

1. **Cookies Seguras**

   - HttpOnly
   - Secure en producción
   - SameSite: strict
   - Expiración controlada

2. **Rate Limiting**

   - Límites en registro
   - Límites en login
   - Protección contra fuerza bruta

3. **Validación de Datos**

   - Express-validator
   - Sanitización de entradas
   - Validación de formato

4. **Protección de Rutas**

   - Middleware de autenticación
   - Verificación de tokens
   - Control de roles

5. **Seguridad de Contraseñas**
   - Hashing con bcrypt
   - Salt rounds configurables
   - No almacenamiento en texto plano
