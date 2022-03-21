import { Form, Formik } from 'formik';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { ErrorMessage, Field, FormWrapper, SubmitBtn, useContext } from '../lib/utils';

const LoginForm = () => {
  const { actions } = useContext();
  const history = useHistory();
  const [apiErrors, setApiErrors] = React.useState({});

  const onSubmit = async values => {
    try {
      await actions.signIn(values);
      history.push(getUrl('home'));
    } catch (e) {
      setApiErrors(e.response.data.errors);
    }
  };

  return (
    <div>
      <h3>Login form</h3>
      <FormWrapper apiErrors={apiErrors} setApiErrors={setApiErrors}>
        <Formik initialValues={{ email: '', password: '' }} onSubmit={onSubmit}>
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
            <SubmitBtn className="btn btn-primary">Sign in</SubmitBtn>
          </Form>
        </Formik>
      </FormWrapper>
    </div>
  );
};

export default LoginForm;
