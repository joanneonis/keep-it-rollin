import * as THREE from 'three'
import { loadGlb } from '~/plugins/three/helpers/helpers'

export class HalfPipe {
  scene
  fileName = 'halfpipe'

  async loadModel () {
    const gltf = await loadGlb(this.fileName)
    this.scene = gltf.scene
  }

  generateExpressionsFolder (gui) {
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const halfPipe = node
        node.castShadow = true

        const expressions = Object.keys(halfPipe.morphTargetDictionary)
        const expressionFolder = gui.addFolder(`MorphTargets - ${halfPipe.name}`)
        for (let i = 0; i < expressions.length; i++) {
          expressionFolder.add(halfPipe.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
        }
      }
    })
  }

  update () {
    // usually inside render animation loop
  }

  delete () {
    // unbinds and deletes everything
  }
}
