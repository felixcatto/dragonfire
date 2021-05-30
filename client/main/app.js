import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import cn from 'classnames';
import { has } from 'lodash';
import { useStore } from 'effector-react';
import originalAxios from 'axios';
import Context, { useContext } from '../lib/context';
import {
  userRolesToIcons,
  NavLink,
  asyncStates,
  makeSessionInfo,
  ProtectedRoute,
} from '../lib/utils';
import { routes, getUrl } from '../lib/routes';
import Home from '../common/home';
import Users from '../users/index';
import NewUser from '../users/new';
import EditUser from '../users/edit';
import { makeUsers, makeUserActions } from '../users/usersSlice';
import Articles from '../articles/index';
import NewArticle from '../articles/new';
import { makeArticles, makeArticlesActions } from '../articles/articlesSlice';
import Tags from '../tags/index';
import NewTag from '../tags/new';
import EditTag from '../tags/edit';
import { makeTags, makeTagActions } from '../tags/tagsSlice';
import LoginForm from '../common/session';
import { makeSession, makeSessionActions } from '../common/sessionSlice';
import {
  makeArticlesList,
  makeArticlesTags,
  makeArticlesTagsActions,
} from '../common/generalSlice';

const Provider = ({ initialState, children }) => {
  const axios = originalAxios.create();
  axios.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error)
  );

  const { getApiUrl, currentUser } = initialState;
  const actions = [
    makeUserActions,
    makeSessionActions,
    makeTagActions,
    makeArticlesActions,
    makeArticlesTagsActions,
  ].reduce(
    (acc, makeActions) => ({
      ...acc,
      ...makeActions({ getApiUrl, axios }),
    }),
    {}
  );
  const initStore = (makeStore, key) =>
    has(initialState, key) ? makeStore(actions, initialState[key]) : makeStore(actions);

  const $users = initStore(makeUsers, '$users');
  const $tags = initStore(makeTags, '$tags');
  const $articles = initStore(makeArticles, '$articles');
  const $articlesTags = initStore(makeArticlesTags, '$articlesTags');
  const $articlesList = makeArticlesList([$users, $articles, $tags, $articlesTags]);
  const store = {
    ...initialState,
    axios,
    actions,
    $users,
    $tags,
    $articles,
    $articlesTags,
    $articlesList,
    $session: makeSession(actions, {
      ...makeSessionInfo(currentUser),
      status: asyncStates.resolved,
      errors: null,
    }),
  };

  return <Context.Provider value={store}>{children}</Context.Provider>;
};

const App = () => {
  const store = useContext();
  const { $session, actions } = store;
  const { currentUser, isSignedIn, isAdmin } = useStore($session);
  const userIconClass = role => cn('app__user-role-icon mr-5', userRolesToIcons[role]);

  console.log(currentUser);
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
          <Route exact path={routes.tags} component={Tags} />
          <ProtectedRoute canRender={isSignedIn} exact path={routes.newTag} component={NewTag} />
          <ProtectedRoute canRender={isSignedIn} exact path={routes.editTag} component={EditTag} />
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
