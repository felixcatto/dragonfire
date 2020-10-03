import React from 'react';
import { hydrate } from 'react-dom';
import '../css/index.scss';
import App from './app';
import { makeUrlFor, isBelongsToUser } from '../lib/utils';

const { routes, currentUser } = window.INITIAL_STATE;
window.INITIAL_STATE.urlFor = makeUrlFor(routes);
window.INITIAL_STATE.isBelongsToUser = isBelongsToUser(currentUser);

hydrate(<App initialState={window.INITIAL_STATE} />, document.getElementById('root'));
