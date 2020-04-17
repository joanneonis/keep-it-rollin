<template>
  <div>
    <div class="authentification">
      <h1>
        {{ isAuthed }}
      </h1>
      <pre>
        {{ user }}
      </pre>
      <h2>VueJS + Google Calendar</h2>
      Authentification
      <button v-if="!isAuthed" @click="handleAuthClick">
        Sign In
      </button>
      <button v-if="isAuthed" @click="handleSignoutClick">
        Sign Out
      </button>
    </div>
    <hr>
    <button v-if="isAuthed" @click="getData">
      Get Data
    </button>
    <div v-if="isAuthed && items" class="item-container">
      <!-- <pre>
        {{ items }}
      </pre> -->

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
import { gapi, loadAuth2WithProps } from 'gapi-script'

const credentiels = {
  apiKey: process.env.apiKey,
  client_id: process.env.clientid,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar'
}

export default {
  data () {
    return {
      items: undefined,
      api: undefined,
      isAuthed: false,
      auth2: undefined,
      user: undefined
    }
  },

  async created () {
    this.api = gapi
    await gapi.load('client:auth2', this.initClient)

    this.auth2 = await loadAuth2WithProps(credentiels)
    this.isAuthed = this.auth2.isSignedIn.get()

    if (this.isAuthed) {
      this.user = this.auth2.currentUser.get()
      // this.$store.commit('auth/setAuthState', true)
      // this.$store.commit('auth/setUserState', this.user)
    } else {
      this.user = undefined
      // this.$store.commit('auth/setAuthState', false)
    }
  },

  methods: {
    initClient () {
      const vm = this

      return vm.api.client.init(credentiels).then((e) => {
        // Listen for sign-in state changes.
        return vm.api.auth2.getAuthInstance().isSignedIn.listen(vm.isAuthed)
      }).catch((error) => {
        console.log('Api client not inited', error)
      })
    },

    /*
     *  Sign in the user upon button click.
     */
    handleAuthClick (event) {
      const auth2 = gapi.auth2.getAuthInstance()

      auth2.signIn().then(() => {
        this.user = this.auth2.currentUser.get()
        this.isAuthed = true
        // this.$store.commit('auth/setAuthState', true)
        // this.$store.commit('auth/setUserState', this.user)
      })
    },

    /*
     *  Sign out the user upon button click.
     */
    handleSignoutClick (event) {
      const auth2 = gapi.auth2.getAuthInstance()

      auth2.signOut().then(() => {
        this.isAuthed = false
        // this.$store.commit('auth/setAuthState', false)
        // this.$store.commit('auth/setUserState', {})
      })
    },

    /*
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    getData () {
      this.api.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      }).then((response) => {
        this.items = response.result.items
        console.log('jeuuuj gotten items!', this.items)
      }).catch((error) => {
        console.log('no calendar items because', error)
      })
    }
  }
}
</script>
