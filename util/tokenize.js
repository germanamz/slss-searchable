const stemmer = require('natural').PorterStemmerEs;

const handleToken = (tokens, token, asMap) => {
  if (typeof asMap === 'function') {
    asMap(token);
  } else if (asMap) {
    tokens[token] = asMap;
  } else {
    tokens.push(token);
  }
};

const tokenize = (value, asMap = false, simple = false) => {
  if (!value || !value.length) {
    return [];
  }
  const stemmedTokens = stemmer.tokenizeAndStem(value);

  if (simple) {
    return stemmedTokens;
  }

  const stemmedTokensLength = stemmedTokens.length;
  const tokens = asMap ? {} : [];

  for (let stemmedTokenIndex = 0; stemmedTokenIndex < stemmedTokensLength; stemmedTokenIndex++) {
    const stemmedToken = stemmedTokens[stemmedTokenIndex];
    const stemmedTokenLength = stemmedToken.length;

    if (simple) {
      handleToken(tokens, stemmedToken, asMap);
      continue;
    }
    let accumulator = '';

    for (let stemmedTokenCharIndex = 0; stemmedTokenCharIndex < stemmedTokenLength; stemmedTokenCharIndex++) {
      accumulator += stemmedToken[stemmedTokenCharIndex];
      handleToken(tokens, accumulator, asMap);
    }
  }

  return tokens;
}

module.exports = tokenize;
