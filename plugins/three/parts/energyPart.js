import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { BasePart } from '~/plugins/three/parts/basePart'

export class EnergyPart extends BasePart {
  constructor (debug, uuid, position, energyLevel = 50) {
    super(debug, uuid, position)
    this.energyLevel = energyLevel
    this.fileUrl = 'energy'
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    const spring = this.scene.children[6]

    spring.morphTargetInfluences[0] = energy / 100

    this.mixer = new THREE.AnimationMixer(this.scene)
    this.mixer.clipAction(this.gltf.animations[0]).play()

    const times = this.gltf.animations[0].tracks[0].times
    const startTime = times[0]
    const endTime = times[times.length - 1] - 0.01
    const timeSpan = endTime - startTime

    this.mixer.setTime(startTime + (timeSpan / 100) * energy)
  }

  addTime () {
    const moonDiv = document.createElement('div')
    moonDiv.className = 'label'
    moonDiv.textContent = 'Start'
    moonDiv.style.marginTop = '0'
    moonDiv.style.fontSize = '100px'
    const moonLabel = new CSS2DObject(moonDiv)
    moonLabel.position.set(...this.position)
    this.mesh.add(moonLabel)
    console.log('moonlabel', this.mesh, this.position)
  }
}
