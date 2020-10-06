import React from 'react';
import Layout from '../common/layout';
import { Link } from '../lib/utils';

export default ({ getApiUrl, tags, isSignedIn }) => (
  <Layout>
    <h3>Tags List</h3>

    {isSignedIn && (
      <a href={getApiUrl('newTag')} className="d-inline-block mb-30">
        <button className="btn btn-primary">Create new tag</button>
      </a>
    )}

    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          {isSignedIn && <th className="text-right">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {tags.map(tag => (
          <tr key={tag.id}>
            <td>{tag.name}</td>
            {isSignedIn && (
              <td>
                <div className="d-flex justify-content-end">
                  <a href={getApiUrl('editTag', { id: tag.id })} className="mr-10">
                    <button className="btn btn-sm btn-outline-primary">Edit Tag</button>
                  </a>
                  <Link href={getApiUrl('tag', { id: tag.id })} method="delete">
                    <div className="btn btn-sm btn-outline-primary">Remove Tag</div>
                  </Link>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);
