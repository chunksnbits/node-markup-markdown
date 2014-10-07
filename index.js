/* jshint node:true */
'use strict';

var defaults = require('./default.options.js');
var _ = require('lodash');

function MarkdownParser () {}

MarkdownParser.parse = function(text, options) {
  options = _.extend({}, defaults, options);

  text = MarkdownParser.applyRules(text, options);

  return text;
};

MarkdownParser.lookupReplacement = function(key, options) {
  _.each(options.markup, function(value, name) {
    key = key.replace(':' + name, value);
  });
  return key;
};

MarkdownParser.applyRules = function (text, options) {
  (options.rules || []).forEach(function(rule) {


    // Rules can be specified multiple ways:
    //
    // 1. Providing an object in the form:
    //
    //   {
    //     // Will be evaluated using regex
    //     pattern: /some-regex-pattern/g,
    //     replacement: 'some-text-replacement'
    //   }
    //
    // 2. Providing a function for pattern and/or replacement:
    //
    //   {
    //     // Expects an array following the the standard set
    //     // by String.prototype match
    //     //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    //     // as return value
    //     pattern: function (text, matches, options) { ... },
    //
    //     // Expects a string value as return value
    //     replacement: function (text, matches, options) { ... }
    //   }
    //
    // 3. Providing a function for pattern and/or replacement:
    //
    //   {
    //     // Expects a string value as return value
    //     function (text, matches, options) { ... }
    //   }
    //
    if (_.isFunction(rule)) {
      text = rule(text, matches, options);
    }
    else {
      var matches = [];

      if (_.isFunction(rule.pattern)) {
        matches = rule.pattern(text, matches, options);
      }
      else {
        matches = text.match(rule.pattern);
      }

      if (matches && matches.length > 0) {
        if (_.isFunction(rule.replacement)) {
          text = rule.replacement(text, matches, options);
        }
        else {
          text = text.replace(rule.pattern, MarkdownParser.lookupReplacement(rule.replacement, options));
        }
      }
    }
  });
  return text;
};

module.exports = MarkdownParser;