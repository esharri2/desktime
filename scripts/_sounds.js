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

const repeatingTones = () => {
  playTones(["E4", "E4", "E4", "E4"]);
};

const playTones = (tones) => {
  const now = Tone.now();
  increments.forEach((increment, i) => {
    synth.triggerAttackRelease(tones[i], "8n", now + increment);
  });
};

const speak = (text) => {
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

export { ascendingTones, descendingTones, repeatingTones, speak };
