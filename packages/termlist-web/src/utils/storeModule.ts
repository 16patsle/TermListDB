import { getModule } from 'vuex-module-decorators'
import store from '../store'
import StoreModule from '../storeModule'

const storeModule = getModule(StoreModule, store)
export default storeModule
