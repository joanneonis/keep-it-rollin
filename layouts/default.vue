<template>
  <div>
    <div class="toolbar-top container">
      <chatbot />
      <account />
    </div>
    <div class="body-container">
      <div
        v-if="!$store.state.auth.authed"
        class="app-container container"
      >
        <intro />
      </div>
      <nuxt v-else />
    </div>
  </div>
</template>
<script>
import intro from '~/components/intro'
import chatbot from '~/components/chatbot'
import account from '~/components/account'

export default {
  components: {
    chatbot,
    account,
    intro
  }
}
</script>

<style lang="scss">
.toolbar-top {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
}
</style>
