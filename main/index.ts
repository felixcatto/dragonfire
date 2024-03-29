import path from 'path';
import fs from 'fs';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import fastifySecureSession from 'fastify-secure-session';
import { objectionPlugin, routesPlugin } from '../lib/utils';
import routes from '../routes/index';
import * as models from '../models';

export default () => {
  const mode = process.env.NODE_ENV || 'development';
  const pathPublic = path.resolve(__dirname, '../public');
  const template = fs.readFileSync(path.resolve(__dirname, pathPublic, 'html/index.html'), 'utf8');
  const manifest = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, pathPublic, 'manifest.json'), 'utf8')
  );
  const app = fastify({
    logger: {
      prettyPrint: true,
      level: 'error',
    },
  });

  app.decorate('ctx', {
    template,
    manifest,
    getApiUrl: fastifyReverseRoutes,
    routes: null,
    isDevelopment: mode === 'development',
  });
  app.decorate('objection', null);
  app.decorateReply('render', null);
  app.decorateRequest('data', null);
  app.decorateRequest('errors', null);
  app.decorateRequest('entityWithErrors', null);
  app.decorateRequest('currentUser', null);

  app.register(fastifySecureSession, {
    secret: 'a secret with minimum length of 32 characters',
    cookie: { path: '/', httpOnly: true },
  });
  app.register(routesPlugin);
  app.register(fastifyReverseRoutes.plugin);
  app.register(fastifyStatic, { root: pathPublic, wildcard: false });
  app.register(objectionPlugin, { mode, models });
  app.register(routes);

  return app;
};
