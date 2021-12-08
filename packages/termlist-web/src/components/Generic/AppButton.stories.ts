import AppButton from './AppButton.vue'

export default {
  title: 'Generic/AppButton',
  component: AppButton,
  argTypes: {
    onClick: { action: 'clicked' },
  },
}

const Template = args => ({
  components: { AppButton },
  setup() {
    return { args }
  },
  template: '<AppButton v-bind="args">{{args.label}}</AppButton>',
})

export const Regular = Template.bind({})
Regular.args = {
  label: 'Button',
}

export const Primary = Template.bind({})
Primary.args = {
  ...Regular.args,
  primary: true,
}

export const Danger = Template.bind({})
Danger.args = {
  ...Regular.args,
  danger: true,
}

export const Loading = Template.bind({})
Loading.args = {
  ...Regular.args,
  loading: true,
}
