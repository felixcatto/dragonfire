import React from 'react';
import Context from '../lib/context';
import { Error } from '../lib/utils';
import TagsSelect from '../components/tagsSelect';

export default ({ article, tags, method = 'post' }) => {
  const { getApiUrl } = React.useContext(Context);
  const action = method === 'put' ? getApiUrl('article', { id: article.id }) : getApiUrl('articles');

  const transformTag = tag => ({ value: tag.id, label: tag.name });
  const tagsForSelect = tags.map(transformTag);
  const selectedTags = article.tags?.map?.(transformTag);

  return (
    <form action={action} method="post">
      <input type="hidden" name="_method" value={method} />
      <div className="row mb-20">
        <div className="col-6">
          <div className="mb-15">
            <label>Title</label>
            <input type="text" className="form-control" name="title" defaultValue={article.title} />
            <Error entity={article} path="title" />
          </div>
          <div className="mb-15">
            <label>Text</label>
            <textarea className="form-control" name="text" defaultValue={article.text} />
          </div>
          <div className="mb-0">
            <label>Tags</label>
            <TagsSelect tags={tagsForSelect} selectedTags={selectedTags} />
          </div>
        </div>
      </div>

      <a href={getApiUrl('articles')} className="mr-10">
        Back
      </a>
      <button className="btn btn-primary" type="submit">
        Save
      </button>
    </form>
  );
};
