import type { Story } from '@storybook/vue3'
import AppNavbarItem from './AppNavbarItem.vue'
import AppButton from './AppButton.vue'
import { Primary } from './AppButton.stories'

export default {
  title: 'Generic/AppNavbarItem',
  component: AppNavbarItem,
}

const Template: Story = args => ({
  components: { AppNavbarItem },
  setup() {
    return { args }
  },
  template: '<AppNavbarItem v-bind="args">{{args.label}}</AppNavbarItem>',
})

export const LinkNoHref = Template.bind({})
LinkNoHref.args = {
  label: 'Link without href',
  link: true,
}

export const LinkWithHref = Template.bind({})
LinkWithHref.args = {
  label: 'Link with href',
  href: 'https://www.google.com',
}

export const NavbarButton: Story = args => ({
  components: { AppNavbarItem, AppButton },
  setup() {
    return { args }
  },
  template:
    '<AppNavbarItem v-bind="args"><AppButton v-bind="args.contentArgs">{{args.contentArgs.label}}</AppNavbarItem>',
})
NavbarButton.args = {
  contentArgs: Primary.args,
}
