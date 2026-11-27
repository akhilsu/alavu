export const TEMPLATES = {
  blouse: { title: 'Blouse fitting', fields: ['shoulder', 'sleeve length', 'blouse length', 'waist'] },
  window: { title: 'Window', fields: ['width', 'drop'] },
  custom: { title: 'Custom measurements', fields: [] },
};

const ALIASES = {
  'shoulder': 'shoulder', 'shoulders': 'shoulder', 'തോൾ': 'shoulder', 'തോള്': 'shoulder', 'ഷോൾഡർ': 'shoulder',
  'sleeve length': 'sleeve length', 'sleeve': 'sleeve length', 'sleeves': 'sleeve length', 'കൈ നീളം': 'sleeve length', 'സ്ലീവ്': 'sleeve length',
  'blouse length': 'blouse length', 'blouse': 'blouse length', 'ബ്ലൗസ് നീളം': 'blouse length',
  'waist': 'waist', 'അരക്കെട്ട്': 'waist', 'അരവണ്ണം': 'waist',
  'width': 'width', 'വീതി': 'width', 'चौड़ाई': 'width',
  'drop': 'drop', 'height': 'drop', 'ഉയരം': 'drop', 'ऊंचाई': 'drop',
  'depth': 'depth', 'ആഴം': 'depth', 'length': 'length', 'നീളം': 'length', 'लंबाई': 'length',
};
const NUMBERS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  'പൂജ്യം': 0, 'ഒന്ന്': 1, 'ഒന്നു': 1, 'രണ്ട്': 2, 'രണ്ടു': 2, 'മൂന്ന്': 3, 'നാല്': 4, 'അഞ്ച്': 5,
  'ആറ്': 6, 'ഏഴ്': 7, 'എട്ട്': 8, 'ഒമ്പത്': 9, 'പത്ത്': 10, 'പതിനൊന്ന്': 11, 'പന്ത്രണ്ട്': 12,
  'പതിമൂന്ന്': 13, 'പതിനാല്': 14, 'പതിനഞ്ച്': 15, 'പതിനാറ്': 16, 'പതിനേഴ്': 17,
  'പതിനെട്ട്': 18, 'പത്തൊമ്പത്': 19, 'ഇരുപത്': 20,
};
const MALAYALAM_FRACTIONS = {
  'പതിനാലര': '14.5', 'അഞ്ചര': '5.5', 'ആറര': '6.5', 'ഏഴര': '7.5', 'എട്ടര': '8.5',
  'ഒന്നര': '1.5', 'രണ്ടര': '2.5', 'മൂന്നര': '3.5', 'നാലര': '4.5', 'പത്തര': '10.5',
};
const UNIT_EXPRESSIONS = [
  ['in', /\b(?:inches|inch|in)\b|ഇഞ്ച്|ഇഞ്ചു|इंच|[″"]/gu],
  ['cm', /\b(?:centimetres?|centimeters?|cm)\b|സെന്റിമീറ്റർ|സെന്റിമീറ്റര്|सेंटीमीटर/gu],
  ['mm', /\b(?:millimetres?|millimeters?|mm)\b|മില്ലിമീറ്റർ/gu],
  ['ft', /\b(?:feet|foot|ft)\b|അടി|[′']/gu],
];

export function normalize(text) {
  return String(text).normalize('NFC').toLowerCase()
    .replace(/[൦-൯]/g, digit => String(digit.charCodeAt(0) - 0x0d66))
    .replace(/[०-९]/g, digit => String(digit.charCodeAt(0) - 0x0966))
    .replace(/½/g, ' and a half ').replace(/¼/g, ' and a quarter ').replace(/¾/g, ' and three quarters ')
    .replace(/(?<=[a-z])-(?=[a-z])/g, ' ').trim();
}

function integerWords(tokens) {
  if (!tokens.length) return null;
  if (tokens.length === 1 && /^\d+(?:\.\d+)?$/.test(tokens[0])) return Number(tokens[0]);
  let total = 0;
  let group = 0;
  let previous = null;
  for (const token of tokens) {
    if (token === 'and') continue;
    if (token === 'hundred' && group > 0 && group < 10) {
      group *= 100;
      previous = null;
      continue;
    }
    if (token === 'thousand' && group > 0) {
      total += group * 1000;
      group = 0;
      previous = null;
      continue;
    }
    const value = NUMBERS[token];
    if (value === undefined) return null;
    // Reject two separate readings such as "fourteen fifteen".
    if (previous !== null && !(previous >= 20 && previous % 10 === 0 && value < 10)) return null;
    group += value;
    previous = value;
  }
  return total + group;
}

export function parseNumber(input) {
  let text = normalize(input).replace(/^(?:to|is|at|equals?)\s+/, '').replace(/\s+(?:please|and)$/g, '').trim();
  for (const [word, value] of Object.entries(MALAYALAM_FRACTIONS)) text = text.replaceAll(word, value);
  const fraction = text.match(/^(.*?)\s*(?:and\s+)?(a half|one half|half|a quarter|one quarter|quarter|three quarters)$/);
  if (fraction) {
    const wholeText = fraction[1].replace(/\band\s*$/, '').trim();
    const whole = wholeText ? integerWords(wholeText.split(/\s+/)) : 0;
    const amount = fraction[2].includes('half') ? .5 : fraction[2] === 'three quarters' ? .75 : .25;
    return whole === null ? null : whole + amount;
  }
  const slashFraction = text.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);
  if (slashFraction) {
    const denominator = Number(slashFraction[3]);
    if (!denominator || Number(slashFraction[2]) >= denominator) return null;
    return Number(slashFraction[1] || 0) + Number(slashFraction[2]) / denominator;
  }
  const decimalParts = text.split(/\s+point\s+/);
  if (decimalParts.length === 2) {
    const whole = integerWords(decimalParts[0].split(/\s+/));
    const decimals = decimalParts[1].split(/\s+/).map(word => /^\d$/.test(word) ? word : NUMBERS[word]);
    if (whole === null || decimals.some(value => value === undefined || value > 9)) return null;
    return Number(`${whole}.${decimals.join('')}`);
  }
  return integerWords(text.split(/\s+/));
}

export function parseMeasurement(input, defaultUnit = '') {
  let text = normalize(input).replace(/[,.!?]$/g, '').trim();
  const foundUnits = new Set();
  for (const [unit, pattern] of UNIT_EXPRESSIONS) {
    text = text.replace(pattern, () => { foundUnits.add(unit); return ' '; });
  }
  if (foundUnits.size > 1) return { error: 'Please use one unit for this field.' };
  const unit = [...foundUnits][0] || defaultUnit;
  const value = parseNumber(text);
  if (value === null || !Number.isFinite(value) || value <= 0 || value > 100000) {
    return { error: 'Please repeat one positive number and its unit.' };
  }
  if (!unit) return { error: 'Which unit? Say the value with inches, centimetres, millimetres or feet.' };
  return { value: Math.round(value * 10000) / 10000, unit };
}

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const aliasKeys = Object.keys(ALIASES).sort((a, b) => b.length - a.length);
const labelsPattern = new RegExp(`(?<![a-z])(${aliasKeys.map(escapeRegex).join('|')})(?![a-z])`, 'gu');

export function parseCommand(input, template = 'blouse', defaultUnit = '') {
  const text = normalize(input).replace(/[.!?]+$/g, '');
  if (/^(review|read back|readback|read card|വായിക്കൂ)$/.test(text)) return { type: 'review' };
  if (/^(save|save card|confirm|confirm and save|സേവ്|സേവ് ചെയ്യൂ)$/.test(text)) return { type: 'save' };
  if (/^(undo|undo that|തിരിച്ചു)$/.test(text)) return { type: 'undo' };
  if (/^(cancel|cancel that|discard pending)$/.test(text)) return { type: 'cancel' };
  const open = text.match(/^(?:open card|open order|open|card|order)\s+(.+)$/);
  if (open) {
    const id = parseNumber(open[1]);
    if (Number.isInteger(id) && id > 0) return { type: 'open', id: String(id) };
  }
  const newCard = text.match(/^(?:new|new card|start)\s+(blouse|window|custom)(?:\s*[,،]\s*|\s+)?(.*)$/);
  if (newCard) return { type: 'new', template: newCard[1], name: newCard[2].trim() };

  let clean = text.replace(/^(?:change|correct|set|update)\s+/, '');
  const matches = [...clean.matchAll(labelsPattern)];
  let segments = matches.map((match, index) => ({
    label: ALIASES[match[1]],
    input: clean.slice(match.index + match[0].length, matches[index + 1]?.index ?? clean.length)
      .replace(/^[\s,:]+|[\s,،]+$/g, '').replace(/\s+and$/g, ''),
  }));
  if (template === 'custom') {
    const custom = clean.match(/^([a-z\s]{2,40}?)\s+((?:\d|zero|one|two|three|four|five|six|seven|eight|nine|ten).*)$/);
    if (custom) segments = [{ label: custom[1].trim().replace(/\s+to$/, ''), input: custom[2] }];
  }
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
  return card && /^\d+$/.test(String(card.id)) && TEMPLATES[card.template]
    && typeof card.name === 'string' && card.fields && typeof card.fields === 'object'
    && Object.keys(card.fields).length > 0
    && Object.entries(card.fields).every(([label, field]) => label.length <= 60 && field
      && typeof field.value === 'number' && Number.isFinite(field.value) && field.value > 0
      && ['in', 'cm', 'mm', 'ft'].includes(field.unit));
}

export const UNIT_NAMES = { in: 'inches', cm: 'centimetres', mm: 'millimetres', ft: 'feet' };
export function readFields(fields) {
  return Object.entries(fields).map(([label, field]) => `${label} ${field.value} ${UNIT_NAMES[field.unit]}`).join('. ');
}
