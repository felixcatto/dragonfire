import { routes } from '../client/lib/routes';
import { getUsers } from '../routes/users';
import { getTags } from '../routes/tags';
import { getArticles } from '../routes/articles';

export default {
  [routes.users]: async app => {
    const data = await getUsers(app.objection.User);
    return { users: data };
  },
  [routes.tags]: async app => {
    const data = await getTags(app.objection.Tag);
    return { tags: data };
  },
  [routes.articles]: async app => {
    const data = await getArticles(app.objection.Article);
    return { articles: data };
  },
};
