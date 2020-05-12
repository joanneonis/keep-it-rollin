<template>
  <div>
    <template v-if="$store.state.auth.authInited">
      <div class="app-container container">
        <intro v-if="!$store.getters['auth/signedInState']" />
        <template v-if="$store.getters['auth/signedInState']">
          <first-item-of-day v-if="$store.state.track.viewState === trackViewStates.CREATION.FIRST" />
          <create-task v-if="$store.state.track.viewState === trackViewStates.CREATION.TASK" />
          <create-booster v-if="$store.state.track.viewState === trackViewStates.CREATION.BOOSTER" />
        </template>
      </div>
      <track-overview v-if="$store.state.track.trackInited && $store.getters['auth/signedInState']" />
      <div class="app-footer">
        <div class="container">
          <track-footer-actions v-if="$store.state.track.viewState === trackViewStates.OVERVIEW && $store.getters['auth/signedInState']" />
        </div>
      </div>
    </template>
    <balloons v-if="dayoffModal" />
    <modal :open="dayoffModal">
      <dayoff-content />
    </modal>
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
import balloons from '~/components/balloons'
import modal from '~/components/modal'
import dayoffContent from '~/components/dayoffContent'

export default {
  components: {
    intro,
    trackOverview,
    firstItemOfDay,
    trackFooterActions,
    createTask,
    createBooster,
    dayoffContent,
    balloons,
    modal
  },

  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (to.query.dayoff) {
        vm.dayoffModal = true
      }
    })
  },

  data () {
    return {
      trackViewStates,
      trackIsDone: false,
      dayoffModal: false,
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
      dayisFinished: state => state.track.dayisFinished
    })
  },

  watch: {
    dayisFinished (val) {
      this.trackIsDone = val
    }
  },

  async fetch ({ store }) {
    await store.dispatch('auth/initClient')
    await store.dispatch('auth/checkLogin')
    await store.dispatch('track/getTrack')
  },

  mounted () {
    this.trackIsDone = this.dayisFinished

    if (this.$store.getters['auth/signedInState'] && this.$store.state.auth.authInited) {
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
