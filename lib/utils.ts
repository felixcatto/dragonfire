import fp from 'fastify-plugin';
import knexConnect from 'knex';
import { Model } from 'objection';
import { isUndefined, isString, isEmpty } from 'lodash';
import knexConfig from '../knexfile';
import { isBelongsToUser, isAdmin, isSignedIn } from './sharedUtils';

export * from './sharedUtils';

export const clearCache = (rootModulePath, options = {} as any) => {
  const { ignoreRegex = null } = options;
  const clearCacheInner = moduleAbsPath => {
    const imodule = require.cache[moduleAbsPath];
    if (!imodule) return;

    if (imodule.id.match(/node_modules/) || (ignoreRegex && imodule.id.match(ignoreRegex))) return;

    delete require.cache[moduleAbsPath];
    imodule.children.forEach(el => clearCacheInner(el.id));
  };

  clearCacheInner(rootModulePath);
};

export const checkAdmin = async (request, reply) => {
  if (!isAdmin(request.currentUser)) {
    reply.code(403).send({ message: 'Forbidden' });
  }
};

export const checkBelongsToUser = getResourceAuthorId => async (request, reply) => {
  const resourceAuthorId = await getResourceAuthorId(request);
  if (!isBelongsToUser(request.currentUser)(resourceAuthorId)) {
    reply.code(403).send({ message: 'Forbidden' });
  }
};

export const checkSignedIn = async (request, reply) => {
  if (!isSignedIn(request.currentUser)) {
    reply.code(401).send({ message: 'Unauthorized' });
  }
};

export const currentUserPlugin = fp(async app => {
  app.addHook('preHandler', async request => {
    const userId = request.session.get('userId');
    const { User } = app.objection;
    let user;
    if (userId) {
      user = await User.query().findById(userId);
    }

    if (user) {
      request.currentUser = user;
    } else {
      request.currentUser = User.guestUser;
    }
  });
});

export const routesPlugin = fp(async app => {
  app.addHook('onRoute', routeOptions => {
    if (routeOptions.name) {
      app.ctx.routes = { ...app.ctx.routes, [routeOptions.name]: routeOptions.url };
    }
  });
});

export const emptyObject = new Proxy(
  {},
  {
    get() {
      return '';
    },
  }
);

const getYupErrors = e => {
  if (e.inner) {
    return e.inner.reduce(
      (acc, el) => ({
        ...acc,
        [el.path]: el.message,
      }),
      {}
    );
  }

  return e.message; // no object?
};

export const validate =
  (schema, payloadType = 'body') =>
  async (request, reply) => {
    const payload = payloadType === 'query' ? request.query : request.body;

    try {
      request.data = schema.validateSync(payload, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (e) {
      reply.code(400).send({ message: 'Input is not valid', errors: getYupErrors(e) });
    }
  };

export const requiredIfExists = () =>
  [
    'requiredIfExists',
    'required',
    value => isUndefined(value) || (isString(value) && !isEmpty(value)),
  ] as const;

export const objectionPlugin = fp(async (app, { mode, models }) => {
  const knex = knexConnect(knexConfig[mode]);
  Model.knex(knex);
  app.objection = { ...models, knex };

  app.addHook('onClose', async (_, done) => {
    await knex.destroy();
    done();
  });
});

export const checkValueUnique = async (Enitity, column, value, id = null) => {
  const existingEntities = await Enitity.query().select(column).whereNot('id', id);
  if (existingEntities.some(entity => entity[column] === value)) {
    return {
      isUnique: false,
      errors: { [column]: `${column} should be unique` },
    };
  }

  return { isUnique: true, errors: null };
};

export const supressConsoleLog = fn => {
  const consoleLog = console.log;
  console.log = () => {};
  const result = fn();
  console.log = consoleLog;
  return result;
};
