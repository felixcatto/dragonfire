import { createStore, createEffect } from 'effector';
import { asyncStates } from '../lib/utils';

export const makeTagActions = ({ getApiUrl, axios }) => ({
  loadTags: createEffect(async () => axios.get(getApiUrl('tags'))),
  addTag: createEffect(async values => axios.post(getApiUrl('tags'), values)),
  editTag: createEffect(async ({ id, values }) => axios.put(getApiUrl('tag', { id }), values)),
  deleteTag: createEffect(async id => axios.delete(getApiUrl('tag', { id }))),
});

export const makeTags = (
  actions,
  initialState = {
    data: [],
    status: asyncStates.idle,
    errors: null,
  }
) =>
  createStore(initialState)
    .on(actions.loadTags, state => ({
      data: state.data,
      status: asyncStates.pending,
      errors: null,
    }))
    .on(actions.loadTags.done, (state, { result }) => ({
      data: result,
      status: asyncStates.resolved,
      errors: null,
    }))
    .on(actions.addTag.done, (state, { result: tag }) => ({
      ...state,
      data: state.data.concat(tag),
    }))
    .on(actions.editTag.done, (state, { result: tag }) => ({
      ...state,
      data: state.data.filter(el => el.id !== tag.id).concat(tag),
    }))
    .on(actions.deleteTag.done, (state, { result }) => ({
      ...state,
      data: state.data.filter(el => el.id !== +result.id),
    }));
