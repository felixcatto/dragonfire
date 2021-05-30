import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useContext } from '../lib/context';
import { ErrorMessage, Field,  emptyObject } from '../lib/utils';
import { Formik, Form } from 'formik';
import { getUrl } from '../lib/routes';

export default ({ tag = emptyObject, method = 'post' }) => {
  const history = useHistory();
  const { getApiUrl, axios, actions } = useContext();

  const onSubmit = async (values, fmActions) => {
    const url = method === 'put' ? getApiUrl('tag', { id: tag.id }) : getApiUrl('tags');
    try {
      await axios({ method, url, data: values });
      await actions.loadTags();
      history.push(getUrl('tags'));
    } catch (e) {
      fmActions.setStatus({ apiErrors: e.response.data.errors });
    }
  };

  return (
    <Formik
      initialValues={{ name: tag.name }}
      onSubmit={onSubmit}
      initialStatus={{ apiErrors: {} }}
    >
      <Form>
        <div className="row mb-20">
          <div className="col-6">
            <div className="mb-15">
              <label>Name</label>
              <Field className="form-control" name="name" />
              <ErrorMessage name="name" />
            </div>
          </div>
        </div>

        <Link to={getUrl('tags')} className="mr-10">
          Back
        </Link>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </Form>
    </Formik>
  );
};
