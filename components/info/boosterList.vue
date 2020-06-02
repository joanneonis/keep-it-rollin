<template>
  <div class="booster-list">
    <idea-list
      class="boosters"
      category="all"
      type="list"
    />
  </div>
</template>

<script>
import ideaList from '~/components/trackCreation/ideaList'

export default {
  components: {
    ideaList
  }
}
</script>

<style lang="scss" scoped>
.booster-list {
  background: gray-color(150);
}
</style>
