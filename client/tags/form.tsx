import { Form, Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { IEmptyObject, ITag } from '../lib/types';
import { ErrorMessage, Field, SubmitBtn } from '../lib/utils';

interface IForm {
  onSubmit: any;
  tag?: ITag | IEmptyObject;
}

export default (props: IForm) => {
  const { onSubmit, tag = {} } = props;
  return (
    <Formik initialValues={{ name: tag.name }} onSubmit={onSubmit}>
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
