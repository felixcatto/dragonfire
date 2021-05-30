import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useStore } from 'effector-react';
import { Formik, Form } from 'formik';
import { useContext } from '../lib/context';
import { ErrorMessage, Field, emptyObject, asyncStates, MultiSelect } from '../lib/utils';
import { getUrl } from '../lib/routes';

export default ({ article = emptyObject, type = 'add' }) => {
  const history = useHistory();
  const { $tags, actions } = useContext();
  const tags = useStore($tags);

  React.useEffect(() => {
    if (tags.status === asyncStates.idle) {
      actions.loadTags();
    }
  }, []);

  if (tags.status !== asyncStates.resolved) return null;

  const transformTag = tag => ({ value: tag.id, label: tag.name });
  const tagsForSelect = tags.data.map(transformTag);
  const articleTags = article.tags || [];
  const selectedTags = articleTags.map(transformTag);
  const tagIds = articleTags.map(tag => tag.id);

  const onSubmit = async (values, fmActions) => {
    try {
      if (type === 'add') {
        await actions.addArticle(values);
      } else {
        await actions.editArticle({ id: article.id, values });
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
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </Form>
    </Formik>
  );
};
