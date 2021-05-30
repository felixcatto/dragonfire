import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useContext } from '../lib/context';
import { getUrl } from '../lib/routes';
import { ErrorMessage, Field, emptyObject } from '../lib/utils';

const LoginForm = () => {
  const { getApiUrl, actions } = useContext();
  const history = useHistory();

  const onSubmit = async (values, fmActions) => {
    try {
      await actions.signIn(values);
      history.push(getUrl('home'));
    } catch (e) {
      fmActions.setStatus({ apiErrors: e.response.data.errors });
    }
  };

  return (
    <div>
      <h3>Login form</h3>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={onSubmit}
        initialStatus={{ apiErrors: {} }}
      >
        <Form>
          <div className="row mb-20">
            <div className="col-6">
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

          <Link to={getUrl('home')} className="mr-10">
            Cancel
          </Link>
          <button className="btn btn-primary" type="submit">
            Sign in
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
