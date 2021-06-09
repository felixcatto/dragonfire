import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'effector-react';
import { useContext } from '../lib/context';
import { getUrl } from '../lib/routes';
import { loadArticlesData } from '../common/generalSlice';
import { asyncStates } from '../lib/utils';

const Articles = () => {
  const {
    $session,
    $articles,
    $users,
    $tags,
    $articlesTags,
    $articlesList,
    actions,
  } = useContext();

  const articlesStatus = useStore($articles.map(el => el.status));
  const usersStatus = useStore($users.map(el => el.status));
  const tagsStatus = useStore($tags.map(el => el.status));
  const articlesTagsStatus = useStore($articlesTags.map(el => el.status));
  const articlesList = useStore($articlesList);
  const { isSignedIn, isBelongsToUser } = useStore($session);

  React.useEffect(() => {
    loadArticlesData({ articlesStatus, usersStatus, tagsStatus, articlesTagsStatus, actions });
  }, []);

  const isDataLoaded = [articlesStatus, usersStatus, tagsStatus, articlesTagsStatus].every(
    status => status === asyncStates.resolved
  );
  if (!isDataLoaded) return null;
  console.log(articlesList);

  const deleteArticle = id => async () => actions.deleteArticle(id);

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
