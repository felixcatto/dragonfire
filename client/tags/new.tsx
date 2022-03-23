import React from 'react';
import { useHistory } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { FormWrapper, useContext } from '../lib/utils';
import Form from './form';

const Tag = () => {
  const history = useHistory();
  const { getApiUrl, axios } = useContext();
  const [apiErrors, setApiErrors] = React.useState({});

  const onSubmit = async values => {
    try {
      await axios.post(getApiUrl('tags'), values);
      history.push(getUrl('tags'));
    } catch (e) {
      setApiErrors(e.response.data.errors);
    }
  };

  return (
    <div>
      <h3>Create New Tag</h3>
      <FormWrapper apiErrors={apiErrors} setApiErrors={setApiErrors}>
        <Form onSubmit={onSubmit} />
      </FormWrapper>
    </div>
  );
};

export default Tag;
