import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'
import { trackPartTypes } from '~/helpers/trackHelpers'
export class EnergyPart extends BasePart {
  constructor (debug, objectName, position, metadata, energyLevel = 50) {
    super(debug, objectName, position, metadata)
    this.energyLevel = energyLevel
    this.fileUrl = trackPartTypes.ENERGY
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
}
