import express from 'express';
import type { Request, Response, NextFunction } from 'express'
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

// Rutas
import authRoutes from './modules/auth/auth.routes.js';
import reqRoutes from './modules/requerimientos/requerimiento.routes.js';
import asigRoutes from './modules/asignaciones/asignacion.routes.js';
import sedeRoutes from './modules/sedes/sede.routes.js';
import personaRoutes from './modules/personas/persona.routes.js';

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares Globales
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Servir Favicon para pestañas directas (PDFs)
app.use('/favicon.ico', express.static(path.join(__dirname, '../public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// 2. Swagger
const swaggerPath = path.join(__dirname, '../swagger.yaml');
// Pequeña protección por si el archivo no existe
try {
  const swaggerDocument = YAML.load(swaggerPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.warn('⚠️ No se pudo cargar Swagger (¿falta swagger.yaml?)');
}

// 3. Rutas de API
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/requerimientos', reqRoutes);
app.use('/api/asignaciones', asigRoutes);
app.use('/api/sedes', sedeRoutes);
app.use('/api/personas', personaRoutes);

// 4. Manejador de Errores Global (Siempre al final)
// Esto captura errores de sintaxis JSON o promesas rotas no capturadas
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Error no controlado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Algo salió mal'
  });
});

// 5. Iniciar Servidor
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Server corriendo en: http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs en:     http://localhost:${PORT}/api-docs`);
  console.log(`=================================`);
});