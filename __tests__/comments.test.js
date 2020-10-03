import getApp from '../main';
import usersFixture from './fixtures/users';
import articlesFixture from './fixtures/articles';
import commentsFixture from './fixtures/comments';

describe('articles', () => {
  const server = getApp();
  let User;
  let Article;
  let Comment;
  let urlFor;

  beforeAll(async () => {
    await server.ready();
    urlFor = server.ctx.urlFor;
    User = server.objection.User;
    Article = server.objection.Article;
    Comment = server.objection.Comment;
    await User.query().delete();
    await Article.query().delete();
    await User.query().insertGraph(usersFixture);
    await Article.query().insertGraph(articlesFixture);
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
      url: urlFor('comments', { id: -1 }),
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
      url: urlFor('comment', { id: comment.article_id, commentId: comment.id }),
      payload: comment,
    });

    const commentFromDb = await Comment.query().findById(comment.id);
    expect(res.statusCode).toBe(201);
    expect(commentFromDb).toMatchObject(comment);
  });

  it('DELETE /articles/:id/comments/:id', async () => {
    const [comment] = commentsFixture;
    const res = await server.inject({
      method: 'delete',
      url: urlFor('comment', { id: comment.article_id, commentId: comment.id }),
    });

    const commentFromDb = await Comment.query().findById(comment.id);
    expect(res.statusCode).toBe(201);
    expect(commentFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
