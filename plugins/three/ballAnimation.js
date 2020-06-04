// eslint-disable-next-line no-unused-vars
import * as THREE from 'three'

export class BallAnimation {
  scene
  splinePointsLength = 1;
  ballPathPositions = [];
  point = new THREE.Vector3();
  ARC_SEGMENTS = 200;
  spline
  animateThisSphere;
  ballPosIndex = 0;
  speed = 500
  isPlaying = false

  // get startpoint
  startPoint = new THREE.Vector3(0, 0, 0)

  constructor (startPos) {
    this.startPoint = startPos
    this.scene = new THREE.Scene()
    this.init()
  }

  init () {
    this.addBall()

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3))

    let curve = new THREE.CatmullRomCurve3(this.ballPathPositions)
    curve = new THREE.CatmullRomCurve3(this.ballPathPositions)
    curve.curveType = 'centripetal'
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0x00FF00
    }))
    curve.mesh.visible = false
    this.spline = curve

    this.scene.add(this.spline.mesh)

    // this.load(this.startPoint)
    this.addPoint(this.startPoint)
    this.animateThisSphere.position.set(this.startPoint)
  }

  addBall () {
    const sphereSize = 0.06
    const geometry = new THREE.SphereGeometry(sphereSize, 32, 32)
    const material = new THREE.MeshStandardMaterial({ color: 0x204DED })
    this.animateThisSphere = new THREE.Mesh(geometry, material)
    this.scene.add(this.animateThisSphere)
  }

  addSplineObject (position) {
    const material = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xFFFFFF
    })
    const object = new THREE.Mesh(new THREE.BoxBufferGeometry(20, 20, 20), material)

    if (position) {
      object.position.copy(position)
    } else {
      // if no pos is added, do random TODO remove
      object.position.x = Math.random() * 1 - 0.5
      object.position.y = Math.random() * 6
      object.position.z = Math.random() * 8 - 4
    }

    return object
  }

  addPoint (pos) {
    this.splinePointsLength++
    this.ballPathPositions.push(this.addSplineObject(pos).position)
    this.updateSplineOutline()
  }

  removePoint () {
    if (this.splinePointsLength <= 1) {
      return
    }
    this.splinePointsLength--
    this.ballPathPositions.pop()

    this.updateSplineOutline()
  }

  updateSplineOutline () {
    const splineMesh = this.spline.mesh
    const position = splineMesh.geometry.attributes.position

    for (let i = 0; i < this.ARC_SEGMENTS; i++) {
      if (this.spline.points.length <= 1) { return }
      const t = i / (this.ARC_SEGMENTS - 1)
      this.spline.getPoint(t, this.point)
      position.setXYZ(i, this.point.x, this.point.y, this.point.z)
    }

    position.needsUpdate = true
  }

  playBall () {
    this.isPlaying = !this.isPlaying
    this.ballPosIndex = 0
  }

  update () {
    if (this.spline.points.length > 1 && this.isPlaying) {
      this.ballPosIndex++

      if (this.ballPosIndex > this.speed) {
        this.ballPosIndex = 0
        this.isPlaying = false

        return false
      }

      const camPos = this.spline.getPoint(this.ballPosIndex / this.speed)
      const camRot = this.spline.getTangent(this.ballPosIndex / this.speed)

      this.animateThisSphere.position.x = camPos.x
      this.animateThisSphere.position.y = camPos.y
      this.animateThisSphere.position.z = camPos.z

      this.animateThisSphere.rotation.x = camRot.x
      this.animateThisSphere.rotation.y = camRot.y
      this.animateThisSphere.rotation.z = camRot.z

      return true
    }

    return false
  }
}
