<template>
  <input-panel>
    <div
      slot="body"
      class="input-panel__large"
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
          name="note"
          cols="30"
          rows="10"
        />
      </div>
    </div>
    <div slot="footer">
      <button
        class="button button--primary"
      >
        Opslaan
      </button>
    </div>
  </input-panel>
</template>

<script>
import energySlider from '~/components/energySlider'
import inputPanel from '~/components/inputPanel'

export default {
  components: {
    energySlider,
    inputPanel
  },

  data () {
    return {
      energyLevel: null,
      note: null
    }
  },

  methods: {
    getEnergyLevel ($event) {
      this.energyLevel = $event
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
