import test from 'node:test';
import assert from 'node:assert/strict';
import { cardsToCSV, parseNumber, parseCommand, parseMeasurement, applyMeasurements, validateCard } from '../dist/measurements.js';

const captures = [
  ['ഷോൾഡർ 14 അര ഇഞ്ച് കൈനീളം അഞ്ചര ഇഞ്ച്', 'blouse', { shoulder: [14.5, 'in'], 'sleeve length': [5.5, 'in'] }],
  ['തോൾ പതിനാലര ഇഞ്ച്, കൈ നീളം അഞ്ചര ഇഞ്ച്', 'blouse', { shoulder: [14.5, 'in'], 'sleeve length': [5.5, 'in'] }],
  ['SHOULDER 14½ inches; sleeve 5¾ inches', 'blouse', { shoulder: [14.5, 'in'], 'sleeve length': [5.75, 'in'] }],
  ['shoulder14.5in, sleeve5.5in', 'blouse', { shoulder: [14.5, 'in'], 'sleeve length': [5.5, 'in'] }],
  ['കൈ നീളം ആറേകാൽ ഇഞ്ച്', 'blouse', { 'sleeve length': [6.25, 'in'] }],
  ['സ്ലീവ് 6.25 ഇഞ്ച് ആക്കൂ', 'blouse', { 'sleeve length': [6.25, 'in'] }],
  ['അരവണ്ണം മുപ്പത് ഇഞ്ച്', 'blouse', { waist: [30, 'in'] }],
  ['അരവണ്ണം മുപ്പത്തിരണ്ട് ഇഞ്ച്', 'blouse', { waist: [32, 'in'] }],
  ['ബ്ലൗസ് നീളം പതിനെട്ടര ഇഞ്ച്', 'blouse', { 'blouse length': [18.5, 'in'] }],
  ['ബ്ലൗസ്നീളം 18 ഇഞ്ച്', 'blouse', { 'blouse length': [18, 'in'] }],
  ['വീതി ൧൪൨ സെന്റിമീറ്റർ ഉയരം ൨൧൦ സെന്റിമീറ്റർ', 'window', { width: [142, 'cm'], drop: [210, 'cm'] }],
  ['width one hundred forty-two centimetres and drop two hundred and ten centimetres', 'window', { width: [142, 'cm'], drop: [210, 'cm'] }],
  ['चौड़ाई १४२ सेंटीमीटर, ऊंचाई २१० सेंटीमीटर', 'window', { width: [142, 'cm'], drop: [210, 'cm'] }],
  ['चौड़ाई एक सौ बयालीस सेंटीमीटर और ऊँचाई दो सौ दस सेंटीमीटर', 'window', { width: [142, 'cm'], drop: [210, 'cm'] }],
  ['कंधा चौदह इंच', 'blouse', { shoulder: [14, 'in'] }],
  ['आस्तीन की लंबाई साढ़े पांच इंच', 'blouse', { 'sleeve length': [5.5, 'in'] }],
  ['आस्तीन सवा छह इंच करो', 'blouse', { 'sleeve length': [6.25, 'in'] }],
  ['कमर बत्तीस इंच है', 'blouse', { waist: [32, 'in'] }],
  ['desk depth 60 centimetres', 'custom', { 'desk depth': [60, 'cm'] }],
  ['മേശ വീതി 90 സെന്റിമീറ്റർ', 'custom', { 'മേശ വീതി': [90, 'cm'] }],
  ['width 142 cm, drop 210 cm', 'custom', { width: [142, 'cm'], drop: [210, 'cm'] }],
];
for (const [phrase, template, expected] of captures) test(`capture: ${phrase}`, () => {
  const result = parseCommand(phrase, template);
  assert.equal(result.type, 'measure');
  assert.deepEqual(result.issues, []);
  assert.deepEqual(applyMeasurements({}, result), Object.fromEntries(Object.entries(expected).map(([label, [value, unit]]) => [label, { value, unit }])));
});

const numbers = [
  ['14 അര', 14.5], ['പതിനാല് അര', 14.5], ['അര', .5], ['ആറേകാൽ', 6.25], ['6 കാൽ', 6.25], ['6 മുക്കാൽ', 6.75],
  ['പതിനൊന്നര', 11.5], ['മുപ്പത്തിരണ്ട്', 32], ['നാൽപ്പത്തിയഞ്ച്', 45], ['അൻപത്', 50],
  ['one thousand two hundred thirty four', 1234], ['fourteen point zero five', 14.05], ['പതിനാല് പോയിന്റ് അഞ്ച്', 14.5],
  ['चौदह दशमलव पांच', 14.5], ['डेढ़', 1.5], ['ढाई', 2.5], ['सवा छह', 6.25], ['साढ़े पांच', 5.5],
  ['one quarter', .25], ['three quarters', .75], ['.5', .5], ['0.5', .5], ['6 and 1 / 4', 6.25], ['1/2', .5], ['2 1/4', 2.25],
];
for (const [phrase, expected] of numbers) test(`number: ${phrase}`, () => assert.equal(parseNumber(phrase), expected));

const units = [['in', ['in', 'inch', 'inches', 'ഇഞ്ച്', 'ഇഞ്ചു', 'इंच', '″', '"']], ['cm', ['cm', 'centimetre', 'centimeters', 'സെന്റിമീറ്റർ', 'सेंटीमीटर']], ['mm', ['mm', 'millimetres', 'മില്ലിമീറ്റർ', 'मिलीमीटर']], ['ft', ['ft', 'feet', 'അടി', 'फीट', '′']]];
for (const [unit, variants] of units) for (const spelling of variants) for (const value of [.5, 6.25, 142]) test(`unit: ${value} ${spelling}`, () => assert.deepEqual(parseMeasurement(`${value} ${spelling}`), { value, unit }));

for (const input of ['', 'and', 'one hundred and', 'fourteen fifteen', '14 or 40', '-14', 'minus fourteen', '14 15', '1/0', '5/4', 'constructor', '__proto__', 'NaN', 'Infinity', '1e3', 'ഒന്നുമില്ല', 'एक या दो', 'one thousand two thousand']) test(`reject number: ${input}`, () => assert.equal(parseNumber(input), null));
for (const input of ['0 inches', '0.0000001 inches', '-14 inches', '100001 mm', '14 inches cm', '14 in or 40 in', '14 inchworm', '14 സെന്റിമീറ്റർxyz', '14 cm extra', '14', 'and inches', '14 inches shoulder 15 inches']) test(`clarify measurement: ${input}`, () => assert.ok(parseMeasurement(input).error));

test('unit defaults are explicit and spoken units override them', () => {
  assert.deepEqual(parseMeasurement('14', 'cm'), { value: 14, unit: 'cm' });
  assert.deepEqual(parseMeasurement('14 inches', 'cm'), { value: 14, unit: 'in' });
  assert.ok(parseMeasurement('14', 'yards').error);
});
test('duplicate aliases and contradictory corrections remove only the unclear field', () => {
  const previous = { shoulder: { value: 14.5, unit: 'in' }, waist: { value: 32, unit: 'in' } };
  for (const phrase of ['shoulder 14 in തോൾ 15 ഇഞ്ച്', 'shoulder fourteen or forty inches']) {
    const result = parseCommand(phrase);
    assert.equal(result.updates.length, 0);
    assert.deepEqual(applyMeasurements(previous, result), { waist: previous.waist });
  }
});
test('valid corrections preserve other measurements', () => {
  const previous = { shoulder: { value: 14.5, unit: 'in' }, 'sleeve length': { value: 5.5, unit: 'in' } };
  for (const phrase of ['change sleeve to 6.25 inches', 'സ്ലീവ് ആറേകാൽ ഇഞ്ച് ആക്കൂ', 'बदलो आस्तीन सवा छह इंच करो']) {
    const result = parseCommand(phrase);
    assert.deepEqual(result.issues, []);
    assert.deepEqual(applyMeasurements(previous, result), { shoulder: previous.shoulder, 'sleeve length': { value: 6.25, unit: 'in' } });
  }
});
for (const phrase of ['not shoulder 14 inches', 'do not change shoulder 14 inches', 'കൈനീളമുള്ള 5 ഇഞ്ച്', 'shoulderboard 14 inches']) test(`do not match embedded fields: ${phrase}`, () => assert.equal(parseCommand(phrase).type, 'unknown'));
for (const [type, phrases] of Object.entries({ review: ['review', 'വായിക്കൂ', 'पढ़कर सुनाओ', 'पढ़कर सुनाओ'], save: ['save', 'സേവ് ചെയ്യൂ', 'सेव करो'], undo: ['undo', 'തിരിച്ചു', 'वापस करो'], cancel: ['cancel', 'റദ്ദാക്കൂ', 'रद्द करो'] })) for (const phrase of phrases) test(`command: ${phrase}`, () => assert.equal(parseCommand(phrase).type, type));
for (const phrase of ['open card 104', 'open card one hundred and four', 'കാർഡ് 104 തുറക്കൂ', 'കാർഡ് ൧൦൪ തുറക്കൂ', 'कार्ड १०४ खोलो']) test(`retrieve: ${phrase}`, () => assert.deepEqual(parseCommand(phrase), { type: 'open', id: '104' }));

test('saved cards reject impossible values and template mismatches', () => {
  const card = { id: '104', template: 'blouse', name: 'Sample', fields: { shoulder: { value: 14.5, unit: 'in' } } };
  assert.ok(validateCard(card));
  for (const invalid of [{ ...card, id: '0' }, { ...card, template: 'constructor' }, { ...card, name: 'x'.repeat(81) }, { ...card, fields: [] }, { ...card, fields: { width: { value: 14, unit: 'cm' } } }, ...[0, -1, Infinity, NaN, 100001].map(value => ({ ...card, fields: { shoulder: { value, unit: 'in' } } }))]) assert.ok(!validateCard(invalid));
});

test('CSV retains exact values, Unicode names, commas, quotes and line breaks', () => {
  const csv = cardsToCSV([{ id: '104', name: 'അളവ്, "sample"\nroom', fields: { width: { value: 142.25, unit: 'cm' } } }]);
  assert.equal(csv, '"card_id","name","field","value","unit"\r\n"104","അളവ്, ""sample""\nroom","width","142.25","cm"');
});
test('CSV exports formula-like names as literal text', () => {
  for (const name of ['=1+1', '+SUM(1)', '-1', '@SUM(1)', '\t=1', '  =1']) {
    const csv = cardsToCSV([{ id: '104', name, fields: { width: { value: 142, unit: 'cm' } } }]);
    assert.ok(csv.includes(`"'${name}"`), name);
  }
});
