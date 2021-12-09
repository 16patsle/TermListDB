import type { Story } from '@storybook/vue3'
import AppTable from './AppTable.vue'

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
