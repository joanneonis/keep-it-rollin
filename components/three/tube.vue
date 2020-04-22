<template>
  <div id="scene-container" style="position: absolute; left:0px; top:0px" ref="sceneContainer" />
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Scene } from '~/plugins/threejs/scene'

// TODO delete stuff on destroy

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
      const fileName = 'tube v3'

      loader.load(`/three-assets/${fileName}.glb`, (gltf) => {
        const model = gltf.scene

        console.log(model)

        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            const halfPipe = node
            node.castShadow = true

            const expressions = Object.keys(halfPipe.morphTargetDictionary)
            const expressionFolder = this.scene.gui.addFolder(`MorphTargets - ${halfPipe.name}`)
            for (let i = 0; i < expressions.length; i++) {
              expressionFolder.add(halfPipe.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
            }
          }
        })

        this.scene.tubeModel = model
        this.scene.scene.add(this.scene.tubeModel)
      })
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
  right: 30vw;
}

.dg li {
    border: none;
}

.dg li:before {
    display: none;
}
</style>
