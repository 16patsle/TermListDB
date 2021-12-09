import type { Story } from '@storybook/vue3'
import AppTable from './AppTable.vue'
import TermHeader from '../TermList/TermHeader.vue'
import TermRow from '../TermList/TermRow.vue'
import { Basic as BasicTerm, MarkdownDesc } from '../TermList/TermRow.stories'

export default {
  title: 'Generic/AppTable',
  component: AppTable,
  argTypes: {},
}

const Template: Story = args => ({
  components: { AppTable },
  setup() {
    return { args }
  },
  template: `
    <AppTable v-bind="args">
      <template #table-header>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
      </template>
      <template #table-body>
        <tr>
          <td>Row 1</td>
          <td>Row 2</td>
          <td>Row 3</td>
        </tr>
      </template>
    </AppTable>
  `,
})

export const Basic = Template.bind({})

export const Fullwidth = Template.bind({})
Fullwidth.args = {
  fullwidth: true,
}

export const Hoverable = Template.bind({})
Hoverable.args = {
  hoverable: true,
}

export const FullwidthHoverable = Template.bind({})
FullwidthHoverable.args = {
  fullwidth: true,
  hoverable: true,
}

export const WithTermHeaderAndRow: Story = args => ({
  components: { AppTable, TermHeader, TermRow },
  setup() {
    return { args }
  },
  template: `
    <AppTable v-bind="args">
      <template #table-header>
        <TermHeader />
      </template>
      <template #table-body>
        <TermRow :term="args.term1" />
        <TermRow :term="args.term2" />
      </template>
    </AppTable>
  `,
})
WithTermHeaderAndRow.args = {
  fullwidth: true,
  hoverable: true,
  term1: BasicTerm.args?.term,
  term2: MarkdownDesc.args?.term,
}
