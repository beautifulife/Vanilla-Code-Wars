const app = 'Codewars';

module.exports = {
  development: {
    DB: `mongodb://localhost:27017/${app}`
  },
  production: {
    DB: `mongodb://localhost:27017/${app}`
  }
};
