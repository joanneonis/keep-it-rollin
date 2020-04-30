import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

// TODO delete stuff on destroy

export class BaseScene {
  cameraPos = {
    x: -0.5,
    y: 1,
    z: 3
  }

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  INTERSECTED
  radius = 100
  theta = 0

  trackParts = new THREE.Group()

  constructor (container) {
    this.container = container

    // develop tools
    this.gui = new dat.GUI()
    this.stats = new Stats()

    // scene
    this.scene = new THREE.Scene()
    this.sceneSettings()

    // add trackpart container (used for interactivity also)
    this.trackParts.name = 'trackparts'
    this.scene.add(this.trackParts)

    // camera
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100)
    this.cameraSettings()
    this.generateCameraGuiFolder()

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.rendererSettings()

    // developer controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // lights
    this.addLights()

    // floorplane (for shadows to projected on)
    this.addFloorPlane()

    // create renderloop
    this.renderer.setAnimationLoop(() => {
      this.render()
    })

    // add renderer to dom
    this.container.appendChild(this.renderer.domElement)

    // add stats to dom
    this.container.appendChild(this.stats.dom)

    // listen to mouse events
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
  }

  sceneSettings () {
    this.scene.background = new THREE.Color('#F7FAFC')
  }

  cameraSettings () {
    this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z)
  }

  rendererSettings () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.renderer.shadowMapEnabled = true
    this.renderer.shadowMapSoft = true

    this.renderer.gammaOutput = true
    this.renderer.gammaFactor = 2.2
  }

  render () {
    this.theta += 0.1
    this.raycaster.setFromCamera(this.mouse, this.camera)
    this.checkIntersection()

    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }

  checkIntersection () {
    const intersects = this.raycaster.intersectObjects(this.trackParts.children, true)
    if (intersects.length > 0) {
      if (this.INTERSECTED !== intersects[0].object) {
        if (this.INTERSECTED) { this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex) }

        this.INTERSECTED = intersects[0].object
        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex()
        this.INTERSECTED.material.emissive.setHex(0xFF0000)

        // console.log('intersects', this.INTERSECTED)
      }
    } else {
      if (this.INTERSECTED) { this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex) }

      this.INTERSECTED = null
    }
  }

  addLights () {
    // lights (lights up whole scene)
    const ambientLight = new THREE.AmbientLight(0x404040) // soft white light
    this.scene.add(ambientLight)

    // directional light (used for shadows)
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF)
    directionalLight.position.set(5, 10, 7.5)
    directionalLight.intensity = 1
    directionalLight.target.position.set(0, 0, 0)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)
  }

  // floorPlane
  addFloorPlane () {
    const geometry = new THREE.PlaneGeometry(300, 300)
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color('#F7FAFC')
    })
    const plane = new THREE.Mesh(geometry, material)

    plane.rotation.x = THREE.Math.degToRad(-90)
    plane.position.y = 0.061
    plane.receiveShadow = true
    plane.name = 'floorplane'
    this.scene.add(plane)
  }

  generateCameraGuiFolder () {
    const cameraFolder = this.gui.addFolder('camera')

    cameraFolder.close()
    cameraFolder.add(this.camera.position, 'x', -20, 20).step(0.01)
    cameraFolder.add(this.camera.position, 'y', -20, 20).step(0.01)
    cameraFolder.add(this.camera.position, 'z', -20, 20).step(0.01)

    cameraFolder.add(this.camera, 'fov', 0, 100).step(1).onChange(() => {
      this.camera.updateProjectionMatrix()
    })
    cameraFolder.add(this.camera, 'near', 0, 10).step(0.01).onChange(() => {
      this.camera.updateProjectionMatrix()
    })
    cameraFolder.add(this.camera, 'far', 0, 100).step(1).onChange(() => {
      // this.camera.lookAt(new THREE.Vector3(this.cameratarget.x, this.cameratarget.y, this.cameratarget.z))
      this.camera.updateProjectionMatrix()
    })
  }

  onDocumentMouseMove (event) {
    event.preventDefault()
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }
}
