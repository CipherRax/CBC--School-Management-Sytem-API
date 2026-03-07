import 'dotenv/config';
import Fastify from 'fastify';
import supabasePlugin from './modules/common/plugins/supabase.js';
import studentModule from './modules/students/index.js';

const fastify = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ENV = process.env.NODE_ENV ?? 'development';

// ── Register Plugins ─────────────────────────────────
fastify.register(supabasePlugin);
fastify.log.info('✅ Supabase plugin registered');

// ── Register Feature Modules ─────────────────────────
fastify.register(studentModule, { prefix: '/api/v1/students' });
fastify.log.info('✅ Student module registered at /api/v1/students');

// ── Health Check ─────────────────────────────────────
fastify.get('/health', async (_request, _reply) => {
  return {
    success: true,
    message: 'EduCore API is running',
    environment: ENV,
    timestamp: new Date().toISOString(),
  };
});

// ── Start Server ─────────────────────────────────────
fastify.listen({ port: PORT, host: HOST }, (err) => {
  if (err) {
    fastify.log.error('❌ Failed to start server:');
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  fastify.log.info(' EduCore API Server Started Successfully');
  fastify.log.info(` URL:         http://localhost:${PORT}`);
  fastify.log.info(` Environment: ${ENV}`);
  fastify.log.info(` Health:      http://localhost:${PORT}/health`);
  fastify.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  fastify.log.info('📋 Registered Routes:');
  fastify.log.info(`   GET  /health`);
  fastify.log.info(`   *    /api/v1/students`);
  fastify.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
