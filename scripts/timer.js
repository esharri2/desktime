let timer;

const controls = {
  start: () => {
    timer = setInterval(function () {
      postMessage("");
    }, 1000);
  },
  pause: () => {
    console.log("pause");
    clearInterval(timer);
  },
  stop: () => {
    console.log("stop");
    clearInterval(timer);
  },
};

onmessage = function ({ data }) {
  if (!controls[data]) {
    console.log("issue!");
  }
  controls[data]();
};
