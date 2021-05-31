import React from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useStore } from 'effector-react';
import { useContext } from '../lib/context';
import Form from './form';
import { getUrl } from '../lib/routes';
import { emptyObject, useImmerState } from '../lib/utils';

const EditComment = () => {
  const { getApiUrl, axios } = useContext();
  const { id, commentId } = useParams();
  const [comment, setComment] = React.useState(emptyObject);

  React.useEffect(() => {
    if (isEmpty(comment)) {
      axios(getApiUrl('comment', { id, commentId }))
        .then(data => setComment(data))
        .catch(({ response }) => console.log(response));
    }
  }, []);

  if (isEmpty(comment)) return null;

  return (
    <div>
      <h3>Edit Comment</h3>
      <Form
        backUrl={getUrl('article', { id: comment.article_id })}
        afterSubmit={() => {}}
        type="edit"
        comment={comment}
      />
    </div>
  );
};

export default EditComment;
