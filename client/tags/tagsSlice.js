import { createStore, createEffect } from 'effector';
import axios from 'axios';
import { asyncStates } from '../lib/utils';

export const makeTagActions = ({ getApiUrl }) => ({
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
    .on(actions.loadTags.done, (state, payload) => ({
      data: payload.result.data,
      status: asyncStates.resolved,
      errors: null,
    }));
