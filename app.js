const list = document.querySelector('#verb-list');
const search = document.querySelector('#search');
const count = document.querySelector('#result-count');
const status = document.querySelector('#voice-status');
const stopButton = document.querySelector('#stop-speaking');

let activeButton = null;

function normalize(value) {
  return value.toLocaleLowerCase().replaceAll(' ', '');
}

function setStatus(message) {
  status.textContent = message;
}

function chooseAmericanVoice() {
  return speechSynthesis.getVoices().find((voice) => /^en-US/i.test(voice.lang)) || null;
}

function stopSpeaking() {
  speechSynthesis.cancel();
  if (activeButton) activeButton.classList.remove('is-speaking');
  activeButton = null;
  stopButton.disabled = true;
}

function speak(word, button) {
  if (!('speechSynthesis' in window)) {
    setStatus('此瀏覽器不支援網頁發音功能。請改用最新版 Chrome、Edge 或 Safari。');
    return;
  }

  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(word.replaceAll('/', ' or '));
  utterance.lang = 'en-US';
  utterance.rate = 0.82;
  utterance.voice = chooseAmericanVoice();
  activeButton = button;
  button.classList.add('is-speaking');
  stopButton.disabled = false;
  setStatus(`正在播放：${word}`);
  utterance.onend = () => { stopSpeaking(); setStatus('準備就緒'); };
  utterance.onerror = () => { stopSpeaking(); setStatus('無法播放發音。請確認瀏覽器允許音訊。'); };
  speechSynthesis.speak(utterance);
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
    card.innerHTML = `<span class="number">${verb.id}</span><span class="meaning">${verb.meaning}</span>`;
    card.append(form('原形', verb.base), form('過去式', verb.past), form('過去分詞', verb.participle));
    list.append(card);
  });
}

search.addEventListener('input', render);
stopButton.addEventListener('click', () => { stopSpeaking(); setStatus('已停止發音'); });
window.addEventListener('beforeunload', stopSpeaking);
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => chooseAmericanVoice();
render();
