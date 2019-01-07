const DIGIT = '9'
const ALPHA = 'A'
const ALPHANUM = 'S'
const DIGIT_RE = /[0-9]/
const ALPHA_RE = /[a-z]/i
const ALPHA_NUM_RE = /[0-9a-z]/i
const is = (target) => (value) => target === value
const isPatternCharLiteral = (char) => ![DIGIT, ALPHA, ALPHANUM].includes(char)
const isDigit = (char) => DIGIT_RE.test(char)
const isAlpha = (char) => ALPHA_RE.test(char)
const isAlphaNum = (char) => ALPHA_NUM_RE.test(char)
const isPatternMatch = (patternChar, valueChar) =>
  (is(DIGIT)(patternChar) && isDigit(valueChar)) ||
  (is(ALPHA)(patternChar) && isAlpha(valueChar)) ||
  (is(ALPHANUM)(patternChar) && isAlphaNum(valueChar))

export default (value = '', opts = {}) => {
  const { pattern = opts, placeholder = '' } = opts
  return [...pattern].reduce(
    ([masked, restValue, hasFailed], patternChar, i, patternChars) => {
      // short circut for fail case
      if (hasFailed) return [masked, restValue, hasFailed]

      if (!restValue && !placeholder) {
        return patternChars.slice(i).every(isPatternCharLiteral)
          ? [`${masked}${patternChar}`, restValue, hasFailed]
          : [masked, restValue, true] // no value left, no placeholder and remaining pattern is not literals -> fail case
      }
      if (isPatternCharLiteral(patternChar)) {
        return [`${masked}${patternChar}`, restValue, hasFailed]
      }
      if (isPatternMatch(patternChar, restValue[0])) {
        return [`${masked}${restValue[0]}`, restValue.slice(1), hasFailed]
      }

      if (placeholder) return [`${masked}${placeholder}`, restValue, hasFailed]

      // fail case
      return [masked, restValue, true]
    },
    [
      '',
      String(value)
        .replace(/\W/g, '')
        .padEnd(pattern.replace(/\W/g, '').length, placeholder),
      false
    ]
  )[0]
}
