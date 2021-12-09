import type { Story } from '@storybook/vue3'
import AppSelect from './AppSelect.vue'

export default {
  title: 'Generic/AppSelect',
  component: AppSelect,
  argTypes: {
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
}

const Template: Story = args => ({
  components: { AppSelect },
  setup() {
    return { args }
  },
  template: '<AppSelect v-bind="args"></AppSelect>',
})

export const Basic = Template.bind({})
Basic.args = {
  options: [
    {
      name: 'option1',
      ui: 'Option 1',
    },
    {
      name: 'option2',
      ui: 'Option 2',
    },
  ],
}

export const NoDefault = Template.bind({})
NoDefault.args = {
  ...Basic.args,
  defaultOption: false,
}

export const NoDefaultWithValue = Template.bind({})
NoDefaultWithValue.args = {
  ...NoDefault.args,
  modelValue: 'option2',
}

export const CustomDefault = Template.bind({})
CustomDefault.args = {
  ...Basic.args,
  defaultOptionName: 'Custom Default',
}

export const Fullwidth = Template.bind({})
Fullwidth.args = {
  ...Basic.args,
  fullwidth: true,
}
