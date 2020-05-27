<template>
  <input-panel
    :title="title"
    :description="description"
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
        <div class="form-field__label">
          Kies een categorie
        </div>
        <div class="form-field__checkboxes">
          <label
            v-for="(checkbox, i) in checkboxes"
            :key="i"
            class="checkbox"
          >{{ checkbox }}
            <input
              type="radio"
              :checked="selectedCategory === checkbox"
              :value="checkbox"
              name="radio"
              @input="selectedCategory = $event.target.value"
            >
          </label>
        </div>
      </div>
      <div class="form-field">
        <label for="note">
          Waar ga je mee bezig?
        </label>
        <input
          id="title"
          v-model="taskTitle"
          placeholder="Wil je een korte titel toevoegen?"
          type="text"
          name="title"
        >
      </div>
      <div class="form-field form-field__split">
        <div class="form-field__split__small">
          <label for="note">
            Hoe lang ga je ermee bezig? <br><small>(In minuten)</small>
          </label>
          <input
            id="title"
            v-model="duration"
            placeholder="90 min"
            type="number"
            name="title"
          >
        </div>
        <div>
          <label>
            Is dit je laatste taak van de dag?
          </label>
          <div class="input-switch">
            <input v-model="isLastItem" type="checkbox" id="switch" />
            <label for="switch">
              <span>{{ isLastItem ? 'ja' : 'nee' }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button
        class="button button--primary"
        @click="saveTrackPart()"
      >
        Opslaan
      </button>
    </div>
  </input-panel>
</template>

<script>
import { trackViewStates, trackPartTypes, uuidv4 } from '~/helpers/trackHelpers'
import inputPanel from '~/components/inputPanel'
import energySlider from '~/components/energySlider'

export default {
  components: {
    inputPanel,
    energySlider
  },

  data () {
    return {
      title: 'Taak toevoegen',
      description: 'Waar ga je mee bezig? Vul het hieronder in, en een stukje baan wordt voor je uitgezocht!',
      checkboxes: [
        trackPartTypes.WORKBLOCK,
        trackPartTypes.MEETING,
        trackPartTypes.SMALLTASKS
      ],
      energyLevel: null,
      selectedCategory: null,
      taskTitle: '',
      duration: 0,
      uuid: null,
      isLastItem: false
    }
  },

  computed: {
    trackPart () {
      return {
        type: this.selectedCategory,
        category: 'task',
        energyLevel: this.energyLevel,
        title: this.taskTitle,
        duration: this.duration,
        uuid: this.uuid,
        isLastItem: this.isLastItem
      }
    }
  },

  watch: {
    trackPart: {
      deep: true,

      handler () {
        this.$store.commit('track/setActiveLocalPart', this.trackPart)
      }
    },
    selectedCategory (e) {
      // update model
      this.$store.commit('track/setAction', e)
    }
  },

  mounted () {
    this.uuid = uuidv4()
    // init uuid in the store
    this.$store.commit('track/setActiveLocalPart', this.trackPart)
  },

  methods: {
    getEnergyLevel ($event) {
      this.energyLevel = $event
    },

    saveTrackPart () {
      this.$store.commit('track/setControls', 'overviewZoom')
      this.$store.dispatch('track/setTrackPart', this.trackPart)
      this.$store.commit('track/setViewState', trackViewStates.OVERVIEW)
      this.$store.commit('track/setAction', 'save')
    },

    getPanelAction ($event) {
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

.form-field__checkboxes {
  display: flex;
}

.form-field__split {
  display: flex;

  &__small {
    width: 49%;
    padding-right: 20px;
  }
}
</style>
