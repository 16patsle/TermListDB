import AppNavbar from './AppNavbar.vue'
import AppNavbarItem from './AppNavbarItem.vue'

export default {
  title: 'Generic/AppNavbar',
  component: AppNavbar,
}

export const ManyItemsTop = args => ({
  components: { AppNavbar, AppNavbarItem },
  setup() {
    return { args }
  },
  template: `
    <AppNavbar v-bind="args">
      <template #start>
        <AppNavbarItem :href="args.link1">{{args.link1Title}}</AppNavbarItem>
        <AppNavbarItem :href="args.link2">{{args.link2Title}}</AppNavbarItem>
        <AppNavbarItem :href="args.link3">{{args.link3Title}}</AppNavbarItem>
        <AppNavbarItem :href="args.link4">{{args.link4Title}}</AppNavbarItem>
      </template>
    </AppNavbar>`,
})
ManyItemsTop.args = {
  fixed: 'top',
  link1: '#link1',
  link2: '#link2',
  link3: '#link3',
  link4: '#link4',
  link1Title: 'Link1',
  link2Title: 'Link2',
  link3Title: 'Link3',
  link4Title: 'Link4',
}

export const ManyItemsBottom = ManyItemsTop.bind({})
ManyItemsBottom.args = {
  ...ManyItemsTop.args,
  fixed: 'bottom',
}
