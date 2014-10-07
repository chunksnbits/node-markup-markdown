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
      rules: []
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

describe('node-markup-markdown using default rules and processors', function () {

  // Empty ruleset container
  // Will be customized for each test
  var options;

  beforeEach(function () {
    options = {
      markup: {},
      rules: []
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

  it('parses strong', function () {
    assert.equal(Markdown.parse('My text with **strong** markup'), 'My text with <strong>strong</strong> markup');
  });

  it('parses emphasis', function () {
    assert.equal(Markdown.parse('My text with *emphasized* markup'), 'My text with <em>emphasized</em> markup');
  });

  it('parses links', function () {
    assert.equal(Markdown.parse('[Link](http://example.com)'), '<a href="http://example.com">Link</a>');
  });

  it('parses anchors', function () {
    assert.equal(Markdown.parse('[Link][target]'), '<a href="#target">Link</a>');
  });

  it('parses inline code', function () {
    assert.equal(Markdown.parse('My test `code element` inline'), 'My test <code>code element</code> inline');
  });

  it('parses multiple inline code elements in one line', function () {
    assert.equal(Markdown.parse('My test `code element` inline followed `by another one`'), 'My test <code>code element</code> inline followed <code>by another one</code>');
  });

  it('parses code blocks', function () {
    assert.equal(Markdown.parse('My test\n```\ncode element\n\nspanning multiple lines\n```'), 'My test<pre data-type="">\ncode element\n\nspanning multiple lines\n</pre>');
  });

  it('parses code blocks with type', function () {
    assert.equal(Markdown.parse('My test\n```javascript\ncode element\n\nspanning multiple lines\n```'), 'My test<pre data-type="javascript">\ncode element\n\nspanning multiple lines\n</pre>');
  });

  it('parses horizontal lines', function () {
    assert.equal(Markdown.parse('Test\n---\nTest\n***\nTest\n___\nTest'), 'Test<hr>Test<hr>Test<hr>Test');
  });

  it('parses paragraphs', function () {
    assert.equal(Markdown.parse('# Headline\n\nParagraph\n\n# Headline'), '<h1>Headline</h1><p>Paragraph</p><h1>Headline</h1>');
  });

  it('parses table cells', function () {
    assert.equal(Markdown.parse('|Cell||Cell|'), '<td>Cell</td><td>Cell</td>');
  });

  it('parses table header cells', function () {
    assert.equal(Markdown.parse('|:Cell:||:Cell:|'), '<th>Cell</th><th>Cell</th>');
  });

  it('parses table rows', function () {
    assert.equal(Markdown.parse('||Cell||Cell||'), '<tr><td>Cell</td><td>Cell</td></tr>');
  });

  it('parses tables', function () {
    assert.equal(Markdown.parse('|||Cell||Cell|||'), '<table><tr><td>Cell</td><td>Cell</td></tr></table>');
  });

  it('parses headline H1', function () {
    assert.equal(Markdown.parse('# My text'), '<h1>My text</h1>');
  });

  it('parses headline H2', function () {
    assert.equal(Markdown.parse('## My text'), '<h2>My text</h2>');
  });

  it('parses headline H3', function () {
    assert.equal(Markdown.parse('### My text'), '<h3>My text</h3>');
  });

  it('parses headline H4', function () {
    assert.equal(Markdown.parse('#### My text'), '<h4>My text</h4>');
  });

  it('parses headline H5', function () {
    assert.equal(Markdown.parse('##### My text'), '<h5>My text</h5>');
  });

  it('parses headline H6', function () {
    assert.equal(Markdown.parse('###### My text'), '<h6>My text</h6>');
  });

  it('parses lists holding a single list item', function () {
    assert.equal(Markdown.parse('* My list item'), '<ul><li>My list item</li></ul>');
  });

  it('parses lists holding multiple list items', function () {
    assert.equal(Markdown.parse('* First\n* Second\n* Third'), '<ul><li>First</li><li>Second</li><li>Third</li></ul>');
  });

  it('parses multiple lists', function () {
    assert.equal(Markdown.parse('* First\n\n\n* First\n* Second'), '<ul><li>First</li></ul><br><ul><li>First</li><li>Second</li></ul>');
  });

  it('parses linebreaks', function () {
    assert.equal(Markdown.parse('My\nlinebreak'), 'My<br>linebreak');
  });

  it('parses spacers', function () {
    assert.equal(Markdown.parse('My\n\nlinebreak'), 'My<br><br>linebreak');
  });
});
