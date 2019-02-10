const express = require('express');
const fs = require('fs');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  fs.readFile('data/problems.json', 'utf8', (err, data) => {
    if (err) throw err;

    const problems = JSON.parse(data);
    const level = req.query.level || 'all';

    res.render('index', {
      title: '바닐라코딩',
      problems,
      level,
    });
  });
});

router.get('/problems/:problem_id', (req, res, next) => {
  fs.readFile('data/problems.json', 'utf8', (err, data) => {
    if (err) throw err;

    const problems = JSON.parse(data);
    const problem = problems.find((item) => {
      return item.id === parseInt(req.params.problem_id);
    });

    if (!problem) {
      res.status(404);
    }

    res.render('problem', {
      title: '바닐라코딩',
      problem
    });
  });
});

router.post('/problems/:problem_id', (req, res, next) => {
  fs.readFile('data/problems.json', 'utf8', (err, data) => {
    if (err) throw err;
    
    const problems = JSON.parse(data);
    const problem = problems.find((item) => {
      return item.id === parseInt(req.params.problem.id);
    });
    const userSolution = req.body.solution;
    const testResult = {
      numberOfTests: problem.tests.length,
      numberOfCorrectAnswer: 0,
      results: []
    };

    problem.tests.forEach((test, index) => {
      if (userSolution(test.code) === test.solution) {
        testResult.numberOfCorrectAnswer++;
        testResult.results.push([`test${index}`, true]);
      } else {
        testResult.results.push([`test${index}`, false]);
      }
    });
  
    if (testResult.numberOfTests === testResult.numberOfCorrectAnswer) {
      res.render('success', {
        title: ''
      });
    } else {
      res.render('failure', {
        title: ''
      });
    }
    //함수를 받는다(텍스트로) -> parse -> 함수를 실행한다. -> 결과일치확인
  });
});

module.exports = router;
