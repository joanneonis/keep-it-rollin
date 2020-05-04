<template>
  <input-panel
    :title="title"
    :description="description"
  >
    <div
      slot="body"
      class="input-panel__large"
    >
      <ul class="list-unstyled booster-list">
        <li
          v-for="(category, i) in boosterCategories"
          :key="i"
          class="booster-item"
          @click="selectedBooster = category.title"
        >
          <figure class="booster-item__image">
            <img :src="category.image" :alt="category.title">
          </figure>
          <h5 class="booster-item__title">
            {{ category.title }}
          </h5>
        </li>
      </ul>
    </div>
    <div slot="footer">
      <button
        v-if="selectedBooster"
        @click="saveTrackPart()"
        class="button button--primary"
      >
        Opslaan
      </button>
    </div>
  </input-panel>
</template>

<script>
import { trackViewStates } from '~/helpers/trackHelpers'
import inputPanel from '~/components/inputPanel'
import booster1 from '~/assets/img/booster/booster-1.png'
import booster2 from '~/assets/img/booster/booster-2.png'

export default {
  components: {
    inputPanel
  },

  data () {
    return {
      title: 'Booster toevoegen',
      description: 'Door een booster toe te passen win je snelheid!',
      selectedBooster: null,
      boosterCategories: [
        {
          title: 'Creatief',
          image: booster1
        },
        {
          title: 'Beweging',
          image: booster2
        },
        {
          title: 'Creatief',
          image: booster1
        },
        {
          title: 'Beweging',
          image: booster2
        },
        {
          title: 'Creatief',
          image: booster1
        },
        {
          title: 'Beweging',
          image: booster2
        }
      ]
    }
  },

  methods: {
    saveTrackPart () {
      this.$store.commit('track/setControls', 'overviewZoom')
      this.$store.dispatch('track/setTrackPart', {
        type: 'booster',
        category: this.selectedBooster
      })
      this.$store.commit('track/viewState', trackViewStates.OVERVIEW)
    }
  }
}
</script>

<style lang="scss">
.booster-list {
  display: flex;
  flex-wrap: wrap;
  max-width: 570px;
  margin-bottom: rem(20px);
}
.booster-item {
  width: calc(100% / 3 - 4px);
  padding-top: 150px;
  background-color: gray-color(150);
  margin: 2px;
  border-radius: 7px;
  position: relative;

  &__image {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }

  &__title {
    position: relative;
    text-align: center;
  }
}
</style>
