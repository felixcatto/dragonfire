import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useContext, ErrorMessage, Field, emptyObject, MultiSelect, SubmitBtn } from '../lib/utils';
import { getUrl } from '../lib/routes';

export default ({ tags, article = emptyObject, type = 'add' }) => {
  const history = useHistory();
  const { axios, getApiUrl } = useContext();

  const transformTag = tag => ({ value: tag.id, label: tag.name });
  const tagsForSelect = tags.map(transformTag);
  const articleTags = article.tags || [];
  const selectedTags = articleTags.map(transformTag);
  const tagIds = articleTags.map(tag => tag.id);

  const onSubmit = async (values, fmActions) => {
    try {
      if (type === 'add') {
        await axios.post(getApiUrl('articles'), values);
      } else {
        await axios.put(getApiUrl('article', { id: article.id }), values);
      }
      history.push(getUrl('articles'));
    } catch (e) {
      fmActions.setStatus({ apiErrors: e.response.data.errors });
    }
  };

  return (
    <Formik
      initialValues={{
        title: article.title,
        text: article.text,
        tagIds,
      }}
      onSubmit={onSubmit}
      initialStatus={{ apiErrors: {} }}
    >
      <Form>
        <div className="row mb-20">
          <div className="col-6">
            <div className="mb-15">
              <label>Title</label>
              <Field className="form-control" name="title" />
              <ErrorMessage name="title" />
            </div>
            <div className="mb-15">
              <label>Text</label>
              <Field className="form-control" as="textarea" name="text" />
            </div>
            <div className="mb-0">
              <label>Tags</label>
              <MultiSelect name="tagIds" defaultValue={selectedTags} options={tagsForSelect} />
            </div>
          </div>
        </div>

        <Link to={getUrl('articles')} className="mr-10">
          Back
        </Link>
        <SubmitBtn className="btn btn-primary">Save</SubmitBtn>
      </Form>
    </Formik>
  );
};
