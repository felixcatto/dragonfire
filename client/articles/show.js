import React from 'react';
import { format, parseISO } from 'date-fns';
import { isEmpty } from 'lodash';
import { userRolesToIcons, roles } from '../lib/utils';
import { Link, useParams } from 'react-router-dom';
import { useStore } from 'effector-react';
import { useContext } from '../lib/context';
import { getUrl } from '../lib/routes';
import s from './styles.module.scss';
import CommentForm from '../comments/form';

const ShowArticle = () => {
  const { id } = useParams();
  const { $session, actions, axios, getApiUrl } = useContext();
  const { isBelongsToUser } = useStore($session);
  const [state, setState] = React.useState({ article: {} });
  const { article } = state;

  const loadArticle = async () =>
    axios({ url: getApiUrl('article', { id }) })
      .then(data => setState({ article: data }))
      .catch(({ response }) => console.log(response));

  React.useEffect(() => {
    loadArticle();
  }, [id]);

  if (isEmpty(article)) return null;
  console.log(article);

  const deleteComment = ({ id, commentId }) => async () => {
    await axios.delete(getApiUrl('comment', { id, commentId }));
    await loadArticle();
  };

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
                    <Link
                      to={getUrl('editComment', { id: article.id, commentId: comment.id })}
                      className="fa fa-edit fa_big fa_link"
                      title="edit"
                    ></Link>
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

      <CommentForm backUrl={getUrl('articles')} afterSubmit={loadArticle} />
    </div>
  );
};

export default ShowArticle;
