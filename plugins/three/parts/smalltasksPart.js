// import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class SmallTasksPart extends BasePart {
  constructor (type, uuid, position, energyLevel = 50) {
    super(type, uuid, position)
    this.energyLevel = energyLevel
    this.fileUrl = 'lossetaak_kleur'
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    const part = 100 * 2 / 6

    this.scene.children.forEach((block, i) => {
      if (i * part >= energy) {
        block.visible = true
      } else {
        block.visible = false
      }
    })
  }
}
