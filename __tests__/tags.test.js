import getApp from '../main';
import tagsFixture from './fixtures/tags';
import usersFixture from './fixtures/users';

describe('tags', () => {
  const server = getApp();
  let urlFor;
  let Tag;
  let User;

  beforeAll(async () => {
    await server.ready();
    urlFor = server.ctx.urlFor;
    User = server.objection.User;
    Tag = server.objection.Tag;
    await User.query().delete();
    await User.query().insertGraph(usersFixture);
  });

  beforeEach(async () => {
    await Tag.query().delete();
    await Tag.query().insertGraph(tagsFixture);
  });

  it('GET /tags', async () => {
    const res = await server.inject({
      method: 'GET',
      url: urlFor('tags'),
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject(tagsFixture);
  });

  it('POST /tags', async () => {
    const tag = { name: 'test' };
    const res = await server.inject({
      method: 'post',
      url: urlFor('tags'),
      payload: tag,
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
      url: urlFor('tag', { id: tag.id }),
      payload: tag,
    });

    const tagFromDb = await Tag.query().findById(tag.id);
    expect(res.statusCode).toBe(201);
    expect(tagFromDb).toMatchObject(tag);
  });

  it('DELETE /tags/:id', async () => {
    const [tag] = tagsFixture;
    const res = await server.inject({
      method: 'delete',
      url: urlFor('tag', { id: tag.id }),
    });
    const tagFromDb = await Tag.query().findById(tag.id);
    expect(res.statusCode).toBe(201);
    expect(tagFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
