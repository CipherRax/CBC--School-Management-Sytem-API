import fp from 'fastify-plugin';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { FastifyInstance } from 'fastify';

// This extends the Fastify type so VS Code knows about 'fastify.supabase'
declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!process.env.SUPABASE_URL || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment variables.');
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    supabaseKey
  );

  fastify.decorate('supabase', supabase);
});
