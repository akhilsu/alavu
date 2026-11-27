import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNumber, parseCommand, parseMeasurement, applyMeasurements, validateCard } from '../dist/measurements.js';

test('spoken fractions, decimal words and Malayalam numbers retain exact values', () => {
  for (const [input, expected] of [['fourteen and a half', 14.5], ['six and a quarter', 6.25], ['14½', 14.5], ['5 3/4', 5.75], ['പതിനാലര', 14.5], ['൧൪.൫', 14.5], ['one hundred forty two', 142], ['two hundred and ten', 210], ['fourteen point two five', 14.25]]) {
    assert.equal(parseNumber(input), expected, input);
  }
});
test('mixed language input populates named fields and units', () => {
  const result = parseCommand('Shoulder പതിനാലര inch, sleeve അഞ്ചര inch');
  assert.deepEqual(result.issues, []);
  assert.deepEqual(applyMeasurements({}, result), { shoulder: { value: 14.5, unit: 'in' }, 'sleeve length': { value: 5.5, unit: 'in' } });
});
test('a correction changes exactly one field', () => {
  const existing = { shoulder: { value: 14.5, unit: 'in' }, 'sleeve length': { value: 5.5, unit: 'in' } };
  const next = applyMeasurements(existing, parseCommand('Change sleeve to six and a quarter inches'));
  assert.equal(next['sleeve length'].value, 6.25);
  assert.equal(next.shoulder, existing.shoulder);
});
test('unclear or contradictory input cannot retain an old value as a confirmed correction', () => {
  const result = parseCommand('Shoulder fourteen or forty inches');
  assert.equal(result.updates.length, 0);
  assert.equal(result.issues.length, 1);
  assert.deepEqual(applyMeasurements({ shoulder: { value: 14, unit: 'in' }, waist: { value: 30, unit: 'in' } }, result), { waist: { value: 30, unit: 'in' } });
  assert.equal(parseCommand('Shoulder 14 inches shoulder 40 inches').updates.length, 0);
  assert.ok(parseMeasurement('14 inches centimetres').error);
  assert.ok(parseMeasurement('14 15 inches').error);
  assert.ok(parseMeasurement('-14 inches').error);
});
test('missing units require clarification unless the user chose a default', () => {
  assert.ok(parseMeasurement('14.5').error);
  assert.deepEqual(parseMeasurement('14.5', 'in'), { value: 14.5, unit: 'in' });
});
test('window and custom cards share the measurement workflow', () => {
  assert.deepEqual(applyMeasurements({}, parseCommand('width 142 centimetres, drop 210 centimetres', 'window')), { width: { value: 142, unit: 'cm' }, drop: { value: 210, unit: 'cm' } });
  assert.deepEqual(parseCommand('desk depth 60 centimetres', 'custom').updates, [{ label: 'desk depth', value: 60, unit: 'cm' }]);
  assert.equal(parseCommand('waist 30 inches', 'window').issues.length, 1);
});
test('commands and stored-card validation reject malformed data', () => {
  assert.deepEqual(parseCommand('open card 104'), { type: 'open', id: '104' });
  assert.deepEqual(parseCommand('open card one hundred and four'), { type: 'open', id: '104' });
  assert.equal(parseCommand('review').type, 'review');
  assert.equal(parseCommand('save').type, 'save');
  assert.ok(validateCard({ id: '104', template: 'window', name: 'Living room', fields: { width: { value: 142, unit: 'cm' } } }));
  assert.ok(!validateCard({ id: '104', template: 'window', name: '', fields: { width: { value: Infinity, unit: 'cm' } } }));
});
