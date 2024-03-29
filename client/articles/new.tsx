import { isNull } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { FormWrapper, useContext } from '../lib/utils';
import Form from './form';
import { ITag } from '../lib/types';

const NewArticle = () => {
  const history = useHistory();
  const { getApiUrl, axios } = useContext();
  const [tags, setTags] = React.useState<ITag[] | null>(null);
  const [apiErrors, setApiErrors] = React.useState({});

  React.useEffect(() => {
    axios.get(getApiUrl('tags')).then((data: ITag[]) => setTags(data));
  }, []);

  const onSubmit = async values => {
    try {
      await axios.post(getApiUrl('articles'), values);
      history.push(getUrl('articles'));
    } catch (e) {
      setApiErrors(e.response.data.errors);
    }
  };

  return (
    <div>
      <h3>Create New Article</h3>
      {!isNull(tags) && (
        <FormWrapper apiErrors={apiErrors} setApiErrors={setApiErrors}>
          <Form tags={tags} onSubmit={onSubmit} />
        </FormWrapper>
      )}
    </div>
  );
};

export default NewArticle;
