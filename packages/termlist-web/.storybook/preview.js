import { app } from '@storybook/vue3'
import { FontAwesomeIcon } from '../src/iconLibrary'
import '../src/assets/main.scss'

app.component('fa-icon', FontAwesomeIcon)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
