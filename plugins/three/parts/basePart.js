import * as THREE from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { loadGlb } from '~/plugins/three/helpers/helpers'

export class BasePart {
  scene
  mesh

  constructor (debug, objectName, position) {
    this.debug = debug
    this.fileUrl = 'loremobject' // loremobject
    this.objectName = objectName
    this.position = position

    // temp random colors
    this.color = new THREE.Color(0xFFFFFF)
  }

  async loadModel () {
    const gltf = await loadGlb(this.fileUrl)
    this.scene = new THREE.Scene()
    this.scene.name = `scene-${this.objectName}`

    // todo whatif more than one mesh?
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mesh = node
        this.mesh = mesh
        this.mesh.position.set(...this.position)

        BufferGeometryUtils.computeTangents(mesh.geometry) // generates bad data due to degenerate UVs
        const group = new THREE.Group()
        group.scale.multiplyScalar(1)
        this.scene.add(group)

        // To make sure that the matrixWorld is up to date for the boxhelpers
        group.updateMatrixWorld(true)

        group.add(mesh)

        if (this.debug) {
          this.scene.add(new THREE.BoxHelper(mesh))
        }
      }
    })
  }

  generateExpressionsFolder (gui) {
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mesh = node
        mesh.castShadow = true
        mesh.name = this.objectName

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

  generatePartPositionFolder (gui, uuid) {
    const positionFolder = gui.addFolder(`${this.objectName} position - ${uuid}`)
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
