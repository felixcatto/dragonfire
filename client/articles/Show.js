import React from 'react';
import { format, parseISO } from 'date-fns';
import { isEmpty } from 'lodash';
import Layout from '../common/layout';
import { Link, userRolesToIcons, roles } from '../lib/utils';
import CommentForm from '../comments/form';
import s from './styles.module.scss';

export default ({ urlFor, isBelongsToUser, article, newComment }) => (
  <Layout>
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
                  <a
                    href={urlFor('editComment', { id: article.id, commentId: comment.id })}
                    className="fa fa-edit fa_big fa_link"
                    title="edit"
                  ></a>
                  <Link
                    href={urlFor('comment', { id: article.id, commentId: comment.id })}
                    method="delete"
                  >
                    <i className="fa fa-trash-alt fa_big fa_link" title="delete"></i>
                  </Link>
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
      comment={newComment}
      action={urlFor('comments', { id: article.id })}
      backUrl={urlFor('articles')}
    />
  </Layout>
);
