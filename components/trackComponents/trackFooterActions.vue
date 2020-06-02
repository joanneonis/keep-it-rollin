<template>
  <div class="track-footer-actions">
    <div>
      <button
        class="button-link button-link--primary"
        @click="$store.commit('track/setControls', 'overviewZoom')"
      >
        <img src="~/assets/img/icon-zoom.svg" class="icon" alt="">
        <span>Overzicht</span>
      </button>
      <button
        v-if="localItemFocused"
        class="button-link button-link--primary"
        :class="{ 'is-muted' : !hasPrev }"
        @click="focusItem(focusIndex - 1)"
      >
        <img src="~/assets/img/icon-prev.svg" class="icon" alt="">
        <span>Vorig baandeel</span>
      </button>
      <button
        v-if="localItemFocused"
        :class="{ 'is-muted' : !hasNext }"
        class="button-link button-link--primary"
        @click="focusItem(focusIndex + 1)"
      >
        <img src="~/assets/img/icon-next.svg" class="icon" alt="">
        <span>Volgend baandeel</span>
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
import { mapState } from 'vuex'
import { trackViewStates } from '~/helpers/trackHelpers'

// itemFocused
export default {
  data () {
    return {
      hasNext: false,
      hasPrev: false,
      localItemFocused: false,
      focusIndex: null
    }
  },

  computed: {
    ...mapState({
      itemFocused: state => state.track.itemFocused
    })
  },

  watch: {
    itemFocused (e) {
      if (!e) {
        this.localItemFocused = false
        this.focusIndex = null
      } else {
        const { length, index } = e
        this.hasNext = length !== index + 1
        this.hasPrev = index !== 0
        this.localItemFocused = true
        this.focusIndex = index
      }
    }
  },

  methods: {
    addBooster () {
      this.$store.commit('track/setViewState', trackViewStates.CREATION.BOOSTER)
    },

    addTask () {
      this.$store.commit('track/setViewState', trackViewStates.CREATION.TASK)
    },

    focusItem (toItemIndex) {
      this.$store.commit('track/setControls', toItemIndex)
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
