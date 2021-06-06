import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { clearCache, supressConsoleLog } from '../lib/utils';
import routesInitialData from '../lib/routesInitialData';
import '../client/main/app';

export default async app => {
  app.all('/api/*', async (request, reply) => {
    const { method, url } = request;
    reply.code(404).send({ message: `path ${method}: '${url}' not found` });
  });

  app.get('/*', async (request, reply) => {
    const { template, getApiUrl, routes, isDevelopment, manifest } = app.ctx;
    const { currentUser } = request;

    let ssrData = {};
    const getSSRData = routesInitialData[request.url];
    if (getSSRData) {
      ssrData = await getSSRData(app);
    }

    const initialState = { routes, getApiUrl, currentUser, ssrData };

    const appPath = path.resolve(__dirname, '../client/main/app.js');
    if (isDevelopment) {
      clearCache(require.resolve(appPath), { ignoreRegex: /context/ });
    }
    const App = require(appPath).default; // eslint-disable-line
    const renderedComponent = supressConsoleLog(() =>
      renderToString(
        <StaticRouter location={request.url}>
          <App initialState={initialState} />
        </StaticRouter>
      )
    );
    const initialStateScript = `
      <script>window.INITIAL_STATE = ${JSON.stringify(initialState)}</script>`;

    const html =
      template
        .replace('{{content}}', renderedComponent)
        .replace('{{initialState}}', initialStateScript)
      |> (v =>
        Object.keys(manifest).reduce(
          (acc, filename) => acc.replace(`{{${filename}}}`, manifest[filename]),
          v
        ));

    reply.type('text/html');
    reply.send(html);
  });
};
