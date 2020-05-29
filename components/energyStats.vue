<template>
  <div>
    <img style="width: 100%" src="~/assets/img/temp/stats.png" alt="">
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.commit('modal/setHeader', { title: 'Tijdelijk plaatje', description: '' })
  }
}
</script>
