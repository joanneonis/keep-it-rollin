<template>
  <div class="container">
    <br>
    <h2>Tijdelijke logout pagina</h2>
    <account class="temp-signout" />
  </div>
</template>

<script>
import account from '~/components/account'

export default {
  components: {
    account
  },

  async fetch ({ store }) {
    await store.dispatch('auth/initClient')
    await store.dispatch('auth/checkLogin')
    await store.dispatch('track/getTrack')
  }
}
</script>

<style lang="scss">
.temp-signout {
  justify-content: left;
  margin-top: 0;
}
</style>
