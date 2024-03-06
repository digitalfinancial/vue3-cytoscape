import { CytoEvent } from './types'
import CyElement from './components/CyElement.vue'
import VueCytoscape from './components/Cytoscape.vue'
import { App } from 'vue'

export default {
  install(app: App) {
    app.component('cytoscape', VueCytoscape)
    app.component('cy-element', CyElement)
  },
}

export { CytoEvent, VueCytoscape, CyElement }
