import './assets/main.scss'

if (document.getElementById('app') === null) {
  const el = document.createElement('div')
  el.id = 'app'
  document.body.appendChild(el)
}

const start = async () => {
  const { initApp } = await import(/* webpackPreload: true */ './initApp')
  await initApp()
}
void start()
