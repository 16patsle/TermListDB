import { onMounted, onUnmounted } from 'vue'
import { globalService } from '../machines/globalService'

export function addTransitionListener(listener: (state: any) => void) {
  onMounted(() => globalService.onTransition(listener))
  onUnmounted(() => globalService.off(listener))
}
