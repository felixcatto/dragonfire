import React from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useStore } from 'effector-react';
import { useContext } from '../lib/context';
import Form from './form';
import { emptyObject, qb } from '../lib/utils';

const EditArticle = () => {
  const { getApiUrl, axios, $articles, $articlesTags, $tags, $session } = useContext();
  const { id } = useParams();
  const { data: articles } = useStore($articles);
  const { data: articlesTags } = useStore($articlesTags);
  const { data: tags } = useStore($tags);
  const { isBelongsToUser } = useStore($session);

  const cashArticle = articles.find(el => el.id === +id);
  if (cashArticle) {
    cashArticle.tags = qb(cashArticle).rowToMany(articlesTags, tags, 'id=article_id, tag_id=id');
  }

  const [article, setArticle] = React.useState(cashArticle || emptyObject);

  React.useEffect(() => {
    if (isEmpty(article)) {
      axios({ url: getApiUrl('article', { id }) }).then(data => setArticle(data));
    }
  }, []);

  if (isEmpty(article)) return null;
  if (!isBelongsToUser(article.author_id)) return '403 forbidden';

  return (
    <div>
      <h3>Edit Article</h3>
      <Form type="edit" article={article} />
    </div>
  );
};

export default EditArticle;
