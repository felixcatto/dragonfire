import React from 'react';
import Layout from '../common/layout';
import Form from './form';

export default ({ tag }) => (
  <Layout>
    <h3>Edit Tag</h3>
    <Form tag={tag} method="put" />
  </Layout>
);
