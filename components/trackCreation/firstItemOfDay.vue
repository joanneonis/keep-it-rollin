<template>
  <input-panel
    :title="title"
    :description="description"
    :has-close="false"
    @action="getPanelAction"
  >
    <div
      slot="body"
      class="input-panel__large input-panel__large--primary"
    >
      <energy-slider @energyLevel="getEnergyLevel" />
    </div>
    <div
      slot="body"
      class="form-fields"
    >
      <div class="form-field">
        <label for="note">
          Notitie toevoegen?
        </label>
        <textarea
          id="note"
          v-model="note"
          placeholder="Waardoor voel je je zo? Door iets bijzonders of juist iets kleins?"
          name="note"
          cols="30"
          rows="10"
        />
      </div>
    </div>
    <div slot="footer">
      <button
        class="button button--primary"
        @click="setTrackpartData()"
      >
        Opslaan
      </button>
    </div>
  </input-panel>
</template>

<script>
import moment from 'moment/min/moment-with-locales'
import energySlider from '~/components/energySlider'
import inputPanel from '~/components/inputPanel'
import { trackViewStates, trackPartTypes, uuidv4 } from '~/helpers/trackHelpers'

export default {
  components: {
    energySlider,
    inputPanel
  },

  data () {
    return {
      type: 'energy',
      energyLevel: 50,
      note: '',
      title: 'Yes, een nieuwe dag!',
      description: 'Hoe zit je erbij? Vol goeie moed, of moet je nog even op gang komen?',
      uuid: null
    }
  },

  computed: {
    trackPart () {
      return {
        title: trackPartTypes.ENERGY,
        type: this.type,
        energyLevel: this.energyLevel,
        note: this.note,
        uuid: this.uuid,
        startTime: moment().format('LT')
      }
    }
  },

  watch: {
    trackPart: {
      deep: true,

      handler () {
        this.$store.commit('track/setActiveLocalPart', this.trackPart)
      }
    }
  },

  beforeCreate () {
    moment.locale('nl')
  },

  mounted () {
    this.uuid = uuidv4()

    // setup local
    this.$store.commit('track/setActiveLocalPart', this.trackPart)
  },

  methods: {
    getEnergyLevel ($event) {
      this.energyLevel = $event
    },

    setTrackpartData () {
      // on save set back to overview zoom
      this.$store.commit('track/setControls', 'overviewZoom')

      // to firebase
      this.$store.dispatch('track/setTrackPart', this.trackPart)

      // zoom out to overview
      this.$store.commit('track/setViewState', trackViewStates.OVERVIEW)
    },

    getPanelAction ($event) {
      this.$store.commit('track/setControls', 'overviewZoom')
      this.$store.commit('track/setAction', $event)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-fields {
  display: flex;
  flex-flow: column;
  padding: 30px 40px;
  align-items: flex-start;
}

.form-field {
  width: 100%;
}
</style>
