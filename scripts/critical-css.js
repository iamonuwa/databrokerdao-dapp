const critical = require('critical')
const glob = require("glob")

const src = dest = 'index.html'

console.log(`[critical-css]: injecting critical css to ${dest} ...`)

const css = glob.sync('./build/static/css/*.css')

critical.generate({
  src,
  dest,
  css,
  base: './build',
  inline: true,
  width: 1300,
  height: 900,
  minify: true,
  ignore: [/url\(/,'@font-face',/print/]
}, () => console.log(`[critical-css]: done`));