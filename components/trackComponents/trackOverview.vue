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

const tempRandomPositions = [[1, 0, -1.6], [1.9, 0, 0], [0.8, 0, 1.45], [1, 0, 6]]

export default {
  data () {
    return {
      baseScene: null,
      trackPartContainer: null,
      localModel: null,
      activeModelCount: 0,
      activeTrackPartModels: [],
      loadingNewPart: true
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
    activeLocalPart: { // todo change to a getter for only energy? (depends on other model properties)
      deep: true,

      handler (newVal, oldVal) {
        if (!this.localModel || this.loadingNewPart) { return }

        console.log('hihi ik voer dit stiekem te vroeg uit', newVal, oldVal)

        // lala selecteer specifiek het laatste model
        this.localModel.updateEnergy(newVal.energyLevel)
      }
    },

    viewState (e) {
      console.log('viewstate changed', e)
      // if (this.viewState === trackViewStates.OVERVIEW) {
      //   await this.addModelsFromFb()
      // }

      if (this.viewState === trackViewStates.CREATION.TASK) { // TODO of booster
        this.addActiveEdit()
      }
    }
  },

  async mounted () {
    // create main scene
    this.baseScene = new BaseScene(this.$refs.sceneContainer)
    this.trackPartContainer = this.baseScene.scene.children.find(obj => obj.name === 'trackparts')

    // always load current track
    await this.addModelsFromFb()

    // then if
    if (this.viewState === trackViewStates.CREATION.FIRST) {
      await this.addActiveEdit()
    }
  },

  methods: {
    async addActiveEdit () {
      this.loadingNewPart = true

      // TODO - per type part also for booster and task
      const testFirstPart = new EnergyPart(trackPartTypes.ENERGY, tempRandomPositions[this.activeModelCount])
      await testFirstPart.loadModel()
      this.localModel = testFirstPart
      this.localModel.updateEnergy(this.activeLocalPart.energyLevel)
      this.trackPartContainer.add(testFirstPart.scene)
      this.activeTrackPartModels.push(testFirstPart)

      this.activeModelCount += 1

      setTimeout(() => {
        this.baseScene.zoomTo(this.localModel.mesh, true)
      }, 100)

      this.loadingNewPart = false
    },
    addModelsFromFb () {
      this.activeModelCount = this.activeTrackParts.length

      this.activeTrackParts.forEach(async (trackpart, i) => {
        // TODO switch part type based on category
        const testFirstPart = new EnergyPart(`generieke unieke uid? ${i}`, tempRandomPositions[i], trackpart.energyLevel, trackpart)
        await testFirstPart.loadModel()
        testFirstPart.initDeforms()
        this.activeTrackPartModels.push(testFirstPart)
        this.trackPartContainer.add(testFirstPart.scene)
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
