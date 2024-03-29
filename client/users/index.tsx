import cn from 'classnames';
import { useStore } from 'effector-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { IUser } from '../lib/types';
import { dedup, useContext, userRolesToIcons, useSWR } from '../lib/utils';

const userIconClass = role => cn('mr-5', userRolesToIcons[role]);

const Users = () => {
  const { $session, getApiUrl, axios } = useContext();
  const { isAdmin } = useStore($session);
  const { data: users, mutate } = useSWR<IUser[]>(getApiUrl('users'));
  console.log(users);

  const deleteUser = id =>
    dedup(async () => {
      await axios.delete(getApiUrl('user', { id }));
      mutate();
    });

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
          {users?.map(user => (
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
