import React from 'react';
import { useHistory } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { FormWrapper, useContext } from '../lib/utils';
import Form from './form';

const NewUser = () => {
  const history = useHistory();
  const { axios, getApiUrl } = useContext();
  const [apiErrors, setApiErrors] = React.useState({});

  const onSubmit = async values => {
    try {
      await axios.post(getApiUrl('users'), values);
      history.push(getUrl('users'));
    } catch (e) {
      setApiErrors(e.response.data.errors);
    }
  };

  return (
    <div>
      <h3>Create New User</h3>
      <FormWrapper apiErrors={apiErrors} setApiErrors={setApiErrors}>
        <Form onSubmit={onSubmit} />
      </FormWrapper>
    </div>
  );
};

export default NewUser;
