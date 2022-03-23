import { useStore } from 'effector-react';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { FormWrapper, useContext, useImmerState } from '../lib/utils';
import Form from './form';

const EditArticle = () => {
  const history = useHistory();
  const { getApiUrl, axios, $session } = useContext();
  const { id } = useParams();
  const { isBelongsToUser } = useStore($session);
  const [{ article, tags }, setState] = useImmerState({ article: null, tags: [] });
  const [apiErrors, setApiErrors] = React.useState({});

  React.useEffect(() => {
    Promise.all([axios.get(getApiUrl('article', { id })), axios.get(getApiUrl('tags'))]).then(
      ([articleData, tagsData]) => setState({ article: articleData, tags: tagsData })
    );
  }, []);

  const onSubmit = async values => {
    try {
      await axios.put(getApiUrl('article', { id: article.id }), values);
      history.push(getUrl('articles'));
    } catch (e) {
      setApiErrors(e.response.data.errors);
    }
  };

  if (isEmpty(article)) return null;
  if (!isBelongsToUser(article.author_id)) return '403 forbidden';

  return (
    <div>
      <h3>Edit Article</h3>
      <FormWrapper apiErrors={apiErrors} setApiErrors={setApiErrors}>
        <Form article={article} tags={tags} onSubmit={onSubmit} />
      </FormWrapper>
    </div>
  );
};

export default EditArticle;
