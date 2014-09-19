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

    linebreak: '<br>',
    spacer: '<p>'
  },

  rules: [{
      pattern: /\*\*([^*\n]+)\*\*/g,
      replacement: ':strong'
    }, {
      pattern: /\*([^*\n]+)\*/g,
      replacement: ':emphasis'
    }, {
      pattern: /\n{2,}/g,
      replacement: ':spacer'
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
      pattern: /#{6}[ ]*([^#\n]+)/g,
      replacement: ':h6'
    }, {
      pattern: /#{5}[ ]*([^#\n]+)/g,
      replacement: ':h5'
    }, {
      pattern: /#{4}[ ]*([^#\n]+)/g,
      replacement: ':h4'
    }, {
      pattern: /#{3}[ ]*([^#\n]+)/g,
      replacement: ':h3'
    }, {
      pattern: /#{2}[ ]*([^#\n]+)/g,
      replacement: ':h2'
    }, {
      pattern: /#{1}[ ]*([^#\n]+)/g,
      replacement: ':h1'
    }, {
      pattern: /\n</g,
      replacement: '<'
    }, {
      pattern: /\n/g,
      replacement: ':linebreak'
  }],
  processors: []
};