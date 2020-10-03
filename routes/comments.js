import { validate, isSignedIn, checkBelongsToUser } from '../lib/utils';

export default async app => {
  const { Comment } = app.objection;

  const isCommentBelongsToUser = checkBelongsToUser(async request => {
    const comment = await Comment.query().findById(request.params.commentId);
    return comment.author_id;
  });

  app.post(
    '/comments',
    { name: 'comments', preHandler: validate(Comment.yupSchema) },
    async (request, reply) => {
      const articleId = request.params.id;
      const { currentUser } = request;
      const comment = await Comment.query().insert(request.data);
      await comment.$relatedQuery('article').relate(articleId);
      if (isSignedIn(currentUser)) {
        await comment.$relatedQuery('author').relate(currentUser.id);
      }
      reply.code(201).send({ id: comment.id });
    }
  );

  app.put(
    '/comments/:commentId',
    { name: 'comment', preHandler: [isCommentBelongsToUser, validate(Comment.yupSchema)] },
    async (request, reply) => {
      const { commentId } = request.params;
      await Comment.query().update(request.data).where('id', commentId);
      reply.code(201).send({ id: commentId });
    }
  );

  app.delete(
    '/comments/:commentId',
    { preHandler: isCommentBelongsToUser },
    async (request, reply) => {
      await Comment.query().deleteById(request.params.commentId);
      reply.code(201).send({ id: request.params.commentId });
    }
  );
};
