// import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class MeetingPart extends BasePart {
  constructor (debug, uuid, position, energyLevel = 50) {
    super(debug, uuid, position)
    this.energyLevel = energyLevel
    this.fileUrl = 'lorem-object-1'
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    const morphingPart = this.scene.children[1]
    morphingPart.morphTargetInfluences[0] = energy / 100
  }
}
