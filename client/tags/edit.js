import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext } from '../lib/context';
import Form from './form';
import { emptyObject, useImmerState } from '../lib/utils';
import { isEmpty } from 'lodash';
import { useStore } from 'effector-react';

const EditTag = () => {
  const { getApiUrl, $tags } = useContext();
  const { id } = useParams();
  const { data: tags } = useStore($tags);
  const [state, setState] = useImmerState({
    tag: tags.find(tag => tag.id === +id) || emptyObject,
  });
  const { tag } = state;

  React.useEffect(() => {
    if (isEmpty(tag)) {
      axios({ url: getApiUrl('tag', { id }) })
        .then(({ data }) => setState({ tag: data }))
        .catch(({ response }) => console.log(response));
    }
  }, []);

  return (
    <div>
      <h3>Edit Tag</h3>
      {!isEmpty(tag) && <Form method="put" tag={tag} />}
    </div>
  );
};

export default EditTag;
