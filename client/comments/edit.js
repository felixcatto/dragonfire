import React from 'react';
import Layout from '../common/layout';
import Form from './form';

export default ({ comment, getApiUrl }) => (
  <Layout>
    <h3>Edit Comment</h3>
    <Form
      comment={comment}
      action={getApiUrl('comment', { id: comment.article_id, commentId: comment.id })}
      backUrl={getApiUrl('article', { id: comment.article_id })}
      method="put"
    />
  </Layout>
);
