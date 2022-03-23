import { currentUserPlugin } from '../lib/utils';
import home from './home';
import session from './session';
import users from './users';
import articles from './articles';
import tags from './tags';

export default async app => {
  app.register(currentUserPlugin);

  const controllers = [session, users, articles, tags];
  controllers.forEach(route => app.register(route, { prefix: '/api' }));
  app.register(home);
};
