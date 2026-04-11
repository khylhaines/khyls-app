// audio_system.js

export function createAudioSystem({
  getState,
  onVoicesChanged,
} = {}) {
  let speechEnabled = true;
  let speechVoice = null;

  function getStateSafe() {
    return typeof getState === "function" ? getState() : {};
  }

  function getAvailableSpeechVoices() {
    try {
      return window.speechSynthesis?.getVoices?.() || [];
    } catch {
      return [];
    }
  }

  function populateVoiceSelect() {
    const state = getStateSafe();
    const select = document.getElementById("voice-select");
    if (!select) return;

    const voices = getAvailableSpeechVoices();
    const savedVoiceName = String(state?.settings?.voiceName || "").trim();

    select.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Default system voice";
    select.appendChild(defaultOption);

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      select.appendChild(option);
    });

    select.value = savedVoiceName || "";
  }

  function loadVoices() {
    const voices = getAvailableSpeechVoices();

    speechVoice =
      voices.find((v) => /en-GB/i.test(v.lang)) ||
      voices.find((v) => /en/i.test(v.lang)) ||
      voices[0] ||
      null;

    populateVoiceSelect();
  }

  function forceLoadVoices() {
    loadVoices();
    setTimeout(loadVoices, 150);
    setTimeout(loadVoices, 500);
    setTimeout(loadVoices, 1000);
  }

  function stopSpeech() {
    try {
      window.speechSynthesis?.cancel();
    } catch {}
  }

  function speakText(text, interrupt = true) {
    if (!speechEnabled || !("speechSynthesis" in window) || !text) return;

    const state = getStateSafe();

    try {
      if (interrupt) stopSpeech();

      const utter = new SpeechSynthesisUtterance(String(text));
      utter.pitch = Number(state?.settings?.voicePitch || 1);
      utter.rate = Number(state?.settings?.voiceRate || 1);
      utter.volume = Math.max(
        0,
        Math.min(1, Number(state?.settings?.sfxVol || 80) / 100)
      );

      const selectedVoiceName = String(state?.settings?.voiceName || "").trim();
      let chosenVoice = null;

      if (selectedVoiceName) {
        const voices = getAvailableSpeechVoices();
        chosenVoice =
          voices.find((v) => v.name === selectedVoiceName) ||
          voices.find((v) => v.voiceURI === selectedVoiceName) ||
          null;
      }

      if (!chosenVoice && speechVoice) {
        chosenVoice = speechVoice;
      }

      if (chosenVoice) utter.voice = chosenVoice;

      window.speechSynthesis.speak(utter);
    } catch (err) {
      console.warn("Speech failed:", err);
    }
  }

  function speakOptions(options = []) {
    if (!Array.isArray(options) || !options.length) return;
    const lines = options.map((opt, i) => `Option ${i + 1}. ${opt}`);
    speakText(lines.join(". "));
  }

  function playWelcomeMessage() {
    const lines = [
      "Welcome to Barrow Quest.",
      "Ready for your next adventure?",
      "Let’s see what you discover today.",
      "Explorer, your journey continues.",
      "Something is waiting out there.",
    ];

    const line = lines[Math.floor(Math.random() * lines.length)];

    setTimeout(() => {
      speakText(line);
    }, 800);
  }

  let lastTrailSoundAt = 0;

  function playTrailSound(trailId) {
    const state = getStateSafe();
    const now = Date.now();

    if (now - lastTrailSoundAt < 350) return;
    lastTrailSoundAt = now;

    let soundSrc = null;

    if (trailId === "trail_poo") {
      soundSrc = "./sounds/plop.mp3";
    } else if (trailId === "trail_rainbow") {
      soundSrc = "./sounds/sparkle.mp3";
    }

    if (!soundSrc) return;

    try {
      const audio = new Audio(soundSrc);
      audio.volume = (state?.settings?.sfxVol || 80) / 100;
      audio.playbackRate = 0.9 + Math.random() * 0.2;
      audio.play();
    } catch (err) {
      console.warn("Trail sound failed:", err);
    }
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
      if (typeof onVoicesChanged === "function") {
        onVoicesChanged();
      }
    };
  }

  return {
    getAvailableSpeechVoices,
    populateVoiceSelect,
    loadVoices,
    forceLoadVoices,
    stopSpeech,
    speakText,
    speakOptions,
    playWelcomeMessage,
    playTrailSound,
    setSpeechEnabled(value) {
      speechEnabled = !!value;
    },
    getSpeechEnabled() {
      return speechEnabled;
    },
  };
}
