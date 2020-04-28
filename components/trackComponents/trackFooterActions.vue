<template>
  <div class="track-footer-actions">
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
  float: right;
}
</style>
