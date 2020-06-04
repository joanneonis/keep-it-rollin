// import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class MeetingPart extends BasePart {
  constructor (type, uuid, position, rotation, energyLevel = 50) {
    super(type, uuid, position, rotation)
    this.energyLevel = energyLevel
    this.fileUrl = 'meeting_kleur'

    this.labelSettings = {
      initText: 'Item',
      x: 0,
      y: 0.12,
      z: -0.2
    }
  }

  initSpherePos () {
    const basePoint = this.initBaseBallPos()
    this.scene.add(basePoint) // todo remove later.. only for testing

    basePoint.position.y += 0.01

    const point2 = basePoint.clone()

    basePoint.position.z -= 0.65
    point2.position.z += 0.55

    this.scene.add(point2)

    this.ballTrackPoints.push(basePoint.getWorldPosition())
    this.ballTrackPoints.push(point2.getWorldPosition())
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    const morphingPart = this.scene.children[1]
    morphingPart.morphTargetInfluences[0] = 1.2 - (energy / 100)
  }
}
