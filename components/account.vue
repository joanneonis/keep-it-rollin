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
  },

  methods: {
    signIn () {
      this.$store.dispatch('auth/handleAuth')
    },

    signOut () {
      this.$store.dispatch('auth/handleSignout')
    },

    getCalendarItems () {
      // const vm = this

      console.log(apiInstance.client.calendar, this.$store.state.auth.clientInited)

      // apiInstance.client.calendar.events.list({
      //   calendarId: 'primary',
      //   timeMin: (new Date()).toISOString(),
      //   showDeleted: false,
      //   singleEvents: true,
      //   maxResults: 10,
      //   orderBy: 'startTime'
      // }).then((response) => {
      //   vm.items = response.result.items
      //   console.log('jeuuuj gotten items!', vm.items)
      // }).catch((error) => {
      //   console.log('no calendar items because', error)
      // })
    }
  }
}
</script>
