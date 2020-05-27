import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'
import { makeTextSprite } from '~/plugins/three/helpers/helpers'

export class SmallTasksPart extends BasePart {
  constructor (debug, uuid, position, energyLevel = 50) {
    super(debug, uuid, position)
    this.energyLevel = energyLevel
    this.fileUrl = 'Start van de dag'
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

  addTime (text = '12:00') {
    const spritey = makeTextSprite(text, 65)
    spritey.position.set(...this.position)
    spritey.position.y -= 0.15
    spritey.position.x -= 5.8
    spritey.position.z -= 2
    this.mesh.add(spritey)
  }
}
