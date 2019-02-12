const express = require('express');
const fs = require('fs');

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
  const solution = new Function(`return ${req.body.solution}`)();

  if (!req.body.solution || typeof solution !== 'function') {
    res.status(400).send('wrong request sent');
  }

  // function solution(number) { return 2 }

  readProblems((problems) => {
    const problem = problems.find((item) => {
      return item.id === parseInt(req.params.problem_id, 10);
    });
    const testResult = {
      numberOfTests: problem.tests.length,
      numberOfCorrectAnswer: 0,
      results: []
    };

    problem.tests.forEach((test, index) => {
      const testCodeResult = new Function(`${solution} return ${test.code}`)();

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

    problem.testResult = testResult;

    debugger;
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
