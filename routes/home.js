import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerLocation } from '@reach/router';
import { clearCache, supressConsoleLog, isSignedIn, isAdmin, isBelongsToUser } from '../lib/utils';

export default async app => {
  app.get('/*', (request, reply) => {
    const { template, urlFor, routes, isDevelopment } = app.ctx;
    const { currentUser } = request;
    const initialState = {
      routes,
      urlFor,
      curPath: request.url,
      currentUser,
      isSignedIn: isSignedIn(currentUser),
      isAdmin: isAdmin(currentUser),
      isBelongsToUser: isBelongsToUser(currentUser),
    };

    const appPath = path.resolve(__dirname, '../client/main/app.js');
    if (isDevelopment) {
      clearCache(require.resolve(appPath), { ignoreRegex: /context/ });
    }
    const App = require(appPath).default; // eslint-disable-line
    const renderedComponent = supressConsoleLog(() =>
      renderToString(
        <ServerLocation url={request.url}>
          <App initialState={initialState} />
        </ServerLocation>
      )
    );

    const initialStateScript = `
      <script>window.INITIAL_STATE = ${JSON.stringify(initialState)}</script>`;
    const html = template
      .replace('{{content}}', renderedComponent)
      .replace('{{initialState}}', initialStateScript);

    reply.type('text/html');
    reply.send(html);
  });
};
