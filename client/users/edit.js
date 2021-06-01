import React from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useContext } from '../lib/context';
import Form from './form';
import { emptyObject, useImmerState } from '../lib/utils';

const EditUser = () => {
  const { getApiUrl, axios, $users } = useContext();
  const { id } = useParams();
  const { data: users } = useStore($users);
  const [state, setState] = useImmerState({
    user: users.find(user => user.id === +id) || emptyObject,
  });
  const { user } = state;

  React.useEffect(() => {
    if (isEmpty(user)) {
      axios({ url: getApiUrl('user', { id }) }).then(data => setState({ user: data }));
    }
  }, []);

  return (
    <div>
      <h3>Edit User</h3>
      {!isEmpty(user) && <Form type="edit" user={user} />}
    </div>
  );
};

export default EditUser;
