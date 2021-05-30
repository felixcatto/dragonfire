import { createStore, createEffect } from 'effector';
import { asyncStates } from '../lib/utils';

export const makeArticlesActions = ({ getApiUrl, axios }) => ({
  loadArticles: createEffect(async () => axios.get(getApiUrl('articles'))),
  addArticle: createEffect(async values => axios.post(getApiUrl('articles'), values)),
  removeArticle: createEffect(async id => axios.delete(getApiUrl('article', { id }))),
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
    .on(actions.loadArticles, state => ({
      data: state.data,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.loadArticles.done, (state, { result }) => ({
      data: result,
      status: asyncStates.resolved,
      errors: null,
    }))
    .on(actions.addArticle.done, (state, { result: article }) => ({
      ...state,
      data: state.data.concat(article),
    }))
    .on(actions.removeArticle.done, (state, { result }) => ({
      ...state,
      data: state.data.filter(el => el.id !== +result.id),
    }));
