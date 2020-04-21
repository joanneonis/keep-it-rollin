<template>
  <div>
    <div class="toolbar-top container">
      <chatbot />
      <account />
    </div>
    <div class="body-container">
      <nuxt />
    </div>
  </div>
</template>
<script>
import chatbot from '~/components/chatbot'
import account from '~/components/account'

export default {
  components: {
    chatbot,
    account
  },

  methods: {
    playIntro () {
      // if not authed
      // and no localstorage
    }
  }
}
</script>

<style lang="scss">
.toolbar-top.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
</style>
