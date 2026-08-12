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

const PHONICS_COMBINATIONS = [
  { text: 'ture', ipa: 'tʃər' }, { text: 'dge', ipa: 'dʒ' }, { text: 'ck', ipa: 'k' },
  { text: 'wr', ipa: 'r', startOnly: true }, { text: 'ph', ipa: 'f' }, { text: 'sh', ipa: 'ʃ' },
  { text: 'kn', ipa: 'n', startOnly: true }, { text: 'qu', ipa: 'kw' }, { text: 'mb', ipa: 'm', endOnly: true },
];

function phonicsCombinationAt(word, index) {
  const lowerWord = word.toLowerCase();
  return PHONICS_COMBINATIONS.find(({ text, startOnly, endOnly }) => (
    lowerWord.startsWith(text, index)
    && (!startOnly || index === 0)
    && (!endOnly || index + text.length === word.length)
  ));
}

function vowelGroupAt(word, index) {
  const match = word.slice(index).match(/^(ai|au|aw|ay|ea|ee|ei|ey|ie|oa|oe|oi|oo|ou|ow|oy|ue|ui|[aeiouy])/i);
  return match?.[0] || '';
}

const NO_IPA_WORDS = new Set([
  'a', 'an', 'the', 'i', "i've", 'me', 'my', 'mine', 'we', 'our', 'ours', 'you', 'your', 'yours',
  'he', 'him', 'his', 'she', 'her', 'hers', 'it', 'its', 'they', 'them', 'their', 'theirs',
  'to', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'with', 'after', 'before', 'behind', 'beside',
  'between', 'by', 'during', 'into', 'near', 'off', 'on', 'onto', 'over', 'since', 'through', 'toward',
  'under', 'up', 'while', 'within', 'without',
]);

function appendAnnotatedWord(parent, rawWord, isTarget = false, showIpa = true) {
  const word = rawWord.toLowerCase();
  const vowels = WORD_VOWELS[word];
  if (!vowels || !showIpa) {
    parent.append(rawWord);
    return;
  }

  const token = document.createElement('span');
  token.className = isTarget ? 'annotated-word target-word' : 'annotated-word';
  let cursor = 0;
  let vowelIndex = 0;
  while (cursor < rawWord.length) {
    const combination = phonicsCombinationAt(rawWord, cursor);
    if (combination) {
      const group = document.createElement('span');
      group.className = 'phonics-combination';
      group.textContent = rawWord.slice(cursor, cursor + combination.text.length);
      const symbol = document.createElement('span');
      symbol.className = 'combo-symbol';
      symbol.textContent = `/${combination.ipa}/`;
      group.append(symbol);
      token.append(group);
      vowelIndex += vowelGroups(combination.text).length;
      cursor += combination.text.length;
      continue;
    }

    const groupText = vowelGroupAt(rawWord, cursor);
    if (!groupText) {
      token.append(rawWord[cursor]);
      cursor += 1;
      continue;
    }

    const vowel = document.createElement('span');
    vowel.className = 'annotated-vowel';
    vowel.textContent = groupText;
    if (vowels[vowelIndex]) {
      const symbol = document.createElement('span');
      symbol.className = 'vowel-symbol';
      symbol.textContent = `/${vowels[vowelIndex]}/`;
      vowel.append(symbol);
    }
    token.append(vowel);
    vowelIndex += 1;
    cursor += groupText.length;
  }
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
    appendAnnotatedWord(parent, token, isTarget, isTarget || !NO_IPA_WORDS.has(token.toLowerCase()));
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
document.querySelectorAll('.phonics-guide-sound').forEach((button) => {
  button.addEventListener('click', () => speak(button.dataset.sound, button));
});
window.addEventListener('beforeunload', stopSpeaking);
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => chooseAmericanVoice();
render();
