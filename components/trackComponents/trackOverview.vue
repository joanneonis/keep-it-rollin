<template>
  <div class="container">
    <strong>viewState:</strong> {{ $store.state.track.viewState }}
    <br>
    <strong>trackparts:</strong>
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
