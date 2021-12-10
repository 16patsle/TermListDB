import type { Story } from '@storybook/vue3'
import AppInput from './AppInput.vue'

export default {
  title: 'Generic/AppInput',
  component: AppInput,
  argTypes: {
    'onUpdate:modelValue': { action: 'update:modelValue' },
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
  components: { AppInput },
  setup() {
    return { args }
  },
  template: '<AppInput v-bind="args" />',
})

export const Basic = Template.bind({})
Basic.args = {
  placeholder: 'Basic input',
}

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  placeholder: 'Primary input',
}

export const Success = Template.bind({})
Success.args = {
  success: true,
  placeholder: 'Success input',
}

export const Warning = Template.bind({})
Warning.args = {
  warning: true,
  placeholder: 'Warning input',
}

export const Danger = Template.bind({})
Danger.args = {
  danger: true,
  placeholder: 'Danger input',
}

export const Password = Template.bind({})
Password.args = {
  type: 'password',
  placeholder: 'Password input',
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  placeholder: 'Disabled input',
}
