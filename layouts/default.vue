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
import { mapState } from 'vuex'
import intro from '~/components/intro'
import chatbot from '~/components/chatbot'
import account from '~/components/account'

export default {
  components: {
    chatbot,
    account,
    intro
  },

  data () {
    return {
      welcomeMessage: {
        storyId: 3,
        messages: null,
        actions: [],
        timer: 2000
      }
    }
  },

  computed: {
    ...mapState({
      authedState (state) {
        return state.auth.authed
      }
    })
  },

  watch: {
    authedState (newValue, oldValue) {
      if (newValue !== oldValue && newValue) {
        this.$store.commit('chatbot/setActiveMessages', this.welcomeMessage)
      }
    }
  },

  async fetch ({ store }) {
    await store.dispatch('auth/initClient')
    await store.dispatch('auth/checkLogin')
  },

  mounted () {
    if (this.$store.state.auth.authed) {
      this.welcomeMessage.messages = [
        `Hallo ${this.capitalizeFirstLetter(this.$store.state.auth.user)}`
      ]
      this.$store.commit('chatbot/setActiveMessages', this.welcomeMessage)
    }
  },

  methods: {
    signOut () {
      this.$store.dispatch('auth/handleSignout')
    },

    capitalizeFirstLetter (string) {
      if (!string) { return '' }
      return string.charAt(0).toUpperCase() + string.slice(1)
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

.body-container {
  height: 100vh;
}
</style>
