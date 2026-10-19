const newspeakDictionary = {
  "bad": "ungood",
  "evil": "ungood",
  "terrible": "doubleplusungood",
  "horrible": "doubleplusungood",
  "excellent": "doubleplusgood",
  "great": "plusgood",
  "very good": "plusgood",
  "good": "good",
  "freedom": "crimethink",
  "liberty": "crimethink",
  "english": "oldspeak",
  "truth": "minitrue",
  "peace": "minipax",
  "love": "miniluv",
  "plenty": "miniplenty",
  "police": "thinkpol",
  "friend": "comrade",
  "warm": "uncold",
  "cold": "unwarm",
  "dark": "unlight",
  "bright": "pluslight"
};

// 禁用語判斷關鍵字（支援英、中）
const triggerPhrases = [
  "down with big brother",
  "打倒老大哥"
];

const englishInput = document.getElementById("english-text");
const newspeakOutput = document.getElementById("newspeak-text");
const translateBtn = document.getElementById("translate-btn");
const arrestModal = document.getElementById("arrest-modal");
const closeModalBtn = document.getElementById("close-modal-btn");

// 利用 Web Audio API 合成警報音效
function playAlarmBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    // 忽略自動播放受限情況
  }
}

function checkCrimethink(text) {
  const lowerText = text.toLowerCase();
  return triggerPhrases.some(phrase => lowerText.includes(phrase));
}

function translateToNewspeak(text) {
  if (!text.trim()) return "";

  let translated = text;

  Object.keys(newspeakDictionary).forEach(englishWord => {
    const regex = new RegExp(`\\b${englishWord}\\b`, "gi");
    translated = translated.replace(regex, newspeakDictionary[englishWord]);
  });

  return translated.toUpperCase();
}

function triggerArrest() {
  newspeakOutput.value = "CRIMETHINK DETECTED! UNPERSON STATUS INITIATED.";
  arrestModal.classList.remove("hidden");
  playAlarmBeep();
}

function handleTranslation() {
  const inputVal = englishInput.value;

  if (checkCrimethink(inputVal)) {
    triggerArrest();
    return;
  }

  newspeakOutput.value = translateToNewspeak(inputVal);
}

// 點擊按鈕觸發翻譯
translateBtn.addEventListener("click", handleTranslation);

// 即時輸入監聽（一打完關鍵字立刻抓包）
englishInput.addEventListener("input", () => {
  if (checkCrimethink(englishInput.value)) {
    triggerArrest();
  }
});

// 認罪並關閉彈窗
closeModalBtn.addEventListener("click", () => {
  arrestModal.classList.add("hidden");
});