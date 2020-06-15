<template>
  <div>
    <template v-if="$store.state.auth.authInited">
      <div class="app-container container">
        <intro v-if="!$store.getters['auth/signedInState']" />
        <template v-if="$store.getters['auth/signedInState']">
          <transition name="slide-fade">
            <first-item-of-day v-if="$store.state.track.viewState === trackViewStates.CREATION.FIRST" />
            <create-task v-if="$store.state.track.viewState === trackViewStates.CREATION.TASK" />
            <create-booster v-if="$store.state.track.viewState === trackViewStates.CREATION.BOOSTER" />
          </transition>
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
      <bobby v-if="modalType === 'bobby'" />
      <day-off v-if="modalType === 'dayOff'" />
      <energy-stats v-if="modalType === 'energyStats'" />
      <create-idea v-if="modalType === 'createIdea'" />
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { trackViewStates } from '~/helpers/trackHelpers'
import intro from '~/components/intro'
import firstItemOfDay from '~/components/trackCreation/firstItemOfDay'
import trackOverview from '~/components/trackComponents/trackOverview'
import trackFooterActions from '~/components/trackComponents/trackFooterActions'
import createTask from '~/components/trackCreation/createTask'
import createBooster from '~/components/trackCreation/createBooster'
import balloons from '~/components/balloons'

// modal
import modal from '~/components/modal'
import createIdea from '~/components/modals/createIdea'
import energyStats from '~/components/modals/energyStats'
import dayOff from '~/components/modals/dayOff'
import bobby from '~/components/modals/Bobby'

export default {
  components: {
    intro,
    trackOverview,
    firstItemOfDay,
    trackFooterActions,
    createTask,
    createBooster,
    dayOff,
    balloons,
    modal,
    createIdea,
    energyStats,
    bobby
  },

  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (to.query.dayoff) {
        vm.dayDone = true
        vm.$store.dispatch('day/setDone', true)
      }
    })
  },

  async fetch ({ store }) {
    await store.dispatch('auth/initClient')
    await store.dispatch('auth/checkLogin')
    await store.dispatch('track/getTrack')
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

  computed: {
    ...mapState({
      modalType: state => state.modal.type,
      modalActive: state => state.modal.isActive
    })
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .5s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(60px);
  opacity: 0;
}
</style>
