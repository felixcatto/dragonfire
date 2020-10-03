export default {
  root: '/',
  users: {
    index: '/users',
    new: '/users/new',
    edit: '/users/:id/edit',
    editUrl: id => `/users/${id}/edit`,
  },
};
