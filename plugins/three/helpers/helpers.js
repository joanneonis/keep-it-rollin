/* eslint-disable no-prototype-builtins */
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

// source: https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
export const visibleHeightAtZDepth = (depth, camera) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z
  if (depth < cameraOffset) {
    depth -= cameraOffset
  } else {
    depth += cameraOffset
  }

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth)
}

export const visibleWidthAtZDepth = (depth, camera) => {
  const height = visibleHeightAtZDepth(depth, camera)
  return height * camera.aspect
}

export function makeTextSprite (message, fontsize) {
  let ctx
  let texture
  let sprite
  let spriteMaterial

  const fontSettings = `800 ${fontsize}px Montserrat`

  const canvas = document.createElement('canvas')
  // eslint-disable-next-line prefer-const
  ctx = canvas.getContext('2d')
  ctx.font = fontSettings

  // setting canvas width/height before ctx draw, else canvas is empty
  canvas.width = ctx.measureText(message).width
  canvas.height = fontsize * 2.6

  // after setting the canvas width/height we have to re-set font to apply!?! looks like ctx reset
  ctx.font = fontSettings
  ctx.fillStyle = '#05046A'
  ctx.fillText(message, 0, fontsize)

  // eslint-disable-next-line prefer-const
  texture = new THREE.Texture(canvas)
  texture.minFilter = THREE.LinearFilter // NearestFilter;
  texture.needsUpdate = true

  // eslint-disable-next-line prefer-const
  spriteMaterial = new THREE.SpriteMaterial({ map: texture })
  spriteMaterial.opacity = 0.08
  // eslint-disable-next-line prefer-const
  sprite = new THREE.Sprite(spriteMaterial)
  sprite.name = 'sprite'
  return sprite
}
