import type { Story } from '@storybook/vue3'
import TermTable from './TermTable.vue'
import { Basic as BasicTerm, MarkdownDesc } from './TermRow.stories'

export default {
  title: 'TermList/TermTable',
  component: TermTable,
  argTypes: {
    onEdit: { action: 'edited' },
    onRemove: { action: 'removed' },
  },
}

const Template: Story = args => ({
  components: { TermTable },
  setup() {
    return { args }
  },
  template: '<TermTable v-bind="args"></TermTable>',
})

export const Basic = Template.bind({})
Basic.args = {
  terms: [BasicTerm.args?.term, MarkdownDesc.args?.term],
}

export const Empty = Template.bind({})
Empty.args = {
  terms: [],
}
