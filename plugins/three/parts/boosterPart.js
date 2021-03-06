// import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class BoosterPart extends BasePart {
  constructor (type, uuid, position, rotation, energyLevel = 50) {
    super(type, uuid, position, rotation)
    this.energyLevel = energyLevel
    this.fileUrl = 'booster_kleur'

    this.labelSettings = {
      initText: 'Item',
      x: 0,
      y: 0.12,
      z: -0.2
    }
  }

  initDeforms () {
    // this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    // const morphingPart = this.scene.children[1]
    // morphingPart.morphTargetInfluences[0] = 1.2 - (energy / 100)
  }
}
