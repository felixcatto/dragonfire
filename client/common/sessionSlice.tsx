import { createEffect, createStore } from 'effector';
import { asyncStates, IAsyncStates, makeSessionInfo } from '../lib/utils';

export const makeSessionActions = ({ getApiUrl, axios }) => ({
  signIn: createEffect(async userCredentials =>
    axios({ method: 'post', url: getApiUrl('session'), data: userCredentials })
  ),
  signOut: createEffect(async () => axios({ method: 'delete', url: getApiUrl('session') })),
});

export const makeSession = (
  actions,
  initialState = {
    currentUser: null,
    isAdmin: false,
    isSignedIn: false,
    isBelongsToUser: () => false,
    status: asyncStates.idle as IAsyncStates,
    errors: null,
  }
) =>
  createStore(initialState)
    .on(actions.signIn, state => ({
      ...state,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.signIn.done, (state, { result: currentUser }) => ({
      ...makeSessionInfo(currentUser),
      status: asyncStates.resolved,
      errors: null,
    }))
    .on(actions.signOut.done, (state, { result: currentUser }) => ({
      ...makeSessionInfo(currentUser),
      status: asyncStates.resolved,
      errors: null,
    }));
