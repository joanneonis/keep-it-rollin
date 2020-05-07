<template>
  <div
    id="scene-container"
    ref="sceneContainer"
    class="scene"
    :class="[{ 'is-loading': baseScene.loading }, `scene--${viewState}`]"
  >
    <div class="scene__state">
      {{ viewState }}
    </div>
    <transition name="scene-popup">
      <popup v-if="popup.visible" :data="popup.data" />
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { BaseScene } from '~/plugins/three/baseScene'
import { EnergyPart } from '~/plugins/three/parts/energyPart'
import { BasePart } from '~/plugins/three/parts/basePart'
import { trackViewStates, tempRandomPositions } from '~/helpers/trackHelpers'
import popup from '~/components/trackComponents/popup'

export default {
  components: {
    popup
  },

  data () {
    return {
      baseScene: { loading: true },
      localModel: null,
      localModelCount: 0,
      loadingNewPart: true,
      debug: false,
      popup: {
        visible: false,
        data: null
      }
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

        // update local 3D modal with new energyValue
        this.localModel.updateEnergy(newVal.energyLevel)
      }
    },

    controls (e) {
      if (e === 'overviewZoom') {
        this.zoomOverview()
        this.baseScene.resetIntersected()
      }

      // then when control is handled, empty action
      this.$store.commit('track/setControls', null)
    },

    action (e) {
      if (e === 'cancelled') {
        this.removeLocalModel()
      }

      // then when action is handled, empty action
      this.$store.commit('track/setAction', null)
    },

    async viewState (e) {
      if (this.viewState === trackViewStates.CREATION.TASK) { // TODO of booster
        // adds local model
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
      this.sceneListeners()

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
        // else zoom to overview
        this.zoomOverview()
      }
    },

    removeLocalModel () {
      this.localModelCount--
      this.baseScene.trackParts.remove(this.localModel.scene)

      if (this.debug) {
        this.baseScene.gui.removeFolder(this.localModel.expressionFolder)
        this.baseScene.gui.removeFolder(this.localModel.positionFolder)
      }

      this.zoomOverview()
    },

    sceneListeners () {
      const that = this
      // listen to mouse events
      this.baseScene.renderer.domElement.addEventListener('click', function (e) {
        that.handleSceneInteractions(that.baseScene.onDocumentMouseClick(e))
      }, false)

      const listeners = ['controlstart', 'control', 'controlend']
      listeners.forEach(evt =>
        this.baseScene.cameraControls.addEventListener(evt, function (e) {
          that.handleSceneInteractions(that.baseScene.dragControls(e), e.originalEvent.type)
        })
      )
    },

    handleSceneInteractions (targetMesh, interactionType = 'click') {
      if (!targetMesh || !targetMesh.userData || interactionType === 'wheel') {
        this.popup.visible = false
        return
      }
      // get selected trackpart data
      this.popup.data = this.activeTrackParts.find(part => part.uuid === targetMesh.userData.uuid)
      this.popup.visible = true
    },

    zoomOverview () {
      this.popup.visible = false
      this.baseScene.zoomTo(this.baseScene.trackParts, false, -Math.PI * 0.3)
    },

    async addActiveEdit (modelType = 'lorem', uuid) {
      this.loadingNewPart = true

      // load part by type & add to scene
      this.createPart(modelType, uuid)
      await this.localModel.loadModel() // loads GLTF file
      await this.baseScene.trackParts.add(this.localModel.scene) // adds trackpart to an Three group

      // set initial or saved deforms
      this.localModel.initDeforms()

      if (this.debug) {
        this.localModel.generateExpressionsFolder(this.baseScene.gui)
        this.localModel.generatePartPositionFolder(this.baseScene.gui)
      }

      this.loadingNewPart = false
      this.localModelCount += 1 // TODO temp code for creating UID and selecting temp position at the same time

      this.baseScene.zoomTo(this.localModel.mesh, true)
    },

    createPart (modelType, uuid) {
      // TODO move to class? idk
      if (modelType === 'energy') {
        this.localModel = new EnergyPart(
          this.debug,
          `trackpart ${uuid}`,
          tempRandomPositions[this.localModelCount], // TODO calculate position based on previous endpoint ball
          uuid
        )
      } else {
        this.localModel = new BasePart(
          this.debug,
          `trackpart ${uuid}`,
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
.scene {
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px;
  transition: opacity .2s;

  &__state {
    position: absolute;
    top: 100px;
    left: 20px;
    z-index: 200;
  }

  &.is-loading {
    opacity: 0;
  }

  &--first-part,
  &--task,
  &--booster {
    pointer-events: none;
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
</style>
