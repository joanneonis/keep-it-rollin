import * as THREE from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { loadGlb } from '~/plugins/three/helpers/helpers'

export class BasePart {
  scene
  mesh

  constructor (debug, uuid, position, energyLevel = 50) {
    this.debug = debug
    this.fileUrl = 'Start van de dag' // loremobject
    this.uuid = uuid
    this.position = position

    this.energyLevel = energyLevel

    // temp random colors
    this.color = new THREE.Color(0xFFFFFF)
  }

  async loadModel () {
    const gltf = await loadGlb(this.fileUrl)
    this.gltf = gltf
    this.scene = gltf.scene
    this.scene.name = `scene-${this.uuid}`
    this.scene.position.set(...this.position)
    this.scene.scale.multiplyScalar(1)

    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.userData.uuid = this.uuid
        BufferGeometryUtils.computeTangents(node.geometry) // generates bad data due to degenerate UVs
      }
    })

    if (this.debug) {
      this.scene.add(new THREE.BoxHelper(this.mesh))
    }

    // To make sure that the matrixWorld is up to date for the boxhelpers
    this.scene.updateMatrixWorld(true)
    this.mesh = this.scene
  }

  generateExpressionsFolder (gui) {
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mesh = node
        mesh.castShadow = true
        mesh.name = this.uuid

        this.mesh = mesh
        // temp set random color
        mesh.material.color.setHex(Math.random() * 0xFFFFFF)

        if (!mesh.morphTargetDictionary) { return }
        const expressions = Object.keys(mesh.morphTargetDictionary)
        const expressionFolder = gui.addFolder(`MorphTargets - ${this.uuid}`)
        for (let i = 0; i < expressions.length; i++) {
          expressionFolder.add(mesh.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
        }

        this.expressionFolder = expressionFolder
      }
    })
  }

  generatePartPositionFolder (gui) {
    const positionFolder = gui.addFolder(`${this.uuid} position`)
    positionFolder.add(this.mesh.position, 'x', -20, 20).step(0.01)
    positionFolder.add(this.mesh.position, 'y', -20, 20).step(0.01)
    positionFolder.add(this.mesh.position, 'z', -20, 20).step(0.01)

    this.positionFolder = positionFolder
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (!node.morphTargetInfluences) {
          console.log('no morphtargets found!')
          return
        }

        node.morphTargetInfluences[1] = energy / 100
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
