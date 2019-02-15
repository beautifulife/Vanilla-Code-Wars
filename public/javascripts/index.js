console.log('welcome to the codewars 🔥');

const $registerKataButton = document.getElementsByClassName('app__main__problems__info__register')[0];
const $appModal = document.getElementsByClassName('app__modal')[0];
const $registerKataForm = document.getElementsByClassName('app__modal__template__form')[0];
const $registerKataFormHeader = document.getElementsByClassName('app__modal__template__form__header')[0];

$appModal.addEventListener('click', closeModal);
$registerKataButton.addEventListener('click', showAddModal);
$registerKataForm.addEventListener('submit', registerKata);

function closeModal(ev) {
  if (ev.target.classList.contains('app__modal')) {
    $appModal.classList.add('hidden');
  }
}

function showAddModal(ev) {
  $appModal.classList.remove('hidden');
}

function registerKata(ev) {
  ev.preventDefault();

  const {
    title,
    difficulty_level,
    description,
    test,
    solution
  } = document.forms.register;

  if (!title.value || !difficulty_level.value || !description.value || !test.value || !solution.value) {
    return $registerKataFormHeader.lastElementChild.classList.add('require');
  }

  console.log('form success');

  fetch('/register', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title.value,
      difficulty_level: difficulty_level.value,
      description: description.value,
      tests: [
        {
          test: test.value,
          solution: solution.value
        }
      ]
    }),
  })
    .then(res => res.json())
    .then((res) => {
      const responseMessage = document.createElement('p');

      responseMessage.classList.add('registered');
      responseMessage.textContent = `Your Kata is ${res.message}`;
      $registerKataForm.appendChild(responseMessage);
    })
    .catch(err => console.error(err));

  console.log(ev, ev.currentTarget);
}
