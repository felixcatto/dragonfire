import { asyncStates } from './utils';
import { routes } from '../client/lib/routes';
import { getUsers } from '../routes/users';
import { getTags } from '../routes/tags';

export default {
  [routes.users]: async app => {
    const data = await getUsers(app.objection.User);
    return {
      $users: {
        data,
        status: asyncStates.resolved,
        errors: null,
      },
    };
  },
  [routes.tags]: async app => {
    const data = await getTags(app.objection.Tag);
    return {
      $tags: {
        data,
        status: asyncStates.resolved,
        errors: null,
      },
    };
  },
};
