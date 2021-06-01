import getApp from '../main';
import tagsFixture from './fixtures/tags';
import usersFixture from './fixtures/users';
import { getLoginCookie } from './fixtures/utils';

describe('tags', () => {
  const server = getApp();
  let getApiUrl;
  let Tag;
  let User;
  let loginCookie;

  beforeAll(async () => {
    await server.ready();
    getApiUrl = server.ctx.getApiUrl;
    User = server.objection.User;
    Tag = server.objection.Tag;
    await User.query().delete();
    await User.query().insertGraph(usersFixture);
    loginCookie = await getLoginCookie(server, getApiUrl);
  });

  beforeEach(async () => {
    await Tag.query().delete();
    await Tag.query().insertGraph(tagsFixture);
  });

  it('GET /tags', async () => {
    const res = await server.inject({
      method: 'GET',
      url: getApiUrl('tags'),
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject(tagsFixture);
  });

  it('GET /tags/:id', async () => {
    const [tag] = tagsFixture;
    const res = await server.inject({
      method: 'GET',
      url: getApiUrl('tag', { id: tag.id }),
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject(tag);
  });

  it('POST /tags', async () => {
    const tag = { name: 'test' };
    const res = await server.inject({
      method: 'post',
      url: getApiUrl('tags'),
      payload: tag,
      cookies: loginCookie,
    });

    const tagFromDb = await Tag.query().findOne('name', tag.name);
    expect(res.statusCode).toBe(201);
    expect(tagFromDb).toMatchObject(tag);
  });

  it('PUT /tags/:id', async () => {
    const tag = {
      ...tagsFixture[0],
      name: '(edited)',
    };
    const res = await server.inject({
      method: 'put',
      url: getApiUrl('tag', { id: tag.id }),
      payload: tag,
      cookies: loginCookie,
    });

    const tagFromDb = await Tag.query().findById(tag.id);
    expect(res.statusCode).toBe(201);
    expect(tagFromDb).toMatchObject(tag);
  });

  it('DELETE /tags/:id', async () => {
    const [tag] = tagsFixture;
    const res = await server.inject({
      method: 'delete',
      url: getApiUrl('tag', { id: tag.id }),
      cookies: loginCookie,
    });
    const tagFromDb = await Tag.query().findById(tag.id);
    expect(res.statusCode).toBe(201);
    expect(tagFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
