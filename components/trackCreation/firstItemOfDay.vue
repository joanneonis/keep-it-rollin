<template>
  <input-panel
    :title="title"
    :description="description"
    :has-close="false"
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
import energySlider from '~/components/energySlider'
import inputPanel from '~/components/inputPanel'
import { trackViewStates } from '~/helpers/trackHelpers'

export default {
  components: {
    energySlider,
    inputPanel
  },

  data () {
    return {
      energyLevel: null,
      note: null,
      title: 'Yes, een nieuwe dag!',
      description: 'Hoe zit je erbij? Vol goeie moed, of moet je nog even op gang komen?'
    }
  },

  methods: {
    getEnergyLevel ($event) {
      this.$store.commit('track/setDeforms', $event)
      this.energyLevel = $event
    },

    setTrackpartData () {
      this.$store.commit('track/viewState', trackViewStates.OVERVIEW)
      this.$store.dispatch('track/setTrackPart', {
        type: 'start-of-day',
        energy: this.energyLevel,
        note: this.note
      })
    }
  }
}
</script>

<style lang="scss">
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
