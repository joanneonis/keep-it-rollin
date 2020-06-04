import * as THREE from 'three'

export class Ball {
  splinePointsLength = 1;
  ballPathPositions = [];
  point = new THREE.Vector3();
  ARC_SEGMENTS = 200;
  spline
  animateThisSphere;
  ballPosIndex = 0;
  speed = 1000
  isPlaying = false
  startPoint
  geometry

  constructor (pos) {
    this.startPoint = pos
  }

  initBallTrack (scene) {
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3))

    let curve = new THREE.CatmullRomCurve3(this.ballPathPositions)
    curve = new THREE.CatmullRomCurve3(this.ballPathPositions)
    curve.curveType = 'centripetal'
    curve.mesh = new THREE.Line(this.geometry.clone(), new THREE.LineBasicMaterial({
      color: 0x00FF00,
      opacity: 0.35
    }))
    this.spline = curve
    scene.add(this.spline.mesh)

    this.load([new THREE.Vector3(this.startPoint)])
    this.animateThisSphere.position.set(this.startPoint)
  }

  initBall () {
    const sphereSize = 0.08
    const geometry = new THREE.SphereGeometry(sphereSize, 32, 32)
    const material = new THREE.MeshBasicMaterial()
    material.color.setHex(Math.random() * 0xFFFFFF)
    this.animateThisSphere = new THREE.Mesh(geometry, material)
    this.animateThisSphere.name = 'scene-ball'
    return this.animateThisSphere
  }

  addSplineObject (position) {
    const material = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xFFFFFF
    })
    const object = new THREE.Mesh(new THREE.BoxBufferGeometry(20, 20, 20), material)

    if (position) {
      object.position.copy(position)
    } else {
      object.position.x = Math.random() * 1000 - 500
      object.position.y = Math.random() * 600
      object.position.z = Math.random() * 800 - 400
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

  load (newBallPathPositions) {
    while (newBallPathPositions.length > this.ballPathPositions.length) {
      this.addPoint()
    }

    while (newBallPathPositions.length < this.ballPathPositions.length) {
      this.removePoint()
    }

    for (let i = 0; i < this.ballPathPositions.length; i++) {
      this.ballPathPositions[i].copy(newBallPathPositions[i])
    }

    this.updateSplineOutline()
  }

  update () {
    if (this.spline.points.length > 1 && this.isPlaying) {
      this.ballPosIndex++

      if (this.ballPosIndex > this.speed) {
        this.ballPosIndex = 0
      }

      const camPos = this.spline.getPoint(this.ballPosIndex / this.speed)
      const camRot = this.spline.getTangent(this.ballPosIndex / this.speed)

      this.animateThisSphere.position.x = camPos.x
      this.animateThisSphere.position.y = camPos.y
      this.animateThisSphere.position.z = camPos.z

      this.animateThisSphere.rotation.x = camRot.x
      this.animateThisSphere.rotation.y = camRot.y
      this.animateThisSphere.rotation.z = camRot.z
    }
  }

  playBall () {
    console.log('playing ball')
    this.isPlaying = !this.isPlaying
    this.ballPosIndex = 0
  }
}
