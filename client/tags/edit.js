import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext } from '../lib/context';
import Form from './form';
import { emptyObject, useImmerState, asyncStates } from '../lib/utils';

const EditTag = () => {
  const { getApiUrl } = useContext();
  const { id } = useParams();
  const [state, setState] = useImmerState({ tag: emptyObject, status: asyncStates.idle });
  const { tag, status } = state;

  React.useEffect(() => {
    axios({ url: getApiUrl('tag', { id }) })
      .then(({ data }) => {
        setState({ tag: data, status: asyncStates.resolved });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  }, []);

  return (
    <div>
      <h3>Edit Tag</h3>
      {status === asyncStates.resolved && <Form method="put" tag={tag} />}
    </div>
  );
};

export default EditTag;
