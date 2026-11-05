// Virtual Dog Park — plain JavaScript, no libraries and no build step.
//
// How this file is organised:
//   dog              the only dog in the park, or null when nobody has adopted yet
//   renderDog()      draws whatever is inside `dog` into the page
//   adoptDog()       creates a dog with the starting values
//   changeHappiness() adds or removes happiness and keeps it inside 0-100

const BREEDS = {
  beagle: { name: "Beagle", image: "assets/beagle.svg", alt: "Illustration of a Beagle." },
  golden: { name: "Golden Retriever", image: "assets/golden-retriever.svg", alt: "Illustration of a Golden Retriever." },
  poodle: { name: "Poodle", image: "assets/poodle.svg", alt: "Illustration of a Poodle." }
};

const HAPPINESS_MIN = 0;
const HAPPINESS_MAX = 100;
const START_HAPPINESS = 50;
const HAPPINESS_PER_CARE = 10;
const NAME_MAX_LENGTH = 20;

let dog = null;

/* --- Element lookups, done once when the page loads ----------------- */
const adoptPanel = document.getElementById("adopt-panel");
const adoptForm = document.getElementById("adopt-form");
const breedSelect = document.getElementById("breed-select");
const nameInput = document.getElementById("dog-name");
const adoptMessage = document.getElementById("adopt-message");
const petPanel = document.getElementById("pet-panel");
const petIllustration = document.getElementById("pet-illustration");
const petName = document.getElementById("pet-name");
const petBreed = document.getElementById("pet-breed");
const statDay = document.getElementById("stat-day");
const statStage = document.getElementById("stat-stage");
const statHappiness = document.getElementById("stat-happiness");
const feedButton = document.getElementById("feed-button");
const playButton = document.getElementById("play-button");
const careMessage = document.getElementById("care-message");

/* --- Small helpers --------------------------------------------------- */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// One single rule for growth, used everywhere the stage is needed.
function stageFor(day) {
  if (day <= 1) return "Puppy";
  if (day <= 3) return "Young Dog";
  return "Adult Dog";
}

function showMessage(element, text) {
  element.textContent = text;
}

/* --- Drawing --------------------------------------------------------- */
function renderDog() {
  if (dog === null) {
    adoptPanel.hidden = false;
    petPanel.hidden = true;
    return;
  }

  const breed = BREEDS[dog.breed];

  adoptPanel.hidden = true;
  petPanel.hidden = false;

  petIllustration.src = breed.image;
  petIllustration.alt = breed.alt;

  // textContent, not innerHTML: a name like <b>Max</b> stays plain text.
  petName.textContent = dog.name;
  petBreed.textContent = breed.name;
  statDay.textContent = String(dog.day);
  statStage.textContent = stageFor(dog.day);
  statHappiness.textContent = dog.happiness + " / " + HAPPINESS_MAX;
}

/* --- Actions --------------------------------------------------------- */
function adoptDog(name, breedKey) {
  dog = {
    name: name,
    breed: breedKey,
    day: 1,
    happiness: START_HAPPINESS
  };
  renderDog();
}

function changeHappiness(amount) {
  if (dog === null) return;

  dog.happiness = clamp(dog.happiness + amount, HAPPINESS_MIN, HAPPINESS_MAX);
  renderDog();
  showMessage(careMessage, "Happiness is now " + dog.happiness + " / " + HAPPINESS_MAX + ".");
}

/* --- Events ---------------------------------------------------------- */
adoptForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // trim() removes the spaces at both ends but keeps the ones in the middle.
  const name = nameInput.value.trim();

  if (name === "") {
    showMessage(adoptMessage, "Please type a name before adopting a dog.");
    nameInput.focus();
    return;
  }

  if (name.length > NAME_MAX_LENGTH) {
    showMessage(adoptMessage, "Please keep the name to " + NAME_MAX_LENGTH + " characters or fewer.");
    nameInput.focus();
    return;
  }

  showMessage(adoptMessage, "");
  adoptDog(name, breedSelect.value);
  nameInput.value = "";
});

feedButton.addEventListener("click", function () {
  changeHappiness(HAPPINESS_PER_CARE);
});

playButton.addEventListener("click", function () {
  changeHappiness(HAPPINESS_PER_CARE);
});

/* --- Start the page -------------------------------------------------- */
renderDog();
