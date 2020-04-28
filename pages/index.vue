<template>
  <div>
    <div class="app-container container">
      <intro v-if="!$store.state.auth.authed" />
      <first-item-of-day v-if="$store.state.track.trackInited && $store.state.track.activeParts.length === 0" />
    </div>
    <track-overview v-if="$store.state.track.trackInited" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import intro from '~/components/intro'
import firstItemOfDay from '~/components/trackCreation/firstItemOfDay' // TODO dynamic import with inputcards
import trackOverview from '~/components/trackOverview'

export default {
  components: {
    intro,
    trackOverview,
    firstItemOfDay
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
    await store.dispatch('track/getTrack')
  },

  mounted () {
    if (this.$store.state.auth.authed) {
      this.welcomeMessage.messages = [
        `Hallo ${this.capitalizeFirstLetter(this.$store.state.auth.userData.displayName)}`
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
