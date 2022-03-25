import { useStore } from 'effector-react';
import { Form, Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { IComment, IEmptyObject } from '../lib/types';
import {  ErrorMessage, Field, SubmitBtn, useContext } from '../lib/utils';

interface IForm {
  onSubmit: any;
  type?: any;
  comment?: IComment | IEmptyObject;
}

const CommentsForm = (props: IForm, ref) => {
  const { onSubmit, comment = {}, type = 'add' } = props;
  const { $session } = useContext();
  const { isSignedIn } = useStore($session);
  const isNewCommentForm = type === 'add';
  const canShowGuestName =
    (isNewCommentForm && !isSignedIn) || (!isNewCommentForm && !comment.author_id);

  return (
    <Formik
      initialValues={{ guest_name: comment.guest_name, text: comment.text }}
      onSubmit={onSubmit}
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
};

export default React.forwardRef(CommentsForm);
