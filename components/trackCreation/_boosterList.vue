<template>
  <ul class="list-unstyled booster-list">
    <li
      v-for="(category, i) in boosterCategories"
      :key="i"
      class="booster-item"
      @click="$emit('selected', category.title)"
    >
      <figure class="booster-item__image">
        <img :src="category.image" :alt="category.title">
      </figure>
      <h5 class="booster-item__title">
        {{ category.title }}
      </h5>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    boosterCategories: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
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
