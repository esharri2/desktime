// Importing main CSS so Rollup will watch and bundle with PostCSS!
import "../styles/index.css";
import { beep, speak } from "./_sounds";
import { getPreference, setPreference } from "./_storage.js";
const timer = new Worker("timer.js");

// Elements
const form = document.querySelector(".timer");
const workDurationInput = form.querySelector("[name='workDuration']");
const workDurationDisplay = form.querySelector("#workDuration");
const breakDurationInput = form.querySelector("[name='breakDuration']");
const breakDurationDisplay = form.querySelector("#breakDuration");
const settings = document.querySelector(".settings__form");

// State
const state = {
  playing: false,
  paused: false,
  breaking: false,
  elapsedSeconds: 0,
};

// Time
const tick = () => {
  state.elapsedSeconds = state.elapsedSeconds + 1;
  let duration;
  let display;

  if (state.breaking) {
    duration = breakDurationInput.value * 60;
    display = breakDurationDisplay;
  } else {
    duration = workDurationInput.value * 60;
    display = workDurationDisplay;
  }

  if (state.elapsedSeconds === duration) {
    playSound();
    state.elapsedSeconds = 0;
    display.innerHTML = duration;
    state.breaking = !state.breaking;
  } else {
    display.innerHTML = duration - state.elapsedSeconds;
  }
};

const playSound = () => {
  const soundPreference = state.breaking
    ? getPreference("workStart")
    : getPreference("breakStart");

  if (soundPreference === "voice") {
    const text = state.breaking
      ? getPreference("workStarVoice") || "work"
      : getPreference("breakStartVoice") || "break";
    speak(text);
  } else {
    beep();
  }
};

// Controls
const play = () => {
  // Extra stuff for initial play
  if (!state.playing && !state.paused) {
    timer.onmessage = function () {
      tick();
    };
    state.breaking = false;
    workDurationDisplay.innerHTML = workDurationInput.value * 60;
    breakDurationDisplay.innerHTML = breakDurationInput.value * 60;
  }

  state.playing = true;
  state.paused = false;
  timer.postMessage("start");
  form.setAttribute("data-state", "playing");
};

const pause = () => {
  state.paused = true;
  timer.postMessage("pause");
};

const stop = () => {
  state.playing = false;
  state.paused = false;
  timer.postMessage("stop");
  form.removeAttribute("data-state");
  workDurationDisplay.innerHTML = workDurationInput.value * 60;
  breakDurationDisplay.innerHTML = breakDurationInput.value * 60;
};

// Attach listeners
form.addEventListener("submit", (event) => {
  event.preventDefault();
  state.playing ? pause() : play();
});

form.addEventListener("reset", (event) => {
  stop();
});

settings.addEventListener("change", (event) => {
  setPreference(event);
});

// Initialize form with values from local storage
const setUpForm = () => {
  console.log(form);
  Object.keys(localStorage).forEach((key) => {
    const input = settings.querySelector(`[name="${key}"]`);
    if (!input) return;
    input.value = getPreference(key);
  });
};

setUpForm();