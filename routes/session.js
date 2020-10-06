import { emptyObject, validate } from '../lib/utils';
import encrypt from '../lib/secure';

export default async app => {
  const { User } = app.objection;
  const { getApiUrl } = app.ctx;

  app.post(
    '/session',
    { name: 'session', preHandler: validate(User.yupLoginSchema) },
    async (request, reply) => {
      const user = await User.query().findOne('email', request.data.email);
      if (!user) {
        return reply.code(400).send({ errors: { email: 'User with such email not found' } });
      }

      if (user.password_digest !== encrypt(request.data.password)) {
        return reply.code(400).send({ errors: { password: 'Wrong password' } });
      }

      request.session.set('userId', user.id);
      return reply.send(user);
    }
  );

  app.delete('/session', async (request, reply) => {
    request.session.delete();
    reply.code(201).send(User.guestUser);
  });
};
