<template>
  <div
    class="modal-container"
    :class="{ 'is-open' : localOpen, 'has-delay': $store.state.modal.type === 'dayOff' }"
  >
    <div v-if="localOpen" class="modal-background" @click="close()" />
    <transition name="modal-up">
      <div v-if="localOpen" class="modal">
        <img
          class="modal__close"
          src="~/assets/img/icon-close.svg"
          alt="sluiten"
          @click="close()"
        >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      localOpen: false
    }
  },

  watch: {
    open (val) {
      this.localOpen = val
    }
  },

  head () {
    return {
      htmlAttrs: {
        class: 'disable-scroll'
      }
    }
  },

  methods: {
    close () {
      this.$store.commit('track/setCheckedDayFinishedModal') // todo move to handler outside modal
      this.$store.dispatch('modal/closeModal')
      this.localOpen = false
      this.$emit('action', 'closed')
    }
  }
}
</script>

<style lang="scss">
@keyframes backgroundBlur {
  0% { opacity: 0; pointer-events: none; }
  100% { opacity: 0.9; pointer-events: auto; }
}

.modal-container {
  pointer-events: none;

  &.is-open { pointer-events: auto; }
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  background: gray-color(100);
  z-index: 998;
  animation: backgroundBlur 1s;
  animation-fill-mode: forwards;
  pointer-events: none;

  .has-delay & {
    animation: backgroundBlur 1s .5s;
    animation-fill-mode: forwards;
  }
}

.modal {
  position: fixed;
  top: 10vh;
  left: 0;
  right: 0;
  margin: auto;
  background: white;
  z-index: 1000;
  padding: rem(60px) rem(20px) rem(50px);
  max-width: rem(650px);
  text-align: center;
  border-radius: rem(10px);

  &__close {
    position: absolute;
    top: 30px;
    right: 30px;
    max-width: 22px;
    cursor: pointer;
  }
}

.modal-up-enter-active,
.modal-up-leave-active {
  transition: all .5s;
}
.modal-up-enter,
.modal-up-leave-to {
  transform: translate(0, 10vh);
  opacity: 0;
}

.has-delay .modal-up-enter-active {
  transition-delay: 2.5s;
}
</style>
