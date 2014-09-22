/* jshint node:true */
'use strict';

var defaults = require('./default.options.js');
var _ = require('lodash');

function MarkdownParser () {}

MarkdownParser.parse = function(text, options) {
  options = _.extend({}, defaults, options);

  text = MarkdownParser.applyProcessors(text, options);
  text = MarkdownParser.applyRules(text, options);

  return text;
};

MarkdownParser.lookupReplacement = function(key, options) {
  _.each(options.markup, function(value, name) {
    key = key.replace(':' + name, value);
  });
  return key;
};

MarkdownParser.applyProcessors = function (text, options) {
  (options.processors || []).forEach(function(processor) {
    // Add an empty line before and after
    // to allow easier processing.
    var lines = text.split('\n');
    lines.splice(0,0,'');
    lines.push('');

    // Create a status object, that will be available for each processor
    // using the this context object.
    var status = _.extend({
      options: _.clone(options)
    }, {
      text: _.clone(text)
    }, {
      lines: lines
    });


    lines.forEach(function(line, index) {
      lines[index] = processor.apply(status, [line, index]);
    });

    lines.shift();
    lines.pop();

    text = lines.join('\n');
  });
  return text;
};

MarkdownParser.applyRules = function (text, options) {
  (options.rules || []).forEach(function(rule) {
    if (_.isFunction(rule.replacement)) {
      var matches = text.match(rule.pattern);
      if (matches) {
        text = rule.replacement(text, matches, options);
      }
    }
    else {
      text = text.replace(rule.pattern, MarkdownParser.lookupReplacement(rule.replacement, options));
    }
  });
  return text;
};

module.exports = MarkdownParser;