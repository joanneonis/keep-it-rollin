import { BasePart } from '~/plugins/three/parts/basePart'

export class WorkPart extends BasePart {
  constructor (type, uuid, position, rotation, energyLevel = 50) {
    super(type, uuid, position, rotation)
    this.energyLevel = energyLevel
    this.fileUrl = 'werkblok3'

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

    basePoint.position.z -= 0.3
    point2.position.z += 0.3

    this.scene.add(point2)

    this.ballTrackPoints.push(basePoint.getWorldPosition())
    this.ballTrackPoints.push(point2.getWorldPosition())
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    this.scene.children[0].morphTargetInfluences[0] = (100 - energy) / 100
    this.scene.children[1].morphTargetInfluences[0] = (100 - energy) / 100
  }
}
