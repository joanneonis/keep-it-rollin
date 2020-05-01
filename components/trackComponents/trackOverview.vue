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
import { mapState } from 'vuex'
import { BaseScene } from '~/plugins/three/baseScene'
import { BasePart } from '~/plugins/three/parts/basePart'
// eslint-disable-next-line no-unused-vars
import { trackViewStates } from '~/helpers/trackHelpers'

export default {
  data () {
    return {
      activeTrackParts: this.$store.state.track.activeParts,
      baseScene: null,
      target: [0, 0, 0],
      firstObject: {
        fileName: 'halfpipe',
        model: null,
        position: [1, 0, -1.6]
      },
      sceneModels: { // temp test code
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

  computed: {
    ...mapState({
      viewState: state => state.track.viewState,
      trackPartTransforms: state => state.track.trackPartTransforms
    })
  },

  watch: {
    trackPartTransforms (newValue) {
      if (newValue === 0) { return }
      const deform = newValue / 100
      this.firstObject.model.mesh.morphTargetInfluences[1] = deform
    }
  },

  async mounted () {
    // create main scene
    this.baseScene = new BaseScene(this.$refs.sceneContainer)

    // very ugly tests yesyesyes
    if (this.viewState === trackViewStates.CREATION.FIRST) {
      await this.addTestObject('firstObject', this.firstObject)

      const that = this
      // !todo something is too slow?
      setTimeout(function () {
        that.baseScene.zoomTo(that.firstObject.model.mesh, true)
      }, 100)
    }
    // this.testSceneModels()
  },

  methods: {
    testSceneModels () {
      const models = Object.keys(this.sceneModels)
      models.forEach(async (key) => {
        await this.addTestObject(key, this.sceneModels[key])
      })
    },

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
