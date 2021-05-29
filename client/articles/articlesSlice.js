import { createStore, createEffect } from 'effector';
import axios from 'axios';
import { asyncStates } from '../lib/utils';

export const makeArticlesActions = ({ getApiUrl }) => ({
  loadArticles: createEffect(async () => axios.get(getApiUrl('articles'))),
});

export const makeArticles = (
  actions,
  initialState = {
    data: [],
    status: asyncStates.idle,
    errors: null,
  }
) =>
  createStore(initialState)
    .on(actions.loadArticles, (state) => ({
      data: state.data,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.loadArticles.done, (state, payload) => ({
      data: payload.result.data,
      status: asyncStates.resolved,
      errors: null,
    }));
