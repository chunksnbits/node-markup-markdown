/* jshint node:true */
'use strict';

var defaults = require('./defaults.config.js');
var _ = require('lodash');

function MarkdownParser () {}

MarkdownParser.parse = function(text, options) {
  options = _.extend(options, defaults);

  text = MarkdownParser.applyProcessors(text, options);
  text = MarkdownParser.applyRules(text, options);

  return text;
};

MarkdownParser.applyProcessors = function (text, options) {
  (options.processors || []).forEach(function(processor) {
    var status = {};
    var lines = text.split('\n');
    lines.forEach(function(line, index) {
      lines[index] = processor.apply(status, [line]);
      console.log(index, line, lines[index]);
    });
    text = lines.join('\n');
  });
};

MarkdownParser.applyRules = function (text, options) {
  (options.rules || []).forEach(function(rule) {
    var replacement = MarkdownParser.lookupReplacement(rule.replacement, options);
    text = text.replace(rule.pattern, replacement);
  });
};

module.extends = MarkdownParser;