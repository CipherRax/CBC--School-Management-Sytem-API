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