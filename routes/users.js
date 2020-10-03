import { validate, checkValueUnique, checkAdmin } from '../lib/utils';

export default async app => {
  const { User } = app.objection;

  app.get('/users', { name: 'users' }, async () => User.query());

  app.post(
    '/users',
    { preHandler: [checkAdmin, validate(User.yupSchema)] },
    async (request, reply) => {
      const { isUnique, errors } = await checkValueUnique(User, 'email', request.data.email);
      if (!isUnique) {
        return reply.code(400).send({ errors });
      }

      const { id } = await User.query().insert(request.data);
      reply.code(201).send({ id });
    }
  );

  app.put(
    '/users/:id',
    { name: 'user', preHandler: [checkAdmin, validate(User.yupSchema)] },
    async (request, reply) => {
      const { id } = request.params;

      const { isUnique, errors } = await checkValueUnique(User, 'email', request.data.email, id);
      if (!isUnique) {
        return reply.code(400).send({ errors });
      }

      await User.query().update(request.data).where('id', id);
      reply.code(201).send({ id });
    }
  );

  app.delete('/users/:id', { preHandler: checkAdmin }, async (request, reply) => {
    await User.query().delete().where('id', request.params.id);
    reply.code(201).send({ id: request.params.id });
  });
};
