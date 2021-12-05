import { onMounted, onUnmounted } from 'vue'
import { StateListener } from 'xstate/lib/interpreter'
import { GlobalContext, GlobalEvent } from '../machines/globalMachine'
import { globalService } from '../machines/globalService'

export function addTransitionListener(
  listener: StateListener<GlobalContext, GlobalEvent>
) {
  onMounted(() => globalService.onTransition(listener))
  onUnmounted(() => globalService.off(listener))
}
