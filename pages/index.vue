<template>
  <div class="app-container container">
    <intro v-if="!$store.state.auth.authed" />
    <div v-if="$store.state.auth.authed">
      <h2>Signed in as {{ $store.state.auth.user }}</h2>
      <button
        class="button button--primary"
        @click="signOut()"
      >
        logout
      </button>

      <section>
        <br>
        <br>
        <h3>Your calendaritems</h3>
        <ul>
          <li
            v-for="item in calendarItems"
            :key="item.id"
          >
            <a
              :href="item.htmlLink"
              target="_blank"
            >
              {{ item.summary }}
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import intro from '~/components/intro'
import { apiInstance } from '~/store/auth'

export default {
  components: {
    intro
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
      },
      calendarItems: null
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
        this.getCalendarItems()
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
      this.getCalendarItems()
    }
  },

  methods: {
    signOut () {
      this.$store.dispatch('auth/handleSignout')
    },

    capitalizeFirstLetter (string) {
      if (!string.length) { return '' }
      return string.charAt(0).toUpperCase() + string.slice(1)
    },

    async getCalendarItems () {
      try {
        const calendarItems = await apiInstance.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime'
        })

        this.calendarItems = calendarItems.result.items
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
