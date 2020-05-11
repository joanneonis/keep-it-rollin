<template>
  <input-panel
    :title="title"
    :description="description"
    @action="getPanelAction"
  >
    <div slot="body">
      <div class="form-fields">
        <div class="form-field">
          <div class="form-field__label">
            Kies type booster
          </div>
          <div class="form-field__checkboxes">
            <label
              v-for="(checkbox, i) in boosterCategories"
              :key="i"
              class="checkbox"
            >{{ checkbox }}
              <input
                type="radio"
                :checked="selectedBooster === checkbox"
                :value="checkbox"
                name="radio"
                @input="selectedBooster = $event.target.value"
              >
            </label>
          </div>
        </div>
      </div>
      <idea-list
        class="boosters"
        :category="selectedBooster"
        @chosen="hanldeIdea"
      />
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
import { trackViewStates, uuidv4 } from '~/helpers/trackHelpers'
import inputPanel from '~/components/inputPanel'
import ideaList from '~/components/trackCreation/ideaList'

export default {
  components: {
    inputPanel,
    ideaList
  },

  data () {
    return {
      title: 'Booster toevoegen',
      description: 'Pas op, je kan snelheid verliezen! Pas een booster toe om dit op te lossen.',
      selectedIdea: null,
      boosterCategories: [
        'Ontspanning',
        'Creatief',
        'Beweging'
      ],
      selectedBooster: 'Ontspanning',
      uuid: null
    }
  },

  computed: {
    trackPart () {
      return {
        category: this.selectedBooster,
        idea: this.selectedIdea,
        type: 'booster',
        uuid: this.uuid
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
    },

    selectedBooster () {
      this.selectedIdea = null
      this.$store.commit('track/setActiveLocalPart', this.trackPart)
    }
  },

  mounted () {
    this.uuid = uuidv4()
    // init uuid in the store
    this.$store.commit('track/setActiveLocalPart', this.trackPart)
  },

  methods: {
    saveTrackPart () {
      this.$store.commit('track/setControls', 'overviewZoom')
      this.$store.dispatch('track/setTrackPart', this.trackPart)
      this.$store.commit('track/viewState', trackViewStates.OVERVIEW)
    },

    getPanelAction ($event) {
      this.$store.commit('track/setAction', $event)
    },

    hanldeIdea ($event) {
      this.selectedIdea = $event
    }
  }
}
</script>

<style lang="scss">
.form-fields {
  display: flex;
  flex-flow: column;
  padding: 0 40px 10px 40px;
  align-items: flex-start;
}

.form-field__checkboxes {
  display: flex;
}

.boosters {
  background: gray-color(150);
  padding: 20px 0;
  border-radius: rem(5px);
  margin: 0 -20px 10px -20px;

  h4 {
    padding-left: 40px;
  }
}
</style>
