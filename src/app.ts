import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Importación de Rutas Modulares
import authRoutes from './modules/auth/auth.routes.js';
import reqRoutes from './modules/requerimientos/requerimiento.routes.js';
import asigRoutes from './modules/asignaciones/asignacion.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Definición de Rutas Base
app.use('/api/auth', authRoutes);
app.use('/api/requerimientos', reqRoutes);
app.use('/api/asignaciones',asigRoutes)

// Mensaje de inicio
app.listen(PORT, () => {
  console.log(`🚀 Servidor Modular corriendo en http://localhost:${PORT}`);
});