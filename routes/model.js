const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Problem = new Schema({
  id: Number,
  title: String,
  solution_count: Number,
  difficulty_level: Number,
  description: String,
  tests: Array
});

module.exports = mongoose.model('Problem', Problem);
