<template>
  <div>
    <span
      v-if="$store.state.auth.authed"
    >
      Logged in as: <strong>{{ $store.state.auth.user }}</strong>
    </span>
    <button
      v-if="!$store.state.auth.authed"
      class="button button--primary"
      @click="signIn()"
    >
      login
    </button>
    <button
      v-if="$store.state.auth.authed"
      class="button button--primary"
      @click="signOut()"
    >
      logout
    </button>

    <button @click="getCalendarItems()">
      get items
    </button>

    <div v-if="$store.state.auth.authed && items" class="item-container">
      <ul>
        <li
          v-for="item in items"
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
    </div>
  </div>
</template>

<script>
import { apiInstance } from '~/store/auth'

export default {
  data () {
    return {
      items: null
    }
  },

  mounted () {
    // this.getCalendarItems()
    // apiInstance.load('client:auth2', this.initCalendar)
  },

  methods: {
    signIn () {
      this.$store.dispatch('auth/handleAuth')
    },

    signOut () {
      this.$store.dispatch('auth/handleSignout')
    },

    initCalendar () {
      // const vm = this
      // return vm.api.client.init({
      //   apiKey: 'AIzaSyAPykd0raJFpDk-42TLcTMHWTWh-k_-Itc',
      //   clientId: '443423667490-ajenbs6802otm1s605v9c4l6sc8vs8dh.apps.googleusercontent.com',
      //   discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      //   scope: 'https://www.googleapis.com/auth/calendar'
      // }).then((e) => {
      //   // Listen for sign-in state changes.
      //   return vm.api.auth2.getAuthInstance().isSignedIn.listen(vm.isAuthed)
      // }).catch((error) => {
      //   console.log('Api client not inited', error)
      // })
    },

    getCalendarItems () {
      const vm = this

      console.log(apiInstance.client, this.$store.state.auth.clientInited)

      apiInstance.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      }).then((response) => {
        vm.items = response.result.items
        console.log('jeuuuj gotten items!', vm.items)
      }).catch((error) => {
        console.log('no calendar items because', error)
      })
    }
  }
}
</script>
