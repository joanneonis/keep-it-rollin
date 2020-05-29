<template>
  <div>
    <img style="width: 100%" src="~/assets/img/temp/bot.png" alt="">
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.commit('modal/setHeader', { title: 'Tijdelijk plaatje', description: '' })
    this.$store.commit('modal/setActions', [
      {
        action: 'close',
        text: 'sluiten'
      }
    ])
  }
}
</script>
