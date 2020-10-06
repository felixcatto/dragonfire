import { asyncStates } from './utils';
import { routes } from '../client/lib/routes';
import { getUsers } from '../routes/users';

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
};
