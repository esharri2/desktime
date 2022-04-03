// worker.js

const controls = {
  start: () => {
    console.log("start!");
  },
  pause: () => {
    console.log("pause i guess");
  },
  stop: () => {
    console.log("stoooop");
  },
};

onmessage = function ({ data }) {
  debugger;
  if (!controls[data]) {
    console.log("issue!");
  }
  controls[data]();

  // console.log("Message received from main script");
  // var workerResult = "Result: " + e.data[0] * e.data[1];
  // console.log("Posting message back to main script");
  // postMessage(workerResult);
};

// setInterval(function () {
//   postMessage("");
// }, 3000);
