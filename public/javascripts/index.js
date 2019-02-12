// require('codemirror/mode/xml/xml');
// require('codemirror/mode/javascript/javascript');
// require('codemirror/mode/css/css');
// require('codemirror/mode/htmlmixed/htmlmixed');
console.log('Code Wars!! 🔥');

//index

//problem

const $solutionForm = document.getElementsByClassName('app__main__problem__solution')[0];
const $textarea = document.getElementById('editor');

// $solutionForm && $solutionForm.addEventListener('submit', sendSolution);

// function sendSolution(ev) {
//   ev.preventDefault();

//   const form = ev.currentTarget;
//   const solution = ev.currentTarget[0].value;

//   (async () => {
//     const rawResponse = await fetch(form.action, {
//       method: 'POST',
//       body: JSON.stringify({ solution }),
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });
//     const content = await rawResponse;
//     console.log(content);
//   })();


  // const form = document.createElement('form');

  // form.setAttribute('method', 'post');
  // form.setAttribute('action', '/problems')
  // console.log(ev);
// }

console.log(CodeMirror);


const editor = CodeMirror.fromTextArea($textarea, {
  lineNumbers: true,
  lineWrapping: true,
  theme: 'monokai',
  mode: 'javascript',
  value: `function solution(num) {
    if (num < 2) {
      return num;
    }

    return solution(num - 1) + solution(num - 2);
  }`,
  tabSize: 2,
  autoFocus: true
});


// var editor = CodeMirror.fromTextArea(textareaElement, {
//   mode: 'text/html',
//   lineWrapping: true,
//   extraKeys: {
//     'Ctrl-Space': 'autocomplete'
//   },
//   lineNumbers: true,
//   theme: 'monokai'
// });
