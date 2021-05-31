import React from 'react';
import { format, parseISO } from 'date-fns';
import { isEmpty } from 'lodash';
import { Link, useParams } from 'react-router-dom';
import { useStore } from 'effector-react';
import { userRolesToIcons, roles, makeEnum, usePageSwitch, emptyObject } from '../lib/utils';
import { useContext } from '../lib/context';
import { getUrl } from '../lib/routes';
import s from './styles.module.scss';
import CommentForm from '../comments/form';

const ShowArticle = ({ setPageState, pages, article, getArticle }) => {
  const { id: articleId } = useParams();
  const { $session, axios, getApiUrl } = useContext();
  const { isBelongsToUser } = useStore($session);

  const updateArticle = async () => getArticle().then(data => setPageState({ article: data }));
  const deleteComment = ({ id, commentId }) => async () => {
    await axios.delete(getApiUrl('comment', { id, commentId }));
    await updateArticle();
  };

  const editComment = commentId => () => setPageState({ page: pages.editForm, commentId, article });

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
          {article.comments.map(comment => (
            <div key={comment.id} className="mb-15">
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
                      onClick={deleteComment({ id: article.id, commentId: comment.id })}
                    ></i>
                  </div>
                )}
              </div>
              <div className="text-justify">{comment.text}</div>
              <div className="text-light">
                {format(parseISO(comment.created_at), 'dd MMM yyyy HH:mm')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-10">Leave a comment</div>

      <CommentForm
        backButton={
          <Link to={getUrl('articles')} className="mr-10">
            Back
          </Link>
        }
        afterSubmit={updateArticle}
        articleId={articleId}
      />
    </div>
  );
};

const EditComment = ({ commentId, setPageState, pages, getArticle }) => {
  const { getApiUrl, axios } = useContext();
  const { id } = useParams();
  const [comment, setComment] = React.useState(emptyObject);

  const updateArticle = async () =>
    getArticle().then(data => setPageState({ page: pages.article, article: data }));

  React.useEffect(() => {
    axios(getApiUrl('comment', { id, commentId })).then(data => setComment(data));
  }, []);

  if (isEmpty(comment)) return null;

  return (
    <div>
      <h3>Edit Comment</h3>
      <CommentForm
        backButton={
          <div className="btn-link mr-10" onClick={() => setPageState({ page: pages.article })}>
            Back
          </div>
        }
        afterSubmit={updateArticle}
        type="edit"
        comment={comment}
        articleId={id}
      />
    </div>
  );
};

const PageSwitch = () => {
  const { axios, getApiUrl } = useContext();
  const { id } = useParams();
  const pages = makeEnum(['article', 'editForm']);
  const getArticle = async () => axios({ url: getApiUrl('article', { id }) });

  const { setPageState, renderPage } = usePageSwitch({
    pages,
    components: {
      [pages.article]: ShowArticle,
      [pages.editForm]: EditComment,
    },
    state: {
      page: pages.article,
      commentId: null,
      article: null,
      getArticle,
    },
  });

  React.useEffect(() => {
    getArticle().then(data => setPageState({ article: data }));
  }, [id]);

  return renderPage();
};

export default PageSwitch;
