// eslint-disable-next-line no-unused-vars
import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class EnergyPart extends BasePart {
  constructor (type, uuid, position, rotation, energyLevel = 50) {
    super(type, uuid, position, rotation)
    this.energyLevel = energyLevel
    this.fileUrl = 'startenergie'
    this.labelSettings = {
      initText: 'Item',
      x: 0,
      y: 0.15,
      z: -0.2
    }
  }

  // initSpherePos () {
  //   const sphereSize = 0.05
  //   const geometry = new THREE.SphereGeometry(sphereSize, 32, 32)
  //   const material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
  //   const animateThisSphere = new THREE.Mesh(geometry, material)
  //   animateThisSphere.position.y += 0.2
  //   animateThisSphere.position.z += 0.3
  //   this.scene.add(animateThisSphere)

  //   this.ballTrackPoint = animateThisSphere.getWorldPosition()
  // }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    const spring = this.scene.children[0].children[4]

    spring.morphTargetInfluences[0] = energy / 100

    this.mixer = new THREE.AnimationMixer(this.scene)
    this.mixer.clipAction(this.gltf.animations[0]).play()

    const times = this.gltf.animations[0].tracks[0].times
    const startTime = times[0]
    const endTime = times[times.length - 1] - 0.01
    const timeSpan = endTime - startTime

    this.mixer.setTime(startTime + (timeSpan / 100) * energy)
  }
}
