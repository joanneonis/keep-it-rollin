<template>
  <div class="app-container container">
    <intro v-if="!$store.state.auth.authed" />
    <account />
    <div v-if="$store.state.auth.authed">
      <h2>Signed in as {{ $store.state.auth.user }}</h2>
      <button
        class="button button--primary"
        @click="signOut()"
      >
        logout
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import intro from '~/components/intro'
import account from '~/components/account'

export default {
  components: {
    intro,
    account
  },

  data () {
    return {
      welcomeMessage: {
        storyId: 3,
        messages: [
          `Hallo ${this.capitalizeFirstLetter(this.$store.state.auth.user)}`
        ],
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
      console.log('signed in?', newValue, oldValue)
      if (newValue) {
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
      this.$store.commit('chatbot/setActiveMessages', this.welcomeMessage)
    }
  },

  methods: {
    signOut () {
      this.$store.dispatch('auth/handleSignout')
    },

    capitalizeFirstLetter (string) {
      if (!string.length) { return '' }
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>

<style lang="scss">
.chatbot-messages {
  display: none;
}
</style>
