import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'effector-react';
import { useContext, useSWR } from '../lib/utils';
import { getUrl } from '../lib/routes';

const Tags = () => {
  const { $session, getApiUrl, axios, ssrData } = useContext();
  const { isSignedIn } = useStore($session);
  const { data: tags, mutate } = useSWR(getApiUrl('tags'), { initialData: ssrData.tags });
  console.log(tags);

  const deleteTag = id => async () => {
    await axios.delete(getApiUrl('tag', { id }));
    mutate();
  };

  return (
    <div>
      <h3>Tags List</h3>

      {isSignedIn && (
        <Link to={getUrl('newTag')} className="d-inline-block mb-30">
          <button className="btn btn-primary">Create new tag</button>
        </Link>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            {isSignedIn && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tags?.map(tag => (
            <tr key={tag.id}>
              <td>{tag.name}</td>
              {isSignedIn && (
                <td>
                  <div className="d-flex justify-content-end">
                    <Link
                      to={getUrl('editTag', { id: tag.id })}
                      className="btn btn-sm btn-outline-primary mr-10"
                    >
                      Edit Tag
                    </Link>
                    <div className="btn btn-sm btn-outline-primary" onClick={deleteTag(tag.id)}>
                      Remove Tag
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tags;
