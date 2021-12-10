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
      <AppInput />
    </AppInputField>
  `,
})

export const Basic = Template.bind({})
Basic.args = {
  label: 'Basic input field',
}

export const NoLabel = Template.bind({})
NoLabel.args = {}

export const WithIconLeft: Story = args => ({
  components: { AppInputField, AppInput },
  setup() {
    return { args }
  },
  template: `
    <AppInputField v-bind="args">
      <span class="icon is-small is-left">
        <fa-icon :icon="['fas', 'search']" />
      </span>
      <AppInput placeholder="Search" />
    </AppInputField>
  `,
})
WithIconLeft.args = {
  label: 'With icon left',
  hasIcons: 'left',
}

export const WithDangerHelpText: Story = args => ({
  components: { AppInputField, AppInput },
  setup() {
    return { args }
  },
  template: `
    <AppInputField v-bind="args">
      <AppInput placeholder="Search" />
      <template #help>
        And it is {{args.helpDanger ? '' : 'not'}} dangerous
      </template>
    </AppInputField>
  `,
})
WithDangerHelpText.args = {
  label: 'This one has help text',
  helpDanger: true,
}

export const WithMultitpleGroupedControls: Story = args => ({
  components: { AppInputField, AppInput },
  setup() {
    return { args }
  },
  template: `
    <AppInputField v-bind="args">
      <template #controls>
        <div class="control">
          <AppInput placeholder="Search" />
        </div>
        <div class="control">
          <AppInput placeholder="Also search" />
        </div>
      </template>
    </AppInputField>
  `,
})
WithMultitpleGroupedControls.args = {
  label: 'Label and two grouped inputs',
  grouped: true,
}
