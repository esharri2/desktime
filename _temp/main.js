(function () {
  'use strict';

  const setPreference = (event) => {
    const target = event.target;
    const { value, id, type, name } = target;
    if (type === "text") {
      localStorage.setItem(id, value);
      return;
    }
    localStorage.setItem(name, value);
  };

  const getPreference = (id) => {
    return localStorage.getItem(id);
  };

  const beep = () => {
    console.log("sound!");
    let audio_ctx = new AudioContext();

    let volume = 0.5;
    let frequency = 200;
    let oscillation_type = "sine";
    let duration = 1;

    let oscillator = audio_ctx.createOscillator();
    let gain = audio_ctx.createGain();

    oscillator.connect(gain);
    oscillator.frequency.value = frequency;
    oscillator.type = oscillation_type;

    gain.connect(audio_ctx.destination);

    gain.gain.value = volume;

    oscillator.start(audio_ctx.currentTime);
    oscillator.stop(audio_ctx.currentTime + duration);
  };

  const speak = (text) => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  // Importing main CSS so Rollup will watch and bundle with PostCSS!
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

})();
