import { validate, checkSignedIn } from '../lib/utils';

export const getTags = async Tag => Tag.query();

export default async app => {
  const { Tag } = app.objection;

  app.get('/tags', { name: 'tags' }, async () => getTags(Tag));

  app.get('/tags/:id', { name: 'tag' }, async (request, reply) => {
    const { id } = request.params;
    const tag = await Tag.query().findById(id);
    if (!tag) {
      return reply.code(400).send({ message: `Tag with id "${id}" not found` });
    }
    return tag;
  });

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
    { preHandler: [checkSignedIn, validate(Tag.yupSchema)] },
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
