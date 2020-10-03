import { validate, checkSignedIn } from '../lib/utils';

export default async app => {
  const { Tag } = app.objection;

  app.get('/tags', { name: 'tags' }, async () => Tag.query());

  app.post(
    '/tags',
    { preHandler: [checkSignedIn, validate(Tag.yupSchema)] },
    async (request, reply) => {
      const { id } = await Tag.query().insert(request.data);
      reply.code(201).send({ id });
    }
  );

  app.put(
    '/tags/:id',
    { name: 'tag', preHandler: [checkSignedIn, validate(Tag.yupSchema)] },
    async (request, reply) => {
      await Tag.query().update(request.data).where('id', request.params.id);
      reply.code(201).send({ id: request.params.id });
    }
  );

  app.delete('/tags/:id', { preHandler: checkSignedIn }, async (request, reply) => {
    await Tag.query().deleteById(request.params.id);
    reply.code(201).send({ id: request.params.id });
  });
};
