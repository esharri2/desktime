let timer;

const controls = {
  start: () => {
    timer = setInterval(function () {
      postMessage("");
    }, 1000);
  },
  pause: () => {
    clearInterval(timer);
  },
  stop: () => {
    clearInterval(timer);
  },
};

onmessage = function ({ data }) {
  if (!controls[data]) {
    console.log("issue!");
  }
  controls[data]();
};
