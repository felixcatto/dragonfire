import getApp from '../main';
import usersFixture from './fixtures/users';
import articlesFixture from './fixtures/articles';
import tagsFixture from './fixtures/tags';
import articleTagsFixture from './fixtures/articles_tags';
import { getLoginCookie } from './fixtures/utils';

describe('articles', () => {
  const server = getApp();
  let User;
  let Article;
  let Tag;
  let knex;
  let getApiUrl;
  let loginCookie;

  beforeAll(async () => {
    await server.ready();
    User = server.objection.User;
    Article = server.objection.Article;
    Tag = server.objection.Tag;
    knex = server.objection.knex;
    getApiUrl = server.ctx.getApiUrl;

    await User.query().delete();
    await Tag.query().delete();
    await User.query().insertGraph(usersFixture);
    await Tag.query().insertGraph(tagsFixture);
    loginCookie = await getLoginCookie(server, getApiUrl);
  });

  beforeEach(async () => {
    await knex.delete().from('articles_tags');
    await Article.query().delete();
    await Article.query().insertGraph(articlesFixture);
    await knex.insert(articleTagsFixture).into('articles_tags');
  });

  it('GET /articles', async () => {
    const res = await server.inject({
      method: 'GET',
      url: getApiUrl('articles'),
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject(articlesFixture);
  });

  it('GET /article/:id', async () => {
    const [article] = articlesFixture;
    const res = await server.inject({
      method: 'GET',
      url: getApiUrl('article', { id: article.id }),
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject(article);
  });

  it('POST /articles', async () => {
    const article = {
      title: 'test',
      text: 'test',
    };
    const res = await server.inject({
      method: 'post',
      url: getApiUrl('articles'),
      payload: article,
      cookies: loginCookie,
    });

    const articleFromDb = await Article.query().findOne('title', article.title);
    expect(res.statusCode).toBe(201);
    expect(articleFromDb).toMatchObject(article);
  });

  it('POST /articles with tags', async () => {
    const tagIds = tagsFixture.map(tag => tag.id);
    const article = {
      title: 'test',
      text: 'test',
      tagIds,
    };
    const res = await server.inject({
      method: 'post',
      url: getApiUrl('articles'),
      payload: article,
      cookies: loginCookie,
    });

    const articleFromDb = await Article.query()
      .findOne('title', article.title)
      .withGraphFetched('tags');
    expect(articleFromDb).toMatchObject(article);
    expect(res.statusCode).toBe(201);
  });

  it('PUT /articles/:id', async () => {
    const article = {
      ...articlesFixture[0],
      title: '(edited)',
    };
    const res = await server.inject({
      method: 'put',
      url: getApiUrl('article', { id: article.id }),
      payload: article,
      cookies: loginCookie,
    });

    const articleFromDb = await Article.query().findById(article.id);
    expect(res.statusCode).toBe(201);
    expect(articleFromDb).toMatchObject(article);
  });

  it('PUT /articles/:id with tags', async () => {
    const article = {
      ...articlesFixture[1],
      tagIds: [-1, -3],
    };
    const res = await server.inject({
      method: 'put',
      url: getApiUrl('article', { id: article.id }),
      payload: article,
      cookies: loginCookie,
    });

    const articleFromDb = await Article.query().findById(article.id).withGraphFetched('tags');
    expect(articleFromDb).toMatchObject(article);
    expect(res.statusCode).toBe(201);
  });

  it('DELETE /articles/:id', async () => {
    const [article] = articlesFixture;
    const res = await server.inject({
      method: 'delete',
      url: getApiUrl('article', { id: article.id }),
      cookies: loginCookie,
    });
    const articleFromDb = await Article.query().findById(article.id);
    expect(res.statusCode).toBe(201);
    expect(articleFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
