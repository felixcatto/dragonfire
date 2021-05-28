import { isEmpty, difference } from 'lodash';
import comments from './comments';
import { validate, checkSignedIn, checkBelongsToUser, isSignedIn } from '../lib/utils';

export const getArticles = async Article => Article.query();

export default async app => {
  const { Article } = app.objection;

  const isArticleBelongsToUser = checkBelongsToUser(async request => {
    const article = await Article.query().findById(request.params.id);
    return article.author_id;
  });

  app.get('/articles', { name: 'articles' }, async () => getArticles(Article));

  app.get('/articles/:id', { name: 'article' }, async request =>
    Article.query().findById(request.params.id).withGraphFetched('[author, comments.author, tags]')
  );

  app.post(
    '/articles',
    { preHandler: [checkSignedIn, validate(Article.yupSchema)] },
    async (request, reply) => {
      const { currentUser } = request;
      const { tagIds, ...articleData } = request.data;
      const article = await Article.query().insert(articleData);
      if (isSignedIn(currentUser)) {
        await article.$relatedQuery('author').relate(currentUser.id);
      }
      if (!isEmpty(tagIds)) {
        await Promise.all(tagIds.map(tagId => article.$relatedQuery('tags').relate(tagId)));
      }

      reply.code(201).send({ id: article.id });
    }
  );

  app.put(
    '/articles/:id',
    { preHandler: [isArticleBelongsToUser, validate(Article.yupSchema)] },
    async (request, reply) => {
      const article = await Article.query()
        .updateAndFetchById(request.params.id, request.data)
        .withGraphFetched('tags');
      const tagIdsToDelete = difference(article.tagIds, request.data.tagIds);
      const tagIdsToInsert = difference(request.data.tagIds, article.tagIds);

      await article.$relatedQuery('tags').unrelate().where('id', 'in', tagIdsToDelete);
      await Promise.all(tagIdsToInsert.map(tagId => article.$relatedQuery('tags').relate(tagId)));

      reply.code(201).send({ id: article.id });
    }
  );

  app.delete('/articles/:id', { preHandler: isArticleBelongsToUser }, async (request, reply) => {
    await Article.query().deleteById(request.params.id);
    reply.code(201).send({ id: request.params.id });
  });

  app.register(comments, { prefix: '/articles/:id' });
};
