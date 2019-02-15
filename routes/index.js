const express = require('express');
const vm = require('vm');
const mongoose = require('mongoose');
const Problems = require('./model');

const router = express.Router();

mongoose.connect('mongodb://localhost/codewars');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('success db connect');
});

function createInternalError(err) {
  console.error(err);

  const error = new Error('Internal Server Error');

  error.status = 500;

  return error;
}

/* GET home page. */
router.get('/problems/:problem_id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.problem_id)) {
    return next();
  }

  Problems.findOne({ _id: req.params.problem_id }, (err, problem) => {
    if (err) {
      return next(createInternalError(err));
    }

    if (!problem) {
      return next();
    }

    res.render('problem', {
      title: `Codewars-${problem.title}`,
      problem,
      testResult: ''
    });
  });
});

router.post('/problems/:problem_id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.problem_id)) {
    return next();
  }

  Problems.findOne({ _id: req.params.problem_id }, (err, problem) => {
    if (err) {
      return next(createInternalError(err));
    }

    const testResult = {
      numberOfTests: problem.tests.length,
      numberOfCorrectAnswer: 0,
      results: []
    };
    const sendBox = {
      setTimeout: global.setTimeout,
      setInterval: global.setInterval
    };

    problem.userSolution = req.body.solution;

    try {
      problem.tests.forEach((test) => {
        const testCodeResult = vm.runInNewContext(
          req.body.solution + test.code,
          sendBox,
          { timeout: 5000 }
        );

        if (testCodeResult === test.solution) {
          testResult.numberOfCorrectAnswer++;
          testResult.results.push({
            testCodeResult,
            resultStatus: 'correct'
          });
        } else {
          testResult.results.push({
            testCodeResult,
            resultStatus: 'wrong'
          });
        }
      });
    } catch (err) {
      const testCodeResult = err.message;

      testResult.results.push({
        testCodeResult,
        resultStatus: 'error'
      });

      return res.render('error', {
        title: `Codewars-${problem.title}(Error)`,
        problem,
        testResult,
        errorMessage: err.message
      });
    }

    if (testResult.numberOfTests === testResult.numberOfCorrectAnswer) {
      Problems.updateOne(
        { _id: req.params.problem_id},
        { solution_count: problem.solution_count + 1 },
        (err) => {
          if (err) {
            return next(createInternalError(err));
          }
        }
      );

      res.render('success', {
        title: `Codewars-${problem.title}(Success)`,
        problem,
        testResult
      });
    } else {
      res.render('failure', {
        title: `Codewars-${problem.title}(Failure)`,
        problem,
        testResult
      });
    }
  });
});

router.post('/register', (req, res, next) => {
  const {
    title,
    difficulty_level,
    description,
    tests,
  } = req.body;
    
  Problems.create({
    title,
    solution_count: 0,
    difficulty_level,
    description,
    tests
  }, (err, problem) => { return next(createInternalError(err)); });

  res.json({
    message: 'registered'
  });
});

router.get('/', (req, res, next) => {
  Problems.find({}, (err, problems) => {
    if (err) {
      return next(createInternalError(err));
    }

    const levels = ['all', '1', '2', '3'];
    const level = req.query.level || 'all';

    problems = problems.filter((problem) => {
      if (level === 'all' || problem.difficulty_level === parseInt(level, 10)) {
        return true;
      }

      return false;
    });

    console.log(levels);

    res.render('index', {
      title: 'Codewars',
      levels,
      problems,
      level
    });
  });
});

module.exports = router;
