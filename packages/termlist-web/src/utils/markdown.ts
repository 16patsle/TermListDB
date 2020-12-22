import * as MarkdownIt from 'markdown-it'

const md = MarkdownIt('zero')
md.enable([
  'emphasis',
  'entity',
  'escape',
  'link',
  'strikethrough',
  'text_collapse',
  'balance_pairs',
])

export default md
