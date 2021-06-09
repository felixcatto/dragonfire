import { combine, createEffect, createStore } from 'effector';
import { asyncStates, qb } from '../lib/utils';

export const loadArticlesData = async ({
  articlesStatus,
  usersStatus,
  tagsStatus,
  articlesTagsStatus,
  actions,
}) =>
  Promise.all(
    [
      { status: articlesStatus, loadStore: actions.loadArticles },
      { status: usersStatus, loadStore: actions.loadUsers },
      { status: tagsStatus, loadStore: actions.loadTags },
      { status: articlesTagsStatus, loadStore: actions.loadArticlesTags },
    ]
      .filter(el => el.status === asyncStates.idle)
      .map(el => el.loadStore())
  );

export const makeArticlesList = stores =>
  combine(
    stores.map(store => store.map(el => el.data)),
    ([users, articles, tags, articlesTags]) => articles.map(article => ({
        ...article,
        author: qb(article).rowToOne(users, 'author_id=id'),
        tags: qb(article).rowToMany(articlesTags, tags, 'id=article_id, tag_id=id'),
      }))
  );

export const makeArticlesTagsActions = ({ getApiUrl, axios }) => ({
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
    .on(actions.addArticle.done, (state, { result: article }) => {
      const { id: articleId, tagIds } = article;
      return {
        ...state,
        data:
          tagIds.map(tag_id => ({ article_id: articleId, tag_id })) |> (v => state.data.concat(v)),
      };
    })
    .on(actions.editArticle.done, (state, { result: article }) => {
      const { id: articleId, tagIds } = article;
      const articleTagsList = tagIds.map(tag_id => ({ article_id: articleId, tag_id }));
      const data = state.data.filter(el => el.article_id !== articleId).concat(articleTagsList);
      return { ...state, data };
    })
    .on(actions.deleteTag.done, (state, { result }) => {
      const deletedTagId = +result.id;
      return { ...state, data: state.data.filter(({ tag_id }) => tag_id !== deletedTagId) };
    });
