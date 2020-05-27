// import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'
import { makeTextSprite } from '~/plugins/three/helpers/helpers'

export class WorkPart extends BasePart {
  constructor (debug, uuid, position, energyLevel = 50) {
    super(debug, uuid, position)
    this.energyLevel = energyLevel
    this.fileUrl = 'lorem-object-2'
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    const morphingPart = this.scene.children[0]
    morphingPart.morphTargetInfluences[0] = energy / 100
  }

  addTime (text = '12:00') {
    const spritey = makeTextSprite(text, 65)
    spritey.position.set(...this.position)
    spritey.position.y -= 0.15
    spritey.position.x -= 1.8
    spritey.position.z -= 3
    this.mesh.add(spritey)
  }
}
