import { createStore, createEffect } from 'effector';
import axios from 'axios';
import { asyncStates } from '../lib/utils';

export const makeArticlesActions = ({ getApiUrl }) => ({
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
    .on(actions.loadArticles.done, (state, payload) => ({
      data: payload.result.data,
      status: asyncStates.resolved,
      errors: null,
    }))
    .on(actions.addArticle.done, (state, payload) => {
      const article = payload.result.data;
      return { ...state, data: state.data.concat(article) };
    })
    .on(actions.removeArticle.done, (state, payload) => {
      const id = Number(payload.result.data.id);
      return { ...state, data: state.data.filter(el => el.id !== id) };
    });
