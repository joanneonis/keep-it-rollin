<template>
  <div class="container">
    <strong>viewState:</strong> {{ $store.state.track.viewState }}
    <br>
    <strong>local</strong>
    <pre>
      {{ activeLocalPart }}
    </pre>
    <strong>trackparts:</strong>
    <pre>
      {{ activeTrackParts }}
    </pre>
    <div
      id="scene-container"
      ref="sceneContainer"
      :class="`scene--${viewState}`"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { BaseScene } from '~/plugins/three/baseScene'
import { EnergyPart } from '~/plugins/three/parts/energyPart'
import { trackViewStates, trackPartTypes } from '~/helpers/trackHelpers'

export default {
  data () {
    return {
      baseScene: null,
      trackPartContainer: null,
      localModel: null,
      activeTrackPartModels: []
      // activeTrackParts: this.$store.state.track.activeParts
      // sceneModels: { // temp test code
      //   item2: {
      //     fileName: 'kegel',
      //     model: null,
      //     position: [1.9, 0, 0]
      //   },
      //   item3: {
      //     fileName: 'halfpipe',
      //     model: null,
      //     position: [0.8, 0, 1.45]
      //   },
      //   item4: {
      //     fileName: 'kegel',
      //     model: null,
      //     position: [1, 0, 6]
      //   }
      // }
    }
  },

  computed: {
    ...mapState({
      activeTrackParts: state => state.track.activeParts,
      viewState: state => state.track.viewState,
      activeLocalPart: state => state.track.activeLocalPart
    })
  },

  watch: {
    activeLocalPart: {
      deep: true,

      handler (e) {
        console.log('activeLocalPart trackoverview changed to', e)
        if (!this.localModel) { return }
        this.localModel.updateEnergy(e.energyLevel)
      }
    }
  },

  mounted () {
    // create main scene
    this.baseScene = new BaseScene(this.$refs.sceneContainer)
    this.trackPartContainer = this.baseScene.scene.children.find(obj => obj.name === 'trackparts')

    if (this.viewState === trackViewStates.CREATION.FIRST) {
      this.addActiveEdit()
    }

    if (this.viewState === trackViewStates.OVERVIEW) {
      this.addModelsFromFb()
    }

    // very ugly tests yesyesyes
    // if (this.viewState === trackViewStates.CREATION.FIRST) {
    //   await this.addTestObject('firstObject', this.firstObject)

    //   const that = this
    //   // !todo something is too slow?
    //   setTimeout(function () {
    //     that.baseScene.zoomTo(that.firstObject.model.mesh, true)
    //   }, 100)
    // }
    // this.testSceneModels()
  },

  methods: {
    async addActiveEdit () {
      // TODO - make generic for also booster and task
      const testFirstPart = new EnergyPart(trackPartTypes.ENERGY, [0, 0, 0])
      await testFirstPart.loadModel()
      this.localModel = testFirstPart
      this.localModel.updateEnergy(this.activeLocalPart.energyLevel)
      this.trackPartContainer.add(testFirstPart.scene)
    },
    addModelsFromFb () {
      this.activeTrackParts.forEach(async (trackpart) => {
        if (trackpart.type === trackPartTypes.ENERGY) {
          const testFirstPart = new EnergyPart('titel first item of the day', [0, 0, 0], trackpart.energyLevel, trackpart)
          await testFirstPart.loadModel()
          testFirstPart.initDeforms()
          this.activeTrackPartModels.push(testFirstPart)
          this.trackPartContainer.add(testFirstPart.scene)
        }
      })
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

.scene--first-part {
  pointer-events: none;
}
</style>
