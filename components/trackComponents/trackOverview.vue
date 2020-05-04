<template>
  <div
    id="scene-container"
    ref="sceneContainer"
    class="scene-container"
    :class="[{ 'is-loading': baseScene.loading }, `scene--${viewState}`]"
  />
</template>

<script>
import { mapState } from 'vuex'
import { BaseScene } from '~/plugins/three/baseScene'
import { EnergyPart } from '~/plugins/three/parts/energyPart'
import { trackViewStates } from '~/helpers/trackHelpers'

const tempRandomPositions = [
  [0, 0.2, 0],
  [1.9, 0.2, 0.6],
  [0.8, 0.2, 1.45],
  [1.6, 0.2, 2.75],
  [0.58, 0.2, 4.05],
  [-0.29, 0.2, 5.57],
  [1.01, 0.2, 6],
  [0.15, 0.2, 6.87],
  [1.48, 0.2, 8.12],
  [0.59, 0.2, 9.67],
  [1.76, 0.2, 10.39],
  [0.9, 0.2, 11.5],
  [2.19, 0.2, 13.42]
]

export default {
  data () {
    return {
      baseScene: { loading: true },
      localModel: null,
      localModelCount: 0,
      loadingNewPart: true,
      debug: false
    }
  },

  computed: {
    ...mapState({
      activeTrackParts: state => state.track.activeParts,
      viewState: state => state.track.viewState,
      activeLocalPart: state => state.track.activeLocalPart,
      action: state => state.track.action,
      controls: state => state.track.controls
    })
  },

  watch: {
    activeLocalPart: { // todo change to a getter for only energy? (depends on other model properties)
      deep: true,

      handler (newVal, oldVal) {
        if (!this.localModel || this.loadingNewPart) { return }

        // lala selecteer specifiek het laatste model
        this.localModel.updateEnergy(newVal.energyLevel)
      }
    },

    controls (e) {
      if (e === 'overviewZoom') {
        this.zoomOverview()
      }

      // then when control is handled, empty action
      this.$store.commit('track/setControls', null)
    },

    action (e) {
      if (e === 'cancelled') {
        this.localModelCount--
        this.baseScene.trackParts.remove(this.localModel.scene)
        this.zoomOverview()
      }

      // then when action is handled, empty action
      this.$store.commit('track/setAction', null)
    },

    async viewState (e) {
      if (this.viewState === trackViewStates.CREATION.TASK) { // TODO of booster
        await this.addActiveEdit()
        this.baseScene.zoomTo(this.localModel.scene, true)
      }
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      // create main scene
      this.baseScene = new BaseScene(this.$refs.sceneContainer, this.debug)

      // always load current track
      await this.addModelsFromFb()

      // after loading all the models etc. center the generated scene
      this.baseScene.centerTrackParts()

      // after everything is done enable interactivity (and visibility?)
      this.baseScene.loading = false

      // and zoom to desired object
      if (this.viewState !== trackViewStates.CREATION.FIRST) {
        this.zoomOverview()
      }

      // if first item of the day, add energyPart
      if (this.viewState === trackViewStates.CREATION.FIRST) {
        await this.addActiveEdit()
        this.baseScene.zoomTo(this.localModel.mesh, true)
      }
    },

    zoomOverview () {
      const padding = 1
      this.baseScene.cameraControls.fitTo(this.baseScene.trackParts, true, {
        paddingLeft: padding,
        paddingRight: padding,
        paddingBottom: padding,
        paddingTop: padding
      })
      this.baseScene.cameraControls.rotateTo(-Math.PI * 0.5, Math.PI * 0.4, true)
    },

    async addActiveEdit () {
      this.loadingNewPart = true

      // TODO - per type part also for booster and task
      this.localModel = new EnergyPart(this.debug, `trackpart ${this.localModelCount}`, tempRandomPositions[this.localModelCount])
      await this.localModel.loadModel()
      this.localModel.generatePartPositionFolder(this.baseScene.gui, this.localModelCount)
      this.localModel.initDeforms()

      await this.baseScene.trackParts.add(this.localModel.scene)

      this.loadingNewPart = false
      this.localModelCount += 1
    },

    // helper function to await an foreach loop
    async asyncForEach (array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    },

    async addModelsFromFb () {
      await this.asyncForEach(this.activeTrackParts, async (trackpart, i) => {
        const number = this.localModelCount + i + 1
        // TODO switch part type based on category
        this.localModel = new EnergyPart(this.debug, `generieke unieke uid? ${number}`, tempRandomPositions[number], trackpart, trackpart.energyLevel)
        await this.localModel.loadModel()
        this.localModel.generatePartPositionFolder(this.baseScene.gui, number)
        this.localModel.initDeforms()
        await this.baseScene.trackParts.add(this.localModel.scene)
      })

      this.localModelCount += this.activeTrackParts.length
    }
  }
}
</script>

<style lang="scss">
.scene-container {
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px;
  transition: opacity .2s;

  &.is-loading {
    opacity: 0;
  }
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

.scene--first-part,
.scene--task,
.scene--booster {
  pointer-events: none;
}
</style>
