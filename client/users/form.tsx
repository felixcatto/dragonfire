import { Form, Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { emptyObject, ErrorMessage, Field, roles, SubmitBtn } from '../lib/utils';

const UserForm = ({ onSubmit, user = emptyObject }) => {
  return (
    <Formik
      initialValues={{
        name: user.name,
        role: user.role || roles.guest,
        email: user.email,
        password: '',
      }}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="row mb-20">
          <div className="col-6">
            <div className="mb-15">
              <label>Name</label>
              <Field className="form-control" name="name" />
              <ErrorMessage name="name" />
            </div>
            <div className="mb-15">
              <label>Role</label>
              <Field className="form-control" as="select" name="role">
                {Object.values(roles).map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="role" />
            </div>
            <div className="mb-15">
              <label>Email</label>
              <Field className="form-control" name="email" />
              <ErrorMessage name="email" />
            </div>
            <div>
              <label>Password</label>
              <Field className="form-control" type="password" name="password" />
              <ErrorMessage name="password" />
            </div>
          </div>
        </div>

        <Link to={getUrl('users')} className="mr-10">
          Back
        </Link>
        <SubmitBtn className="btn btn-primary">Save</SubmitBtn>
      </Form>
    </Formik>
  );
};

export default UserForm;
