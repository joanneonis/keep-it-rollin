<template>
  <div class="energy-slider">
    <label
      for="energySlider"
      class="energy-slider__label"
    >
      Je energie-niveau
    </label>
    <input
      id="energySlider"
      class="energy-slider__input"
      type="range"
      min="0"
      max="100"
      :value="energyLevel"
      @change="$emit('energyLevel', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  data () {
    return {
      energyLevel: 50
    }
  },

  created () {
    this.$emit('energyLevel', this.energyLevel)
  }
}
</script>

<style lang="scss" scoped>
.energy-slider {
  display: flex;
  align-items: center;

  &__label {
    margin-right: rem(15px);
    white-space: nowrap;
    margin-bottom: 0;
  }

  &__input {
    -webkit-appearance: none;
    width: 100%;
    height: rem(2px);
    border-radius: rem(5px);
    background: rgba(#fff, .4);
    outline: none;
    transition: background .2s;

    &:hover {
      background: rgba(#fff, .4);
    }

    &::-webkit-slider-thumb {
      $size: 25px;

      -webkit-appearance: none;
      appearance: none;
      width: rem($size);
      height: rem($size);
      border-radius: 50%;
      border: 2px solid rgba(#fff, .4);
      background: #fff;
      cursor: pointer;
      background-clip: content-box;
    }
  }
}
</style>
