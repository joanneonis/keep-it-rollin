import * as THREE from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { loadGlb, rotateObject, makeTextSprite } from '~/plugins/three/helpers/helpers'

export class BasePart {
  scene
  mesh
  labelSettings = {
    initText: 'Item',
    x: 0,
    y: 0.25,
    z: -0.2
  }

  ballTrackPoints = []

  constructor (type, uuid, position, rotation, energyLevel = 50) {
    this.type = type
    this.fileUrl = '/old/Start van de dag' // loremobject
    this.uuid = uuid
    this.position = position
    this.rotation = rotation
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

    rotateObject(this.scene, 0, this.rotation)

    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.userData.uuid = this.uuid
        node.userData.type = this.type
        node.userData.isTrackpart = true
        // node.material.color.setHex(Math.random() * 0xFFFFFF)
        node.castShadow = true
        BufferGeometryUtils.computeTangents(node.geometry) // generates bad data due to degenerate UVs
      }
    })

    // To make sure that the matrixWorld is up to date for the boxhelpers
    this.scene.updateMatrixWorld(true)
    this.mesh = this.scene

    this.initSpherePos()
  }

  initSpherePos () {
    const basePoint = this.initBaseBallPos()
    this.scene.add(basePoint) // todo remove later.. only for testing
    this.ballTrackPoints.push(basePoint.getWorldPosition())
  }

  initBaseBallPos () {
    const sphereSize = 0.05
    const geometry = new THREE.SphereGeometry(sphereSize, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
    const point = new THREE.Mesh(geometry, material)
    point.visible = false
    point.position.y += 0.06

    return point
  }

  generateExpressionsFolder (gui) {
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mesh = node
        mesh.name = this.uuid

        this.mesh = mesh

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

  addTime (text = this.labelSettings.text) {
    const spritey = makeTextSprite(text, 45)
    spritey.position.set(this.labelSettings.x, this.labelSettings.y, this.labelSettings.z)
    spritey.scale.set(0.7, 0.7, 0.7)
    this.mesh.add(spritey)
  }
}
