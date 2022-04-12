import { getPreference } from "./_storage";

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

export { beep, speak };
