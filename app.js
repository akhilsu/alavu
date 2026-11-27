import { TEMPLATES, UNIT_NAMES, parseCommand, parseMeasurement, applyMeasurements, validateCard, readFields } from './measurements.js';

const $ = id => document.getElementById(id);
const STORAGE_KEY = 'alavu.cards.v1';
let current = { template: 'blouse', name: '', fields: {}, id: null };
let issues = [];
let history = [];
let reviewed = false;
let dirty = false;
let wantMicrophone = false;
let recognition = null;
let listening = false;
let speaking = false;
let speechGeneration = 0;
let storageProblem = '';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function readStoredCards() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(data)) throw new Error('Invalid cards');
    return data.filter(validateCard).map(card => ({ ...card, updatedAt: typeof card.updatedAt === 'string' && !Number.isNaN(Date.parse(card.updatedAt)) ? card.updatedAt : new Date(0).toISOString() }));
  } catch {
    storageProblem = 'Device storage is unavailable or unreadable. Export your current card before closing.';
    return [];
  }
}

function setStatus(title, hint) {
  $('voice-status').textContent = title;
  if (hint) $('voice-hint').textContent = hint;
  $('mode-badge').textContent = speaking ? 'Reading back' : listening ? 'Listening' : 'Microphone off';
  $('mode-badge').classList.toggle('active', listening);
  $('mic-button').classList.toggle('listening', wantMicrophone);
  $('mic-button').setAttribute('aria-label', wantMicrophone ? 'Stop microphone' : 'Start microphone');
}

function stopRecognition() {
  if (recognition) {
    recognition.onend = null;
    recognition.onerror = null;
    recognition.onresult = null;
    recognition.abort();
    recognition = null;
  }
  listening = false;
}

function startRecognition() {
  if (!wantMicrophone || speaking || recognition || !SpeechRecognition) return;
  const engine = new SpeechRecognition();
  engine.lang = $('language').value;
  engine.interimResults = true;
  engine.continuous = true;
  engine.maxAlternatives = 1;
  recognition = engine;
  engine.onstart = () => {
    listening = true;
    setStatus('Listening to you', 'Say a measurement or a command. Tap the microphone to stop.');
  };
  engine.onresult = event => {
    for (let index = event.resultIndex; index < event.results.length; index++) {
      const result = event.results[index];
      $('last-heard').textContent = result[0].transcript;
      if (!result.isFinal) continue;
      if (result[0].confidence > 0 && result[0].confidence < .55) {
        respond('I could not hear that clearly. Please repeat the field, value and unit.');
        return;
      }
      handleCommand(result[0].transcript, 'Live microphone');
      return;
    }
  };
  engine.onerror = event => {
    wantMicrophone = false;
    stopRecognition();
    const hints = {
      'not-allowed': 'Microphone access was declined. Enable it in the browser or use Wispr Flow in the transcript field.',
      'audio-capture': 'A microphone is unavailable. Connect one or use the transcript field.',
      'network': 'The browser speech service could not connect. Try again or dictate with Wispr Flow.',
      'no-speech': 'No speech was detected. Tap the microphone and try again.',
    };
    setStatus('Microphone paused', hints[event.error] || 'Speech recognition stopped. Tap the microphone to retry.');
  };
  engine.onend = () => {
    recognition = null;
    listening = false;
    if (wantMicrophone && !speaking) startRecognition();
  };
  try {
    engine.start();
  } catch {
    wantMicrophone = false;
    recognition = null;
    setStatus('Microphone unavailable', 'Use Chrome on localhost or HTTPS, or enter a transcript below.');
  }
}

function respond(message) {
  $('reply').textContent = message;
  const generation = ++speechGeneration;
  stopRecognition();
  if (!window.speechSynthesis) {
    speaking = false;
    setStatus('Read the confirmation', 'Voice readback is unavailable. Check the confirmation on screen.');
    startRecognition();
    return;
  }
  speechSynthesis.cancel();
  speaking = true;
  setStatus('Reading it back', 'Check the number and unit as you hear them.');
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'en-IN';
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(voice => voice.lang === 'en-IN') || voices.find(voice => voice.lang.startsWith('en')) || null;
  utterance.rate = .94;
  let completed = false;
  const finish = () => {
    if (completed || generation !== speechGeneration) return;
    completed = true;
    speaking = false;
    setStatus('Ready for your next measurement', 'Say another measurement, a correction, review, or save.');
    startRecognition();
  };
  utterance.onend = finish;
  utterance.onerror = finish;
  speechSynthesis.speak(utterance);
  // A failed voice provider must leave the text interface usable.
  setTimeout(finish, Math.max(10000, message.length * 120));
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function render() {
  const template = TEMPLATES[current.template];
  $('template').value = current.template;
  $('card-heading').textContent = template.title;
  $('card-name').value = current.name;
  $('card-number').textContent = current.id ? `#${current.id}${dirty ? ' · unsaved edits' : ''}` : 'Draft';
  const fields = [...new Set([...template.fields, ...Object.keys(current.fields)])];
  $('measurements').replaceChildren();
  for (const label of fields) {
    const field = current.fields[label];
    const row = makeElement('div', 'measurement');
    row.append(makeElement('span', 'field-label', label));
    const value = makeElement('span', `field-value${field ? '' : ' empty'}`, field ? String(field.value) : '—');
    if (field) value.append(makeElement('small', '', field.unit));
    const edit = makeElement('button', 'measurement-edit', field ? 'Correct' : 'Add');
    edit.setAttribute('aria-label', `${field ? 'Correct' : 'Add'} ${label}`);
    edit.addEventListener('click', () => correctField(label));
    value.append(edit);
    row.append(value);
    $('measurements').append(row);
  }
  $('pending').hidden = issues.length === 0;
  $('pending').textContent = issues.map(issue => issue.message).join(' ');
  const count = Object.keys(current.fields).length;
  $('card-state').textContent = storageProblem || (count ? `${count} measurement${count === 1 ? '' : 's'} · ${reviewed ? 'reviewed, ready to confirm' : 'read back before saving'}` : 'Add your first measurement by speaking.');
  $('confirm').disabled = !count || issues.length > 0 || !reviewed;
  $('review').disabled = !count;
  renderSavedCards();
}

function renderSavedCards() {
  const cards = readStoredCards().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  $('saved-cards').replaceChildren();
  if (!cards.length) $('saved-cards').append(makeElement('p', 'empty-state', 'Your confirmed cards will appear here.'));
  for (const card of cards) {
    const button = makeElement('button', 'saved-card');
    const title = makeElement('span', '', card.name || TEMPLATES[card.template].title);
    title.append(makeElement('small', '', `${Object.keys(card.fields).length} measurements · ${new Date(card.updatedAt).toLocaleDateString('en-IN')}`));
    button.append(title, makeElement('b', '', `#${card.id}`));
    button.addEventListener('click', () => openCard(card.id));
    $('saved-cards').append(button);
  }
}

function remember() {
  history.push(structuredClone({ current, issues, reviewed, dirty }));
  if (history.length > 20) history.shift();
}

function startCard(template, name = '') {
  if (dirty && !window.confirm('Start a new card and discard the unsaved draft?')) return;
  current = { template, name, fields: {}, id: null };
  issues = [];
  history = [];
  reviewed = false;
  dirty = false;
  render();
  const firstFields = TEMPLATES[template].fields.slice(0, 2).join(' and ');
  respond(firstFields ? `New ${TEMPLATES[template].title}. Say ${firstFields} with numbers and units.` : 'New custom card. Say a label, a number and a unit, such as desk depth 60 centimetres.');
}

function reviewCard() {
  if (!Object.keys(current.fields).length) return respond('Add a measurement first.');
  if (issues.length) return respond(`Please resolve the unclear measurements first. ${issues.map(issue => issue.message).join(' ')}`);
  reviewed = true;
  render();
  const missing = TEMPLATES[current.template].fields.filter(label => !current.fields[label]);
  const partial = missing.length ? ` This card is partial. Missing ${missing.join(', ')}.` : '';
  respond(`${readFields(current.fields)}.${partial} Check every value and unit. Say save to confirm, or say a correction.`);
}

function saveCard() {
  if (!reviewed || issues.length || !Object.keys(current.fields).length) return reviewCard();
  try {
    const cards = readStoredCards();
    if (storageProblem) throw new Error('Storage unavailable');
    const occupiedIds = new Set(cards.map(card => String(card.id)));
    let id = current.id;
    while (!id || (!current.id && occupiedIds.has(id))) {
      id = String(100 + crypto.getRandomValues(new Uint32Array(1))[0] % 9900);
    }
    const card = { ...structuredClone(current), id, updatedAt: new Date().toISOString() };
    if (!validateCard(card)) throw new Error('Invalid measurement card');
    const next = cards.filter(saved => saved.id !== id);
    next.push(card);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    current = { ...card };
    dirty = false;
    reviewed = false;
    history = [];
    render();
    respond(`Saved ${current.name || TEMPLATES[current.template].title} on this device. Card ${id}.`);
  } catch {
    storageProblem = 'Could not save on this device. Export the card as CSV before closing.';
    render();
    respond(storageProblem);
  }
}

function openCard(id) {
  const card = readStoredCards().find(item => String(item.id) === String(id));
  if (!card) return respond(`Card ${id} was not found on this device.`);
  if (dirty && !window.confirm('Open the saved card and discard the unsaved draft?')) return;
  current = structuredClone(card);
  issues = [];
  reviewed = false;
  dirty = false;
  history = [];
  render();
  respond(`${current.name || TEMPLATES[current.template].title}. ${readFields(current.fields)}.`);
}

function correctField(label) {
  const previous = current.fields[label];
  const answer = window.prompt(`Enter ${label} with its unit.`, previous ? `${previous.value} ${UNIT_NAMES[previous.unit]}` : '');
  if (answer === null) return;
  const parsed = parseMeasurement(answer, $('unit').value);
  if (parsed.error) return respond(parsed.error);
  remember();
  current.fields[label] = parsed;
  issues = issues.filter(issue => issue.label !== label);
  dirty = true;
  reviewed = false;
  render();
  respond(`${label} ${parsed.value} ${UNIT_NAMES[parsed.unit]}. Say review before saving.`);
}

function handleCommand(text, source) {
  $('last-heard').textContent = text;
  $('mode-badge').textContent = source;
  const result = parseCommand(text, current.template, $('unit').value);
  if (result.type === 'review') return reviewCard();
  if (result.type === 'save') return saveCard();
  if (result.type === 'open') return openCard(result.id);
  if (result.type === 'new') return startCard(result.template, result.name);
  if (result.type === 'unknown') return respond(result.message);
  if (result.type === 'undo') {
    const previous = history.pop();
    if (!previous) return respond('There is no unsaved change to undo.');
    ({ current, issues, reviewed, dirty } = previous);
    render();
    return respond(`Last change undone. ${readFields(current.fields) || 'The card is empty'}.`);
  }
  if (result.type === 'cancel') {
    issues = [];
    reviewed = false;
    render();
    return respond('Unclear inputs discarded. Say review to check the remaining fields.');
  }
  remember();
  current.fields = applyMeasurements(current.fields, result);
  const handled = new Set([...result.updates, ...result.issues].map(item => item.label));
  issues = [...issues.filter(issue => !handled.has(issue.label)), ...result.issues];
  dirty = true;
  reviewed = false;
  render();
  const captured = readFields(Object.fromEntries(result.updates.map(update => [update.label, update])));
  respond([captured && `${captured}.`, ...issues.map(issue => issue.message), issues.length ? '' : 'Say another measurement or review.'].filter(Boolean).join(' '));
}

$('mic-button').addEventListener('click', () => {
  if (!SpeechRecognition) {
    $('transcript-details').open = true;
    setStatus('Use a transcript', 'This browser does not provide speech recognition. Dictate with Wispr Flow in the field below.');
    return;
  }
  wantMicrophone = !wantMicrophone;
  if (wantMicrophone) {
    ++speechGeneration;
    window.speechSynthesis?.cancel();
    speaking = false;
    startRecognition();
  } else {
    stopRecognition();
    setStatus('Microphone off', 'Tap to start again. You can still use the transcript field.');
  }
});
$('language').addEventListener('change', () => { stopRecognition(); startRecognition(); });
$('template').addEventListener('change', event => { const selected = event.target.value; startCard(selected); render(); });
$('new-card').addEventListener('click', () => startCard($('template').value));
$('card-name').addEventListener('input', event => { current.name = event.target.value; dirty = true; reviewed = false; $('confirm').disabled = true; });
$('review').addEventListener('click', reviewCard);
$('confirm').addEventListener('click', saveCard);
$('command-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = $('command').value.trim();
  if (text) handleCommand(text, 'Text transcript');
  $('command').value = '';
});
const samples = [
  ['Mixed Malayalam + English', 'Shoulder പതിനാലര inch, sleeve അഞ്ചര inch'],
  ['Correct a fraction', 'Change sleeve to six and a quarter inches'],
  ['Unclear measurement', 'Shoulder fourteen or forty inches'],
  ['Window dimensions', 'Width 142 centimetres, drop 210 centimetres'],
];
for (const [label, text] of samples) {
  const button = makeElement('button', '', label);
  button.addEventListener('click', () => handleCommand(text, 'Sample transcript'));
  $('samples').append(button);
}
$('help-button').addEventListener('click', () => $('help-dialog').showModal());
$('export').addEventListener('click', () => {
  const saved = readStoredCards();
  const cards = Object.keys(current.fields).length && dirty ? [...saved, { ...current, id: 'unsaved-draft' }] : saved;
  if (!cards.length) return respond('Add a measurement or open a saved card before exporting.');
  const quote = value => `"${String(value).replaceAll('"', '""')}"`;
  const rows = [['card_id', 'name', 'field', 'value', 'unit'], ...cards.flatMap(card => Object.entries(card.fields).map(([label, field]) => [card.id, card.name, label, field.value, field.unit]))];
  const blob = new Blob([rows.map(row => row.map(quote).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'alavu-measurements.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) renderSavedCards(); });
window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
render();
if (!SpeechRecognition) $('voice-hint').textContent = 'Use Chrome for live speech, or dictate with Wispr Flow in the transcript field.';
