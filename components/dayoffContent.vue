<template>
  <div class="modal-dayoff">
    <div class="modal-dayoff__intro">
      <h2>Top, je dag zit erop!</h2>
      <p> Wauw, weer een dag afgerond, lekker gewerkt! Hieronder je highlights nog even op een rijtje. </p>
    </div>

    <ul class="list-unstyled day-highlights">
      <li class="day-highlights__item">
        <figure class="day-highlights__image">
          <img :src="require(`~/assets/img/types/${bestTasks.type}.png`)" alt="Energie highlight">
        </figure>
        <div class="day-highlights__title">
          <strong class="type--highlight">Meeste energie</strong>
          <span>{{ bestTasks.title || bestTasks.type }}</span>
        </div>
      </li>
      <li class="day-highlights__item">
        <figure class="day-highlights__image">
          <img src="~/assets/img/types/booster.png" alt="Energie highlight">
        </figure>
        <div class="day-highlights__title">
          <strong class="type--highlight">Boosters</strong>
          <span v-if="boosterParts.length > 0">{{ boosterParts.length }}x toegepast</span>
          <span>Helaas geen boosters vandaag...</span>
        </div>
      </li>
    </ul>

    <button class="button button--primary" @click="playTrack()">
      <img src="~/assets/img/icon-play.svg" alt="" class="icon">
      <span>bekijk jouw baan nogmaals</span>
    </button>
    <button class="button-link button-link--primary">
      <img src="~/assets/img/icon-share.svg" alt="" class="icon">
      <span>deel jouw baan</span>
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    playTrack () {
      this.$store.commit('track/setControls', 'play')
      this.$store.dispatch('modal/closeModal')
    }
  },

  computed: {
    boosterParts () {
      const parts = this.$store.getters['track/energyParts']
      return parts.filter(part => part.type === 'booster')
    },
    taskParts () {
      const parts = this.$store.getters['track/energyParts']
      return parts.filter(part => part.type !== 'booster')
    },
    bestTasks () {
      const energyLevels = this.taskParts.map(part => part.energyLevel)
      const highestVal = Math.max(...energyLevels)
      let itemWithHighest = this.taskParts.filter(part => parseInt(part.energyLevel) === highestVal)
      itemWithHighest = itemWithHighest.length > 1 ? itemWithHighest[itemWithHighest.length - 1] : itemWithHighest[0]
      return itemWithHighest
    }
  }
}
</script>

<style lang="scss">
.modal-dayoff {
  text-align: center;
  margin: auto;

  &__intro {
    max-width: rem(280px);
    margin: auto;
  }
}

.day-highlights {
  max-width: rem(300px);
  margin: rem(15px) auto rem(20px);

  &__title {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    width: 100%;
    padding-left: rem(20px);
  }

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: rem(120px);
    }
  }
}
</style>
