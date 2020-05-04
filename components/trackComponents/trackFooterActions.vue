<template>
  <div class="track-footer-actions">
    <div>
      <button
        class="button button--primary"
        @click="$store.commit('track/setControls', 'overviewZoom')"
      >
        overview
      </button>
    </div>
    <div>
      <a
        class="button button--secondary"
        @click="addBooster()"
      >
        Booster toevoegen
      </a>
      <a
        class="button button--primary"
        @click="addTask()"
      >
        Baandeel toevoegen
      </a>
    </div>
  </div>
</template>

<script>
import { trackViewStates } from '~/helpers/trackHelpers'

export default {
  methods: {
    addBooster () {
      this.$store.commit('track/viewState', trackViewStates.CREATION.BOOSTER)
    },

    addTask () {
      this.$store.commit('track/viewState', trackViewStates.CREATION.TASK)
    }
  }
}
</script>

<style lang="scss" scoped>
.track-footer-actions {
  display: flex;
  justify-content: space-between;
}
</style>
