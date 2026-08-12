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
    utterance.rate = part.rate ?? 0.9;
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

function speak(word, button, rate = 0.9) {
  setStatus(`正在播放：${word}`);
  startSpeech([{ text: word, lang: 'en-US', rate }], button);
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

function vowelGroups(word) {
  return [...word.matchAll(/ai|au|aw|ay|ea|ee|ei|ey|ie|oa|oe|oi|oo|ou|ow|oy|ue|ui|[aeiouy]/gi)];
}

function appendAnnotatedWord(parent, rawWord, isTarget = false) {
  const word = rawWord.toLowerCase();
  const vowels = WORD_VOWELS[word];
  if (!vowels) {
    parent.append(rawWord);
    return;
  }

  const token = document.createElement('span');
  token.className = isTarget ? 'annotated-word target-word' : 'annotated-word';
  const groups = vowelGroups(rawWord);
  let cursor = 0;
  groups.forEach((match, index) => {
    token.append(rawWord.slice(cursor, match.index));
    const vowel = document.createElement('span');
    vowel.className = 'annotated-vowel';
    vowel.textContent = match[0];
    if (vowels[index]) {
      const symbol = document.createElement('span');
      symbol.className = 'vowel-symbol';
      symbol.textContent = `/${vowels[index]}/`;
      vowel.append(symbol);
    }
    token.append(vowel);
    cursor = match.index + match[0].length;
  });
  token.append(rawWord.slice(cursor));
  parent.append(token);
}

function appendAnnotatedText(parent, text, highlightedWord = '') {
  let highlightAvailable = highlightedWord.toLowerCase();
  const tokens = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?|[^A-Za-z]+/g) || [text];
  tokens.forEach((token) => {
    if (!/^[A-Za-z]/.test(token)) {
      parent.append(token);
      return;
    }
    const isTarget = token.toLowerCase() === highlightAvailable;
    if (isTarget) highlightAvailable = '';
    appendAnnotatedWord(parent, token, isTarget);
  });
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
  appendAnnotatedText(button, word);
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
  appendAnnotatedText(button, sentence, word);
  button.addEventListener('click', () => speak(sentence, button, 0.8));
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
