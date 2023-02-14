<template>
  <div id="app">
    <Cytoscape
      ref="cy"
      :config="exampleConfig"
      :preConfig="preConfig"
      :afterCreated="afterCreated"
      @mousedown="addNode"
      @cxttap="reactiveUpdate"
    >
      <cy-element
        v-for="def in elements"
        :key="`${def.data.id}`"
        :definition="def"
        :sync="true"
        @click="deleteNode($event, def.data.id)"
        @cxttap="updateNode"
      />
    </Cytoscape>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 400px;
}
</style>

<script setup lang="ts">
import { computed, ref, toRaw } from 'vue'
import uuid from 'uuid/v4'
import { Core, ElementDefinition, EventObject } from 'cytoscape'
import Cytoscape from '@/components/Cytoscape.vue'
import CyElement from '@/components/CyElement.vue'
import exampleConfig from '@/example-config.ts'
import eles from '@/example-elements.ts'

const cy = ref<Core | undefined>(undefined)
const elements = ref(eles)

const config = computed(() => {
  const noElementsConfig = { ...exampleConfig }
  delete noElementsConfig.elements
  return noElementsConfig
})

function addNode(event: EventObject) {
  console.log('node added')
  // Example of adding node
  if (event.target === toRaw(cy.value)) {
    const id: string = uuid()
    elements.value.push({
      data: {
        id,
        label: 'new',
      },
      position: event.position,
      group: 'nodes',
    })
  }
}

function deleteNode(event: Event, id: string) {
  // Example of reactivelyeactively delete an element
  elements.value.some((ele: ElementDefinition, index: number) => {
    const match = ele.data.id == id
    if (match) {
      elements.value = elements.value.filter(
        (_: ElementDefinition, idx: number) => idx !== index
      )
    }
    return match
  })
}

function updateNode(event: any) {
  // Example of directly changing the data by target
  let label: string = event.target.data().label
  label += label[0]
  event.target.data({ label })
}

function reactiveUpdate(event: any) {
  if (event.target === cy.value.instance) {
    // Example of changing this component's "elements" array to reactively change the data
    elements.value[0].data.label = 'Updated Reactively'
    if (elements.value[1].position) elements.value[1].position.x -= 100
  }
}

function preConfig(cytoscape: any) {
  console.log(`calling preConfig`)
}

function afterCreated(created: Core) {
  console.log(`calling afterCreated`)
  cy.value = created
}
</script>
