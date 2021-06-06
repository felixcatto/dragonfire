import React from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useStore } from 'effector-react';
import { useContext, useImmerState } from '../lib/utils';
import Form from './form';

const EditArticle = () => {
  const { getApiUrl, axios, $session } = useContext();
  const { id } = useParams();
  const { isBelongsToUser } = useStore($session);
  const [{ article, tags }, setState] = useImmerState({ article: null, tags: [] });

  React.useEffect(() => {
    Promise.all([
      axios.get(getApiUrl('article', { id })),
      axios.get(getApiUrl('tags')),
    ]).then(([articleData, tagsData]) => setState({ article: articleData, tags: tagsData }));
  }, []);

  if (isEmpty(article)) return null;
  if (!isBelongsToUser(article.author_id)) return '403 forbidden';

  return (
    <div>
      <h3>Edit Article</h3>
      <Form type="edit" article={article} tags={tags} />
    </div>
  );
};

export default EditArticle;
