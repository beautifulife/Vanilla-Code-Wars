console.log('Can you solve this problem!? 🔥');

const $solutionTextarea = document.getElementById('editor');
const $modal = document.getElementsByClassName('app__modal')[0];
const $modalButton = document.getElementsByClassName('app__modal__button')[0];

if ($modalButton) {
  $modalButton.addEventListener('click', closeModal);
}

function closeModal(ev) {
  $modal.style.display = 'none';
}

const editor = CodeMirror.fromTextArea($solutionTextarea, {
  lineNumbers: true,
  lineWrapping: true,
  theme: 'monokai',
  mode: 'javascript',
  tabSize: 2,
  autoFocus: true
});
