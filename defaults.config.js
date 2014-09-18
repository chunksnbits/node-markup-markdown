module.exports = {
  markup: {
    bold: '<strong>$1</strong>',
    italic: '<i>$1</i>',

    h6: '<h6>$1</h6>',
    h5: '<h5>$1</h5>',
    h4: '<h4>$1</h4>',
    h3: '<h3>$1</h3>',
    h2: '<h2>$1</h2>',
    h1: '<h1>$1</h1>',

    linebreak: '<br>',
    spacer: '<p>',

    unorderList: '<ul>$1</ul>',
    orderedList: '<ol>$1</ol>'
  },

  rules: [{
      pattern: /\*\*([^*\n]+)\*\*/g,
      replacement: ':bold'
    }, {
      pattern: /\*([^*\n]+)\*/g,
      replacement: ':italic'
    }, {
      pattern: /######[ ]*(.+)/g,
      replacement: ':h6'
    }, {
      pattern: /#####[ ]*(.+)/g,
      replacement: ':h5'
    }, {
      pattern: /####[ ]*(.+)/g,
      replacement: ':h4'
    }, {
      pattern: /###[ ]*(.+)/g,
      replacement: ':h3'
    }, {
      pattern: /##[ ]*(.+)/g,
      replacement: ':h2'
    }, {
      pattern: /#[ ]*(.+)/g,
      replacement: ':h1'
    }, {
      pattern: /\n\n/g,
      replacement: ':spacer'
    }, {
      pattern: /\n/g,
      replacement: ':linebreak'
  }],

  processors: [
    function ulOpen (line) {
      var tag = this.markup.line.split('$1')[0];
      var matches = line.match(/^(\*)+/);
      var depth = (matches ? matches[0].length : 0) - (this.depth || 0);
      this.depth = depth;
      while (--depth > -1) {
        line = tag + line;
      }
      return line;
    },
    function ulClose (line) {
      var tag = this.markup.line.split('$1')[1];
      var matches = line.match(/^(\*)+/);
      var depth = (this.depth || 0) - (matches ? matches[0].length : 0);
      this.depth = depth;
      while (--depth > -1) {
        line = line + tag;
      }
      return line;
    }
  ]
};