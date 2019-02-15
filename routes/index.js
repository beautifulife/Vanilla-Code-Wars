const createError = require('http-errors');
const vm = require('vm');
const express = require('express');
const mongoose = require('mongoose');
const Problems = require('../models/Problem');

const router = express.Router();

mongoose.connect('mongodb://localhost/codewars');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('success db connect');
});

/* GET home page. */
router.get('/', (req, res, next) => {
  Problems.find({}, (err, problems) => {
    if (err) {
      console.error(err);

      return next(createError(500));
    }

    const levels = ['all', '1', '2', '3'];
    const level = req.query.level || 'all';

    problems = problems.filter((problem) => {
      if (level === 'all' || problem.difficulty_level === parseInt(level, 10)) {
        return true;
      }

      return false;
    });

    res.render('index', {
      title: 'Codewars',
      levels,
      problems,
      level
    });
  });
});

router.get('/problems/:problem_id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.problem_id)) {
    return next();
  }

  Problems.findOne({ _id: req.params.problem_id }, (err, problem) => {
    if (err) {
      console.error(err);

      return next(createError(500));
    }

    if (!problem) {
      return next();
    }

    res.render('problem', {
      title: `Codewars-${problem.title}`,
      problem
    });
  });
});

router.post('/problems/:problem_id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.problem_id)) {
    return next();
  }

  Problems.findOne({ _id: req.params.problem_id }, (err, problem) => {
    if (err) {
      console.error(err);

      return next(createError(500));
    }

    const testResult = {
      numberOfTests: problem.tests.length,
      numberOfCorrectAnswers: 0,
      results: []
    };
    const sandBox = {
      setTimeout: global.setTimeout,
      setInterval: global.setInterval
    };
    const userSolution = req.body.solution;

    try {
      problem.tests.forEach((test) => {
        const testCodeResult = vm.runInNewContext(
          req.body.solution + test.code,
          sandBox,
          { timeout: 5000 }
        );

        if (testCodeResult === test.solution) {
          testResult.numberOfCorrectAnswers++;
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
        userSolution,
        testResult,
        errorMessage: err.message
      });
    }

    if (testResult.numberOfTests === testResult.numberOfCorrectAnswers) {
      Problems.updateOne(
        { _id: req.params.problem_id },
        { solution_count: problem.solution_count + 1 },
        (err, res) => {
          if (err) {
            console.error(err);

            return next(createError(500));
          }
        }
      );

      res.render('success', {
        title: `Codewars-${problem.title}(Success)`,
        problem,
        userSolution,
        testResult
      });
    } else {
      res.render('failure', {
        title: `Codewars-${problem.title}(Failure)`,
        problem,
        userSolution,
        testResult
      });
    }
  });
});

router.post('/register', (req, res, next) => {
  const { title, difficulty_level, description, tests } = req.body;

  Problems.create(
    {
      title,
      solution_count: 0,
      difficulty_level,
      description,
      tests
    },
    (err, problem) => {
      if (err) {
        console.error(err);

        return next(createError(500));
      }
    }
  );

  res.json({
    message: 'registered'
  });
});

module.exports = router;
