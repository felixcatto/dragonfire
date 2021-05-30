import { combine, createEffect, createStore, createEvent } from 'effector';
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

export const makeArticlesTagsActions = ({ getApiUrl, axios }) => ({
  loadArticlesTags: createEffect(async () => axios.get(getApiUrl('articlesTags'))),
  relateArticleWithTags: createEvent(),
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
    .on(actions.loadArticlesTags, state => ({
      data: state.data,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.loadArticlesTags.done, (state, { result }) => ({
      data: result,
      status: asyncStates.resolved,
      errors: null,
    }))
    .on(actions.relateArticleWithTags, (state, { articleId, tagIds, type }) => {
      let data;
      const articleTagsList = tagIds.map(tag_id => ({ article_id: articleId, tag_id }));
      if (type === 'add') {
        data = state.data.concat(articleTagsList);
      } else {
        data = state.data.filter(el => el.article_id !== articleId).concat(articleTagsList);
      }

      return { ...state, data };
    });
