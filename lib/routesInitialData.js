import { asyncStates } from './utils';
import { routes } from '../client/lib/routes';
import { getUsers } from '../routes/users';
import { getTags } from '../routes/tags';
import { getArticles } from '../routes/articles';
import { getArticlesTags } from '../routes/joinTables';

const makeEntity = entity => ({
  data: entity,
  status: asyncStates.resolved,
  errors: null,
});

export default {
  [routes.users]: async app => {
    const data = await getUsers(app.objection.User);
    return { $users: makeEntity(data) };
  },
  [routes.tags]: async app => {
    const data = await getTags(app.objection.Tag);
    return { $tags: makeEntity(data) };
  },
  [routes.articles]: async app => {
    const articles = await getArticles(app.objection.Article);
    const tags = await getTags(app.objection.Tag);
    const users = await getUsers(app.objection.User);
    const articlesTags = await getArticlesTags(app.objection.knex);

    return {
      $articles: makeEntity(articles),
      $tags: makeEntity(tags),
      $users: makeEntity(users),
      $articlesTags: makeEntity(articlesTags),
    };
  },
};
