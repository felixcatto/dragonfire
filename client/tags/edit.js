import React from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useContext } from '../lib/utils';
import Form from './form';

const EditTag = () => {
  const { getApiUrl, axios } = useContext();
  const { id } = useParams();
  const [tag, setTag] = React.useState(null);

  React.useEffect(() => {
    axios.get(getApiUrl('tag', { id })).then(data => setTag(data));
  }, []);

  return (
    <div>
      <h3>Edit Tag</h3>
      {!isEmpty(tag) && <Form type="edit" tag={tag} />}
    </div>
  );
};

export default EditTag;
