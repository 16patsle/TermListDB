import { onMounted, onUnmounted } from 'vue'
import { globalService } from '../machines/globalService'

export function addTransitionListener(
  listener: Parameters<typeof globalService.onTransition>[0]
) {
  onMounted(() => globalService.onTransition(listener))
  onUnmounted(() => globalService.off(listener))
}
