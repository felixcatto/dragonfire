import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import '../css/index.scss';
import App from './app';
import { makeUrlFor } from '../lib/utils';

const { routes } = window.INITIAL_STATE;
window.INITIAL_STATE.getApiUrl = makeUrlFor(routes);

hydrate(
  <BrowserRouter>
    <App initialState={window.INITIAL_STATE} />
  </BrowserRouter>,
  document.getElementById('root')
);
