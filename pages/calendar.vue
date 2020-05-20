<template>
  <div class="container">
    <br>
    <h2>Kalender testpagina</h2>
    <calendar-items />
  </div>
</template>

<script>
import calendarItems from '~/components/calendarItems'

export default {
  components: {
    calendarItems
  },

  async fetch ({ store }) {
    await store.dispatch('auth/initClient')
    await store.dispatch('auth/checkLogin')
    await store.dispatch('track/getTrack')
  }
}
</script>
