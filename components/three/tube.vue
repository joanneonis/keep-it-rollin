<template>
  <div id="scene-container" style="position: absolute; left:0px; top:0px" ref="sceneContainer" />
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Scene, rotateObject } from '~/plugins/threejs/scene'

export default {
  data () {
    return {
      scene: null
    }
  },

  mounted () {
    this.scene = new Scene(this.$refs.sceneContainer)
    this.loadObject()
  },

  methods: {
    loadObject () {
      const loader = new GLTFLoader()

      // const fileName = 'RobotExpressive' //
      const fileName = 'tube-v0'

      loader.load(`/three-assets/${fileName}.glb`, (gltf) => {
        const model = gltf.scene
        model.position.y = 2
        let runPart

        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            runPart = node
            node.castShadow = true
          }
        })

        const expressions = Object.keys(runPart.morphTargetDictionary)
        const expressionFolder = this.scene.gui.addFolder('Blob')
        for (let i = 0; i < expressions.length; i++) {
          expressionFolder.add(runPart.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
        }

        this.scene.tubeModel = model
        this.scene.scene.add(this.scene.tubeModel)
        this.addGui()
      })
    },

    addGui () {
      const tubeFolder = this.scene.gui.addFolder('Tube')
      const rotation = {
        x: 0,
        y: 0,
        z: 0
      }

      tubeFolder.add(rotation, 'x', 0, 360).step(1).onChange((e) => {
        rotateObject(this.scene.tubeModel, rotation.x, rotation.y, rotation.z)
      })
      tubeFolder.add(rotation, 'y', 0, 360).step(1).onChange((e) => {
        rotateObject(this.scene.tubeModel, rotation.x, rotation.y, rotation.z)
      })
      tubeFolder.add(rotation, 'z', 0, 360).step(1).onChange((e) => {
        rotateObject(this.scene.tubeModel, rotation.x, rotation.y, rotation.z)
      })

      tubeFolder.close()
      tubeFolder.add(this.scene.tubeModel.position, 'x', -50, 50).step(1)
      tubeFolder.add(this.scene.tubeModel.position, 'y', -50, 50).step(1)
      tubeFolder.add(this.scene.tubeModel.position, 'z', -50, 50).step(1)
    }
  }
}
</script>

<style>
#scene-container {
  height: 100vh;
}

.dg.ac {
    color: white;
    z-index: 20;
}

.dg li {
    border: none;
}

.dg li:before {
    display: none;
}
</style>
