import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import cn from 'classnames';
import { has } from 'lodash';
import { useStore } from 'effector-react';
import Context, { useContext } from '../lib/context';
import { userRolesToIcons, NavLink, asyncStates, makeSessionInfo } from '../lib/utils';
import { routes, getUrl } from '../lib/routes';
import Root from '../common/index';
import Users from '../users/index';
import NewUser from '../users/new';
import EditUser from '../users/edit';
import { makeUserActions, makeUsers } from '../users/usersSlice';
import LoginForm from '../common/session';
import { makeSession, makeSessionActions } from '../common/sessionSlice';

const Provider = ({ initialState, children }) => {
  const { getApiUrl, currentUser } = initialState;
  const actions = [makeUserActions, makeSessionActions].reduce(
    (acc, makeActions) => ({
      ...acc,
      ...makeActions({ getApiUrl }),
    }),
    {}
  );
  const initStore = (makeStore, key) =>
    has(initialState, key) ? makeStore(actions, initialState[key]) : makeStore(actions);
  const store = {
    ...initialState,
    actions,
    $users: initStore(makeUsers, '$users'),
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
  const { $session, actions, getApiUrl } = store;
  const { currentUser, isSignedIn } = useStore($session);
  const userIconClass = role => cn('app__user-role-icon mr-5', userRolesToIcons[role]);

  console.log(currentUser);
  return (
    <div className="app">
      <div className="app__header">
        <div className="container app__header-fg">
          <div className="d-flex align-items-center">
            <img src="/img/dragon.svg" className="app__logo mr-30" />
            <div className="d-flex">
              <NavLink to={getUrl('root')} exact>
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
          <Route exact path={routes.root} component={Root} />
          <Route exact path={routes.users} component={Users} />
          <Route exact path={routes.newUser} component={NewUser} />
          <Route exact path={routes.editUser} component={EditUser} />
          <Route exact path={routes.newSession} component={LoginForm} />
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
