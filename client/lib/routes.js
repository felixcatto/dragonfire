import { makeUrlFor, makeUndefinedKeyError } from './utils';

export const routes = makeUndefinedKeyError({
  root: '/',
  users: '/users',
  user: '/users/:id',
  newUser: '/users/new',
  editUser: '/users/:id/edit',
  articles: '/articles',
  tags: '/tags',
  projectStructure: '/structure',
  newSession: '/session/new',
});

export const getUrl = makeUrlFor(routes);
