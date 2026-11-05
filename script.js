// Virtual Dog Park — plain JavaScript, no libraries and no build step.
//
// How this file is organised:
//   dog                the only dog in the park, or null when nobody has adopted yet
//   renderDog()        draws whatever is inside `dog` into the page
//   adoptDog()         creates a dog with the starting values
//   changeHappiness()  adds or removes happiness and keeps it inside 0-100
//   nextDay()          moves time forward by one day
//   saveDog()/loadDog() copy the dog to and from localStorage
//   startOver()        deletes the saved dog after a confirmation

const STORAGE_KEY = "virtualDogParkPetV1";

const BREEDS = {
  beagle: { name: "Beagle", image: "assets/beagle.svg", alt: "Illustration of a Beagle." },
  golden: { name: "Golden Retriever", image: "assets/golden-retriever.svg", alt: "Illustration of a Golden Retriever." },
  poodle: { name: "Poodle", image: "assets/poodle.svg", alt: "Illustration of a Poodle." }
};

// How full the growth bar looks for each stage. The text states the stage too.
const GROWTH_PERCENT = {
  "Puppy": 33,
  "Young Dog": 66,
  "Adult Dog": 100
};

const HAPPINESS_MIN = 0;
const HAPPINESS_MAX = 100;
const START_HAPPINESS = 50;
const HAPPINESS_PER_CARE = 10;
const HAPPINESS_PER_DAY = 5;
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
const growthBar = document.getElementById("growth-bar");
const growthFill = document.getElementById("growth-fill");
const feedButton = document.getElementById("feed-button");
const playButton = document.getElementById("play-button");
const nextDayButton = document.getElementById("next-day-button");
const startOverButton = document.getElementById("start-over-button");
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

/* --- Saved progress -------------------------------------------------- */
// The dog lives in localStorage, which belongs to this browser on this
// device only. Nothing here is uploaded to GitHub.

function saveDog() {
  if (dog === null) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dog));
  } catch (error) {
    showMessage(careMessage, "This browser could not save your progress.");
  }
}

function loadDog() {
  let raw = null;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }

  if (raw === null) return null;

  try {
    const saved = JSON.parse(raw);

    // Anything that does not look like one of our dogs is ignored.
    if (saved === null || typeof saved !== "object") return null;
    if (typeof saved.name !== "string" || saved.name === "") return null;
    if (typeof saved.breed !== "string" || !(saved.breed in BREEDS)) return null;

    const day = Number(saved.day);
    const happiness = Number(saved.happiness);
    if (!Number.isInteger(day) || day < 1) return null;
    if (!Number.isFinite(happiness)) return null;

    return {
      name: saved.name,
      breed: saved.breed,
      day: day,
      happiness: clamp(happiness, HAPPINESS_MIN, HAPPINESS_MAX)
    };
  } catch (error) {
    return null;
  }
}

function clearSavedDog() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Nothing else to do: the page state is cleared below anyway.
  }
}

/* --- Drawing --------------------------------------------------------- */
function renderGrowth(stage) {
  const percent = GROWTH_PERCENT[stage];

  growthFill.style.width = percent + "%";
  growthBar.setAttribute("aria-valuenow", String(percent));
  growthBar.setAttribute("aria-valuetext", stage);

  // CSS uses this to make the illustration a little bigger each stage.
  petPanel.dataset.stage = stage;
}

function renderDog() {
  if (dog === null) {
    adoptPanel.hidden = false;
    petPanel.hidden = true;
    return;
  }

  const breed = BREEDS[dog.breed];
  const stage = stageFor(dog.day);

  adoptPanel.hidden = true;
  petPanel.hidden = false;

  petIllustration.src = breed.image;
  petIllustration.alt = breed.alt;

  // textContent, not innerHTML: a name like <b>Max</b> stays plain text.
  petName.textContent = dog.name;
  petBreed.textContent = breed.name;
  statDay.textContent = String(dog.day);
  statStage.textContent = stage;
  statHappiness.textContent = dog.happiness + " / " + HAPPINESS_MAX;

  renderGrowth(stage);
}

/* --- Actions --------------------------------------------------------- */
function adoptDog(name, breedKey) {
  dog = {
    name: name,
    breed: breedKey,
    day: 1,
    happiness: START_HAPPINESS
  };

  saveDog();
  renderDog();
  showMessage(careMessage, "Welcome home, " + name + "!");
}

function changeHappiness(amount) {
  if (dog === null) return;

  dog.happiness = clamp(dog.happiness + amount, HAPPINESS_MIN, HAPPINESS_MAX);
  saveDog();
  renderDog();
  showMessage(careMessage, "Happiness is now " + dog.happiness + " / " + HAPPINESS_MAX + ".");
}

function nextDay() {
  if (dog === null) return;

  dog.day = dog.day + 1;
  dog.happiness = clamp(dog.happiness - HAPPINESS_PER_DAY, HAPPINESS_MIN, HAPPINESS_MAX);

  saveDog();
  renderDog();
  showMessage(
    careMessage,
    "Day " + dog.day + ": " + stageFor(dog.day) + ", happiness " + dog.happiness + " / " + HAPPINESS_MAX + "."
  );
}

function startOver() {
  if (dog === null) return;

  const agreed = window.confirm(
    "Start over with a new dog? This deletes your saved progress and cannot be undone."
  );

  if (!agreed) {
    showMessage(careMessage, dog.name + " is still here.");
    return;
  }

  dog = null;
  clearSavedDog();
  showMessage(careMessage, "");
  showMessage(adoptMessage, "Saved progress deleted. Adopt a new dog whenever you are ready.");
  renderDog();
  nameInput.focus();
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

nextDayButton.addEventListener("click", function () {
  nextDay();
});

startOverButton.addEventListener("click", function () {
  startOver();
});

/* --- Start the page -------------------------------------------------- */
// Restore the saved dog first, then draw whatever we have.
dog = loadDog();
renderDog();
