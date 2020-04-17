<template>
  <div>
    <button v-if="!isAuthed" @click="handleAuthClick">
      Sign In
    </button>
    <button v-if="isAuthed" @click="handleSignoutClick">
      Sign Out
    </button>
  </div>
</template>

<script>
import { GoogleAuth } from '~/plugins/gapi'

export default {
  data () {
    return {
      isAuthed: false,
      auth: new GoogleAuth()
    }
  },

  mounted () {
    this.isAuthed = this.auth.isAuthed
  },

  methods: {
    handleAuthClick () {
      this.auth.handleAuthClick().then((e) => {
        console.log(e)
        this.isAuthed = true
      })
    },

    handleSignoutClick () {
      this.auth.handleSignoutClick().then((e) => {
        console.log(e)
      })
    }
  }
}
</script>
