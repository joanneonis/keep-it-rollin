<template>
  <div>
    <!-- intro -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { staticMessages } from '~/assets/messages/messages'

export default {
  computed: {
    ...mapState({
      storyId: state => state.chatbot.storyId,
      action (state) {
        return state.chatbot.clickedAction
      }
    })
  },

  watch: {
    action (newValue) {
      console.log('action changed', newValue)
      this.introActions(newValue)
    }
  },

  mounted () {
    this.$store.commit('chatbot/setActiveMessages', staticMessages.welcome)
  },

  methods: {
    introActions (action) {
      if (action === 'start') {
        this.$store.commit('chatbot/setActiveMessages', staticMessages.connectCalendar)
      }
      if (action === 'connectCalendar') {
        this.$store.dispatch('auth/handleAuth')
      }
      if (action === 'later') {
        this.done()
      }
    },

    done () {
      this.$store.commit('chatbot/setToIdle')
    }
  },

  beforeDestroy () {
    this.done()
  }
}
</script>
