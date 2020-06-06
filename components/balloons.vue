<template>
  <div class="balloons">
    <img src="~/assets/img/balloons/balloon-0.png">
    <img src="~/assets/img/balloons/balloon-1.png">
    <img src="~/assets/img/balloons/balloon-2.png">
    <img src="~/assets/img/balloons/balloon-3.png">
    <img src="~/assets/img/balloons/balloon-0.png">
    <img src="~/assets/img/balloons/balloon-1.png">
    <img src="~/assets/img/balloons/balloon-2.png">
    <img src="~/assets/img/balloons/balloon-3.png">
  </div>
</template>

<script>
export default {
  mounted () {
    const that = this
    setTimeout(function () {
      that.$store.commit('track/setControls', 'play')
    }, 3500)
  }
}
</script>

<style lang="scss" scoped>
@keyframes float {
  from {
    transform: translate(0, 110vh);
  }
  to {
    transform: translate(0, -40vw);
  }
}

.balloons {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: 999;
  pointer-events: none;

  img {
    transform: translate(0, 10vh);
    position: absolute;
    width: 8vw;
    animation: float 6s;

    &:nth-child(1) {
      transform: translate(0, 110vh);
      width: 14vw;
      filter: blur(1rem);
      right: 10vw;
      animation-delay: 0;
      animation-duration: 5s;
      z-index: 1;
    }

    &:nth-child(2) {
      transform: translate(0, 110vh);
      width: 16vw;
      filter: blur(.8rem);
      right: 5vw;
      animation-delay: 1.2s;
      animation-duration: 5s;
      z-index: 1;
    }

    &:nth-child(2) {
      transform: translate(0, 110vh);
      left: 30vw;
      animation-delay: 0;
    }

    &:nth-child(3) {
      transform: translate(0, 110vh);
      left: 40vw;
      animation-delay: .9s;
    }

    &:nth-child(4) {
      transform: translate(0, 110vh);
      right: 30vw;
      animation-delay: .4s;
      width: 16vw;
      filter: blur(1rem);
      animation-duration: 5s;
      z-index: 1;
    }

    &:nth-child(5) {
      transform: translate(0, 110vh);
      right: 15vw;
      animation-delay: 0;
    }

    &:nth-child(6) {
      transform: translate(0, 110vh);
      left: 10vw;
      animation-delay: .5s;
      width: 16vw;
      filter: blur(.5rem);
      animation-duration: 5s;
      z-index: 1;
    }

    &:nth-child(7) {
      transform: translate(0, 110vh);
      right: 20vw;
      animation-delay: .9s;
    }

    &:nth-child(8) {
      transform: translate(0, 110vh);
      left: 20vw;
      animation-delay: .4s;
    }
  }
}
</style>
