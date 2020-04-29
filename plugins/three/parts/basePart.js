import * as THREE from 'three'
import { loadGlb } from '~/plugins/three/helpers/helpers'

export class BasePart {
  scene

  constructor (fileUrl, objectName, position) {
    this.fileUrl = fileUrl
    this.objectName = objectName
    this.position = position
  }

  async loadModel () {
    const gltf = await loadGlb(this.fileUrl)
    this.scene = gltf.scene
    this.scene.name = this.objectName
    this.scene.position.set(...this.position)
  }

  generateExpressionsFolder (gui) {
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const halfPipe = node
        node.castShadow = true

        const expressions = Object.keys(halfPipe.morphTargetDictionary)
        const expressionFolder = gui.addFolder(`MorphTargets - ${this.objectName}`)
        for (let i = 0; i < expressions.length; i++) {
          expressionFolder.add(halfPipe.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
        }
      }
    })
  }

  generatePartPositionFolder (gui) {
    const positionFolder = gui.addFolder(`${this.objectName} position`)
    positionFolder.add(this.scene.position, 'x', -20, 20).step(0.01)
    positionFolder.add(this.scene.position, 'y', -20, 20).step(0.01)
    positionFolder.add(this.scene.position, 'z', -20, 20).step(0.01)
  }

  update () {
    // usually inside render animation loop
  }

  delete () {
    // unbinds and deletes everything
  }
}
