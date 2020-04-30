<template>
  <div>
    <div class="app-container container">
      <intro v-if="!$store.state.auth.authed" />
      <!-- <first-item-of-day v-if="!$store.state.track.activeParts || $store.state.track.activeParts.length === 0" /> -->
      <create-task v-if="$store.state.track.viewState === trackViewStates.CREATION.TASK" />
      <create-booster v-if="$store.state.track.viewState === trackViewStates.CREATION.BOOSTER" />
    </div>
    <track-overview v-if="$store.state.track.trackInited" />
    <div class="app-footer">
      <div class="container">
        <track-footer-actions v-if="$store.state.track.viewState === trackViewStates.OVERVIEW" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { trackViewStates } from '~/helpers/trackHelpers'
import intro from '~/components/intro'
import firstItemOfDay from '~/components/trackCreation/firstItemOfDay' // TODO dynamic import with inputcards
import trackOverview from '~/components/trackComponents/trackOverview'
import trackFooterActions from '~/components/trackComponents/trackFooterActions'
import createTask from '~/components/trackCreation/createTask'
import createBooster from '~/components/trackCreation/createBooster'

export default {
  components: {
    intro,
    trackOverview,
    // eslint-disable-next-line vue/no-unused-components
    firstItemOfDay, // !TODO set back
    trackFooterActions,
    createTask,
    createBooster
  },

  data () {
    return {
      trackViewStates,
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

<style lang="scss" scoped>
.app-container {
  position: relative;
  z-index: 10;
}

.app-footer {
  position: absolute;
  bottom: 0;
  padding: 0 0 rem(30px);
  width: 100%;
}
</style>
