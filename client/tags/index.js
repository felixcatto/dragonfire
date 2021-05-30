import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'effector-react';
import { asyncStates } from '../lib/utils';
import { useContext } from '../lib/context';
import { getUrl } from '../lib/routes';

const Tags = () => {
  const { $session, $tags, actions } = useContext();
  const tags = useStore($tags);
  const { isSignedIn } = useStore($session);
  console.log(tags);

  const deleteTag = id => async () => actions.deleteTag(id);

  React.useEffect(() => {
    if (tags.status === asyncStates.idle) {
      actions.loadTags();
    }
  }, []);

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
          {tags.data.map(tag => (
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
