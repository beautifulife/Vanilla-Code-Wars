const express = require('express');
const fs = require('fs');
const util = require('util');
const vm = require('vm');

const router = express.Router();

// router.use(express.json());

function readProblems(callback) {
  fs.readFile('data/problems.json', 'utf8', (err, data) => {
    if (err) throw err;

    const problems = JSON.parse(data);

    callback(problems);
  });
}

/* GET home page. */
router.get('/', (req, res, next) => {
  readProblems((problems) => {
    const level = req.query.level || 'all';
    problems = problems.filter((problem) => {
      if (level === 'all' || parseInt(level) === problem.difficulty_level) {
        return true;
      }

      return false;
    });

    res.render('index', {
      title: '바닐라코딩',
      problems,
      level,
    });
  });
});

router.get('/problems/:problem_id', (req, res, next) => {
  readProblems((problems) => {
    const problem = problems.find((item) => {
      return item.id === parseInt(req.params.problem_id);
    });

    if (!problem) {
      res.status(404).send('wrong address');
    }

    res.render('problem', {
      title: '바닐라코딩',
      problem,
    });
  });
});

router.post('/problems/:problem_id', (req, res, next) => {
  readProblems((problems) => {
    const problem = problems.find((item) => {
      return item.id === parseInt(req.params.problem_id, 10);
    });
    const testResult = {
      numberOfTests: problem.tests.length,
      numberOfCorrectAnswer: 0,
      results: []
    };

    problem.tests.forEach((test) => {
      const sandbox = {};
      let testCodeResult;

      try {
        debugger;
        testCodeResult = vm.runInNewContext(req.body.solution + test.code, sandbox);
      } catch (err) {
        res.status(400).render('service_error', {
          title: '바닐라코딩',
        });
      }

      if (testCodeResult === test.solution) {
        testResult.numberOfCorrectAnswer++;
        testResult.results.push({
          testCodeResult,
          isCorrect: 'correct'
        });
      } else {
        testResult.results.push({
          testCodeResult,
          isCorrect: 'wrong'
        });
      }
    });

    problem.userSolution = req.body.solution;
    problem.testResult = testResult;

    if (testResult.numberOfTests === testResult.numberOfCorrectAnswer) {
      res.render('success', {
        title: '바닐라코딩',
        problem,
      });
    } else {
      res.render('failure', {
        title: '바닐라코딩',
        problem,
      });
    }
  });
});

module.exports = router;
