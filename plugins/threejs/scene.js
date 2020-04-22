import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

export class Scene {
  cameratarget

  constructor (
    container
  ) {
    this.cameratarget = {
      x: 0,
      y: 5,
      z: 0
    }
    this.gui = new dat.GUI()
    this.stats = new Stats()
    this.container = container

    // scene
    this.scene = new THREE.Scene()
    // camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, -18, 9)

    // this.camera.lookAt(new THREE.Vector3(this.cameratarget.x, this.cameratarget.y, this.cameratarget.z))

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.renderer.shadowMapEnabled = true
    this.renderer.shadowMapSoft = true

    this.container.appendChild(this.renderer.domElement)

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.baseElements()
    this.cube()
    this.cylinder()
    this.plane()

    this.cameraGui()

    // create renderloop
    this.renderer.setAnimationLoop(() => {
      this.render()
    })

    // add stats to dom
    this.container.appendChild(this.stats.dom)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }

  baseElements () {
    // lights

    // directional light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF)
    directionalLight.position.set(5, 0, 5)
    directionalLight.target.position.set(0, 0, 0)

    directionalLight.castShadow = true
    directionalLight.shadowDarkness = 0.5
    directionalLight.shadowCameraVisible = true

    directionalLight.shadowCameraNear = 0
    directionalLight.shadowCameraFar = 15

    directionalLight.shadowCameraLeft = -5
    directionalLight.shadowCameraRight = 5
    directionalLight.shadowCameraTop = 5
    directionalLight.shadowCameraBottom = -5

    this.scene.add(directionalLight)

    // spotlight
    const spotLight = new THREE.SpotLight(0xFFFFFF, 1)
    spotLight.position.set(5, 0, 6)

    spotLight.castShadow = true
    spotLight.shadowCameraVisible = true

    spotLight.target.position.set(-1, 0, 1)
    spotLight.shadowDarkness = 0.5

    spotLight.shadowCameraNear = 6
    spotLight.shadowCameraFar = 13

    this.scene.add(spotLight)
  }

  // plane
  plane () {
    const geometry = new THREE.PlaneGeometry(300, 300)
    const material = new THREE.MeshPhongMaterial({
      color: 0xCCCCCC
    })
    const plane = new THREE.Mesh(geometry, material)
    // plane.rotation.x = THREE.Math.degToRad(90)
    // plane.position.y = 10
    plane.receiveShadow = true
    this.scene.add(plane)
  }

  cube () {
    // cube
    const geometry = new THREE.CubeGeometry(1, 1, 1)
    const material = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(-4, 0, 0.5)
    cube.castShadow = true
    this.scene.add(cube)
  }

  cylinder () {
    // cylinder
    const geometry = new THREE.CylinderGeometry(1, 0, 3, 50, 50, false)
    const material = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    })
    const cylinder = new THREE.Mesh(geometry, material)
    cylinder.position.set(-1, -2, 1)
    cylinder.rotation.x = -Math.PI / 2
    cylinder.castShadow = true
    this.scene.add(cylinder)
  }

  cameraGui () {
    const cameraFolder = this.gui.addFolder('camera')

    cameraFolder.close()
    cameraFolder.add(this.camera.position, 'x', -50, 50).step(1)
    cameraFolder.add(this.camera.position, 'y', -50, 50).step(1)
    cameraFolder.add(this.camera.position, 'z', -50, 50).step(1)
    cameraFolder.add(this.camera, 'fov', 0, 5000).step(5)
    cameraFolder.add(this.camera, 'aspect', 0, 10).step(0.1)
    cameraFolder.add(this.camera, 'near', 0, 5000).step(5).onChange(() => {
      this.camera.updateProjectionMatrix()
    })
    cameraFolder.add(this.camera, 'far', 0, 5000).step(5).onChange(() => {
      this.camera.lookAt(new THREE.Vector3(this.cameratarget.x, this.cameratarget.y, this.cameratarget.z))
      this.camera.updateProjectionMatrix()
    })
  }
}

export function rotateObject (object, degreeX = 0, degreeY = 0, degreeZ = 0) {
  object.rotation.x = (THREE.Math.degToRad(degreeX))
  object.rotation.y = (THREE.Math.degToRad(degreeY))
  object.rotation.z = (THREE.Math.degToRad(degreeZ))
}
