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
    <balloons v-if="dayDone" />
    <modal :open="modalActive" @action="handleModalAction()">
      <dayoff-content v-if="modalType === 'dayOff'" />
      <create-idea v-if="modalType === 'createIdea'" />
      <energy-stats v-if="modalType === 'energyStats'" />
      <bot-modal v-if="modalType === 'botModal'" />
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
import createIdea from '~/components/createIdea'
import energyStats from '~/components/energyStats'
import botModal from '~/components/botModal'

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
    modal,
    createIdea,
    energyStats,
    botModal
  },

  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (to.query.dayoff) {
        vm.dayDone = true
        vm.$store.dispatch('day/setDone', true)
      }
    })
  },

  // watch: {
  //   modalActive (val) {
  //   }
  // },

  computed: {
    ...mapState({
      modalType: state => state.modal.type,
      modalActive: state => state.modal.isActive
    })
  },

  data () {
    return {
      trackViewStates,
      dayDone: false,
      welcomeMessage: {
        storyId: 3,
        messages: null,
        actions: [],
        timer: 2000
      }
    }
  },

  async fetch ({ store }) {
    await store.dispatch('auth/initClient')
    await store.dispatch('auth/checkLogin')
    await store.dispatch('track/getTrack')
  },

  mounted () {
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
    },

    handleModalAction ($event) {
      if ($event === 'closed') {
        this.dayoffModal = false
      }
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
