const verbSelect = document.querySelector('#verb-select');
const currentMeaning = document.querySelector('#current-meaning');
const currentForms = document.querySelector('#current-forms');
const sentenceFrames = document.querySelector('#sentence-frames');
const wordByWord = document.querySelector('#word-by-word');
const gameVerb = document.querySelector('#game-verb');
const gameInstruction = document.querySelector('#game-instruction');
const formFeedback = document.querySelector('#form-feedback');
const gameFeedback = document.querySelector('#game-feedback');
const timerDisplay = document.querySelector('#timer-display');
const timerButton = document.querySelector('#timer-button');
const stopButton = document.querySelector('#stop-speaking');
const recordButton = document.querySelector('#record-button');
const playRecordingButton = document.querySelector('#play-recording');
const recordingPlayback = document.querySelector('#recording-playback');
const recordingStatus = document.querySelector('#recording-status');
const formInputs = {
  base: document.querySelector('#write-base'),
  past: document.querySelector('#write-past'),
  participle: document.querySelector('#write-participle'),
};

const actionVerbBases = ['take', 'eat', 'drink', 'go', 'come', 'run', 'jump', 'throw', 'catch', 'draw', 'write', 'sing', 'swim', 'ride', 'wear', 'give', 'make', 'build', 'break', 'grow'];
const sentenceEndings = {
  take: 'a book', eat: 'an apple', drink: 'water', go: 'to the park', come: 'home', run: 'fast',
  throw: 'a soft ball', catch: 'a soft ball', draw: 'a picture', write: 'a note', sing: 'a song',
  swim: 'in the pool', ride: 'a bike', wear: 'my hat', give: 'a gift', make: 'a card',
  build: 'a tower', break: 'a cookie', grow: 'taller',
};
const actionCues = {
  take: '拿起一樣東西，讓孩子跟著你的手勢說。',
  eat: '指著食物，做出吃東西的動作。',
  drink: '指著杯子，做出喝水的動作。',
  go: '指向一個地方，再踏出一步。',
  come: '招招手，請孩子走過來。',
  run: '原地跑兩步。',
  jump: '一起跳一下。',
  throw: '拿軟球做出丟的動作。',
  catch: '用雙手做接住的動作。',
  draw: '指著畫紙，做出畫畫的動作。',
  write: '指著紙和筆，做出寫字的動作。',
  sing: '做出拿麥克風的手勢。',
  swim: '用手做出游泳動作。',
  ride: '做出騎車或騎馬的動作。',
  wear: '指著身上的衣服。',
  give: '把一樣東西遞給孩子。',
  make: '指著正在做的作品。',
  build: '指著積木，做出堆疊動作。',
  break: '做出把餅乾掰開的動作。',
  grow: '雙手從低到高慢慢張開。',
};

let currentVerb = null;
let activeButton = null;
let speechSession = 0;
let timerSeconds = 300;
let timerId = null;
let mediaRecorder = null;
let recordingStream = null;
let recordingChunks = [];
let recordingUrl = null;

function primaryForm(value) {
  return value.split('/')[0].trim();
}

function americanSpeechText(text) {
  return text.replace(/\bleads\b/gi, 'leeds').replace(/\blead\b/gi, 'leed');
}

function chooseVoice(language) {
  const pattern = language === 'zh-TW' ? /^zh-TW/i : /^en-US/i;
  return speechSynthesis.getVoices().find((voice) => pattern.test(voice.lang)) || null;
}

function stopSpeaking() {
  speechSession += 1;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (activeButton) activeButton.classList.remove('is-speaking');
  activeButton = null;
  stopButton.disabled = true;
}

function releaseRecordingStream() {
  if (!recordingStream) return;
  recordingStream.getTracks().forEach((track) => track.stop());
  recordingStream = null;
}

function resetRecordButton() {
  recordButton.textContent = '開始錄音';
  recordButton.classList.remove('is-recording');
}

async function toggleRecording() {
  if (mediaRecorder?.state === 'recording') {
    mediaRecorder.stop();
    recordButton.disabled = true;
    recordingStatus.textContent = '正在整理你的錄音…';
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    recordingStatus.textContent = '此瀏覽器不支援錄音，請使用最新版 Chrome、Edge 或 Safari。';
    return;
  }
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordingChunks = [];
    mediaRecorder = new MediaRecorder(recordingStream);
    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) recordingChunks.push(event.data);
    });
    mediaRecorder.addEventListener('stop', () => {
      const recording = new Blob(recordingChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
      recordingUrl = URL.createObjectURL(recording);
      recordingPlayback.src = recordingUrl;
      recordingPlayback.hidden = false;
      playRecordingButton.disabled = false;
      releaseRecordingStream();
      resetRecordButton();
      recordButton.disabled = false;
      recordingStatus.textContent = '錄音完成！按播放聽聽自己的聲音。';
    }, { once: true });
    mediaRecorder.start();
    recordButton.textContent = '停止錄音';
    recordButton.classList.add('is-recording');
    recordingStatus.textContent = '錄音中…現在說三態和三句話。';
  } catch (error) {
    releaseRecordingStream();
    resetRecordButton();
    recordingStatus.textContent = '無法使用麥克風。請允許瀏覽器使用麥克風後再試。';
  }
}

function speakParts(parts, button) {
  if (!('speechSynthesis' in window)) return;
  stopSpeaking();
  const session = speechSession;
  activeButton = button;
  button?.classList.add('is-speaking');
  stopButton.disabled = false;
  let index = 0;

  function next() {
    if (session !== speechSession) return;
    if (index >= parts.length) {
      if (activeButton) activeButton.classList.remove('is-speaking');
      activeButton = null;
      stopButton.disabled = true;
      return;
    }
    const part = parts[index++];
    const utterance = new SpeechSynthesisUtterance(part.language === 'en-US' ? americanSpeechText(part.text) : part.text);
    utterance.lang = part.language;
    utterance.rate = part.rate || 0.78;
    utterance.voice = chooseVoice(part.language);
    utterance.onend = next;
    utterance.onerror = () => stopSpeaking();
    speechSynthesis.speak(utterance);
  }
  next();
}

function speakEnglish(text, button, rate = 0.76) {
  speakParts([{ text, language: 'en-US', rate }], button);
}

function speakVerbSequence(button) {
  speakParts([
    { text: primaryForm(currentVerb.base), language: 'en-US' },
    { text: primaryForm(currentVerb.past), language: 'en-US' },
    { text: primaryForm(currentVerb.participle), language: 'en-US' },
    { text: currentVerb.meaning, language: 'zh-TW', rate: 0.84 },
  ], button);
}

function sentenceData() {
  const base = primaryForm(currentVerb.base);
  const past = primaryForm(currentVerb.past);
  const participle = primaryForm(currentVerb.participle);
  const ending = sentenceEndings[base.toLowerCase()] || 'it';
  return [
    { label: '我會…', visible: `I can ${base} _____.`, spoken: `I can ${base} ${ending}.` },
    { label: '我昨天…', visible: `Yesterday, I ${past} _____.`, spoken: `Yesterday, I ${past} ${ending}.` },
    { label: '我已經…', visible: `I have ${participle} _____.`, spoken: `I have ${participle} ${ending}.` },
  ];
}

function renderWordByWord() {
  const words = sentenceData()[0].spoken.match(/[A-Za-z']+|[.!?]/g) || [];
  wordByWord.replaceChildren();
  words.forEach((word) => {
    const token = document.createElement('span');
    token.className = 'word-token';
    token.textContent = word;
    wordByWord.append(token);
  });
}

function renderSentences() {
  sentenceFrames.replaceChildren();
  sentenceData().forEach((frame) => {
    const card = document.createElement('div');
    card.className = 'sentence-frame';
    const label = document.createElement('small');
    label.textContent = frame.label;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = frame.visible;
    button.setAttribute('aria-label', `播放句子：${frame.spoken}`);
    button.addEventListener('click', () => speakEnglish(frame.spoken, button));
    card.append(label, button);
    sentenceFrames.append(card);
  });
}

function clearWriting() {
  Object.values(formInputs).forEach((input) => { input.value = ''; });
  formFeedback.textContent = '';
  gameFeedback.textContent = '';
  document.querySelector('#game-object').value = '';
}

function setVerb(verb) {
  currentVerb = verb;
  verbSelect.value = String(verb.id);
  currentMeaning.textContent = verb.meaning;
  currentForms.textContent = `${verb.base} · ${verb.past} · ${verb.participle}`;
  gameVerb.textContent = primaryForm(verb.past);
  gameVerb.setAttribute('aria-label', `播放 ${primaryForm(verb.past)} 的美式英文發音`);
  gameInstruction.textContent = actionCues[primaryForm(verb.base).toLowerCase()] || '做出這個動作，或指向和這個動詞有關的實物，再把句子說完。';
  renderSentences();
  renderWordByWord();
  clearWriting();
}

function fillVerbChoices() {
  practiceVerbs().forEach((verb) => {
    const option = document.createElement('option');
    option.value = String(verb.id);
    option.textContent = `${verb.id}. ${verb.base} — ${verb.meaning}`;
    verbSelect.append(option);
  });
}

function checkForms() {
  const expected = {
    base: primaryForm(currentVerb.base).toLowerCase(),
    past: primaryForm(currentVerb.past).toLowerCase(),
    participle: primaryForm(currentVerb.participle).toLowerCase(),
  };
  const correct = Object.entries(formInputs).filter(([key, input]) => input.value.trim().toLowerCase() === expected[key]).length;
  formFeedback.textContent = correct === 3 ? '三態都正確！接著把它們放進句子裡。' : `目前答對 ${correct} 個。卡住時請先做動作或指著實物想一想。`;
}

function playWordByWord() {
  if (!('speechSynthesis' in window)) return;
  const tokens = [...wordByWord.querySelectorAll('.word-token')];
  const spoken = sentenceData()[0].spoken.match(/[A-Za-z']+|[.!?]/g) || [];
  stopSpeaking();
  const session = speechSession;
  let index = 0;
  stopButton.disabled = false;

  function next() {
    if (session !== speechSession) return;
    tokens.forEach((token) => token.classList.remove('is-current'));
    if (index >= spoken.length) {
      stopButton.disabled = true;
      return;
    }
    tokens[index]?.classList.add('is-current');
    const utterance = new SpeechSynthesisUtterance(americanSpeechText(spoken[index++]));
    utterance.lang = 'en-US';
    utterance.rate = 0.64;
    utterance.voice = chooseVoice('en-US');
    utterance.onend = next;
    utterance.onerror = () => stopSpeaking();
    speechSynthesis.speak(utterance);
  }
  next();
}

function updateTimer() {
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const seconds = String(timerSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function toggleTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    timerButton.textContent = '繼續計時';
    return;
  }
  if (timerSeconds === 0) timerSeconds = 300;
  timerButton.textContent = '暫停計時';
  timerId = setInterval(() => {
    timerSeconds -= 1;
    updateTimer();
    if (timerSeconds === 0) {
      clearInterval(timerId);
      timerId = null;
      timerButton.textContent = '再來 5 分鐘';
      speakParts([{ text: 'Great job. Your five-minute practice is finished.', language: 'en-US', rate: 0.8 }], timerButton);
    }
  }, 1000);
}

fillVerbChoices();
const defaultVerb = IRREGULAR_VERBS.find((verb) => primaryForm(verb.base) === 'take') || IRREGULAR_VERBS[0];
setVerb(defaultVerb);

function practiceVerbs() {
  return IRREGULAR_VERBS.filter((verb) => actionVerbBases.includes(primaryForm(verb.base).toLowerCase()));
}

verbSelect.addEventListener('change', () => setVerb(practiceVerbs().find((verb) => String(verb.id) === verbSelect.value)));
document.querySelector('#random-verb').addEventListener('click', () => {
  const candidates = practiceVerbs();
  setVerb(candidates[Math.floor(Math.random() * candidates.length)] || IRREGULAR_VERBS[0]);
});
document.querySelector('#speak-forms').addEventListener('click', (event) => speakVerbSequence(event.currentTarget));
document.querySelector('#check-forms').addEventListener('click', checkForms);
document.querySelector('#gesture-hint').addEventListener('click', () => { formFeedback.textContent = gameInstruction.textContent; });
document.querySelector('#word-read').addEventListener('click', playWordByWord);
document.querySelector('#game-verb').addEventListener('click', (event) => speakEnglish(primaryForm(currentVerb.past), event.currentTarget));
document.querySelector('#game-listen').addEventListener('click', (event) => speakEnglish(sentenceData()[1].spoken, event.currentTarget));
document.querySelector('#game-done').addEventListener('click', () => { gameFeedback.textContent = '做得好！換一樣東西，再說一次也可以。'; });
stopButton.addEventListener('click', stopSpeaking);
timerButton.addEventListener('click', toggleTimer);
recordButton.addEventListener('click', toggleRecording);
playRecordingButton.addEventListener('click', () => {
  recordingPlayback.play().catch(() => {
    recordingStatus.textContent = '請按播放器上的播放鍵再試一次。';
  });
});
window.addEventListener('beforeunload', () => {
  stopSpeaking();
  releaseRecordingStream();
  if (recordingUrl) URL.revokeObjectURL(recordingUrl);
  if (timerId) clearInterval(timerId);
});
