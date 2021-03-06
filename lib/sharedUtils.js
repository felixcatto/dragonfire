// shared utils for Server and Client
import { isObject, has } from 'lodash';

export const makeUndefinedKeyError = rootObject => {
  const proxyObject = object =>
    new Proxy(object, {
      get(target, key) {
        if (has(target, key) || key === 'toJSON') {
          return target[key];
        }
        console.warn(target);
        throw new Error(`There is no key [${key}] in enum`);
      },
    });

  Object.keys(rootObject).forEach(key => {
    if (isObject(rootObject[key])) {
      rootObject[key] = proxyObject(rootObject[key]);
    }
  });

  return proxyObject(rootObject);
};

export const makeEnum = args =>
  makeUndefinedKeyError(args.reduce((acc, key) => ({ ...acc, [key]: key }), {}));

export const roles = makeEnum(['user', 'admin', 'guest']);
export const asyncStates = makeEnum(['idle', 'pending', 'resolved', 'rejected']);

export const isSignedIn = currentUser => currentUser.role !== roles.guest;
export const isAdmin = currentUser => currentUser.role === roles.admin;
export const isBelongsToUser = currentUser => resourceAuthorId =>
  currentUser.id === resourceAuthorId || currentUser.role === roles.admin;

export const makeSessionInfo = currentUser => ({
  currentUser,
  isSignedIn: isSignedIn(currentUser),
  isAdmin: isAdmin(currentUser),
  isBelongsToUser: isBelongsToUser(currentUser),
});
