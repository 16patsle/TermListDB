import type { Story } from '@storybook/vue3'
import TermRow from './TermRow.vue'

export default {
  title: 'TermList/TermRow',
  component: TermRow,
  argTypes: {
    onEdit: { action: 'edited' },
    onRemove: { action: 'removed' },
  },
}

const Template: Story = args => ({
  components: { TermRow },
  setup() {
    return { args }
  },
  template: '<TermRow v-bind="args"></TermRow>',
})

export const Basic = Template.bind({})
Basic.args = {
  term: {
    _id: 'fake id',
    date: '2017-08-14T14:07:48.197Z',
    desc: 'Fake description',
    term: 'Fake term',
    type: 'verb',
  },
}

export const MarkdownDesc = Template.bind({})
MarkdownDesc.args = {
  term: {
    ...Basic.args.term,
    desc: '*This* description has **markdown** support.',
  },
}

export const Empty = Template.bind({})
Empty.args = {
  term: {},
}
