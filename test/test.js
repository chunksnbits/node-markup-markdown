/* jshint node: true */
/* global describe:false, expect: false, it:false, beforeEach:false, afterEach:false */
'use strict';

var assert = require('assert');
var Markdown = require('../index.js');

describe('node-markup-markdown using custom rules', function () {

  // Empty ruleset container
  // Will be customized for each test
  var options;

  beforeEach(function () {
    options = {
      markup: {},
      rules: [],
      processors: []
    };
  });

  it('parses custom rules', function () {
    options.rules = [{
      pattern: /#[ ]*(.+)/g,
      replacement: '<h1>$1</h1>'
    }];

    assert.equal(Markdown.parse('# Headline H1', options), '<h1>Headline H1</h1>');
  });

  it('parses multiples custom rules', function () {
    options.rules = [{
      pattern: /#{3}[ ]*([^#\n]+)/g,
      replacement: '<h3>$1</h3>'
    }, {
      pattern: /#{2}[ ]*([^#\n]+)/g,
      replacement: '<h2>$1</h2>'
    }, {
      pattern: /#{1}[ ]*([^#\n]+)/g,
      replacement: '<h1>$1</h1>'
    }];

    assert.equal(Markdown.parse('# Headline H1\n### Headline H3', options), '<h1>Headline H1</h1>\n<h3>Headline H3</h3>');
  });


  it('parses custom inline rules', function () {
    options.rules = [{
      pattern: /\*\*([^*\n]+)\*\*/g,
      replacement: '<strong>$1</strong>'
    }, {
      pattern: /\*([^*\n]+)\*/g,
      replacement: '<em>$1</em>'
    }];

    assert.equal(Markdown.parse('My text with **bold** and *italic* markup', options), 'My text with <strong>bold</strong> and <em>italic</em> markup');
  });

  it('recogizes custom markup options', function () {
    options.markup = {
      strong: '<strong>$1</strong>',
      italic: '<em>$1</em>'
    };

    options.rules = [{
      pattern: /\*\*([^*\n]+)\*\*/g,
      replacement: ':strong'
    }, {
      pattern: /\*([^*\n]+)\*/g,
      replacement: ':italic'
    }];

    assert.equal(Markdown.parse('My text with **bold** and *italic* markup', options), 'My text with <strong>bold</strong> and <em>italic</em> markup');
  });
});

describe('node-markup-markdown using custom processors', function () {

  // Empty ruleset container
  // Will be customized for each test
  var options;

  beforeEach(function () {
    options = {
      markup: {},
      rules: [],
      processors: []
    };
  });


  it('parses custom processors', function () {
    options.processors = [
      function(line) {
        return line.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
      },
      function(line) {
        return line.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
      }
    ];

    assert.equal(Markdown.parse('My text with **bold** and\n*italic* markup', options), 'My text with <strong>bold</strong> and\n<em>italic</em> markup');
  });

  it('allows to set a state for custom processors', function () {
    options.processors = [
      function(line) {
        this.counter = this.counter || 0;
        return line + this.counter++;
      }
    ];

    assert.equal(Markdown.parse('My\ntext\nwith\n**bold**\nand\n*italic*\nmarkup', options), 'My1\ntext2\nwith3\n**bold**4\nand5\n*italic*6\nmarkup7');
  });

  it('allows access to the whole text for custom processors', function () {
    options.processors = [
      function(line) {
        return this.text;
      }
    ];

    assert.equal(Markdown.parse('My\ntext\nmarkup', options), 'My\ntext\nmarkup\nMy\ntext\nmarkup\nMy\ntext\nmarkup');
  });

  it('allows access to the configuration options for custom processors', function () {
    options.processors = [
      function(line) {
        return this.options.markup.pattern + ':' + this.options.markup.replacement;
      }
    ];

    options.markup = {
      pattern: 'foo',
      replacement: 'bar'
    };

    assert.equal(Markdown.parse('test', options), 'foo:bar');
  });

});

describe('node-markup-markdown using default rules and processors', function () {

  // Empty ruleset container
  // Will be customized for each test
  var options;

  beforeEach(function () {
    options = {
      markup: {},
      rules: [],
      processors: []
    };
  });

  it('recogizes default markup overwrites', function () {
    // Overwrite custom
    options = {
      markup: {
        strong: '<foo>$1</foo>',
        emphasis: '<bar>$1</bar>'
      }
    };

    assert.equal(Markdown.parse('My text with **bold** and *italic* markup', options), 'My text with <foo>bold</foo> and <bar>italic</bar> markup');
  });
});

describe('node-markup-markdown using default options', function () {

  // Empty ruleset container
  // Will be customized for each test
  var options;

  beforeEach(function () {
    options = undefined;
  });

  it('parses strong', function () {
    assert.equal(Markdown.parse('My text with **strong** markup', options), 'My text with <strong>strong</strong> markup');
  });

  it('parses emphasis', function () {
    assert.equal(Markdown.parse('My text with *emphasized* markup', options), 'My text with <em>emphasized</em> markup');
  });

  it('parses headline H1', function () {
    assert.equal(Markdown.parse('# My text', options), '<h1>My text</h1>');
  });

  it('parses headline H2', function () {
    assert.equal(Markdown.parse('## My text', options), '<h2>My text</h2>');
  });

  it('parses headline H3', function () {
    assert.equal(Markdown.parse('### My text', options), '<h3>My text</h3>');
  });

  it('parses headline H4', function () {
    assert.equal(Markdown.parse('#### My text', options), '<h4>My text</h4>');
  });

  it('parses headline H5', function () {
    assert.equal(Markdown.parse('##### My text', options), '<h5>My text</h5>');
  });

  it('parses headline H6', function () {
    assert.equal(Markdown.parse('###### My text', options), '<h6>My text</h6>');
  });

  it('parses lists holding a single list item', function () {
    assert.equal(Markdown.parse('* My list item', options), '<ul><li>My list item</li></ul>');
  });

  it('parses lists holding multiple list items', function () {
    assert.equal(Markdown.parse('* First\n* Second\n* Third', options), '<ul><li>First</li><li>Second</li><li>Third</li></ul>');
  });

  it('parses multiple lists', function () {
    assert.equal(Markdown.parse('* First\n\n\n* First\n* Second', options), '<ul><li>First</li></ul><p><ul><li>First</li><li>Second</li></ul>');
  });

  it('parses linebreaks', function () {
    assert.equal(Markdown.parse('My\nlinebreak', options), 'My<br>linebreak');
  });

  it('parses spacers', function () {
    assert.equal(Markdown.parse('My\n\nlinebreak', options), 'My<p>linebreak');
  });
});
