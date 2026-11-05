# Virtual Dog Park

**AIE1101 course assignment — Week 8 Lab 2: "Build a Virtual Dog Park with Vibe Coding & Push into GitHub".**

A dog encyclopedia and a small virtual-pet game, built with **HTML, CSS and vanilla JavaScript**.

## Environment

This project is designed to run in a normal browser from a local HTTP server. There is no build step.

| Item | Value |
| --- | --- |
| Runtime | Any current browser (Chrome, Edge, Firefox, Safari); desktop and phone widths |
| Server | VS Code **Live Server** extension, `http://127.0.0.1:5500` |
| Dependencies | None. No framework, no backend, no external API, no package manager |
| Files | Three web files plus three local SVG illustrations |

Open `index.html` through the local server, **not** through a `file://` address. Browser storage can behave differently there, and the pet would seem to forget itself.

## Preview locally

1. In VS Code, open this folder (`File → Open Folder`).
2. Install the **Live Server** extension by Ritwick Dey if it is not installed yet.
3. Right-click `index.html` and choose **Open with Live Server**.
4. A page opens at an address such as `http://127.0.0.1:5500/index.html`. Keep this same browser and address while you test saving and refreshing.

## Features

- **Dog Encyclopedia** — Beagle, Golden Retriever and Poodle, each with an illustration, size, personality and everyday care notes.
- **Adoption** — choose one of the three breeds, type a name, press **Adopt**. The name is trimmed, cannot be empty and is limited to 20 characters.
- **My Virtual Dog** — shows the dog's name, breed, day number, growth stage, happiness and a growth bar.
- **Feed** and **Play** — each press adds 10 happiness.
- **Next Day** — moves to the next day and costs 5 happiness.
- **Saved progress** — the dog survives a page refresh.
- **Start Over** — asks for confirmation, then deletes the saved dog and returns to the adoption form.
- **Responsive layout** — breed cards stack on a narrow screen without horizontal scrolling.

## Rules: growth and happiness

| Value | Rule |
| --- | --- |
| Starting state | Day **1**, stage **Puppy**, happiness **50** |
| Feed / Play | **+10** happiness per press, never above **100** |
| Next Day | **+1** day and **−5** happiness, never below **0** |
| Growth | Day 1 → **Puppy**; Days 2–3 → **Young Dog**; Day 4 onwards → **Adult Dog** |
| Stage display | The stage is always written in text (`Growth stage`), and the growth bar plus the illustration size change with it, so the stage is never shown by colour or size alone |

Growth comes from a single `stageFor(day)` function in `script.js`, so the label, the bar and the illustration can never disagree.

## Where your progress is saved

The adopted dog is stored in the browser's **localStorage**, under the key `virtualDogParkPetV1`, as one JSON object:

```json
{ "name": "Buddy", "breed": "beagle", "day": 1, "happiness": 50 }
```

- The dog is saved immediately after adoption and after every **Feed**, **Play** and **Next Day**.
- Only **one** dog is stored at a time.
- The data belongs to that browser on that device. It is **not** an online account, it is **not** linked to GitHub, and other devices or browsers will not see it.
- **Start Over → Cancel** keeps the dog; **Start Over → Confirm** deletes the stored key and returns to the adoption form.
- If the saved data is missing or damaged, the page simply starts from the adoption form instead of failing.

## Illustrations

`assets/beagle.svg`, `assets/golden-retriever.svg` and `assets/poodle.svg` are original SVG drawings made for this project. They are not photographs and do not link to any external image website.

## Manual testing checklist

- [ ] Three breed entries and three illustrations appear, with no broken image.
- [ ] Pressing **Adopt** with an empty name or a name of only spaces shows a message and adopts nothing.
- [ ] A name typed as `  Buddy  ` is adopted as `Buddy`; `Big  Dog` keeps the spaces in the middle.
- [ ] A name containing `<` and `>` is shown as plain text.
- [ ] The name field stops at 20 characters.
- [ ] **Feed** and **Play** raise happiness by 10 and stop at 100.
- [ ] **Next Day** adds one day, removes 5 happiness, and happiness never goes below 0.
- [ ] Day 2 and Day 3 read **Young Dog**; Day 4 and later read **Adult Dog**; the bar grows at the same moments.
- [ ] Refreshing the page restores the same name, breed, day and happiness.
- [ ] **Start Over → Cancel** keeps the dog; **Start Over → Confirm** clears it and the old dog does not come back after a refresh.
- [ ] With a narrow window the cards stack and nothing scrolls sideways.

## Project structure

```
virtual-dog-park/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── beagle.svg
    ├── golden-retriever.svg
    └── poodle.svg
```

## Commit history

The project was built in three tested rounds. Each round was committed only after its features worked, with a setup commit first and a documentation commit last:

1. `chore: initialize virtual dog park`
2. `feat: add dog encyclopedia`
3. `feat: add virtual dog adoption and care`
4. `feat: add dog growth and saved progress`
5. `docs: finish instructions and final review`
