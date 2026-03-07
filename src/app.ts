<<<<<<< HEAD
import Fastify from 'fastify';
import supabasePlugin from './modules/common/plugins/supabase.js';
import studentModule from './modules/students/index.js';

const fastify = Fastify({ logger: true });

// Register Plugins
fastify.register(supabasePlugin);

// Register Feature Modules with a prefix
fastify.register(studentModule, { prefix: '/api/v1/students' });

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
=======
import "dotenv/config";
import express from "express";
import { logger } from "./modules/common/utils/logger.js";
import { globalErrorHandler } from "./modules/common/middleware/error.handler.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ── Core Middleware ──────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ─────────────────────────────────────
app.get("/health", (_req, res) => {
 res.json({
  success: true,
  message: "EduCore API is running",
  environment: process.env.NODE_ENV ?? "development",
  timestamp: new Date().toISOString(),
 });
});

// ── API Routes ───────────────────────────────────────
// TODO: Mount module routers as they are built out
// app.use("/api/v1/students", studentRoutes);
// app.use("/api/v1/finance",  financeRoutes);
// app.use("/api/v1/reports",  reportRoutes);
// app.use("/api/v1/security", securityRoutes);
// app.use("/api/v1/comms",    communicationRoutes);

// ── 404 Handler ──────────────────────────────────────
app.use((_req, res) => {
 res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global Error Handler ─────────────────────────────
app.use(globalErrorHandler);

// ── Start Server ─────────────────────────────────────
app.listen(PORT, () => {
 logger.info(`EduCore API listening on http://localhost:${PORT}`);
 logger.info(`Health check: http://localhost:${PORT}/health`);
});

export default app;
>>>>>>> mulandi-changes
