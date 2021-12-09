import type { Story } from '@storybook/vue3'
import TermRowButton from './TermRowButton.vue'
import { iconLibrary } from '../../iconLibrary'

const options = Object.keys(iconLibrary.definitions.fas)
const mapping = options.reduce((all, option) => {
  all[option] = ['fas', option]
  return all
}, {} as { [key: string]: ['fas', string] })

export default {
  title: 'TermList/TermRowButton',
  component: TermRowButton,
  argTypes: {
    onClick: { action: 'clicked' },
    icon: {
      options,
      mapping,
      control: 'select',
    },
  },
}

const Template: Story = args => ({
  components: { TermRowButton },
  setup() {
    return { args }
  },
  template: '<TermRowButton v-bind="args"></TermRowButton>',
})

export const Pencil = Template.bind({})
Pencil.args = {
  icon: ['fas', 'pencil-alt'],
}

export const Trash = Template.bind({})
Trash.args = {
  icon: ['fas', 'trash-alt'],
}
