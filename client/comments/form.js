import React from 'react';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import { omit } from 'lodash';
import { useStore } from 'effector-react';
import { useContext, ErrorMessage, Field, emptyObject, SubmitBtn } from '../lib/utils';
import { getUrl } from '../lib/routes';

export default React.forwardRef((props, ref) => {
  const { afterSubmit, articleId, comment = emptyObject, type = 'add' } = props;
  const { $session, axios, getApiUrl } = useContext();
  const { isSignedIn } = useStore($session);
  const isNewCommentForm = type === 'add';
  const canShowGuestName =
    (isNewCommentForm && !isSignedIn) || (!isNewCommentForm && !comment.author_id);

  const onSubmit = async (values, fmActions) => {
    const newValues = canShowGuestName ? values : omit(values, 'guest_name');
    try {
      if (isNewCommentForm) {
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
      <Form ref={ref}>
        <div className="row">
          <div className="col-6">
            {canShowGuestName && (
              <div className="mb-15">
                <label>Guest name</label>
                <Field className="form-control" name="guest_name" />
                <ErrorMessage name="guest_name" />
              </div>
            )}
            <div>
              {isNewCommentForm && <label>Text</label>}
              <Field as="textarea" className="form-control" name="text" />
              <ErrorMessage name="text" />
            </div>
          </div>
        </div>

        {isNewCommentForm && (
          <div className="mt-20">
            <Link to={getUrl('articles')} className="mr-10">
              Back
            </Link>

            <SubmitBtn className="btn btn-primary">Save</SubmitBtn>
          </div>
        )}
      </Form>
    </Formik>
  );
});
