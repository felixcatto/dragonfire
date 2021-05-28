export const getArticlesTags = async knex => knex.select().from('articles_tags');

export default async app => {
  const { knex } = app.objection;

  app.get('/articlesTags', { name: 'articlesTags' }, async () => getArticlesTags(knex));
};
