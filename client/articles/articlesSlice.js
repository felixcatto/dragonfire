import { createStore, createEffect } from 'effector';
import produce from 'immer';
import { asyncStates } from '../lib/utils';

export const makeArticlesActions = ({ getApiUrl, axios }) => ({
  loadArticles: createEffect(async () => axios.get(getApiUrl('articles'))),
  addArticle: createEffect(async values => {
    const article = await axios.post(getApiUrl('articles'), values);
    return { ...article, tagIds: values.tagIds };
  }),
  editArticle: createEffect(async ({ id, values }) => {
    const article = await axios.put(getApiUrl('article', { id }), values);
    return { ...article, tagIds: values.tagIds };
  }),
  deleteArticle: createEffect(async id => axios.delete(getApiUrl('article', { id }))),
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
    .on(actions.editArticle.done, (state, { result: article }) => ({
      ...state,
      data: state.data.filter(el => el.id !== article.id).concat(article),
    }))
    .on(actions.deleteArticle.done, (state, { result }) => ({
      ...state,
      data: state.data.filter(el => el.id !== +result.id),
    }))
    .on(actions.deleteUser.done, (state, { result }) => {
      const deletedUserId = +result.id;
      const data = produce(state.data, i => {
        i.forEach(article => {
          article.author_id = article.author_id === deletedUserId ? null : article.author_id;
        });
      });

      return { ...state, data };
    });
