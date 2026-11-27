export const TEMPLATES = {
  blouse: { title: 'Blouse fitting', fields: ['shoulder', 'sleeve length', 'blouse length', 'waist'] },
  window: { title: 'Window', fields: ['width', 'drop'] },
  custom: { title: 'Custom measurements', fields: [] },
};

const ALIASES = {
  'shoulder': 'shoulder', 'shoulders': 'shoulder', 'തോൾ': 'shoulder', 'തോള്': 'shoulder', 'ഷോൾഡർ': 'shoulder',
  'sleeve length': 'sleeve length', 'sleeve': 'sleeve length', 'sleeves': 'sleeve length', 'കൈ നീളം': 'sleeve length', 'കൈനീളം': 'sleeve length', 'സ്ലീവ്': 'sleeve length',
  'ബ്ലൗസ്നീളം': 'blouse length', 'blouse length': 'blouse length', 'blouse': 'blouse length', 'ബ്ലൗസ് നീളം': 'blouse length',
  'waist': 'waist', 'അരക്കെട്ട്': 'waist', 'അരവണ്ണം': 'waist',
  'width': 'width', 'വീതി': 'width', 'चौड़ाई': 'width',
  'drop': 'drop', 'height': 'drop', 'ഉയരം': 'drop', 'ऊंचाई': 'drop', 'ऊँचाई': 'drop',
  'depth': 'depth', 'ആഴം': 'depth', 'length': 'length', 'നീളം': 'length', 'लंबाई': 'length',
  'कंधा': 'shoulder', 'कंधे': 'shoulder', 'बाजू': 'sleeve length', 'आस्तीन': 'sleeve length',
  'आस्तीन की लंबाई': 'sleeve length', 'ब्लाउज की लंबाई': 'blouse length', 'ब्लाउज़ की लंबाई': 'blouse length', 'कमर': 'waist',
};
const NUMBERS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  'പൂജ്യം': 0, 'ഒന്ന്': 1, 'ഒന്നു': 1, 'രണ്ട്': 2, 'രണ്ടു': 2, 'മൂന്ന്': 3, 'നാല്': 4, 'അഞ്ച്': 5,
  'ആറ്': 6, 'ഏഴ്': 7, 'എട്ട്': 8, 'ഒമ്പത്': 9, 'പത്ത്': 10, 'പതിനൊന്ന്': 11, 'പന്ത്രണ്ട്': 12,
  'പതിമൂന്ന്': 13, 'പതിനാല്': 14, 'പതിനഞ്ച്': 15, 'പതിനാറ്': 16, 'പതിനേഴ്': 17,
  'പതിനെട്ട്': 18, 'പത്തൊമ്പത്': 19, 'ഇരുപത്': 20, 'മുപ്പത്': 30, 'നാല്പത്': 40, 'നാൽപ്പത്': 40,
  'അമ്പത്': 50, 'അൻപത്': 50, 'അറുപത്': 60, 'എഴുപത്': 70, 'എൺപത്': 80, 'തൊണ്ണൂറ്': 90,
  'പതിനാലു': 14, 'നാലു': 4, 'അഞ്ചു': 5, 'നൂറ്': 100, 'നൂറു': 100,
  'शून्य': 0, 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5, 'छह': 6, 'छः': 6,
  'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'ग्यारह': 11, 'बारह': 12, 'तेरह': 13, 'चौदह': 14,
  'पंद्रह': 15, 'पन्द्रह': 15, 'सोलह': 16, 'सत्रह': 17, 'अठारह': 18, 'उन्नीस': 19, 'बीस': 20,
  'इक्कीस': 21, 'बाईस': 22, 'पच्चीस': 25, 'तीस': 30, 'बत्तीस': 32, 'पैंतीस': 35, 'चालीस': 40,
  'बयालीस': 42, 'पैंतालीस': 45, 'पचास': 50, 'साठ': 60, 'सत्तर': 70, 'अस्सी': 80, 'नब्बे': 90,
};
const MALAYALAM_FRACTIONS = {
  'പതിനാലര': '14.5', 'അഞ്ചര': '5.5', 'ആറര': '6.5', 'ഏഴര': '7.5', 'എട്ടര': '8.5',
  'ഒന്നര': '1.5', 'രണ്ടര': '2.5', 'മൂന്നര': '3.5', 'നാലര': '4.5', 'പത്തര': '10.5',
  'ഒമ്പതര': '9.5', 'പതിനൊന്നര': '11.5', 'പന്ത്രണ്ടര': '12.5', 'പതിമൂന്നര': '13.5',
  'പതിനഞ്ചര': '15.5', 'പതിനാറര': '16.5', 'പതിനേഴര': '17.5', 'പതിനെട്ടര': '18.5',
  'പത്തൊമ്പതര': '19.5', 'ഇരുപതര': '20.5', 'മുപ്പതര': '30.5',
  'ഒന്നേകാൽ': '1.25', 'രണ്ടേകാൽ': '2.25', 'മൂന്നേകാൽ': '3.25', 'നാലേകാൽ': '4.25',
  'അഞ്ചേകാൽ': '5.25', 'ആറേകാൽ': '6.25', 'ഏഴേകാൽ': '7.25', 'എട്ടേകാൽ': '8.25',
  'ഒമ്പതേകാൽ': '9.25', 'പത്തേകാൽ': '10.25',
};
// Compound Malayalam tens have a regular stem, unlike Hindi's irregular tens.
for (const [stem, tens] of Object.entries({ 'ഇരുപത്തി': 20, 'മുപ്പത്തി': 30, 'നാല്പത്തി': 40, 'നാൽപ്പത്തി': 40, 'അമ്പത്തി': 50, 'അൻപത്തി': 50, 'അറുപത്തി': 60, 'എഴുപത്തി': 70, 'എൺപത്തി': 80, 'തൊണ്ണൂറ്റി': 90 })) {
  for (const [word, digit] of Object.entries({ 'ഒന്ന്': 1, 'രണ്ട്': 2, 'മൂന്ന്': 3, 'നാല്': 4, 'അഞ്ച്': 5, 'ആറ്': 6, 'ഏഴ്': 7, 'എട്ട്': 8, 'ഒമ്പത്': 9 })) {
    NUMBERS[stem + word] = tens + digit;
    const joined = { 'ഒന്ന്': 'യൊന്ന്', 'അഞ്ച്': 'യഞ്ച്', 'ആറ്': 'യാറ്', 'ഏഴ്': 'യേഴ്', 'എട്ട്': 'യെട്ട്', 'ഒമ്പത്': 'യൊമ്പത്' }[word];
    if (joined) NUMBERS[stem + joined] = tens + digit;
  }
}
const normalizedNumbers = Object.fromEntries(Object.entries(NUMBERS).map(([word, value]) => [normalize(word), value]));
const UNIT_EXPRESSIONS = [
  ['in', /(?<![\p{L}\p{M}])(?:inches|inch|in|ഇഞ്ചു|ഇഞ്ച്|इंच)(?![\p{L}\p{M}])|[″"]/gu],
  ['cm', /(?<![\p{L}\p{M}])(?:centimetres?|centimeters?|cm|സെന്റിമീറ്റർ|സെന്റിമീറ്റര്|सेंटीमीटर|सेंटीमीटर्)(?![\p{L}\p{M}])/gu],
  ['mm', /(?<![\p{L}\p{M}])(?:millimetres?|millimeters?|mm|മില്ലിമീറ്റർ|मिलीमीटर)(?![\p{L}\p{M}])/gu],
  ['ft', /(?<![\p{L}\p{M}])(?:feet|foot|ft|അടി|फीट|फुट)(?![\p{L}\p{M}])|[′']/gu],
];

export function normalize(text) {
  return String(text).normalize('NFC').toLowerCase()
    .replace(/[൦-൯]/g, digit => String(digit.charCodeAt(0) - 0x0d66))
    .replace(/[०-९]/g, digit => String(digit.charCodeAt(0) - 0x0966))
    .replace(/½/g, ' and a half ').replace(/¼/g, ' and a quarter ').replace(/¾/g, ' and three quarters ')
    .replace(/(?<=[a-z])-(?=[a-z])/g, ' ').replace(/\s+/gu, ' ').trim();
}

function integerWords(tokens) {
  if (!tokens.length) return null;
  if (tokens.length === 1 && /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(tokens[0])) return Number(tokens[0]);
  if (tokens.length === 1 && Object.hasOwn(normalizedNumbers, tokens[0])) return normalizedNumbers[tokens[0]];
  if (tokens[0] === 'and' || tokens.at(-1) === 'and' || tokens.some((token, index) => token === 'and' && tokens[index - 1] === 'and')) return null;
  let total = 0;
  let group = 0;
  let previous = null;
  for (const token of tokens) {
    if (token === 'and') continue;
    if (['hundred', 'सौ'].includes(token) && group > 0 && group < 10) {
      group *= 100;
      previous = null;
      continue;
    }
    if (['thousand', 'हजार', 'हज़ार'].includes(token) && group > 0 && total === 0) {
      total += group * 1000;
      group = 0;
      previous = null;
      continue;
    }
    const value = Object.hasOwn(normalizedNumbers, token) ? normalizedNumbers[token] : undefined;
    if (value === undefined) return null;
    // Reject two separate readings such as "fourteen fifteen".
    if (previous !== null && !(previous >= 20 && previous < 100 && previous % 10 === 0 && value > 0 && value < 10)) return null;
    group += value;
    previous = value;
  }
  return total + group;
}

export function parseNumber(input) {
  let text = normalize(input).replace(/^(?:to|is|at|equals?)\s+/, '').replace(/\s+please$/, '').trim();
  text = Object.hasOwn(MALAYALAM_FRACTIONS, text) ? MALAYALAM_FRACTIONS[text] : text;
  // Recognition can split an otherwise joined half-inch word: "14 അര".
  text = text.replace(/\s*(അര|മുക്കാൽ|കാൽ)$/u, (_, word) => ` ${word === 'അര' ? 'half' : word === 'കാൽ' ? 'quarter' : 'three quarters'}`);
  if (/^(?:साढ़े|साढ़े)\s+/u.test(text)) text = text.replace(/^(?:साढ़े|साढ़े)\s+(.+)$/u, '$1 and a half');
  if (/^सवा\s+/u.test(text)) text = text.replace(/^सवा\s+(.+)$/u, '$1 and a quarter');
  if (text === 'डेढ़') text = '1.5';
  if (text === 'ढाई') text = '2.5';
  const fraction = text.match(/^(.*?)\s*(?:and\s+)?(a half|one half|half|a quarter|one quarter|quarter|three quarters)$/);
  if (fraction) {
    const wholeText = fraction[1].replace(/\band\s*$/, '').trim();
    const whole = wholeText ? integerWords(wholeText.split(/\s+/)) : 0;
    const amount = fraction[2].includes('half') ? .5 : fraction[2] === 'three quarters' ? .75 : .25;
    return whole === null ? null : whole + amount;
  }
  const slashFraction = text.match(/^(?:(\d+)\s+(?:and\s+)?)?(\d+)\s*\/\s*(\d+)$/);
  if (slashFraction) {
    const denominator = Number(slashFraction[3]);
    if (!denominator || Number(slashFraction[2]) >= denominator) return null;
    return Number(slashFraction[1] || 0) + Number(slashFraction[2]) / denominator;
  }
  const decimalParts = text.split(/\s+(?:point|പോയിന്റ്|दशमलव|पॉइंट)\s+/u);
  if (decimalParts.length === 2) {
    const whole = integerWords(decimalParts[0].split(/\s+/));
    const decimals = decimalParts[1].split(/\s+/).map(word => /^\d$/.test(word) ? word : Object.hasOwn(normalizedNumbers, word) ? normalizedNumbers[word] : undefined);
    if (whole === null || decimals.some(value => value === undefined || value > 9)) return null;
    return Number(`${whole}.${decimals.join('')}`);
  }
  return integerWords(text.split(/\s+/));
}

export function parseMeasurement(input, defaultUnit = '') {
  let text = normalize(input).replace(/[,.!?।]+$/gu, '').trim()
    .replace(/\s+(?:ആക്കൂ|ആക്കുക|ആക്കണം|करो|करें|कर दीजिए|कर दो|है)$/u, '').trim();
  const foundUnits = new Set();
  for (const [unit, pattern] of UNIT_EXPRESSIONS) {
    text = text.replace(pattern, () => { foundUnits.add(unit); return ' '; });
  }
  if (foundUnits.size > 1) return { error: 'Please use one unit for this field.' };
  const unit = [...foundUnits][0] || defaultUnit;
  if (unit && !['in', 'cm', 'mm', 'ft'].includes(unit)) return { error: 'Please choose a supported unit.' };
  const value = parseNumber(text);
  if (value === null || !Number.isFinite(value) || value <= 0 || value > 100000) {
    return { error: 'Please repeat one positive number and its unit.' };
  }
  if (!unit) return { error: 'Which unit? Say the value with inches, centimetres, millimetres or feet.' };
  const rounded = Math.round(value * 10000) / 10000;
  if (rounded <= 0) return { error: 'This value is too small. Use a smaller unit such as millimetres.' };
  return { value: rounded, unit };
}

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizedAliases = Object.fromEntries(Object.entries(ALIASES).map(([key, value]) => [normalize(key), value]));
const aliasKeys = Object.keys(normalizedAliases).sort((a, b) => b.length - a.length);
const labelsPattern = new RegExp(`(?<![\\p{L}\\p{M}])(${aliasKeys.map(escapeRegex).join('|')})(?![\\p{L}\\p{M}])`, 'gu');

const commandTypes = new Map(Object.entries({
  review: ['review', 'read back', 'readback', 'read card', 'വായിക്കൂ', 'വായിക്കുക', 'पढ़कर सुनाओ', 'पढ़ो', 'रीव्यू'],
  save: ['save', 'save card', 'confirm', 'confirm and save', 'സേവ്', 'സേവ് ചെയ്യൂ', 'സേവ് ചെയ്യുക', 'സേവ് ചെയ്യണം', 'सेव करो', 'सेव करें', 'सेव', 'सहेजो'],
  undo: ['undo', 'undo that', 'തിരിച്ചു', 'പഴയപടി', 'वापस करो'],
  cancel: ['cancel', 'cancel that', 'discard pending', 'റദ്ദാക്കൂ', 'रद्द करो'],
}).flatMap(([type, words]) => words.map(word => [normalize(word), type])));

export function parseCommand(input, template = 'blouse', defaultUnit = '') {
  const text = normalize(input).replace(/[.!?।]+$/gu, '').replace(/\s+please$/, '');
  if (commandTypes.has(text)) return { type: commandTypes.get(text) };
  const open = text.match(/^(?:open card|open order|open|card|order|കാർഡ്|കാര്‍ഡ്|कार्ड)\s+(.+?)(?:\s+(?:തുറക്കൂ|തുറക്കുക|खोलो|खोलें))?$/u);
  if (open) {
    const id = parseNumber(open[1]);
    if (Number.isInteger(id) && id > 0) return { type: 'open', id: String(id) };
  }
  const newCard = text.match(/^(?:new|new card|start)\s+(blouse|window|custom)(?:\s*[,،]\s*|\s+)?(.*)$/);
  if (newCard) return { type: 'new', template: newCard[1], name: newCard[2].trim() };

  let clean = text.replace(/^(?:change|correct|set|update|മാറ്റൂ|മാറ്റുക|बदलो)\s+/u, '');
  const matches = [...clean.matchAll(labelsPattern)];
  let segments = matches.map((match, index) => ({
    label: normalizedAliases[match[1]],
    input: clean.slice(match.index + match[0].length, matches[index + 1]?.index ?? clean.length)
      .replace(/^[\s,:]+|[\s,،;]+$/g, '').replace(/\s+(?:and|ഉം|और)$/u, ''),
  }));
  if (template === 'custom') {
    const custom = clean.match(/^([\p{L}\p{M}\s]{2,40}?)\s+((?:\d|zero\b|one\b|two\b|three\b|four\b|five\b|six\b|seven\b|eight\b|nine\b|ten\b).*)$/u);
    if (custom && matches.length < 2) segments = [{ label: custom[1].trim().replace(/\s+to$/, ''), input: custom[2] }];
  }
  // Do not act on a field buried inside an unrecognized instruction.
  if (template !== 'custom' && matches.length && clean.slice(0, matches[0].index).trim()) segments = [];
  if (!segments.length) return { type: 'unknown', message: 'Say a field, a number and a unit. For example, width 142 centimetres.' };
  const allowed = TEMPLATES[template]?.fields || [];
  const updates = [];
  const issues = [];
  const seen = new Set();
  for (const segment of segments) {
    if (seen.has(segment.label)) {
      issues.push({ label: segment.label, message: `I heard ${segment.label} twice. Please repeat it once.` });
      continue;
    }
    seen.add(segment.label);
    if (template !== 'custom' && !allowed.includes(segment.label)) {
      issues.push({ label: segment.label, message: `${segment.label} is outside this template. Choose a custom card for other fields.` });
      continue;
    }
    const result = parseMeasurement(segment.input, defaultUnit);
    if (result.error) issues.push({ label: segment.label, message: `${segment.label}: ${result.error}` });
    else updates.push({ label: segment.label, ...result });
  }
  const ambiguous = new Set(issues.map(issue => issue.label));
  return { type: 'measure', updates: updates.filter(update => !ambiguous.has(update.label)), issues };
}

export function applyMeasurements(fields, result) {
  const next = { ...fields };
  for (const issue of result.issues) delete next[issue.label];
  for (const update of result.updates) next[update.label] = { value: update.value, unit: update.unit };
  return next;
}

export function validateCard(card) {
  return card && /^[1-9]\d*$/.test(String(card.id)) && Object.hasOwn(TEMPLATES, card.template)
    && typeof card.name === 'string' && card.name.length <= 80 && card.fields && typeof card.fields === 'object' && !Array.isArray(card.fields)
    && Object.keys(card.fields).length > 0
    && Object.entries(card.fields).every(([label, field]) => label.length > 0 && label.length <= 60 && field
      && (card.template === 'custom' || TEMPLATES[card.template].fields.includes(label))
      && typeof field.value === 'number' && Number.isFinite(field.value) && field.value > 0 && field.value <= 100000
      && ['in', 'cm', 'mm', 'ft'].includes(field.unit));
}

export const UNIT_NAMES = { in: 'inches', cm: 'centimetres', mm: 'millimetres', ft: 'feet' };
export function readFields(fields) {
  return Object.entries(fields).map(([label, field]) => `${label} ${field.value} ${UNIT_NAMES[field.unit]}`).join('. ');
}

export function cardsToCSV(cards) {
  const quote = value => {
    let text = String(value);
    // Spreadsheet applications may interpret even quoted text as a formula.
    if (/^\s*[=+@-]/u.test(text) || /^[\t\r\n]/u.test(text)) text = "'" + text;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const rows = [['card_id', 'name', 'field', 'value', 'unit'], ...cards.flatMap(card => Object.entries(card.fields).map(([label, field]) => [card.id, card.name, label, field.value, field.unit]))];
  return rows.map(row => row.map(quote).join(',')).join('\r\n');
}
