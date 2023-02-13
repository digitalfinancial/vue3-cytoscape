<template>
  <div ref="container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  withDefaults,
  provide,
  onMounted,
  useSlots,
  useAttrs,
  defineEmits,
} from 'vue'
import cytoscape, {
  CytoscapeOptions,
  Core,
  EventNames,
  EventHandler,
  EventObject,
} from 'cytoscape'

const props = withDefaults(
  defineProps<{
    config: CytoscapeOptions
    preConfig?: (x: any) => void
    afterCreated?: (x: any) => void
  }>(),
  {
    preConfig: (x: any) => {},
    afterCreated: (x: any) => {},
  }
)

const emit = defineEmits<{
  (e: 'mousedown', event: EventObject): void
}>()

const attrs = useAttrs()
const slots = useSlots()
const container = ref<HTMLElement | null>(null)
const instance = ref<Core | undefined>(undefined)
const resolve = ref<(value?: PromiseLike<Core> | Core) => void>(() => {})
const reject = ref<(reason?: any) => void>(() => {})

provide(
  'cy',
  new Promise<Core>((res, rej) => {
    resolve.value = res
    reject.value = rej
  })
)

onMounted(() => {
  // create a vue independent element
  container.value?.setAttribute('id', 'cytoscape-div')
  container.value?.setAttribute('width', '100%')
  container.value?.setAttribute('style', 'min-height: 600px;')
  // apply lifecycle hooks
  if (props.preConfig) props.preConfig(cytoscape)
  // create cytoscape instance
  const cyInstance = cytoscape({ container: container.value, ...props.config })
  // register all the component events as cytoscape ones
  const events = Object.entries(attrs).filter(
    ([_, val]) => typeof val === 'function'
  )
  const register = (eventType: EventNames, f: EventHandler) =>
    instance.value?.on(eventType, f)
  for (const [eventType, callback] of events) {
    if (Array.isArray(callback))
      callback.map((f) => register(eventType, f as EventHandler))
    else register(eventType, callback as EventHandler)
  }
  instance.value = cyInstance
  // resolve the promise with the object created
  resolve.value(cyInstance)
  if (props.afterCreated) props.afterCreated(cyInstance)
})
</script>
