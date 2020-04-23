<template>
  <div class="app-container container">
    <intro v-if="!$store.state.auth.authed" />
    <calendar-items v-if="$store.state.auth.authed" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import intro from '~/components/intro'
import calendarItems from '~/components/calendarItems'

export default {
  components: {
    intro,
    // eslint-disable-next-line vue/no-unused-components
    calendarItems
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
