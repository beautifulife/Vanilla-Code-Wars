console.log('welcome to the problem page 🔥');

const $textarea = document.getElementById('editor');
const $modalButton = document.getElementsByClassName('app__modal__button')[0];

if ($modalButton) {
  $modalButton.addEventListener('click', closeModal);
}

function closeModal(ev) {
  const $modal = document.getElementsByClassName('app__modal')[0];

  $modal.style.display = 'none';
}

const editor = CodeMirror.fromTextArea($textarea, {
  lineNumbers: true,
  lineWrapping: true,
  theme: 'monokai',
  mode: 'javascript',
  tabSize: 2,
  autoFocus: true
});
