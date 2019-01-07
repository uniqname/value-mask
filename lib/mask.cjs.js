'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const DIGIT = '9';
const ALPHA = 'A';
const ALPHANUM = 'S';
const isDigitPattern = patternChar => patternChar === DIGIT;
const isAlphaPattern = patternChar => patternChar === ALPHA;
const isAlphaNumPattern = patternChar => patternChar === ALPHANUM;
const isPatternCharLiteral = char => ![DIGIT, ALPHA, ALPHANUM].includes(char);
const DIGIT_RE = /[0-9]/;
const ALPHA_RE = /[a-z]/i;
const ALPHA_NUM_RE = /[0-9a-z]/i;
const isDigit = char => DIGIT_RE.test(char);
const isAlpha = char => ALPHA_RE.test(char);
const isAlphaNum = char => ALPHA_NUM_RE.test(char);
const isPatternMatch = (patternChar, valueChar) => isDigitPattern(patternChar) && isDigit(valueChar) || isAlphaPattern(patternChar) && isAlpha(valueChar) || isAlphaNumPattern(patternChar) && isAlphaNum(valueChar);

exports.default = (value = '', opts = {}) => {
  const { pattern = opts, placeholder = '' } = opts;
  return [...pattern].reduce(([mapped, restValue, hasFailed], patternChar, i, patternChars) => {
    // short circut for fail case
    if (hasFailed) return [mapped, restValue, hasFailed];

    if (!restValue && !placeholder) {
      return patternChars.slice(i).every(isPatternCharLiteral) ? [`${mapped}${patternChar}`, restValue] : [mapped, restValue, true]; // no value left, no placeholder and remaining pattern is not literals -> fail case
    }
    if (isPatternCharLiteral(patternChar)) {
      return [`${mapped}${patternChar}`, restValue];
    }
    if (isPatternMatch(patternChar, restValue[0])) {
      return [`${mapped}${restValue[0]}`, restValue.slice(1)];
    }

    if (placeholder) return [`${mapped}${placeholder}`, restValue];

    // fail case
    return [mapped, restValue, true];
  }, ['', String(value).replace(/\W/g, '').padEnd(pattern.replace(/\W/g, '').length, placeholder), false])[0];
};
