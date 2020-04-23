import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class HalfPipe {
  model

  constructor (scene) {
    this.scene = scene
    this.loadModel()
  }

  loadModel () {
    const loader = new GLTFLoader()
    const fileName = 'tube v3'

    loader.load(`/three-assets/${fileName}.glb`, (gltf) => {
      const model = gltf.scene

      model.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          const halfPipe = node
          node.castShadow = true

          const expressions = Object.keys(halfPipe.morphTargetDictionary)
          const expressionFolder = this.scene.gui.addFolder(`MorphTargets - ${halfPipe.name}`)
          for (let i = 0; i < expressions.length; i++) {
            expressionFolder.add(halfPipe.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
          }
        }
      })

      this.model = model
      this.scene.scene.add(this.model)
    })
  }
}
