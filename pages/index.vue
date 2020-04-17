<template>
  <div class="container">
    <div>
      <!-- <auth-firebase /> -->
      <!-- <account /> -->
      <o-auth />
      <!-- <list-items /> -->
    </div>
  </div>
</template>

<script>
import oAuth from '~/components/oAuth'
// import account from '~/components/account'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    oAuth
    // account
    // authFirebase
    // listItems
  },

  mounted () {
    //
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
