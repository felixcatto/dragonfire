import React from 'react';
import { format, parseISO } from 'date-fns';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import { useStore } from 'effector-react';
import { userRolesToIcons, roles, useImmerState, useContext, useSWR } from '../lib/utils';
import s from './styles.module.scss';
import CommentForm from '../comments/form';

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
            onClick={deleteComment({ id: articleId, commentId: comment.id })}
          ></i>
        </div>
      )}
    </div>
    <div className="text-justify">{comment.text}</div>
    <div className="text-light">{format(parseISO(comment.created_at), 'dd MMM yyyy HH:mm')}</div>
  </div>
);

const EditComment = ({ comment, articleId, hideEditedComment, afterSaveComment }) => {
  const formRef = React.useRef(null);
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
          <i className="fa fa-undo-alt fa_big fa_link" title="edit" onClick={hideEditedComment}></i>
          <i className="fa fa-save fa_big fa_link" title="save" onClick={saveComment}></i>
        </div>
      </div>
      <CommentForm
        type="edit"
        comment={comment}
        articleId={articleId}
        ref={formRef}
        afterSubmit={afterSaveComment}
      />
      <div className="text-light">{format(parseISO(comment.created_at), 'dd MMM yyyy HH:mm')}</div>
    </div>
  );
};

const ShowArticle = () => {
  const { id } = useParams();
  const { $session, axios, getApiUrl } = useContext();
  const { isBelongsToUser } = useStore($session);
  const { data: article, mutate } = useSWR(getApiUrl('article', { id }));
  const [{ editedCommentId }, setState] = useImmerState({ editedCommentId: null });

  const afterSaveComment = async () => {
    await mutate();
    setState({ editedCommentId: null });
  };
  const deleteComment = ({ id: articleId, commentId }) => async () => {
    await axios.delete(getApiUrl('comment', { id: articleId, commentId }));
    await mutate();
  };
  const editComment = commentId => () => setState({ editedCommentId: commentId });
  const hideEditedComment = () => setState({ editedCommentId: null });

  if (isEmpty(article)) return null;
  console.log(article);

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
          {article.comments.map(comment =>
            comment.id === editedCommentId ? (
              <EditComment
                key={comment.id}
                comment={comment}
                articleId={id}
                hideEditedComment={hideEditedComment}
                afterSaveComment={afterSaveComment}
              />
            ) : (
              <ShowComment
                key={comment.id}
                comment={comment}
                articleId={id}
                isBelongsToUser={isBelongsToUser}
                editComment={editComment}
                deleteComment={deleteComment}
              />
            )
          )}
        </div>
      )}

      <div className="mb-10">Leave a comment</div>

      <CommentForm afterSubmit={mutate} articleId={id} />
    </div>
  );
};

export default ShowArticle;
