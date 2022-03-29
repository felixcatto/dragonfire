import { useStore } from 'effector-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { getUrl } from '../lib/routes';
import { IArticle } from '../lib/types';
import { useContext, useSWR } from '../lib/utils';

const Articles = () => {
  const { $session, getApiUrl, axios } = useContext();
  const { isSignedIn, isBelongsToUser } = useStore($session);
  const { data: articles, mutate } = useSWR<IArticle[]>(getApiUrl('articles'));

  const deleteArticle = id => async () => {
    await axios.delete(getApiUrl('article', { id }));
    mutate();
  };

  return (
    <div>
      <h3>Articles List</h3>

      {isSignedIn && (
        <Link to={getUrl('newArticle')} className="d-inline-block mb-30">
          <button className="btn btn-primary">Create new article</button>
        </Link>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Text</th>
            <th>Author</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles?.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td className="text-justify">{article.text}</td>
              <td>{article.author?.name}</td>
              <td>{article.tags?.map(tag => tag.name).join(', ')}</td>
              <td>
                <div className="d-flex justify-content-end">
                  <Link to={getUrl('article', { id: article.id })} className="mr-10">
                    <button className="btn btn-sm btn-outline-primary">Show Article</button>
                  </Link>
                  {isBelongsToUser(article.author_id) && (
                    <>
                      <Link
                        to={getUrl('editArticle', { id: article.id })}
                        className="btn btn-sm btn-outline-primary mr-10"
                      >
                        Edit Article
                      </Link>
                      <div
                        className="btn btn-sm btn-outline-primary"
                        onClick={deleteArticle(article.id)}
                      >
                        Remove Article
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Articles;
