// Importing main CSS so Rollup will watch and bundle with PostCSS!
import "../styles/index.css";
import {
  ascendingTones,
  descendingTones,
  repeatingTones,
  speak,
} from "./_sounds";
import { getPreference, setPreference } from "./_storage.js";
import { DetailsUtils } from "./_details-util.js";
const timer = new Worker("timer.js");

if (typeof window !== "undefined" && "customElements" in window) {
  window.customElements.define("details-utils", DetailsUtils);
}

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
    // Toggle work/break state
    document.documentElement.classList.toggle("dark");
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
    ? getPreference("workStart") ||
      settings.querySelector("input[name='workStart']:checked").value
    : getPreference("breakStart") ||
      settings.querySelector("input[name='breakStart']:checked").value;
  if (soundPreference === "voice") {
    const text = state.breaking
      ? getPreference("workVoiceText") || "work"
      : getPreference("breakVoiceText") || "break";
    speak(text);
  } else if (soundPreference === "ascChime") {
    ascendingTones();
  } else if (soundPreference === "descChime") {
    descendingTones();
  } else if (soundPreference === "repeatChime") {
    repeatingTones();
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
  document.documentElement.classList.add("playing");
  document.documentElement.classList.remove("paused");
};

const pause = () => {
  debugger;
  document.documentElement.classList.add("paused");
  state.paused = true;
  timer.postMessage("pause");
};

const stop = () => {
  state.playing = false;
  state.paused = false;
  state.elapsedSeconds = 0;
  timer.postMessage("stop");
  document.documentElement.classList.remove("paused");
  document.documentElement.classList.remove("playing");
  document.documentElement.classList.remove("dark");
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

form.addEventListener("change", (event) => {
  setPreference(event);
});

settings.addEventListener("change", (event) => {
  setPreference(event);
});

// Initialize form with values from local storage
const setUpForm = () => {
  Object.keys(localStorage).forEach((key) => {
    const inputs = document.querySelectorAll(`[name="${key}"]`);
    inputs.forEach((input) => {
      if (input.matches("[type='radio']")) {
        input.checked = input.value === getPreference(key);
      } else {
        input.setAttribute("value", getPreference(key));
      }
    });
  });
};

setUpForm();