(function () {
  'use strict';

  // Importing main CSS so Rollup will watch and bundle with PostCSS!
  const timer = new Worker("timer.js");

  // Elements
  const form = document.querySelector(".timer");
  form.querySelector("[name='workDuration']");
  form.querySelector("[name='breakDuration']");
  // const playButton = form.querySelector(".timer__play");
  // const stopButton = form.querySelector(".timer__stop");

  // State
  const state = {
    playing: false,
    paused: false,
  };

  // Controls
  const play = () => {
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
    timer.postMessage("pause");
    form.removeAttribute("data-state");
  };

  // Handle form submit as play
  form.addEventListener("submit", (event) => {
    debugger;
    event.preventDefault();
    state.playing ? pause() : play();
  });

  form.addEventListener("reset", (event) => {
    stop();
    timer.postMessage("stop");
  });

  // const playButton = document
  //   .querySelector("button")
  //   .addEventListener("click", () => {
  //     worker.onmessage = function () {
  //       playSound();
  //     };
  //   });

})();
