import { createStore, createEvent, createEffect } from 'effector';
import axios from 'axios';
import { asyncStates, makeSessionInfo } from '../lib/utils';

export const makeSessionActions = ({ getApiUrl }) => ({
  signIn: createEffect(async userCredentials =>
    axios({ method: 'post', url: getApiUrl('session'), data: userCredentials })
  ),
  signOut: createEffect(async userCredentials =>
    axios({ method: 'delete', url: getApiUrl('session') })
  ),
});

export const makeSession = (
  actions,
  initialState = {
    currentUser: null,
    isAdmin: false,
    isSignedIn: false,
    isBelongsToUser: () => false,
    status: asyncStates.idle,
    errors: null,
  }
) =>
  createStore(initialState)
    .on(actions.signIn, state => ({
      ...state,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.signIn.done, (state, payload) => {
      const currentUser = payload.result.data;
      return { ...makeSessionInfo(currentUser), status: asyncStates.resolved, errors: null };
    })
    .on(actions.signOut.done, (state, payload) => {
      const currentUser = payload.result.data;
      return { ...makeSessionInfo(currentUser), status: asyncStates.resolved, errors: null };
    });
