(function () {
  'use strict';

  const setPreference = (event) => {
    const target = event.target;
    const { value, id, type, name } = target;
    console.log(id, name);
    if (type === "text") {
      localStorage.setItem(id, value);
      return;
    }
    localStorage.setItem(name, value);
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
  // const playButton = form.querySelector(".timer__play");
  // const stopButton = form.querySelector(".timer__stop");

  // State
  const state = {
    playing: false,
    paused: false,
    breaking: false,
    elapsedSeconds: 0,
  };

  // Time
  const tick = () => {
    console.log("tick...");
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
      state.elapsedSeconds = 0;
      display.innerHTML = duration;
      state.breaking = !state.breaking;
    } else {
      display.innerHTML = duration - state.elapsedSeconds;
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

})();
