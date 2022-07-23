const synth = new Tone.MonoSynth({
  oscillator: {
    type: "square",
  },
  envelope: {
    attack: 0.1,
  },
}).toDestination();

const tones = ["C4", "E4", "G4", "A4"];

const increments = [0, 0.5, 1, 1.5];

const ascendingTones = () => {
  playTones(tones);
};

const descendingTones = () => {
  playTones([...tones].reverse());
};

const playTones = (tones) => {
  const now = Tone.now();
  increments.forEach((increment, i) => {
    synth.triggerAttackRelease(tones[i], "8n", now + increment);
  });
};

// const beep = () => {
//   let audio_ctx = new AudioContext();

//   let volume = 0.5;
//   let frequency = 250;
//   let oscillation_type = "sine";
//   let duration = 1;

//   let oscillator = audio_ctx.createOscillator();
//   let gain = audio_ctx.createGain();

//   oscillator.connect(gain);
//   oscillator.frequency.value = frequency;
//   oscillator.type = oscillation_type;

//   gain.connect(audio_ctx.destination);

//   gain.gain.value = volume;

//   oscillator.start(audio_ctx.currentTime);
//   oscillator.stop(audio_ctx.currentTime + duration);
// };

const speak = (text) => {
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

export { ascendingTones, descendingTones, speak };
