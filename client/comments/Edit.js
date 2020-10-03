import React from 'react';
import Layout from '../common/layout';
import Form from './form';

export default ({ comment, urlFor }) => (
  <Layout>
    <h3>Edit Comment</h3>
    <Form
      comment={comment}
      action={urlFor('comment', { id: comment.article_id, commentId: comment.id })}
      backUrl={urlFor('article', { id: comment.article_id })}
      method="put"
    />
  </Layout>
);
