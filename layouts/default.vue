<template>
  <div v-if="$store.state.auth.authInited">
    <div class="toolbar-top container">
      <chatbot />
      <account v-if="!$store.getters['auth/signedInState']" />
      <energy-level v-if="$store.getters['auth/signedInState'] && $store.state.track.viewState !== trackViewStates.CREATION.FIRST" />
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
import { trackViewStates } from '~/helpers/trackHelpers'
import intro from '~/components/intro'
import chatbot from '~/components/chatbot'
import account from '~/components/account'
import energyLevel from '~/components/trackComponents/energyLevel'

export default {
  components: {
    chatbot,
    intro,
    account,
    energyLevel
  },

  data () {
    return {
      trackViewStates
    }
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
