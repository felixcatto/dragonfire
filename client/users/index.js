import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { useStore } from 'effector-react';
import axios from 'axios';
import { userRolesToIcons, asyncStates } from '../lib/utils';
import { useContext } from '../lib/context';
import { getUrl } from '../lib/routes';

const userIconClass = role => cn('mr-5', userRolesToIcons[role]);

const Users = () => {
  const { $session, $users, actions, getApiUrl } = useContext();
  const users = useStore($users);
  const { isAdmin } = useStore($session);
  console.log(users);

  const deleteUser = id => async () => {
    await axios({ method: 'delete', url: getApiUrl('user', { id }) });
    await actions.loadUsers();
  };

  React.useEffect(() => {
    if (users.status === asyncStates.idle) {
      actions.loadUsers();
    }
  }, []);

  return (
    <div>
      <h3>Users List</h3>

      {isAdmin && (
        <Link to={getUrl('newUser')} className="d-inline-block mb-30">
          <button className="btn btn-primary">Create new user</button>
        </Link>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            {isAdmin && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.data.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <div className="d-flex align-items-center">
                  <i className={userIconClass(user.role)}></i>
                  <div>{user.role}</div>
                </div>
              </td>
              <td>{user.email}</td>
              {isAdmin && (
                <td>
                  <div className="d-flex justify-content-end">
                    <Link
                      to={getUrl('editUser', { id: user.id })}
                      className="btn btn-sm btn-outline-primary mr-10"
                    >
                      Edit user
                    </Link>
                    <div className="btn btn-sm btn-outline-primary" onClick={deleteUser(user.id)}>
                      Remove user
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
