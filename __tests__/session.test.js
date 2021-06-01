import { omit } from 'lodash';
import getApp from '../main';
import usersFixture from './fixtures/users';

describe('session', () => {
  const server = getApp();
  let User;
  let getApiUrl;

  beforeAll(async () => {
    await server.ready();
    getApiUrl = server.ctx.getApiUrl;
    User = server.objection.User;
  });

  beforeEach(async () => {
    await User.query().delete();
    await User.query().insertGraph(usersFixture);
  });

  it('POST /session', async () => {
    const [user] = usersFixture;
    const res = await server.inject({
      method: 'POST',
      url: getApiUrl('session'),
      payload: user,
    });
    const [loginCookie] = res.cookies;

    expect(res.statusCode).toBe(200);
    expect(loginCookie).toMatchObject({ name: 'session', value: expect.any(String) });
  });

  it('DELETE /session', async () => {
    const [user] = usersFixture;
    const res = await server.inject({
      method: 'DELETE',
      url: getApiUrl('session'),
      payload: user,
    });
    const [loginCookie] = res.cookies;

    expect(res.statusCode).toBe(201);
    expect(loginCookie).toMatchObject({ name: 'session', value: '' });
  });

  afterAll(async () => {
    await server.close();
  });
});
