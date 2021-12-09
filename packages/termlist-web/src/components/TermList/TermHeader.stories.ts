import type { Story } from '@storybook/vue3'
import TermHeader from './TermHeader.vue'

export default {
  title: 'TermList/TermHeader',
  component: TermHeader,
  decorators: [
    () => ({
      template: `
    <table class="table">
      <thead>
        <tr>
          <story/>
        </tr>
      </thead>
    </table>
  `,
    }),
  ],
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
