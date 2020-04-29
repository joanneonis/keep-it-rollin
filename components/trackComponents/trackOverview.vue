<template>
  <div class="container">
    <strong>viewState:</strong> {{ $store.state.track.viewState }}
    <br>
    <strong>trackparts:</strong>
    <pre>
      {{ activeTrackParts }}
    </pre>

    <div
      id="scene-container"
      ref="sceneContainer"
    />
  </div>
</template>

<script>
import { BaseScene } from '~/plugins/three/baseScene'
import { HalfPipe } from '~/plugins/three/parts/tube'

export default {
  data () {
    return {
      activeTrackParts: this.$store.state.track.activeParts,
      baseScene: null,
      halfPipe: null
    }
  },

  async mounted () {
    // create main scene
    this.baseScene = new BaseScene(this.$refs.sceneContainer)

    // create and load halfpipe
    this.halfPipe = new HalfPipe()
    await this.halfPipe.loadModel()
    this.halfPipe.generateExpressionsFolder(this.baseScene.gui)

    // add halfpipe to main scene
    this.baseScene.scene.add(this.halfPipe.scene)
  }
}
</script>

<style lang="scss">
#scene-container {
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px
}

// fix GUI list styles
.dg.ac {
  color: white;
  z-index: 20;
  // right: 30vw;

  li {
    border: none;

    &:before {
      display: none;
    }
  }
}
</style>
