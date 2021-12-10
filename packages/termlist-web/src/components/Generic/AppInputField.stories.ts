import type { Story } from '@storybook/vue3'
import AppInputField from './AppInputField.vue'
import AppInput from './AppInput.vue'

export default {
  title: 'Generic/AppInputField',
  component: AppInputField,
}

const Template: Story = args => ({
  components: { AppInputField, AppInput },
  setup() {
    return { args }
  },
  template: `
    <AppInputField v-bind="args">
      <template #control>
        <AppInput />
      </template>
    </AppInputField>
  `,
})

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic input field',
}
