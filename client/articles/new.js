import React from 'react';
import { isEmpty } from 'lodash';
import Form from './form';
import { useContext } from '../lib/utils';

const NewArticle = () => {
  const { getApiUrl, axios } = useContext();
  const [tags, setTags] = React.useState(null);

  React.useEffect(() => {
    axios.get(getApiUrl('tags')).then(data => setTags(data));
  }, []);

  return (
    <div>
      <h3>Create New Article</h3>
      {!isEmpty(tags) && <Form tags={tags} />}
    </div>
  );
};

export default NewArticle;
