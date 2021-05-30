import { createStore, createEvent, createEffect } from 'effector';
import { asyncStates } from '../lib/utils';

export const makeUserActions = ({ getApiUrl, axios }) => ({
  loadUsers: createEffect(async () => axios.get(getApiUrl('users'))),
});

export const makeUsers = (
  actions,
  initialState = {
    data: [],
    status: asyncStates.idle,
    errors: null,
  }
) =>
  createStore(initialState)
    .on(actions.loadUsers, state => ({
      data: state.data,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.loadUsers.done, (state, { result }) => ({
      data: result,
      status: asyncStates.resolved,
      errors: null,
    }));
