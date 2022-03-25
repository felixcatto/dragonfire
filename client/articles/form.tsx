import { Form, Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { IArticle, IEmptyObject, ITag } from '../lib/types';
import { ErrorMessage, Field, MultiSelect, SubmitBtn } from '../lib/utils';

interface IForm {
  onSubmit: any;
  tags: ITag[];
  article?: IArticle | IEmptyObject;
}

export default (props: IForm) => {
  const { onSubmit, tags, article = {} } = props;
  const transformTag = tag => ({ value: tag.id, label: tag.name });
  const tagsForSelect = tags.map(transformTag);
  const articleTags = article.tags || [];
  const selectedTags = articleTags.map(transformTag);
  const tagIds = articleTags.map(tag => tag.id);

  return (
    <Formik
      initialValues={{
        title: article.title,
        text: article.text,
        tagIds,
      }}
      onSubmit={onSubmit}
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
