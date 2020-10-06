import React from 'react';
import Context from '../lib/context';
import { Error } from '../lib/utils';

export default ({ tag, method = 'post' }) => {
  const { getApiUrl } = React.useContext(Context);
  const action = method === 'put' ? getApiUrl('tag', { id: tag.id }) : getApiUrl('tags');

  return (
    <form action={action} method="post">
      <input type="hidden" name="_method" value={method} />
      <div className="row mb-20">
        <div className="col-6">
          <div className="mb-15">
            <label>Name</label>
            <input type="text" className="form-control" name="name" defaultValue={tag.name} />
            <Error entity={tag} path="name" />
          </div>
        </div>
      </div>

      <a href={getApiUrl('tags')} className="mr-10">
        Back
      </a>
      <button className="btn btn-primary" type="submit">
        Save
      </button>
    </form>
  );
};
