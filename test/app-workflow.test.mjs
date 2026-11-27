// Execute the real app against small DOM/speech/storage doubles. These tests
// cover application state and browser events, not speech-provider accuracy.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import * as parser from '../dist/measurements.js';

function boot({ cards = [], storageFails = false, speech = true } = {}) {
  class Element {
    constructor() { this.value = ''; this.textContent = ''; this.children = []; this.events = {}; this.disabled = false; this.classList = { toggle() {} }; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(key, value) { this[key] = value; }
    addEventListener(name, fn) { this.events[name] = fn; }
    click() { this.events.click?.({}); }
  }
  const elements = new Map();
  const get = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  const document = { getElementById: get, createElement: () => new Element() };
  get('template').value = 'blouse'; get('language').value = 'ml-IN';
  const engines = [], utterances = [];
  class Recognition {
    constructor() { engines.push(this); }
    start() { this.onstart?.(); }
    abort() { this.aborted = true; this.onend?.(); }
  }
  let storage = JSON.stringify(cards);
  const localStorage = { getItem: () => storage, setItem: (_, value) => { if (storageFails) throw new Error('Quota'); storage = value; } };
  const synthesis = { cancel() {}, getVoices: () => [], speak: utterance => utterances.push(utterance) };
  const window = { SpeechRecognition: Recognition, speechSynthesis: speech ? synthesis : null, confirm: () => true, addEventListener() {} };
  const context = vm.createContext({ ...parser, document, window, speechSynthesis: synthesis, SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } }, localStorage, structuredClone, crypto: { getRandomValues(array) { array[0] = 4; return array; } }, setTimeout() {}, Blob, URL, console });
  const source = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8').replace(/^import .*?;\n/, '');
  vm.runInContext(source + '\nthis.api = { handleCommand, reviewCard, saveCard, startCard, openCard, state: () => JSON.stringify({ current, issues, reviewed, dirty, speaking, listening, wantMicrophone }) };', context);
  return { api: context.api, get, engines, utterances, state: () => JSON.parse(context.api.state()), cards: () => JSON.parse(storage), done: () => utterances.at(-1)?.onend?.() };
}

test('Malayalam capture → correction → review → save → retrieve survives reload', () => {
  const app = boot();
  app.api.handleCommand('ഷോൾഡർ 14 അര ഇഞ്ച് കൈനീളം അഞ്ചര ഇഞ്ച്', 'Test transcript');
  assert.equal(app.state().current.fields.shoulder.value, 14.5);
  assert.equal(app.get('confirm').disabled, true);
  app.api.handleCommand('സ്ലീവ് ആറേകാൽ ഇഞ്ച് ആക്കൂ', 'Test transcript');
  assert.equal(app.state().current.fields['sleeve length'].value, 6.25);
  app.api.handleCommand('വായിക്കൂ', 'Test transcript');
  assert.equal(app.get('confirm').disabled, false);
  app.api.handleCommand('സേവ് ചെയ്യൂ', 'Test transcript');
  assert.equal(app.cards().length, 1);
  assert.equal(app.cards()[0].id, '104');
  const reloaded = boot({ cards: app.cards() });
  reloaded.api.handleCommand('കാർഡ് 104 തുറക്കൂ', 'Test transcript');
  assert.deepEqual(reloaded.state().current.fields, { shoulder: { value: 14.5, unit: 'in' }, 'sleeve length': { value: 6.25, unit: 'in' } });
});
test('unclear correction blocks save, recovery and undo preserve other fields', () => {
  const app = boot();
  app.api.handleCommand('shoulder 14.5 inches sleeve 5.5 inches', 'Test transcript');
  app.api.handleCommand('review', 'Test transcript');
  app.api.handleCommand('shoulder 14 or 40 inches', 'Test transcript');
  app.api.handleCommand('save', 'Test transcript');
  assert.equal(app.cards().length, 0);
  assert.equal(app.get('confirm').disabled, true);
  app.api.handleCommand('shoulder 14.5 inches', 'Test transcript');
  assert.equal(app.state().issues.length, 0);
  app.api.handleCommand('change sleeve to 6 inches', 'Test transcript');
  app.api.handleCommand('undo', 'Test transcript');
  assert.equal(app.state().current.fields['sleeve length'].value, 5.5);
  app.api.handleCommand('save', 'Test transcript');
  assert.equal(app.cards().length, 0, 'first save reviews only');
  app.api.handleCommand('save', 'Test transcript');
  assert.equal(app.cards().length, 1);
});
test('Hindi window flow and custom dimensions use the same review gate', () => {
  const app = boot();
  app.api.startCard('window');
  app.api.handleCommand('चौड़ाई एक सौ बयालीस सेंटीमीटर और ऊँचाई दो सौ दस सेंटीमीटर', 'Test transcript');
  app.api.handleCommand('पढ़कर सुनाओ', 'Test transcript');
  app.api.handleCommand('सेव करो', 'Test transcript');
  assert.equal(app.cards()[0].fields.width.value, 142);
  app.api.startCard('custom');
  app.api.handleCommand('desk depth 60 cm', 'Test transcript');
  assert.equal(app.state().current.fields['desk depth'].value, 60);
  assert.equal(app.get('confirm').disabled, true);
});
test('storage failure never reports a successful save', () => {
  const app = boot({ storageFails: true });
  app.api.handleCommand('shoulder 14 inches', 'Test transcript');
  app.api.handleCommand('review', 'Test transcript');
  app.api.handleCommand('save', 'Test transcript');
  assert.equal(app.cards().length, 0);
  assert.match(app.get('reply').textContent, /Could not save/);
});
test('speech batches retain every final result and pause while reading back', () => {
  const app = boot();
  app.get('mic-button').click();
  const engine = app.engines[0];
  assert.equal(engine.lang, 'ml-IN');
  const result = text => Object.assign([{ transcript: text, confidence: .95 }], { isFinal: true });
  engine.onresult({ resultIndex: 0, results: [result('ഷോൾഡർ 14 അര ഇഞ്ച്'), result('കൈനീളം അഞ്ചര ഇഞ്ച്')] });
  assert.equal(app.state().current.fields.shoulder.value, 14.5);
  assert.equal(app.state().current.fields['sleeve length'].value, 5.5);
  assert.equal(engine.aborted, true);
  assert.equal(app.engines.length, 1, 'no restart while speaking');
  assert.equal(engine.onend, null, 'aborting cannot trigger a restart');
  app.done();
  assert.equal(app.engines.length, 2);
  app.get('mic-button').click();
  assert.equal(app.state().wantMicrophone, false);
});
test('low-confidence live speech changes no measurements and recognition errors stop cleanly', () => {
  const app = boot();
  app.get('mic-button').click();
  app.engines[0].onresult({ resultIndex: 0, results: [Object.assign([{ transcript: 'shoulder 40 inches', confidence: .2 }], { isFinal: true })] });
  assert.deepEqual(app.state().current.fields, {});
  app.done();
  app.engines.at(-1).onerror({ error: 'no-speech' });
  assert.equal(app.state().wantMicrophone, false);
  assert.match(app.get('voice-hint').textContent, /No speech/);
});
test('without speech synthesis, the text flow remains usable', () => {
  const app = boot({ speech: false });
  app.api.handleCommand('shoulder 14 inches', 'Test transcript');
  app.api.handleCommand('review', 'Test transcript');
  app.api.handleCommand('save', 'Test transcript');
  assert.equal(app.cards().length, 1);
  assert.equal(app.state().speaking, false);
});
