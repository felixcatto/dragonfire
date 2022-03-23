import { makeUrlFor } from './utils';

export const routes = {
  home: '/',
  users: '/users',
  newUser: '/users/new',
  editUser: '/users/:id/edit',
  articles: '/articles',
  article: '/articles/:id',
  newArticle: '/articles/new',
  editArticle: '/articles/:id/edit',
  tags: '/tags',
  newTag: '/tags/new',
  editTag: '/tags/:id/edit',
  projectStructure: '/structure',
  newSession: '/session/new',
};

export const getUrl = makeUrlFor(routes);
