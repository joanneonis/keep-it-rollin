<template>
  <div class="container">
    <strong>viewState:</strong> {{ $store.state.track.viewState }}
    <br>
    <strong>trackparts:</strong>
    <pre>
      {{ activeTrackParts }}
    </pre>
    <div
      id="scene-container"
      ref="sceneContainer"
    />
  </div>
</template>

<script>
import { BaseScene } from '~/plugins/three/baseScene'
import { BasePart } from '~/plugins/three/parts/basePart'

export default {
  data () {
    return {
      activeTrackParts: this.$store.state.track.activeParts,
      baseScene: null,
      target: [0, 0, 0],
      sceneModels: {
        item1: {
          fileName: 'halfpipe',
          model: null,
          position: [1, 0, -1.6]
        },
        item2: {
          fileName: 'kegel',
          model: null,
          position: [1.9, 0, 0]
        },
        item3: {
          fileName: 'halfpipe',
          model: null,
          position: [0.8, 0, 1.45]
        },
        item4: {
          fileName: 'kegel',
          model: null,
          position: [1, 0, 6]
        }
      }
    }
  },

  mounted () {
    // create main scene
    this.baseScene = new BaseScene(this.$refs.sceneContainer)

    const models = Object.keys(this.sceneModels)
    models.forEach(async (key) => {
      await this.addTestObject(key, this.sceneModels[key])
    })
  },

  methods: {
    async addTestObject (name, modelObj) {
      modelObj.model = new BasePart(modelObj.fileName, name, modelObj.position)

      // create and load halfpipe
      await modelObj.model.loadModel()
      modelObj.model.generateExpressionsFolder(this.baseScene.gui)
      modelObj.model.generatePartPositionFolder(this.baseScene.gui)

      // add halfpipe to main scene
      const trackPartContainer = this.baseScene.scene.children.find((obj) => {
        return obj.name === 'trackparts'
      })
      trackPartContainer.add(modelObj.model.scene)
    }
  }
}
</script>

<style lang="scss">
#scene-container {
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px
}

// fix GUI list styles
.dg.ac {
  color: white;
  z-index: 20;
  // right: 30vw;

  li {
    border: none;

    &:before {
      display: none;
    }
  }
}

.testControls {
  position: fixed;
  z-index: 20;
  bottom: 20px;
}
</style>
