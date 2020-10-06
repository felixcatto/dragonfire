import React from 'react';
import Layout from '../common/layout';
import { Link } from '../lib/utils';

export default ({ getApiUrl, articles, isSignedIn, isBelongsToUser }) => (
  <Layout>
    <h3>Articles List</h3>

    {isSignedIn && (
      <a href={getApiUrl('newArticle')} className="d-inline-block mb-30">
        <button className="btn btn-primary">Create new article</button>
      </a>
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
        {articles.map(article => (
          <tr key={article.id}>
            <td>{article.title}</td>
            <td className="text-justify">{article.text}</td>
            <td>{article.author?.name}</td>
            <td>{article.tags.map(tag => tag.name).join(', ')}</td>
            <td>
              <div className="d-flex justify-content-end">
                <a href={getApiUrl('article', { id: article.id })} className="mr-10">
                  <button className="btn btn-sm btn-outline-primary">Show Article</button>
                </a>
                {isBelongsToUser(article.author_id) && (
                  <>
                    <a href={getApiUrl('editArticle', { id: article.id })} className="mr-10">
                      <button className="btn btn-sm btn-outline-primary">Edit Article</button>
                    </a>
                    <Link href={getApiUrl('article', { id: article.id })} method="delete">
                      <div className="btn btn-sm btn-outline-primary">Remove Article</div>
                    </Link>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);
