import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { FormWrapper, useContext } from '../lib/utils';
import Form from './form';

const EditTag = () => {
  const history = useHistory();
  const { getApiUrl, axios } = useContext();
  const { id } = useParams();
  const [tag, setTag] = React.useState(null);
  const [apiErrors, setApiErrors] = React.useState({});

  React.useEffect(() => {
    axios.get(getApiUrl('tag', { id })).then(data => setTag(data));
  }, []);

  const onSubmit = async values => {
    try {
      await axios.put(getApiUrl('tag', { id: tag.id }), values);
      history.push(getUrl('tags'));
    } catch (e) {
      setApiErrors(e.response.data.errors);
    }
  };

  return (
    <div>
      <h3>Edit Tag</h3>
      {!isEmpty(tag) && (
        <FormWrapper apiErrors={apiErrors} setApiErrors={setApiErrors}>
          <Form onSubmit={onSubmit} tag={tag} />
        </FormWrapper>
      )}
    </div>
  );
};

export default EditTag;
