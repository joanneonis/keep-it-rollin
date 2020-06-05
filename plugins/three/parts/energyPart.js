// eslint-disable-next-line no-unused-vars
import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class EnergyPart extends BasePart {
  constructor (type, uuid, position, rotation, energyLevel = 50) {
    super(type, uuid, position, rotation)
    this.energyLevel = energyLevel
    this.fileUrl = 'startenergie'
    this.labelSettings = {
      initText: 'Item',
      x: 0,
      y: 0.15,
      z: -0.2
    }
  }

  initSpherePos () {
    const basePoint = this.initBaseBallPos()
    this.scene.add(basePoint) // todo remove later.. only for testing

    basePoint.position.y += 0.14
    basePoint.position.z += 0.2

    this.ballTrackPoints.push(basePoint.getWorldPosition())
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    const spring = this.scene.children[0].children[4]

    spring.morphTargetInfluences[0] = energy / 100

    this.mixer = new THREE.AnimationMixer(this.scene)
    this.mixer.clipAction(this.gltf.animations[0]).play()

    const times = this.gltf.animations[0].tracks[0].times
    const startTime = times[0]
    const endTime = times[times.length - 1] - 0.01
    const timeSpan = endTime - startTime

    this.mixer.setTime(startTime + (timeSpan / 100) * energy)
  }
}
