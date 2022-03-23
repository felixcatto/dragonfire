import { format, parseISO } from 'date-fns';
import { useStore } from 'effector-react';
import { isEmpty, omit } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import CommentForm from '../comments/form';
import {
  FormWrapper,
  roles,
  useContext,
  useImmerState,
  userRolesToIcons,
  useSWR,
} from '../lib/utils';
import s from './styles.module.scss';

const ShowComment = ({ comment, articleId, isBelongsToUser, editComment, deleteComment }) => (
  <div className="mb-15">
    <div className="d-flex align-items-center">
      {comment.author ? (
        <div className="d-flex align-items-center">
          <i className={userRolesToIcons[comment.author.role]}></i>
          <div className="steelblue ml-5">{comment.author.name}</div>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <i className={userRolesToIcons[roles.guest]}></i>
          <div className="steelblue ml-5">{comment.guest_name}</div>
        </div>
      )}
      {isBelongsToUser(comment.author_id) && (
        <div className="ml-30">
          <i
            className="fa fa-edit fa_big fa_link"
            title="edit"
            onClick={editComment(comment.id)}
          ></i>
          <i
            className="fa fa-trash-alt fa_big fa_link"
            title="delete"
            onClick={deleteComment({ articleId, commentId: comment.id })}
          ></i>
        </div>
      )}
    </div>
    <div className="text-justify">{comment.text}</div>
    <div className="text-light">{format(parseISO(comment.created_at), 'dd MMM yyyy HH:mm')}</div>
  </div>
);

const EditComment = ({ comment, cancelEditingComment, saveEditedComment }) => {
  const formRef: any = React.useRef(null);
  const saveComment = () => formRef.current.requestSubmit();

  return (
    <div className="mb-15">
      <div className="d-flex align-items-center">
        {comment.author ? (
          <div className="d-flex align-items-center">
            <i className={userRolesToIcons[comment.author.role]}></i>
            <div className="steelblue ml-5">{comment.author.name}</div>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <i className={userRolesToIcons[roles.guest]}></i>
            <div className="steelblue ml-5">{comment.guest_name}</div>
          </div>
        )}
        <div className="ml-30">
          <i
            className="fa fa-undo-alt fa_big fa_link"
            title="edit"
            onClick={cancelEditingComment}
          ></i>
          <i className="fa fa-save fa_big fa_link" title="save" onClick={saveComment}></i>
        </div>
      </div>
      <CommentForm type="edit" comment={comment} ref={formRef} onSubmit={saveEditedComment} />
      <div className="text-light">{format(parseISO(comment.created_at), 'dd MMM yyyy HH:mm')}</div>
    </div>
  );
};

const ShowArticle = () => {
  const { id: articleId } = useParams();
  const { $session, axios, getApiUrl } = useContext();
  const { isBelongsToUser, isSignedIn } = useStore($session);
  const { data: article, mutate } = useSWR(getApiUrl('article', { id: articleId }));
  const [{ editedCommentId }, setState] = useImmerState({ editedCommentId: null });
  const [apiErrorsForNewCommentForm, setApiErrorsForNewCommentForm] = React.useState({});
  const [apiErrorsForEditCommentForm, setApiErrorsForEditCommentForm] = React.useState({});

  const deleteComment =
    ({ articleId: id, commentId }) =>
    async () => {
      await axios.delete(getApiUrl('comment', { id, commentId }));
      await mutate();
    };
  const editComment = commentId => () => setState({ editedCommentId: commentId });
  const cancelEditingComment = () => setState({ editedCommentId: null });

  const saveNewComment = async (values, fmActions) => {
    const canShowGuestName = !isSignedIn;
    const newValues = canShowGuestName ? values : omit(values, 'guest_name');
    try {
      await axios.post(getApiUrl('comments', { id: articleId }), newValues);
      fmActions.setFieldValue('text', '');
      await mutate();
    } catch (e) {
      setApiErrorsForNewCommentForm(e.response.data.errors);
    }
  };

  const saveEditedComment = comment => async values => {
    const canShowGuestName = !comment.author_id;
    const newValues = canShowGuestName ? values : omit(values, 'guest_name');
    try {
      await axios.put(getApiUrl('comment', { id: articleId, commentId: comment.id }), newValues);
      setState({ editedCommentId: null });
      await mutate();
    } catch (e) {
      setApiErrorsForEditCommentForm(e.response.data.errors);
    }
  };

  if (isEmpty(article)) return null;

  return (
    <div>
      <div className="d-flex align-items-center mb-10">
        <h3 className="mr-20 mb-0">{article.title}</h3>
        {article.author && (
          <div className="d-flex align-items-center">
            <div className="steelblue mr-5">{article.author.name}</div>
            <i className={userRolesToIcons[article.author.role]}></i>
          </div>
        )}
      </div>

      <p className="text-justify mb-30">{article.text}</p>

      {!isEmpty(article.tags) && (
        <div className={s.articleTags}>
          <div className="text-light mr-10">Tags:</div>
          {article.tags.map(tag => (
            <div key={tag.id} className={s.articleTag}>
              {tag.name}
            </div>
          ))}
        </div>
      )}

      {article.comments && (
        <div className="mb-30">
          <FormWrapper
            apiErrors={apiErrorsForEditCommentForm}
            setApiErrors={setApiErrorsForEditCommentForm}
          >
            {article.comments.map(comment =>
              comment.id === editedCommentId ? (
                <EditComment
                  key={comment.id}
                  comment={comment}
                  cancelEditingComment={cancelEditingComment}
                  saveEditedComment={saveEditedComment(comment)}
                />
              ) : (
                <ShowComment
                  key={comment.id}
                  comment={comment}
                  articleId={articleId}
                  isBelongsToUser={isBelongsToUser}
                  editComment={editComment}
                  deleteComment={deleteComment}
                />
              )
            )}
          </FormWrapper>
        </div>
      )}

      <div className="mb-10">Leave a comment</div>

      <FormWrapper
        apiErrors={apiErrorsForNewCommentForm}
        setApiErrors={setApiErrorsForNewCommentForm}
      >
        <CommentForm onSubmit={saveNewComment} />
      </FormWrapper>
    </div>
  );
};

export default ShowArticle;
