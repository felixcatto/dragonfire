import { validate, checkValueUnique, checkAdmin } from '../lib/utils';

export const getUsers = async User => User.query();

export default async app => {
  const { User } = app.objection;

  app.get('/users', { name: 'users' }, async () => getUsers(User));

  app.get('/users/:id', { name: 'user' }, async (request, reply) => {
    const { id } = request.params;
    const user = await User.query().findById(id);
    if (!user) {
      return reply.code(400).send({ message: `User with id "${id}" not found` });
    }
    return user;
  });

  app.post(
    '/users',
    { preHandler: [checkAdmin, validate(User.yupSchema)] },
    async (request, reply) => {
      const { isUnique, errors } = await checkValueUnique(User, 'email', request.data.email);
      if (!isUnique) {
        return reply.code(400).send({ errors });
      }

      const user = await User.query().insert(request.data);
      reply.code(201).send(user);
    }
  );

  app.put(
    '/users/:id',
    { preHandler: [checkAdmin, validate(User.yupSchema)] },
    async (request, reply) => {
      const { id } = request.params;

      const { isUnique, errors } = await checkValueUnique(User, 'email', request.data.email, id);
      if (!isUnique) {
        return reply.code(400).send({ errors });
      }

      const user = await User.query().updateAndFetchById(request.params.id, request.data);
      reply.code(201).send(user);
    }
  );

  app.delete('/users/:id', { preHandler: checkAdmin }, async (request, reply) => {
    await User.query().delete().where('id', request.params.id);
    reply.code(201).send({ id: request.params.id });
  });
};
