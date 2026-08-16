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

function americanSpeechText(text) {
  return text.replace(/\bleads\b/gi, 'leeds').replace(/\blead\b/gi, 'leed');
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
    const spokenText = part.lang === 'en-US' ? americanSpeechText(part.text) : part.text;
    const utterance = new SpeechSynthesisUtterance(spokenText.replaceAll('/', ' or '));
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

function speakPhonicsExample(button) {
  const word = button.dataset.sound;
  if (!word) return;
  speak(word, button, 0.82);
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

function appendAnnotatedWord(parent, rawWord, isTarget = false, showIpa = true, vowelOverride = null) {
  const word = rawWord.toLowerCase();
  const vowels = vowelOverride || WORD_VOWELS[word];
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

function appendAnnotatedText(parent, text, highlightedWord = '', targetVowelOverride = null) {
  let highlightAvailable = highlightedWord.toLowerCase();
  const tokens = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?|[^A-Za-z]+/g) || [text];
  tokens.forEach((token) => {
    if (!/^[A-Za-z]/.test(token)) {
      parent.append(token);
      return;
    }
    const isTarget = token.toLowerCase() === highlightAvailable;
    if (isTarget) highlightAvailable = '';
    appendAnnotatedWord(
      parent,
      token,
      isTarget,
      isTarget || !NO_IPA_WORDS.has(token.toLowerCase()),
      isTarget ? targetVowelOverride : null,
    );
  });
}

function form(label, word, vowelOverride = null) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form';
  const caption = document.createElement('span');
  caption.className = 'form-label';
  caption.textContent = label;
  const button = document.createElement('button');
  button.className = 'word';
  button.type = 'button';
  appendAnnotatedText(button, word, word, vowelOverride);
  button.setAttribute('aria-label', `播放 ${word} 的美式英文發音`);
  button.addEventListener('click', () => speak(word, button));
  wrapper.append(caption, button);
  return wrapper;
}

function sentenceExample({ sentence, word, vowels = null }) {
  const button = document.createElement('button');
  button.className = 'sentence';
  button.type = 'button';
  button.setAttribute('aria-label', `播放例句：${sentence}`);
  appendAnnotatedText(button, sentence, word, vowels);
  button.addEventListener('click', () => speak(sentence, button, 0.72));
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
      form('Base Form', verb.base, FORM_VOWEL_OVERRIDES[verb.id]?.base),
      form('Past Tense', verb.past, FORM_VOWEL_OVERRIDES[verb.id]?.past),
      form('Past Participle', verb.participle, FORM_VOWEL_OVERRIDES[verb.id]?.participle),
    );
    const examples = document.createElement('div');
    examples.className = 'examples';
    exampleSentences(verb).forEach((example) => examples.append(sentenceExample(example)));
    card.append(examples);
    list.append(card);
  });
}

const practiceForm = document.querySelector('#practice-form');
const practiceRange = document.querySelector('#practice-range');
const practiceMode = document.querySelector('#practice-mode');
const practiceStatus = document.querySelector('#practice-status');
const practiceArea = document.querySelector('#practice-area');
let practiceVerbs = [];
let practiceIndex = 0;
let flashcardFlipped = false;
let quizQuestions = [];
let quizScore = 0;

function parsePracticeRange(value) {
  const match = value.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
  if (!match) return null;
  const first = Number(match[1]);
  const last = Number(match[2] || match[1]);
  if (first < 1 || last < first) return null;
  return { first, last };
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function practiceButton(label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', action);
  return button;
}

function renderFlashcard() {
  const verb = practiceVerbs[practiceIndex];
  practiceArea.replaceChildren();
  const card = document.createElement('div');
  card.className = 'study-card';
  const number = document.createElement('p');
  number.className = 'card-number';
  number.textContent = `第 ${practiceIndex + 1} / ${practiceVerbs.length} 張 · 編號 ${verb.id}`;
  const prompt = document.createElement('div');
  prompt.className = 'card-prompt';
  prompt.textContent = verb.meaning;
  const answer = document.createElement('div');
  answer.className = 'card-answer';
  answer.hidden = !flashcardFlipped;
  [
    ['Base Form', verb.base],
    ['Past Tense', verb.past],
    ['Past Participle', verb.participle],
  ].forEach(([label, word]) => {
    const item = document.createElement('span');
    const caption = document.createElement('small');
    caption.textContent = label;
    const value = document.createElement('strong');
    value.textContent = word;
    item.append(caption, value);
    answer.append(item);
  });
  const actions = document.createElement('div');
  actions.className = 'practice-actions';
  const speakButton = practiceButton('播放三態', () => speakVerb(verb, speakButton));
  actions.append(
    practiceButton('上一張', () => {
      practiceIndex = (practiceIndex - 1 + practiceVerbs.length) % practiceVerbs.length;
      flashcardFlipped = false;
      renderFlashcard();
    }),
    practiceButton(flashcardFlipped ? '隱藏答案' : '顯示答案', () => {
      flashcardFlipped = !flashcardFlipped;
      renderFlashcard();
    }),
    speakButton,
    practiceButton('下一張', () => {
      practiceIndex = (practiceIndex + 1) % practiceVerbs.length;
      flashcardFlipped = false;
      renderFlashcard();
    }),
  );
  card.append(number, prompt, answer, actions);
  practiceArea.append(card);
}

function quizFieldLabel(field) {
  return field === 'past' ? 'Past Tense（過去式）' : 'Past Participle（過去分詞）';
}

function quizOptions(answer, field) {
  const options = [answer];
  shuffle(IRREGULAR_VERBS).forEach((verb) => {
    const candidate = verb[field];
    if (options.length < 4 && !options.includes(candidate)) options.push(candidate);
  });
  return shuffle(options);
}

function renderQuiz() {
  practiceArea.replaceChildren();
  if (practiceIndex === quizQuestions.length) {
    const result = document.createElement('div');
    result.className = 'quiz-result';
    const score = document.createElement('h3');
    score.textContent = `完成！答對 ${quizScore} / ${quizQuestions.length} 題`;
    result.append(score, practiceButton('再考一次', () => startQuiz()));
    practiceArea.append(result);
    return;
  }

  const question = quizQuestions[practiceIndex];
  const card = document.createElement('div');
  card.className = 'quiz-card';
  const progress = document.createElement('p');
  progress.className = 'quiz-progress';
  progress.textContent = `第 ${practiceIndex + 1} / ${quizQuestions.length} 題`;
  const prompt = document.createElement('p');
  prompt.className = 'quiz-question';
  prompt.textContent = `「${question.verb.meaning}」的 ${quizFieldLabel(question.field)} 是？（原形：${question.verb.base}）`;
  const options = document.createElement('div');
  options.className = 'quiz-options';
  quizOptions(question.answer, question.field).forEach((option) => {
    const button = practiceButton(option, () => {
      const correct = option === question.answer;
      if (correct) quizScore += 1;
      [...options.children].forEach((choice) => {
        choice.disabled = true;
        if (choice.textContent === question.answer) choice.classList.add('is-correct');
      });
      if (!correct) button.classList.add('is-wrong');
      const next = practiceButton(
        practiceIndex + 1 === quizQuestions.length ? '查看成績' : '下一題',
        () => { practiceIndex += 1; renderQuiz(); },
      );
      card.append(next);
    });
    options.append(button);
  });
  card.append(progress, prompt, options);
  practiceArea.append(card);
}

function startFlashcards() {
  practiceIndex = 0;
  flashcardFlipped = false;
  renderFlashcard();
}

function startQuiz() {
  practiceIndex = 0;
  quizScore = 0;
  quizQuestions = shuffle(practiceVerbs).map((verb) => {
    const field = Math.random() < 0.5 ? 'past' : 'participle';
    return { verb, field, answer: verb[field] };
  });
  renderQuiz();
}

practiceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const range = parsePracticeRange(practiceRange.value);
  if (!range) {
    practiceArea.hidden = true;
    practiceStatus.textContent = '請輸入有效範圍，例如：61-90。';
    return;
  }
  practiceVerbs = IRREGULAR_VERBS.filter((verb) => verb.id >= range.first && verb.id <= range.last);
  if (!practiceVerbs.length) {
    practiceArea.hidden = true;
    practiceStatus.textContent = '此範圍沒有可練習的動詞，請調整編號。';
    return;
  }
  practiceArea.hidden = false;
  practiceStatus.textContent = `已選擇第 ${range.first}-${range.last} 號，共 ${practiceVerbs.length} 個動詞。`;
  if (practiceMode.value === 'quiz') startQuiz();
  else startFlashcards();
});

search.addEventListener('input', render);
stopButton.addEventListener('click', () => { stopSpeaking(); setStatus('已停止發音'); });
document.querySelectorAll('.phonics-guide-sound').forEach((button) => {
  button.addEventListener('click', () => speakPhonicsExample(button));
});
window.addEventListener('beforeunload', stopSpeaking);
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => chooseAmericanVoice();
render();
