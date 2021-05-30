import { createStore, createEffect } from 'effector';
import { asyncStates } from '../lib/utils';

export const makeTagActions = ({ getApiUrl, axios }) => ({
  loadTags: createEffect(async () => axios.get(getApiUrl('tags'))),
});

export const makeTags = (
  actions,
  initialState = {
    data: [],
    status: asyncStates.idle,
    errors: null,
  }
) =>
  createStore(initialState)
    .on(actions.loadTags, (state) => ({
      data: state.data,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.loadTags.done, (state, { result }) => ({
      data: result,
      status: asyncStates.resolved,
      errors: null,
    }));
