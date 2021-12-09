import type { Story } from '@storybook/vue3'
import TermHeader from './TermHeader.vue'

export default {
  title: 'TermList/TermHeader',
  component: TermHeader,
}

export const Basic: Story = args => ({
  components: { TermHeader },
  setup() {
    return { args }
  },
  template: '<TermHeader v-bind="args"></TermHeader>',
})
Basic.parameters = {
  controls: { hideNoControlsWarning: true },
}
