import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext } from '../lib/context';
import Form from './form';
import { emptyObject, useImmerState, asyncStates } from '../lib/utils';

const EditUser = () => {
  const { getApiUrl } = useContext();
  const { id } = useParams();
  const [state, setState] = useImmerState({ user: emptyObject, status: asyncStates.idle });
  const { user, status } = state;

  React.useEffect(() => {
    axios({ url: getApiUrl('user', { id }) })
      .then(({ data }) => {
        setState({ user: data, status: asyncStates.resolved });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  }, []);

  return (
    <div>
      <h3>Edit User</h3>
      {status === asyncStates.resolved && <Form method="put" user={user} />}
    </div>
  );
};

export default EditUser;
