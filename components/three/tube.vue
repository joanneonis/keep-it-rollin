<template>
  <div id="scene-container" style="position: absolute; left:0px; top:0px" ref="sceneContainer" />
</template>

<script>
import { Scene } from '~/plugins/threejs/scene'
import { HalfPipe } from '~/plugins/threejs/halfPipe'

// TODO delete stuff on destroy

export default {
  data () {
    return {
      scene: null
    }
  },

  mounted () {
    this.scene = new Scene(this.$refs.sceneContainer)
    this.HalfPipe = new HalfPipe(this.scene)
  }
}
</script>

<style>
#scene-container {
  height: 100vh;
}

.dg.ac {
  color: white;
  z-index: 20;
  right: 30vw;
}

.dg li {
    border: none;
}

.dg li:before {
    display: none;
}
</style>
