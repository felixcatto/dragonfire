import { omit } from 'lodash';
import getApp from '../main';
import usersFixture from './fixtures/users';
import encrypt from '../lib/secure';
import { getLoginCookie } from './fixtures/utils';

describe('users', () => {
  const server = getApp();
  let User;
  let getApiUrl;
  let loginCookie;

  beforeAll(async () => {
    await server.ready();
    getApiUrl = server.ctx.getApiUrl;
    User = server.objection.User;
    loginCookie = await getLoginCookie(server, getApiUrl);
  });

  beforeEach(async () => {
    await User.query().delete();
    await User.query().insertGraph(usersFixture);
  });

  it('GET /users', async () => {
    const res = await server.inject({
      method: 'GET',
      url: getApiUrl('users'),
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
      url: getApiUrl('users'),
      payload: user,
      cookies: loginCookie,
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
      url: getApiUrl('users'),
      payload: user,
      cookies: loginCookie,
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
      url: getApiUrl('user', { id: user.id }),
      payload: user,
      cookies: loginCookie,
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
      url: getApiUrl('user', { id: user.id }),
      cookies: loginCookie,
    });
    const userFromDb = await User.query().findById(user.id);
    expect(res.statusCode).toBe(201);
    expect(userFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
