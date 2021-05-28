import { makeUrlFor, makeUndefinedKeyError } from './utils';

export const routes = makeUndefinedKeyError({
  home: '/',
  users: '/users',
  user: '/users/:id',
  newUser: '/users/new',
  editUser: '/users/:id/edit',
  articles: '/articles',
  tags: '/tags',
  tag: '/tags/:id',
  newTag: '/tags/new',
  editTag: '/tags/:id/edit',
  projectStructure: '/structure',
  newSession: '/session/new',
});

export const getUrl = makeUrlFor(routes);
