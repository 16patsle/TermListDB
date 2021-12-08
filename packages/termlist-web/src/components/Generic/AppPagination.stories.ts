import AppPagination from './AppPagination.vue'

export default {
  title: 'Generic/AppPagination',
  component: AppPagination,
  argTypes: {
    onGoto: { action: 'goto' },
    onGotopage: { action: 'gotopage' },
  },
}

const Template = args => ({
  components: { AppPagination },
  setup() {
    return { args }
  },
  template: '<AppPagination v-bind="args"></AppPagination>',
})

export const Basic = Template.bind({})
Basic.args = {
  currentpage: 1,
  lastpage: 10,
}

export const OnlyTwoPages = Template.bind({})
OnlyTwoPages.args = {
  ...Basic.args,
  lastpage: 2,
}

export const ManyPages = Template.bind({})
ManyPages.args = {
  ...Basic.args,
  lastpage: 100,
}

export const CurrentInMiddle = Template.bind({})
CurrentInMiddle.args = {
  ...Basic.args,
  currentpage: 5,
}

export const WeirdFirstPage = Template.bind({})
WeirdFirstPage.args = {
  currentpage: 27,
  firstpage: 5,
  lastpage: 100,
}
