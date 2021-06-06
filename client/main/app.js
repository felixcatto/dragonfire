import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import cn from 'classnames';
import { useStore } from 'effector-react';
import originalAxios from 'axios';
import { SWRConfig } from 'swr';
import Context from '../lib/context';
import {
  userRolesToIcons,
  NavLink,
  asyncStates,
  makeSessionInfo,
  ProtectedRoute,
  useContext,
} from '../lib/utils';
import { routes, getUrl } from '../lib/routes';
import Home from '../common/home';
import Users from '../users/index';
import NewUser from '../users/new';
import EditUser from '../users/edit';
import Articles from '../articles/index';
import ShowArticle from '../articles/show';
import NewArticle from '../articles/new';
import EditArticle from '../articles/edit';
import Tags from '../tags/index';
import NewTag from '../tags/new';
import EditTag from '../tags/edit';
import LoginForm from '../common/session';
import { makeSession, makeSessionActions } from '../common/sessionSlice';
import Structure from '../common/structure';

const Provider = ({ initialState, children }) => {
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const axios = originalAxios.create();
  axios.interceptors.response.use(
    response => response.data,
    error => {
      console.log(error.response);
      return Promise.reject(error);
    }
  );
  const swrConfig = { fetcher: axios.get, revalidateOnFocus: false };

  const { getApiUrl, currentUser } = initialState;
  const actions = [makeSessionActions].reduce(
    (acc, makeActions) => ({
      ...acc,
      ...makeActions({ getApiUrl, axios }),
    }),
    {}
  );

  const store = {
    ...initialState,
    isFirstRender,
    axios,
    actions,
    $session: makeSession(actions, {
      ...makeSessionInfo(currentUser),
      status: asyncStates.resolved,
      errors: null,
    }),
  };

  return (
    <Context.Provider value={store}>
      <SWRConfig value={swrConfig}>{children}</SWRConfig>
    </Context.Provider>
  );
};

const App = () => {
  const store = useContext();
  const { $session, actions } = store;
  const { currentUser, isSignedIn, isAdmin } = useStore($session);
  const userIconClass = role => cn('app__user-role-icon mr-5', userRolesToIcons[role]);

  return (
    <div className="app">
      <div className="app__header">
        <div className="container app__header-fg">
          <div className="d-flex align-items-center">
            <img src="/img/dragon.svg" className="app__logo mr-30" />
            <div className="d-flex">
              <NavLink to={getUrl('home')} exact>
                Home
              </NavLink>
              <NavLink to={getUrl('users')}>Users</NavLink>
              <NavLink to={getUrl('articles')}>Articles</NavLink>
              <NavLink to={getUrl('tags')}>Tags</NavLink>
              <NavLink to={getUrl('projectStructure')}>Project Structure</NavLink>
            </div>
          </div>
          {isSignedIn ? (
            <div className="d-flex align-items-center">
              <i className={userIconClass(currentUser.role)}></i>
              <div className="app__user-name mr-10">{currentUser.name}</div>
              <i
                className="fa fa-sign-out-alt app__sign-icon"
                title="Sign out"
                onClick={actions.signOut}
              ></i>
            </div>
          ) : (
            <Link to={getUrl('newSession')} className="app__sign-in">
              <div className="app__sign-in-text">Sign In</div>
              <i className="fa fa-sign-in-alt app__sign-icon" title="Sign in"></i>
            </Link>
          )}
        </div>
      </div>
      <div className="container app__body">
        <Switch>
          <Route exact path={routes.home} component={Home} />
          <Route exact path={routes.newSession} component={LoginForm} />
          <Route exact path={routes.users} component={Users} />
          <ProtectedRoute canRender={isAdmin} exact path={routes.newUser} component={NewUser} />
          <ProtectedRoute canRender={isAdmin} exact path={routes.editUser} component={EditUser} />
          <Route exact path={routes.articles} component={Articles} />
          <ProtectedRoute
            canRender={isSignedIn}
            exact
            path={routes.newArticle}
            component={NewArticle}
          />
          <Route exact path={routes.article} component={ShowArticle} />
          <ProtectedRoute
            canRender="maybe"
            exact
            path={routes.editArticle}
            component={EditArticle}
          />
          <Route exact path={routes.tags} component={Tags} />
          <ProtectedRoute canRender={isSignedIn} exact path={routes.newTag} component={NewTag} />
          <ProtectedRoute canRender={isSignedIn} exact path={routes.editTag} component={EditTag} />
          <Route exact path={routes.projectStructure} component={Structure} />
        </Switch>
      </div>
    </div>
  );
};

export default ({ initialState }) => (
  <Provider initialState={initialState}>
    <App />
  </Provider>
);
