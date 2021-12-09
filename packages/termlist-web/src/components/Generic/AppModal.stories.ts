import type { Story } from '@storybook/vue3'
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

export default {
  title: 'Generic/AppModal',
  component: AppModal,
  argTypes: {
    onOkClick: { action: 'okClicked' },
    onClose: { action: 'closed' },
  },
}

const Template: Story = args => ({
  components: { AppModal },
  setup() {
    return { args }
  },
  template: `
    <AppModal v-bind="args">
      <template #modal-body>
        Modal Body
      </template>
    </AppModal>
  `,
})

export const Basic = Template.bind({})
Basic.args = {
  title: 'Modal Title',
  isActive: true,
}

export const NoCloseAllowed = Template.bind({})
NoCloseAllowed.args = {
  ...Basic.args,
  closeAllowed: false,
}

export const CustomText = Template.bind({})
CustomText.args = {
  ...Basic.args,
  title: 'Custom Title',
  okText: 'Custom OK Text',
  cancelText: 'Custom Cancel Text',
}

export const CustomFooter: Story = args => ({
  components: { AppModal, AppButton },
  setup() {
    return { args }
  },
  template: `
    <AppModal v-bind="args">
      <template #modal-body>
        Modal Body
      </template>
      <template #modal-footer>
        <AppButton danger>Danger Button</AppButton>
      </template>
    </AppModal>
  `,
})
CustomFooter.args = {
  ...Basic.args,
}

export const CustomHeader: Story = args => ({
  components: { AppModal, AppButton },
  setup() {
    return { args }
  },
  template: `
    <AppModal v-bind="args">
      <template #title>
        <AppButton danger>Header Button</AppButton>
      </template>
      <template #modal-body>
        Modal Body
      </template>
    </AppModal>
  `,
})
CustomHeader.args = {
  ...Basic.args,
}
