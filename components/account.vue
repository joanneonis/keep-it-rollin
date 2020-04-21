<template>
  <div class="account">
    <template v-if="!$store.state.auth.authed">
      <span class="account__label">Heb je al een account?</span>
      <button
        class="button button--primary button--sm"
        @click="signIn()"
      >
        login
      </button>
    </template>

    <template
      v-if="$store.state.auth.authed"
    >
      <button
        v-if="$store.state.auth.authed"
        @click="signOut()"
      >
        Uitloggen <!-- Instellingen -->
      </button>
    </template>
  </div>
</template>

<script>
export default {
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

<style lang="scss">
.account {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 40px;

  &__label {
    display: inline-block;
    margin-right: rem(15px);
  }
}
</style>
