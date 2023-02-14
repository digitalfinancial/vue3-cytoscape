<template>
  <div />
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  withDefaults,
  watch,
  onBeforeUnmount,
  useAttrs,
  onMounted,
  inject,
  defineEmits,
} from 'vue'
import { Selector, Core, ElementDefinition, EventObject } from 'cytoscape'
import { CyElementEventsNames } from '@/types'

const props = withDefaults(
  defineProps<{
    definition: ElementDefinition
    sync?: boolean
  }>(),
  {
    sync: false,
  }
)

const emit = defineEmits<{
  (e: CyElementEventsNames, event: EventObject): void
}>()

const attrs = useAttrs()
const id = ref(props.definition.data.id)
const selector = ref<Selector>(`#${id.value}`)
const instance = ref<Core | undefined>(undefined)

function add() {
  // register all the component events as cytoscape ones
  for (const eventType of Object.values(CyElementEventsNames)) {
    instance.value?.on(eventType, selector.value, (event: EventObject) => {
      emit(eventType, event)
    })
  }

  // if sync is on, track position
  if (props.sync) {
    instance.value?.on('drag', selector.value, (event: EventObject) => {
      /*  Note: Cytoscape behaves badly when ele.position is an observer object. The underlying
          data may change, which adjust edge target coordinates, without re-drawing the node.

          In the definition below, and in the position watcher, JSON.parse(JSON.stringify())
          returns a raw object. Here, "definition.position" is an observer because of Vue, and
          event.target.position() seems to be an observer also. Without this strip, we end up with
          an observer of an observer after a drag event, one of which is stripped out in the
          watcher, creating the same problem we had initially.
      */

      // strip observers from the event position
      // update definition object
      // eslint-disable-next-line vue/no-mutating-props
      props.definition.position = JSON.parse(
        JSON.stringify(event.target.position())
      )
    })
  }

  // strip observers from the original definition
  let def = JSON.parse(JSON.stringify(props.definition))

  // add the element to cytoscape
  return instance.value?.add(def)[0]
}

function configure(cy: Core) {
  instance.value = cy

  const ele = add()

  id.value = ele.data().id
  selector.value = `#${id.value}`
}

const cy = inject('cy')

onMounted(() => {
  cy?.then(configure)
})

onBeforeUnmount(() => {
  instance.value?.remove(selector.value)
})

watch(
  () => props.definition.data,
  (data: any) => {
    const ele = instance.value?.getElementById(id.value)
    ele?.data(data)
  }
)

watch(
  () => props.definition.position,
  (position: any = null) => {
    const ele = instance.value?.getElementById(id.value)
    ele?.position(JSON.parse(JSON.stringify(position)))
  }
)
</script>
