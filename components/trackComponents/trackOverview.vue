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
import { BasePart } from '~/plugins/three/parts/basePart'
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
      console.log(e)
      if (e === 'overviewZoom') {
        this.zoomOverview()
        this.baseScene.resetIntersected()
      }

      // then when control is handled, empty action
      this.$store.commit('track/setControls', null)
    },

    action (e) {
      if (e === 'cancelled') {
        this.localModelCount--
        this.baseScene.trackParts.remove(this.localModel.scene)

        if (this.debug) {
          this.baseScene.gui.removeFolder(this.localModel.expressionFolder)
          this.baseScene.gui.removeFolder(this.localModel.positionFolder)
        }

        this.zoomOverview()
      }

      // then when action is handled, empty action
      this.$store.commit('track/setAction', null)
    },

    async viewState (e) {
      if (this.viewState === trackViewStates.CREATION.TASK) { // TODO of booster
        await this.addActiveEdit('task', this.activeLocalPart.uuid)
        this.baseScene.zoomTo(this.localModel.scene, true)
      }
    }
  },

  mounted () {
    // moved to function for async
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

      // if first item of the day, add energyPart
      if (this.viewState === trackViewStates.CREATION.FIRST) {
        this.addActiveEdit('energy', this.activeLocalPart.uuid)
      } else {
        this.zoomOverview()
      }
    },

    zoomOverview () {
      this.baseScene.zoomTo(this.baseScene.trackParts, false, -Math.PI * 0.3)
    },

    async addActiveEdit (type = 'lorem', uuid) {
      this.loadingNewPart = true

      // TODO - per type different classss
      this.createPart(type, uuid)
      await this.localModel.loadModel() // loads GLTF file
      await this.baseScene.trackParts.add(this.localModel.scene) // adds trackpart to an Three group

      if (this.debug) {
        this.localModel.generateExpressionsFolder(this.baseScene.gui)
        this.localModel.generatePartPositionFolder(this.baseScene.gui)
      }

      this.loadingNewPart = false
      this.localModelCount += 1 // TODO temp code for creating UID and selecting temp position at the same time

      this.baseScene.zoomTo(this.localModel.mesh, true)
    },

    createPart (type, uuid) {
      if (type === 'energy') {
        this.localModel = new EnergyPart(
          this.debug,
          `trackpart ${this.localModelCount}`, // TODO replace with FB UID
          tempRandomPositions[this.localModelCount], // TODO calculate position based on previous endpoint ball
          uuid
        )
      } else {
        this.localModel = new BasePart(
          this.debug,
          `trackpart ${this.localModelCount}`, // TODO replace with FB UID
          tempRandomPositions[this.localModelCount], // TODO calculate position based on previous endpoint ball
          uuid
        )
      }
    },

    // helper function to await an foreach loop
    async asyncForEach (array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    },

    async addModelsFromFb () {
      // iterate through trackparts from firebase
      await this.asyncForEach(this.activeTrackParts, async (trackpart, i) => {
        await this.addActiveEdit(trackpart.type, trackpart.uuid)
        // set saved deforms
        this.localModel.updateEnergy(trackpart.energyLevel)
      })
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
