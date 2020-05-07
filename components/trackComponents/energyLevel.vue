<template>
  <div class="energy-status">
    <div class="energy-status__info">
      <span class="">
        jouw energie vandaag
      </span>
      <span v-if="getEnergyInfo.text" class="energy-status__info__value">
        {{ getEnergyInfo.text }}
      </span>
    </div>
    <figure class="energy-status__image">
      <img :src="require(`~/assets/img/emoji/${getEnergyInfo.img}.svg`)" alt="Energie niveau">
    </figure>
  </div>
</template>

<script>
import { getEnergyDescription } from '~/helpers/trackHelpers'

export default {
  computed: {
    avarageEnergy () {
      return Math.round(this.$store.getters['track/avarageEnergyLevel'])
    },
    getEnergyInfo () {
      return getEnergyDescription(this.avarageEnergy)
    }
  }
}
</script>

<style lang="scss">
.energy-status {
  display: flex;
  z-index: 200;
  margin-top: 20px;

  &__info {
    display: flex;
    flex-flow: column;
    justify-content: center;
    padding-right: 20px;
    text-align: right;

    &__value {
      color: theme-color(primary);
      font-weight: 700;
    }
  }

  &__image {
    width: 80px;
    background: white;
    padding: 13px;
    border-radius: 50px;
    margin: 0;
  }
}
</style>
