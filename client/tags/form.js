import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useContext, ErrorMessage, Field, emptyObject, SubmitBtn } from '../lib/utils';
import { getUrl } from '../lib/routes';

export default ({ tag = emptyObject, type = 'add' }) => {
  const history = useHistory();
  const { axios, getApiUrl } = useContext();

  const onSubmit = async (values, fmActions) => {
    try {
      if (type === 'add') {
        await axios.post(getApiUrl('tags'), values);
      } else {
        await axios.put(getApiUrl('tag', { id: tag.id }), values);
      }
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
        <SubmitBtn className="btn btn-primary">Save</SubmitBtn>
      </Form>
    </Formik>
  );
};
