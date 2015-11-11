"use strict";

var parse = function (str, template) {
  var tokens = template.tokens, 
      separators = template.separators,
      state = {
        index: -1,
        strPos: 0,
        item: {}
      },
      next = function (n) {
        n = n || 1;
        var separator = separators[state.index + n], 
            currPos = state.strPos,
            index = n > 0 ? str.indexOf(separator, currPos) : str.lastIndexOf(separator, currPos);

        if (index < 0)
          return false;
        
        state.strPos = index + separator.length;
        state.index += n;
        return str.substr(currPos, index - currPos);
      };

  // ignore anything before start
  if (next() !== false) {
    while(state.index < template.tokens.length) {
      if (tokens[state.index](state.item, next(), next))
        break;
    }
  }
  
  return state.item;
};

var findToken = function(s, token, start) {
  start = start || 0;
  var startToken = s.indexOf(token), tokenLength = token.length;

  if (startToken < 0) 
    return null;
  
  var tbt = s.substr(start, startToken - start);
  
  while((s.substr(startToken + tokenLength, tokenLength) === token)) {
    tbt += token;
    start = startToken + tokenLength + tokenLength;
    startToken = s.indexOf(start, token);
    
    if (startToken < 0) 
      return null;
    
    tbt += s.substr(start, startToken - start);
  }
  
  return {
    index: startToken + tokenLength,
    textBeforeToken: tbt
  };
};

var compile = function(str) {
  var separators = [], tokens = [], s = str, token, endToken, tokenFunc, result;
  
  while(s.length) {
    var startOfBracket = findToken(s, "{{");
    if (!startOfBracket)
      break;
    
    separators.push(startOfBracket.textBeforeToken);
    s = s.substr(startOfBracket.index);  
    if (s[0] === "{") {
      // code
      result = findToken(s, "}}}", 1);
      if (!result)
        throw new Error("Incomplete function");

      tokenFunc = new Function("item", "text", "next", result.textBeforeToken);
      endToken = result.index;
    } else {
      // token
      endToken = s.indexOf("}}");
      if (endToken < 0)
        throw new Error("Incomplete token");
        
      token = s.substr(0, endToken).trim();

      if (token === "...") {
        tokenFunc = function(item, text) { return !text; };
      } else {
        var dot = token.indexOf(".");
        if (dot < 0)
          tokenFunc = new Function("item", "text", "if (!text) return true; item." + token + "=text");
        else
          tokenFunc = new Function("item", "text", "if (!text) return true; item." + token.substr(0, dot) + "=text" + token.substr(dot));
      }
      endToken += 2;
    }
    
    s = s.substr(endToken);
    tokens.push(tokenFunc);  
  }
  
  separators.push(s.replace(/\\\\/g, "\\").replace(/\\{/g, "{"));
  
  return {
    separators: separators,
    tokens: tokens
  };
}

module.exports = function(template) {
  var tpl = compile(template);
  return function(text) {
    return parse(text, tpl);
  }
};
