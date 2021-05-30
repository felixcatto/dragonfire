import { createStore, createEffect } from 'effector';
import { asyncStates } from '../lib/utils';

export const makeUserActions = ({ getApiUrl, axios }) => ({
  loadUsers: createEffect(async () => axios.get(getApiUrl('users'))),
  addUser: createEffect(async values => axios.post(getApiUrl('users'), values)),
  editUser: createEffect(async ({ id, values }) => axios.put(getApiUrl('user', { id }), values)),
  deleteUser: createEffect(async id => axios.delete(getApiUrl('user', { id }))),
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
    }))
    .on(actions.addUser.done, (state, { result: user }) => ({
      ...state,
      data: state.data.concat(user),
    }))
    .on(actions.editUser.done, (state, { result: user }) => ({
      ...state,
      data: state.data.filter(el => el.id !== user.id).concat(user),
    }))
    .on(actions.deleteUser.done, (state, { result }) => ({
      ...state,
      data: state.data.filter(el => el.id !== +result.id),
    }));
