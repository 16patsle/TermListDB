import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import type { defaultSchema } from 'rehype-sanitize'
import { type VNode } from 'vue'
import { Fragment, jsx, jsxs } from 'vue-jsx-runtime'
import { toJsxRuntime, type Jsx } from 'hast-util-to-jsx-runtime'

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
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm, { singleTilde: false })
    .use(remarkRehype)
    .use(rehypeSanitize, schema)

  const hast = processor.runSync(processor.parse(input))

  const result = toJsxRuntime(hast, {
    Fragment,
    jsx: jsx as Jsx,
    jsxs: jsxs as Jsx,
    elementAttributeNameCase: 'html',
  }) as VNode

  return { ...result, type: Fragment } as VNode
}

export default md
