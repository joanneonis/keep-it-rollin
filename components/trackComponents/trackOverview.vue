<template>
  <div
    id="scene-container"
    ref="sceneContainer"
    class="scene"
    :class="[{ 'is-loading': baseScene.loading }, `scene--${viewState}`]"
  >
    <transition name="scene-popup">
      <popup
        v-if="popup.visible"
        :data="popup.data"
        :saved="popup.saved"
      />
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { BaseScene } from '~/plugins/three/baseScene'
import { EnergyPart } from '~/plugins/three/parts/energyPart'
import { MeetingPart } from '~/plugins/three/parts/meetingPart'
import { SmallTasksPart } from '~/plugins/three/parts/smalltasksPart'
import { WorkPart } from '~/plugins/three/parts/workPart'
import { BasePart } from '~/plugins/three/parts/basePart'
import { trackViewStates, tempRandomPositions, uuidv4 } from '~/helpers/trackHelpers'
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
        saved: true,
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

        // live update popup
        this.popup.data = this.activeLocalPart
        this.popup.visible = true
        this.popup.saved = false

        if (this.viewState !== trackViewStates.CREATION.BOOSTER) {
          // update local 3D modal with new energyValue
          this.localModel.updateEnergy(newVal.energyLevel)
        }
      }
    },

    controls (e) {
      if (e === null) {
        return
      }

      if (e === 'overviewZoom') {
        this.zoomOverview()
        this.baseScene.resetIntersected()
      }

      // zoom to item index
      if (e <= this.activeTrackParts.length) {
        const trackPartModels = this.baseScene.scene.children[0].children
        const mesh = trackPartModels[e].children.find(element => element.isMesh)
        this.baseScene.zoomTo(mesh, false, -1.7, 1)

        this.$store.commit('track/setItemFocused', { length: this.activeTrackParts.length, index: e })

        this.popup.data = this.activeTrackParts[e]
        this.popup.visible = true
        this.popup.saved = true // when clicked
      }

      // then when control is handled, empty action
      this.$store.commit('track/setControls', null)
    },

    action (e) {
      if (e === 'save') {
        const label = this.activeLocalPart.type === 'energy' ? 'Start' : moment(this.activeLocalPart.createdAt.toDate()).format('h:mm')
        this.localModel.addTime(label)

        const completionMessage = {
          storyId: uuidv4(),
          messages: [
            'Ik heb je baandeel geplaatst! &#128516;'
          ],
          actions: [],
          timer: 5000
        }

        if (this.checkPersonalState()) {
          completionMessage.messages.push(this.checkPersonalState())
        }

        this.$store.commit('chatbot/setActiveMessages', completionMessage)
      }

      if (e === 'cancelled') {
        this.removeLocalModel()
        this.zoomOverview()
      }

      const types = ['Meeting', 'Losse taken', 'Werkblok']
      if (types.includes(e)) {
        // remove old model
        this.removeLocalModel()
        // set new model
        this.addActiveEdit(e, this.activeLocalPart.uuid)
      }

      // then when action is handled, empty action
      this.$store.commit('track/setAction', null)
    },

    viewState (e) {
      this.switchView()
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
      this.switchView()
    },

    switchView () {
      switch (this.viewState) {
        case trackViewStates.CREATION.FIRST:
          this.addActiveEdit('energy', this.activeLocalPart.uuid)
          break
        case trackViewStates.CREATION.TASK:
          this.addActiveEdit('task', this.activeLocalPart.uuid)
          break
        case trackViewStates.CREATION.BOOSTER:
          this.addActiveEdit('booster', this.activeLocalPart.uuid)
          break
        default:
          this.zoomOverview()
          break
      }
    },

    removeLocalModel () {
      this.localModelCount--
      this.baseScene.trackParts.remove(this.localModel.scene)

      if (this.debug) {
        this.baseScene.gui.removeFolder(this.localModel.expressionFolder)
        this.baseScene.gui.removeFolder(this.localModel.positionFolder)
      }
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
        this.$store.commit('track/setItemFocused', false)
        return
      }

      // get selected trackpart data
      const activeItemIndex = this.activeTrackParts.findIndex(part => part.uuid === targetMesh.userData.uuid)
      this.popup.data = this.activeTrackParts[activeItemIndex]
      this.popup.visible = true
      this.popup.saved = true // when clicked

      this.$store.commit('track/setItemFocused', { length: this.activeTrackParts.length, index: activeItemIndex })
    },

    zoomOverview () {
      this.popup.visible = false
      this.baseScene.zoomTo(this.baseScene.trackParts, false, -1.7, 1)
      this.$store.commit('track/setItemFocused', null)
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
      const baseData = [
        this.activeLocalPart.type || modelType,
        uuid,
        tempRandomPositions[this.localModelCount], // TODO calculate position based on previous endpoint ball
        this.activeLocalPart.energyLevel
      ]

      switch (baseData[0]) {
        case 'energy':
          this.localModel = new EnergyPart(...baseData)
          break
        case 'Meeting':
          this.localModel = new MeetingPart(...baseData)
          break
        case 'Losse taken':
          this.localModel = new SmallTasksPart(...baseData)
          break
        case 'Werkblok':
          this.localModel = new WorkPart(...baseData)
          break
        case 'booster':
          this.localModel = new BasePart(...baseData)
          break
        default:
          this.localModel = new BasePart(...baseData)
          break
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

        if (trackpart.energyLevel) {
          // set saved deforms
          this.localModel.updateEnergy(trackpart.energyLevel)
        }

        const label = trackpart.type === 'energy' ? 'Start' : moment(trackpart.createdAt.toDate()).format('h:mm')
        this.localModel.addTime(label)
      })
    },

    checkPersonalState () {
      const energyLevel = Math.round(this.$store.getters['track/avarageEnergyLevel'])

      if (this.localModel.type === 'booster') {
        return 'Je hebt snelheid gewonnen! Goed bezig'
      }
      if (this.localModel.type !== 'booster' && energyLevel < 50) {
        return 'Probeer zo nog eens een booster, je energie is aan de lage kant...'
      }
      // console.log(this.activeTrackParts, `energylevel: ${Math.round(this.$store.getters['track/avarageEnergyLevel'])}`, this.localModel)
      return false
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
  display: none; // dayoff hide fps meter
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
