var _ = require('lodash');

module.exports = {
  markup: {
    strong: '<strong>$1</strong>',
    emphasis: '<em>$1</em>',

    h6: '<h6>$1</h6>',
    h5: '<h5>$1</h5>',
    h4: '<h4>$1</h4>',
    h3: '<h3>$1</h3>',
    h2: '<h2>$1</h2>',
    h1: '<h1>$1</h1>',

    table: '<table>$1</table>',
    tr: '<tr>$1</tr>',
    td: '<td>$1</td>',
    th: '<th>$1</th>',

    paragraph: '<p>$1</p>',
    linebreak: '<br>',

    codeblock: '<pre data-type="$1">$2</pre>',
    code: '<code>$1</code>',

    anchor: '<a href="#$2">$1</a>',
    link: '<a href="$2">$1</a>',
    line: '<hr>'
  },

  rules: [{
      pattern: /\*\*([^*\n]+)\*\*/g,
      replacement: ':strong'
    }, {
      pattern: /\*([^*\n]+)\*/g,
      replacement: ':emphasis'
    }, {
      pattern: /(\*{3,}|-{3,}|_{3,})\n/g,
      replacement: ':line'
    }, {
      pattern: /\n\n(.*)\n\n/g,
      replacement: ':paragraph'
    }, {
      pattern: /```([\s\S\n]*)```/g,
      replacement: function (text, matches, options) {

        var open = options.markup.codeblock.split('$2')[0];
        var close = options.markup.codeblock.split('$2')[1];

        var clone = _.clone(matches);
        clone.forEach(function(match, index) {
          var type = match.match(/```([^\n]+)\n/);
          console.log('>' + (type ? type[1] : ''));
          clone[index] = match
            .replace('```', open.replace('$1', type ? type[1] : ''))
            .replace('```', close)
            .replace(/[\n]/g, '!!!linebreak!!!')
            .replace('>' + (type ? type[1] : ''), '>');
        });

        matches.forEach(function(match, index) {
          text = text.replace(match, clone[index]);
        });

        return text;
      }
    }, {
      pattern: /`([^`]*)`/g,
      replacement: ':code'
    }, {
      pattern: /\|:([^|]+):\|/g,
      replacement: ':th'
    }, {
      pattern: /\|([^|]+)\|/g,
      replacement: ':td'
    }, {
      pattern: /\|([^|]+)\|/g,
      replacement: ':tr'
    }, {
      pattern: /\|([^|]+)\|/g,
      replacement: ':table'
    }, {
    //   pattern: /      [*+-] ([^*+-<]*)/gm,
    //   replacement: '<ul><ul><ul><ul><li>$1</li></ul></ul></ul></ul>'
    // }, {
    //   pattern: /    [*+-] ([^*+-<]*)/gm,
    //   replacement: '<ul><ul><ul><li>$1</li></ul></ul></ul>'
    // }, {
    //   pattern: /  [*+-] ([^*+-<]*)/gm,
    //   replacement: '<ul><ul><li>$1</li></ul></ul>'
    // }, {
      pattern: /[*+-] ([^*+-<]*)/gm,
      replacement: '<ul><li>$1</li></ul>'
    }, {
      pattern: /\n{0,1}<\/ul>\n{0,1}<ul>/gm,
      replacement: ''
    }, {
      pattern: /#{6}[ ]*([^#\n<]+)/g,
      replacement: ':h6'
    }, {
      pattern: /#{5}[ ]*([^#\n<]+)/g,
      replacement: ':h5'
    }, {
      pattern: /#{4}[ ]*([^#\n<]+)/g,
      replacement: ':h4'
    }, {
      pattern: /#{3}[ ]*([^#\n<]+)/g,
      replacement: ':h3'
    }, {
      pattern: /#{2}[ ]*([^#\n<]+)/g,
      replacement: ':h2'
    }, {
      pattern: /#{1}[ ]*([^#\n<]+)/g,
      replacement: ':h1'
    }, {
      pattern: /\[(.*)\]\[(.*)\]/g,
      replacement: ':anchor'
    }, {
      pattern: /\[(.*)\]\((.*)\)/g,
      replacement: ':link'
    }, {
      pattern: /\n</g,
      replacement: '<'
    }, {
      pattern: /\n/g,
      replacement: ':linebreak'
    }, {
      pattern: /!!!linebreak!!!/g,
      replacement: '\n'
  }],
  processors: []
};