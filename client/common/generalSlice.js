import { combine, createEffect, createStore } from 'effector';
import axios from 'axios';
import { asyncStates } from '../lib/utils';

export const loadArticlesData = async ({ articles, users, tags, articlesTags, actions }) =>
  Promise.all(
    [
      { store: articles, loadStore: actions.loadArticles },
      { store: tags, loadStore: actions.loadTags },
      { store: users, loadStore: actions.loadUsers },
      { store: articlesTags, loadStore: actions.loadArticlesTags },
    ]
      .filter(el => el.store.status === asyncStates.idle)
      .map(el => el.loadStore())
  );

export const makeArticlesList = stores =>
  combine(stores, ([users, articles, tags, articlesTags]) => {
    console.log('here');
    if ([users, articles, tags, articlesTags].some(el => el.status !== asyncStates.resolved)) {
      return [];
    }
    console.log('computed');
    const usersList = users.data;
    const articlesList = articles.data;
    const tagsList = tags.data;
    const articlesTagsList = articlesTags.data;

    return articlesList.map(article => ({
      ...article,
      author: usersList.find(user => user.id === article.author_id),
      tags: articlesTagsList
        .filter(({ article_id }) => article_id === article.id)
        .flatMap(({ tag_id }) => tagsList.filter(tag => tag.id === tag_id)),
    }));
  });

export const makeArticlesTagsActions = ({ getApiUrl }) => ({
  loadArticlesTags: createEffect(async () => axios.get(getApiUrl('articlesTags'))),
});

export const makeArticlesTags = (
  actions,
  initialState = {
    data: [],
    status: asyncStates.idle,
    errors: null,
  }
) =>
  createStore(initialState)
    .on(actions.loadArticlesTags, () => ({
      data: [],
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.loadArticlesTags.done, (state, payload) => ({
      data: payload.result.data,
      status: asyncStates.resolved,
      errors: null,
    }));
