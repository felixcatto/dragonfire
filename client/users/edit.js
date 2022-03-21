import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { FormWrapper, useContext } from '../lib/utils';
import Form from './form';

const EditUser = () => {
  const history = useHistory();
  const { getApiUrl, axios } = useContext();
  const { id } = useParams();
  const [user, setUser] = React.useState(null);
  const [apiErrors, setApiErrors] = React.useState({});

  React.useEffect(() => {
    axios.get(getApiUrl('user', { id })).then(data => setUser(data));
  }, []);

  const onSubmit = async values => {
    try {
      await axios.put(getApiUrl('user', { id: user.id }), values);
      history.push(getUrl('users'));
    } catch (e) {
      setApiErrors(e.response.data.errors);
    }
  };

  return (
    <div>
      <h3>Edit User</h3>
      {!isEmpty(user) && (
        <FormWrapper apiErrors={apiErrors} setApiErrors={setApiErrors}>
          <Form onSubmit={onSubmit} user={user} />
        </FormWrapper>
      )}
    </div>
  );
};

export default EditUser;
