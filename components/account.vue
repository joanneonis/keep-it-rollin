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
  </div>
</template>

<script>
export default {
  data () {
    return {
      //
    }
  },

  methods: {
    signIn () {
      this.$store.dispatch('auth/handleAuth')
    },

    signOut () {
      this.$store.dispatch('auth/handleSignout')
    }
  }
}
</script>
