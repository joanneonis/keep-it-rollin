// import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class WorkPart extends BasePart {
  constructor (type, uuid, position, energyLevel = 50) {
    super(type, uuid, position)
    this.energyLevel = energyLevel
    this.fileUrl = 'werkblok3'

    this.labelSettings = {
      initText: 'Item',
      x: 0,
      y: 0.12,
      z: -0.2
    }
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    this.scene.children[0].morphTargetInfluences[0] = (100 - energy) / 100
    this.scene.children[1].morphTargetInfluences[0] = (100 - energy) / 100
  }
}
