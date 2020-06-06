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
            StartTijd
          </label>
          <input
            id="title"
            v-model="startTime"
            placeholder="90 min"
            type="time"
            name="title"
            :min="now"
            :max="today"
          >
        </div>
        <div class="form-field__split__small">
          <label for="note">
            Eindtijd
          </label>
          <input
            id="title"
            v-model="endTime"
            placeholder="90 min"
            type="time"
            name="title"
            :min="startTime"
            :max="today"
          >
        </div>
        <div class="form-field">
          <strong class="label">Duratie</strong> <br>
          <div class="calculation">
            <span v-if="duration.dur > 0">
              <template v-if="duration.hrs > 0">{{ duration.hrs }} u</template>
              <template v-if="duration.hrs > 0 && duration.mins !== 0"> en </template>
              <template v-if="duration.hrs === 0 || duration.hrs > 0 && duration.mins !== 0">{{ duration.mins }} min</template>
            </span>
            <span v-else>
              0  min
            </span>
            <div>
              <button :class="{ 'is-muted' : duration.dur <= 0 }" class="button button--primary button--sm" @click="changeTime(-15)">
                - 15 min
              </button>
              <button class="button button--primary button--sm" @click="changeTime(+15)">
                + 15 min
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-field">
        <label>
          Is dit je laatste taak van de dag?
        </label>
        <div class="input-switch">
          <div>
            <input id="switch" v-model="isLastItem" type="checkbox">
            <label for="switch">
              <span>{{ isLastItem ? 'ja' : 'nee' }}</span>
            </label>
          </div>
          <span class="input-switch__value">{{ isLastItem ? 'ja' : 'nee' }}</span>
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
import moment from 'moment/min/moment-with-locales'
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
      selectedCategory: trackPartTypes.WORKBLOCK,
      taskTitle: '',
      startTime: moment().format('LT'),
      endTime: moment().add(30, 'minutes').format('LT'),
      uuid: null,
      isLastItem: false,
      now: moment().startOf('day').format('LT'),
      today: moment().endOf('day').format('LT')
    }
  },

  computed: {
    trackPart () {
      return {
        category: 'task',
        type: this.selectedCategory,
        energyLevel: this.energyLevel,
        title: this.taskTitle,
        duration: this.duration.inmin,
        startTime: this.startTime,
        endTime: this.endTime,
        uuid: this.uuid,
        isLastItem: this.isLastItem
      }
    },

    duration () {
      const start = moment(this.startTime, 'LT')
      const end = moment(this.endTime, 'LT')
      const diffTime = moment(end).diff(start)
      const duration = moment.duration(diffTime)
      const hrs = duration.hours()
      const mins = duration.minutes()

      return { hrs, mins, dur: duration, inmin: duration.minutes() }
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

  beforeCreate () {
    moment.locale('nl')
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
    },

    changeTime (minutes) {
      this.endTime = moment(this.endTime, 'LT').add(minutes, 'minutes').format('LT')
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
  padding-bottom: 0;
}

.form-field__checkboxes {
  display: flex;
}

.form-field__split {
  display: flex;

  &__small {
    width: 28%;
    padding-right: 20px;
  }
}

.calculation {
  display: flex;
  align-items: center;

  span {
    display: flex;
    height: 46px;
    align-items: center;
    white-space: nowrap;
    width: 120px;
  }

  .button {
    margin-left: 13px;
    padding: 3px 10px;
    height: auto;

    &:first-child { margin-bottom: 2px; }
  }
}
</style>
