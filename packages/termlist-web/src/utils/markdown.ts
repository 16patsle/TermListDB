import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import type { defaultSchema } from 'rehype-sanitize'

const schema: typeof defaultSchema = {
  strip: [
    'script',
    'table', // tables are not allowed
    'sup', // removes footnotes
    'section', // removes footnote list at end
  ],
  clobberPrefix: 'md-content-',
  clobber: ['name', 'id'],
  protocols: {
    href: ['http', 'https'],
    cite: ['http', 'https'],
  },
  tagNames: [
    'br',
    'strong',
    'em',
    'a',
    'del',
    'p',
    'ol',
    'ul',
    'q',
    'li',
    'span',
    'input',
  ],
  attributes: {
    a: ['href', 'hrefLang', 'rel'],
    input: [['type', 'checkbox'], ['disabled', true], 'checked'],
    ol: ['start'],
    li: [['className', 'task-list-item'], 'value'],
    q: ['cite'],
    '*': [
      'ariaDescribedBy',
      'ariaHidden',
      'ariaLabel',
      'ariaLabelledBy',
      'dir',
      'id',
      'lang',
      'title',
    ],
  },
  required: {
    input: {
      type: 'checkbox',
      disabled: true,
    },
  },
  allowComments: false,
  allowDoctypes: false,
}

function md(input: string) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm, { singleTilde: false })
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .processSync(input)

  return String(file)
}

export default md
