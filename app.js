const list = document.querySelector('#verb-list');
const search = document.querySelector('#search');
const count = document.querySelector('#result-count');
const status = document.querySelector('#voice-status');
const stopButton = document.querySelector('#stop-speaking');

let activeButton = null;
let speechSession = 0;

function normalize(value) {
  return value.toLocaleLowerCase().replaceAll(' ', '');
}

function setStatus(message) {
  status.textContent = message;
}

function chooseAmericanVoice() {
  return speechSynthesis.getVoices().find((voice) => /^en-US/i.test(voice.lang)) || null;
}

function chooseChineseVoice() {
  return speechSynthesis.getVoices().find((voice) => /^zh-TW/i.test(voice.lang))
    || speechSynthesis.getVoices().find((voice) => /^zh/i.test(voice.lang))
    || null;
}

function stopSpeaking() {
  speechSession += 1;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (activeButton) activeButton.classList.remove('is-speaking');
  activeButton = null;
  stopButton.disabled = true;
}

function startSpeech(parts, button) {
  if (!('speechSynthesis' in window)) {
    setStatus('此瀏覽器不支援網頁發音功能。請改用最新版 Chrome、Edge 或 Safari。');
    return;
  }

  stopSpeaking();
  const session = speechSession;
  activeButton = button;
  button.classList.add('is-speaking');
  stopButton.disabled = false;
  let currentPart = 0;

  function speakNext() {
    if (session !== speechSession) return;
    if (currentPart === parts.length) {
      if (activeButton) activeButton.classList.remove('is-speaking');
      activeButton = null;
      stopButton.disabled = true;
      setStatus('準備就緒');
      return;
    }

    const part = parts[currentPart++];
    const utterance = new SpeechSynthesisUtterance(part.text.replaceAll('/', ' or '));
    utterance.lang = part.lang;
    utterance.rate = 0.82;
    utterance.voice = part.lang === 'zh-TW' ? chooseChineseVoice() : chooseAmericanVoice();
    utterance.onend = speakNext;
    utterance.onerror = () => {
      if (session !== speechSession) return;
      stopSpeaking();
      setStatus('無法播放發音。請確認瀏覽器允許音訊。');
    };
    speechSynthesis.speak(utterance);
  }

  speakNext();
}

function speak(word, button) {
  setStatus(`正在播放：${word}`);
  startSpeech([{ text: word, lang: 'en-US' }], button);
}

function speakVerb(verb, button) {
  setStatus(`正在依序播放：${verb.base}、${verb.past}、${verb.participle}、${verb.meaning}`);
  startSpeech([
    { text: verb.base, lang: 'en-US' },
    { text: verb.past, lang: 'en-US' },
    { text: verb.participle, lang: 'en-US' },
    { text: verb.meaning, lang: 'zh-TW' },
  ], button);
}

function form(label, word) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form';
  const caption = document.createElement('span');
  caption.className = 'form-label';
  caption.textContent = label;
  const button = document.createElement('button');
  button.className = 'word';
  button.type = 'button';
  button.textContent = word;
  button.setAttribute('aria-label', `播放 ${word} 的美式英文發音`);
  button.addEventListener('click', () => speak(word, button));
  wrapper.append(caption, button);
  return wrapper;
}

function sentenceExample({ sentence, word }) {
  const button = document.createElement('button');
  button.className = 'sentence';
  button.type = 'button';
  button.setAttribute('aria-label', `播放例句：${sentence}`);
  const wordStart = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (wordStart === -1) {
    button.textContent = sentence;
  } else {
    button.append(sentence.slice(0, wordStart));
    const highlightedWord = document.createElement('strong');
    highlightedWord.textContent = sentence.slice(wordStart, wordStart + word.length);
    button.append(highlightedWord, sentence.slice(wordStart + word.length));
  }
  button.addEventListener('click', () => speak(sentence, button));
  return button;
}

function render() {
  const query = normalize(search.value);
  const matches = IRREGULAR_VERBS.filter((verb) => normalize(`${verb.meaning}${verb.base}${verb.past}${verb.participle}`).includes(query));
  count.textContent = `顯示 ${matches.length} 個動詞`;
  list.replaceChildren();
  if (!matches.length) {
    list.innerHTML = '<p class="empty">找不到符合的動詞。</p>';
    return;
  }
  matches.forEach((verb) => {
    const card = document.createElement('article');
    card.className = 'verb-card';
    const number = document.createElement('span');
    number.className = 'number';
    number.textContent = verb.id;
    const meaning = document.createElement('button');
    meaning.className = 'meaning';
    meaning.type = 'button';
    meaning.textContent = verb.meaning;
    meaning.setAttribute('aria-label', `依序播放 ${verb.base}、${verb.past}、${verb.participle}，再播放中文意思 ${verb.meaning}`);
    meaning.addEventListener('click', () => speakVerb(verb, meaning));
    card.append(number, meaning);
    card.append(
      form('原形', verb.base),
      form('過去式', verb.past),
      form('過去分詞', verb.participle),
    );
    const examples = document.createElement('div');
    examples.className = 'examples';
    exampleSentences(verb).forEach((example) => examples.append(sentenceExample(example)));
    card.append(examples);
    list.append(card);
  });
}

search.addEventListener('input', render);
stopButton.addEventListener('click', () => { stopSpeaking(); setStatus('已停止發音'); });
window.addEventListener('beforeunload', stopSpeaking);
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => chooseAmericanVoice();
render();
