const babelconfig = require('./babelconfig');

module.exports = {
  transform: { '^.+\\.js$': ['babel-jest', babelconfig.server] },
  testPathIgnorePatterns: ['fixtures'],
};
