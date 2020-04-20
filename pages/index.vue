<template>
  <div class="app-container container">
    <h2>Hallo</h2>
    <account />
  </div>
</template>

<script>
import account from '~/components/account'

export default {
  components: {
    account
  },

  async fetch ({ store }) {
    await store.dispatch('auth/checkLogin')
  },

  mounted () {
    //
  }
}
</script>
