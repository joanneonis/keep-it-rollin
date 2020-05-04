import * as THREE from 'three'
// import TWEEN from '@tweenjs/tween.js'
// eslint-disable-next-line no-unused-vars
import CameraControls from 'camera-controls'
import * as dat from 'dat.gui'
import Stats from 'stats.js'

// TODO delete stuff on destroy

export class BaseScene {
  cameraOrigin = {
    x: -0.5,
    y: 1,
    z: 3
  }

  raycaster = new THREE.Raycaster()
  mouseMove = new THREE.Vector2()
  mouseClick = new THREE.Vector2()
  INTERSECTED
  radius = 100

  clock = new THREE.Clock()
  delta
  cameraControls

  trackParts = new THREE.Group()

  loading = true

  constructor (container, debug = false) {
    this.debug = debug

    CameraControls.install({ THREE })
    this.container = container

    // develop tools
    this.gui = new dat.GUI()
    this.gui.close()

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
    this.renderer.domElement.addEventListener('click', this.onDocumentMouseClick.bind(this), false)

    // init controls
    this.cameraControls = new CameraControls(this.camera, this.renderer.domElement)
    this.cameraControls.maxPolarAngle = (Math.PI / 2) - 0.1
    this.cameraControls.maxDistance = 15
    this.cameraControls.minDistance = 2

    this.cameraControls.addEventListener('controlstart', this.dragControls.bind(this))
    this.cameraControls.addEventListener('control', this.dragControls.bind(this))
    this.cameraControls.addEventListener('controlend', this.dragControls.bind(this))

    // temp helper
    const axis = new THREE.AxisHelper(7.5)
    this.scene.add(axis)
  }

  sceneSettings () {
    this.scene.background = new THREE.Color('#F7FAFC')
  }

  cameraSettings () {
    this.camera.position.set(this.cameraOrigin.x, this.cameraOrigin.y, this.cameraOrigin.z)
  }

  rendererSettings () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.renderer.shadowMapEnabled = true
    this.renderer.shadowMapSoft = true

    this.renderer.gammaOutput = true
    this.renderer.gammaFactor = 2.2
  }

  render () {
    this.delta = this.clock.getDelta()
    this.cameraControls.update(this.delta)

    this.raycaster.setFromCamera(this.mouseClick, this.camera)

    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }

  // checks if mouse intersects with something in the trackpartgroup
  checkIntersection () {
    const intersects = this.raycaster.intersectObjects(this.trackParts.children, true)

    if (intersects.length > 0) {
      if (this.loading) { return }

      // if its not same as previous target
      if (this.INTERSECTED !== intersects[0].object) {
        // reset hex previous clicked
        if (this.INTERSECTED) { this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex) }

        // hopefully animate camera to target
        this.zoomTo(intersects[0].object)

        // set currently clicked hex
        this.INTERSECTED = intersects[0].object
        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex()
        this.INTERSECTED.material.emissiveIntensity = 0.2
        this.INTERSECTED.material.emissive.setHex(0xFFFFFF)
      }
    } else {
      this.resetIntersected()
    }
  }

  resetIntersected () {
    // also reset hex previous clicked if no target is found on new click (clickoff)
    if (this.INTERSECTED) { this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex) }

    // this.cameraControls.reset(true) // TODO maybe?

    // reset intersection history
    this.INTERSECTED = null
  }

  zoomTo (mesh, panelActive = false, rotationV = -Math.PI * 0.4, rotationH = Math.PI * 0.4) {
    const padding = 0.3
    this.cameraControls.fitTo(mesh, true, {
      paddingLeft: panelActive ? 0 : padding,
      paddingRight: panelActive ? 3 : padding,
      paddingBottom: panelActive ? 1 : padding,
      paddingTop: padding
    })
    this.cameraControls.rotateTo(rotationV, rotationH, true)
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

  onDocumentMouseClick (event) {
    event.preventDefault()
    this.checkIntersection()
    this.mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  dragControls (e) {
    const event = e.originalEvent
    if (event.type === 'mousedown') {
      this.mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1
      this.checkIntersection()
    }
  }

  centerTrackParts () {
    this.trackParts.updateMatrixWorld(true)
    new THREE.Box3().setFromObject(this.trackParts).getCenter(this.trackParts.position).multiplyScalar(-1)
    this.trackParts.position.y = 0 // do not center y

    if (this.debug) {
      this.scene.add(new THREE.BoxHelper(this.trackParts))
    }
  }
}
