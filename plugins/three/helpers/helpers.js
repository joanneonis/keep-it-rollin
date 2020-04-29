import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function rotateObject (object, degreeX = 0, degreeY = 0, degreeZ = 0) {
  object.rotation.x = (THREE.Math.degToRad(degreeX))
  object.rotation.y = (THREE.Math.degToRad(degreeY))
  object.rotation.z = (THREE.Math.degToRad(degreeZ))
}

export function loadGlb (fileName) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()

    loader.load(`/three-assets/${fileName}.glb`, function (object) {
      resolve(object)
    })
  })
}
