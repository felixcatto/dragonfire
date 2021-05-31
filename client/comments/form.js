import React from 'react';
import { Formik, Form } from 'formik';
import { omit } from 'lodash';
import { useStore } from 'effector-react';
import { useContext } from '../lib/context';
import { ErrorMessage, Field, emptyObject } from '../lib/utils';

export default ({ backButton, afterSubmit, articleId, comment = emptyObject, type = 'add' }) => {
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
      } else {
        await axios.put(getApiUrl('comment', { id: articleId, commentId: comment.id }), newValues);
      }
      await afterSubmit();
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

        {backButton}
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </Form>
    </Formik>
  );
};
