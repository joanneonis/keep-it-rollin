<template>
  <div class="container">
    trackparts:
    <pre>
      {{ activeTrackParts }}
    </pre>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeTrackParts: this.$store.state.track.activeParts
    }
  }
}
</script>
