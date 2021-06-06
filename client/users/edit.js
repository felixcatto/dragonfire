import React from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useContext } from '../lib/utils';
import Form from './form';

const EditUser = () => {
  const { getApiUrl, axios } = useContext();
  const { id } = useParams();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    axios.get(getApiUrl('user', { id })).then(data => setUser(data));
  }, []);

  return (
    <div>
      <h3>Edit User</h3>
      {!isEmpty(user) && <Form type="edit" user={user} />}
    </div>
  );
};

export default EditUser;
