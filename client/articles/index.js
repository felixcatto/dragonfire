import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'effector-react';
import { asyncStates } from '../lib/utils';
import { useContext } from '../lib/context';
import { getUrl } from '../lib/routes';
import { loadArticlesData } from '../common/generalSlice';

const Articles = () => {
  const {
    $session,
    $articles,
    $users,
    $tags,
    $articlesTags,
    $articlesList,
    actions,
    getApiUrl,
  } = useContext();

  const articles = useStore($articles);
  const users = useStore($users);
  const tags = useStore($tags);
  const articlesTags = useStore($articlesTags);
  const articlesList = useStore($articlesList);
  const { isSignedIn, isBelongsToUser } = useStore($session);
  console.log(articlesList);

  const deleteArticle = id => async () => actions.removeArticle(id);

  React.useEffect(() => {
    loadArticlesData({ articles, users, tags, articlesTags, actions });
  }, []);

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
          {articlesList.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td className="text-justify">{article.text}</td>
              <td>{article.author?.name}</td>
              <td>{article.tags.map(tag => tag.name).join(', ')}</td>
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
