import type { Story } from '@storybook/vue3'
import AppFileInput from './AppFileInput.vue'

export default {
  title: 'Generic/AppFileInput',
  component: AppFileInput,
  argTypes: {
    onChange: { action: 'changed' },
    type: {
      options: [
        'text',
        'email',
        'password',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime',
        'datetime-local',
        'month',
        'week',
      ],
      control: 'select',
    },
  },
}

const Template: Story = args => ({
  components: { AppFileInput },
  setup() {
    return { args }
  },
  template: '<AppFileInput v-bind="args" />',
})

export const Basic = Template.bind({})
Basic.args = {
  label: 'Select file',
}

export const AcceptOnlyJSON = Template.bind({})
AcceptOnlyJSON.args = {
  label: 'Select JSON file',
  accept: 'application/json',
}

export const Centered = Template.bind({})
Centered.args = {
  ...Basic.args,
  centered: true,
}

export const Primary = Template.bind({})
Primary.args = {
  label: 'Primary file input',
  primary: true,
}

export const Success = Template.bind({})
Success.args = {
  label: 'Success file input',
  success: true,
}

export const Warning = Template.bind({})
Warning.args = {
  label: 'Warning file input',
  warning: true,
}

export const Danger = Template.bind({})
Danger.args = {
  label: 'Danger file input',
  danger: true,
}
