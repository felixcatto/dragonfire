import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useContext } from '../lib/context';
import { ErrorMessage, Field, roles, emptyObject } from '../lib/utils';
import { Formik, Form } from 'formik';
import { getUrl } from '../lib/routes';

const UserForm = ({ user = emptyObject, type = 'add' }) => {
  const history = useHistory();
  const { actions } = useContext();

  const onSubmit = async (values, fmActions) => {
    try {
      if (type === 'add') {
        await actions.addUser(values);
      } else {
        await actions.editUser({ id: user.id, values });
      }
      history.push(getUrl('users'));
    } catch (e) {
      fmActions.setStatus({ apiErrors: e.response.data.errors });
    }
  };

  return (
    <Formik
      initialValues={{
        name: user.name,
        role: user.role || roles.guest,
        email: user.email,
        password: '',
      }}
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
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </Form>
    </Formik>
  );
};

export default UserForm;
