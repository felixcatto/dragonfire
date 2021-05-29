import { createStore, createEvent, createEffect } from 'effector';
import axios from 'axios';
import { asyncStates } from '../lib/utils';

export const makeUserActions = ({ getApiUrl }) => ({
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
    .on(actions.loadUsers, (state) => ({
      data: state.data,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.loadUsers.done, (state, payload) => ({
      data: payload.result.data,
      status: asyncStates.resolved,
      errors: null,
    }));
