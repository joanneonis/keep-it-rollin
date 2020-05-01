import * as THREE from 'three'
import { loadGlb } from '~/plugins/three/helpers/helpers'

export class BasePart {
  scene
  mesh

  constructor (objectName, position) {
    this.fileUrl = 'loremobject' // loremobject
    this.objectName = objectName
    this.position = position

    // temp random colors
    this.color = new THREE.Color(0xFFFFFF)
  }

  async loadModel () {
    const gltf = await loadGlb(this.fileUrl)
    this.scene = gltf.scene
    this.scene.name = `scene-${this.objectName}`
    this.scene.position.set(...this.position)
  }

  generateExpressionsFolder (gui) {
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mesh = node
        mesh.castShadow = true
        mesh.name = this.objectName
        mesh.testPos = this.position

        this.mesh = mesh
        // temp set random color
        mesh.material.color.setHex(Math.random() * 0xFFFFFF)

        if (!mesh.morphTargetDictionary) { return }
        const expressions = Object.keys(mesh.morphTargetDictionary)
        const expressionFolder = gui.addFolder(`MorphTargets - ${this.objectName}`)
        for (let i = 0; i < expressions.length; i++) {
          expressionFolder.add(mesh.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
        }
      }
    })
  }

  generatePartPositionFolder (gui) {
    const positionFolder = gui.addFolder(`${this.objectName} position`)
    positionFolder.add(this.scene.position, 'x', -10, 10).step(0.01)
    positionFolder.add(this.scene.position, 'y', -10, 10).step(0.01)
    positionFolder.add(this.scene.position, 'z', -10, 10).step(0.01)
  }

  update () {
    // usually inside render animation loop
  }

  delete () {
    // unbinds and deletes everything
  }
}
