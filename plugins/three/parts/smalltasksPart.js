// import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class SmallTasksPart extends BasePart {
  constructor (type, uuid, position, rotation, energyLevel = 50) {
    super(type, uuid, position, rotation)
    this.energyLevel = energyLevel
    this.fileUrl = 'lossetaak_kleur_small'
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  initSpherePos () {
    const basePoint = this.initBaseBallPos()
    this.scene.add(basePoint)

    basePoint.position.z += 0.1
    basePoint.position.x += 0.6

    const point2 = basePoint.clone()
    this.scene.add(point2)

    point2.position.z += 0.15
    point2.position.x -= 1

    this.ballTrackPoints.push(basePoint.getWorldPosition())
    this.ballTrackPoints.push(point2.getWorldPosition())
  }

  updateEnergy (energy) {
    const part = 100 * 2 / 6

    this.scene.children.forEach((block, i) => {
      if (block.userData.type !== this.type) { return }

      if (i * part >= energy) {
        block.visible = true
      } else {
        block.visible = false
      }
    })
  }
}
