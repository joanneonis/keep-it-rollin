<template>
  <div>
    <div class="toolbar-top container">
      <chatbot />
    </div>
    <div class="body-container">
      <nuxt />
    </div>
  </div>
</template>
<script>
import chatbot from '~/components/chatbot'

export default {
  components: {
    chatbot
  },

  methods: {
    playIntro () {
      // if not authed
      // and no localstorage
    }
  }
}
</script>

<style lang="scss">
.body-container {
  padding-top: 16vh;
}
</style>
