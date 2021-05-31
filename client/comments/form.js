import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { omit } from 'lodash';
import { useStore } from 'effector-react';
import { useContext } from '../lib/context';
import { ErrorMessage, Field, emptyObject } from '../lib/utils';
import { getUrl } from '../lib/routes';

export default ({ backUrl, afterSubmit, comment = emptyObject, type = 'add' }) => {
  const history = useHistory();
  const { id: articleId } = useParams();
  const { $session, axios, getApiUrl } = useContext();
  const { isSignedIn } = useStore($session);
  const isNewComment = type === 'add';
  const canShowGuestName = (isNewComment && !isSignedIn) || (!isNewComment && !comment.author_id);

  const onSubmit = async (values, fmActions) => {
    const newValues = canShowGuestName ? values : omit(values, 'guest_name');
    try {
      if (type === 'add') {
        await axios.post(getApiUrl('comments', { id: articleId }), newValues);
        fmActions.setFieldValue('text', '');
        await afterSubmit();
      } else {
        await axios.put(getApiUrl('comment', { id: articleId, commentId: comment.id }), newValues);
        await afterSubmit();
        history.push(backUrl);
      }
    } catch (e) {
      fmActions.setStatus({ apiErrors: e.response.data.errors });
    }
  };

  return (
    <Formik
      initialValues={{ guest_name: comment.guest_name, text: comment.text }}
      onSubmit={onSubmit}
      initialStatus={{ apiErrors: {} }}
    >
      <Form>
        <div className="row mb-20">
          <div className="col-6">
            {canShowGuestName && (
              <div className="mb-15">
                <label>Guest name</label>
                <Field className="form-control" name="guest_name" />
                <ErrorMessage name="guest_name" />
              </div>
            )}
            <div>
              <label>Text</label>
              <Field as="textarea" className="form-control" name="text" />
              <ErrorMessage name="text" />
            </div>
          </div>
        </div>

        <Link to={backUrl} className="mr-10">
          Back
        </Link>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </Form>
    </Formik>
  );
};
