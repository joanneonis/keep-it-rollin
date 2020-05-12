<template>
  <div class="account">
    <template v-if="!$store.getters['auth/signedInState']">
      <span class="account__label">Heb je al een account?</span>
      <button
        class="button button--primary button--sm"
        @click="signIn()"
      >
        login
      </button>
    </template>

    <template
      v-if="$store.getters['auth/signedInState']"
    >
      <button class="button button--primary" @click="signOut()">
        Uitloggen
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
