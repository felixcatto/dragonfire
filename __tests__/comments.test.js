import getApp from '../main';
import usersFixture from './fixtures/users';
import articlesFixture from './fixtures/articles';
import commentsFixture from './fixtures/comments';
import { getLoginCookie } from './fixtures/utils';

describe('articles', () => {
  const server = getApp();
  let User;
  let Article;
  let Comment;
  let getApiUrl;
  let loginCookie;

  beforeAll(async () => {
    await server.ready();
    getApiUrl = server.ctx.getApiUrl;
    User = server.objection.User;
    Article = server.objection.Article;
    Comment = server.objection.Comment;
    await User.query().delete();
    await Article.query().delete();
    await User.query().insertGraph(usersFixture);
    await Article.query().insertGraph(articlesFixture);
    loginCookie = await getLoginCookie(server, getApiUrl);
  });

  beforeEach(async () => {
    await Comment.query().delete();
    await Comment.query().insertGraph(commentsFixture);
  });

  it('POST /articles/:id/comments', async () => {
    const comment = {
      guest_name: 'guest_name',
      text: 'text',
    };
    const res = await server.inject({
      method: 'post',
      url: getApiUrl('comments', { id: -1 }),
      payload: comment,
    });

    const commentFromDb = await Comment.query().findOne('guest_name', comment.guest_name);
    expect(res.statusCode).toBe(201);
    expect(commentFromDb).toMatchObject(comment);
  });

  it('PUT /articles/:id/comments/:id', async () => {
    const comment = {
      ...commentsFixture[0],
      guest_name: 'guest_name',
      text: '(edited)',
    };

    const res = await server.inject({
      method: 'put',
      url: getApiUrl('comment', { id: comment.article_id, commentId: comment.id }),
      payload: comment,
      cookies: loginCookie,
    });

    const commentFromDb = await Comment.query().findById(comment.id);
    expect(res.statusCode).toBe(201);
    expect(commentFromDb).toMatchObject(comment);
  });

  it('DELETE /articles/:id/comments/:id', async () => {
    const [comment] = commentsFixture;
    const res = await server.inject({
      method: 'delete',
      url: getApiUrl('comment', { id: comment.article_id, commentId: comment.id }),
      cookies: loginCookie,
    });

    const commentFromDb = await Comment.query().findById(comment.id);
    expect(res.statusCode).toBe(201);
    expect(commentFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
