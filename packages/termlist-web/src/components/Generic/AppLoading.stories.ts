import type { Story } from '@storybook/vue3'
import AppLoading from './AppLoading.vue'

export default {
  title: 'Generic/AppLoading',
  component: AppLoading,
  argTypes: {
    onClick: { action: 'clicked' },
  },
}

export const Regular: Story = args => ({
  components: { AppLoading },
  setup() {
    return { args }
  },
  template: '<AppLoading v-bind="args"></AppLoading>',
})
Regular.args = {
  text: 'Loading...',
}
