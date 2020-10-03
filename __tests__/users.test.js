import { omit } from 'lodash';
import getApp from '../main';
import usersFixture from './fixtures/users';
import encrypt from '../lib/secure';

describe('users', () => {
  const server = getApp();
  let User;
  let urlFor;

  beforeAll(async () => {
    await server.ready();
    urlFor = server.ctx.urlFor;
    User = server.objection.User;
  });

  beforeEach(async () => {
    await User.query().delete();
    await User.query().insertGraph(usersFixture);
  });

  it('GET /users', async () => {
    const res = await server.inject({
      method: 'GET',
      url: urlFor('users'),
    });
    const expectedUsers = usersFixture.map(user => omit(user, 'password'));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject(expectedUsers);
  });

  it('POST /users', async () => {
    const user = {
      name: 'boris',
      role: 'admin',
      email: 'boris@yandex.ru',
      password: '1',
    };

    const res = await server.inject({
      method: 'post',
      url: urlFor('users'),
      payload: user,
    });

    const userFromDb = await User.query().findOne('name', user.name);
    const expectedUser =
      omit(user, 'password') |> (v => ({ ...v, password_digest: encrypt(user.password) }));
    expect(res.statusCode).toBe(201);
    expect(userFromDb).toMatchObject(expectedUser);
  });

  it('POST /users (unique email)', async () => {
    const user = omit(usersFixture[0], 'id');
    const res = await server.inject({
      method: 'post',
      url: urlFor('users'),
      payload: user,
    });

    expect(res.statusCode).toBe(400);
  });

  it('PUT /users/:id', async () => {
    const user = {
      ...usersFixture[0],
      role: 'guest',
    };
    const res = await server.inject({
      method: 'put',
      url: urlFor('user', { id: user.id }),
      payload: user,
    });

    const userFromDb = await User.query().findOne('name', user.name);
    const expectedUser = omit(user, 'password');
    expect(res.statusCode).toBe(201);
    expect(userFromDb).toMatchObject(expectedUser);
  });

  it('DELETE /users/:id', async () => {
    const [user] = usersFixture;
    const res = await server.inject({
      method: 'delete',
      url: urlFor('user', { id: user.id }),
    });
    const userFromDb = await User.query().findById(user.id);
    expect(res.statusCode).toBe(201);
    expect(userFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
