<template>
  <div>
    <div class="toolbar-top container">
      <chatbot />
      <!-- <account /> -->
      <energy-level />
    </div>
    <div class="body-container">
      <div
        v-if="!$store.getters['auth/signedInState']"
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
import energyLevel from '~/components/trackComponents/energyLevel'

export default {
  components: {
    chatbot,
    intro,
    // eslint-disable-next-line vue/no-unused-components
    account,
    energyLevel
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
