console.log('Welcome to the codewars 🔥');

const $modalOpenButton = document.getElementsByClassName('app__main__problems__info__register')[0];
const $appModal = document.getElementsByClassName('app__modal')[0];
const $kataRegisterForm = document.getElementsByClassName('app__modal__template__form')[0];
const $kataRegisterFormHeader = document.getElementsByClassName('app__modal__template__form__header')[0];

$appModal.addEventListener('click', closeModal);
$modalOpenButton.addEventListener('click', showModal);
$kataRegisterForm.addEventListener('submit', registerKata);

function closeModal(ev) {
  if (ev.target.classList.contains('app__modal')) {
    $appModal.classList.add('hidden');
  }
}

function showModal(ev) {
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

  if (!title.value || !difficulty_level.value ||
      !description.value || !test.value || !solution.value) {
    return $kataRegisterFormHeader.lastElementChild.classList.add('require');
  }

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

      responseMessage.classList.add(`${res.message}`);
      responseMessage.textContent = `Your Kata is ${res.message}`;
      $kataRegisterForm.appendChild(responseMessage);
    })
    .catch(err => console.error(err));
}
