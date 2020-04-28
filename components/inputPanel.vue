<template>
  <section class="input-panel">
    <button
      v-if="hasClose"
      @click="close()"
      class="button-link button-link--primary input-panel__close"
    >
      annuleren
    </button>
    <div class="input-panel__header">
      <h2>{{ title }}</h2>
      <span>{{ description }}</span>
    </div>
    <div class="input-panel__body">
      <slot name="body" />
    </div>
    <div class="input-panel__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<script>
import { trackViewStates } from '~/helpers/trackHelpers'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    hasClose: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    close () {
      this.$store.commit('track/viewState', trackViewStates.OVERVIEW)
    }
  }
}
</script>

<style lang="scss">
.input-panel {
  background: #fff;
  border-radius: rem(11px);
  float: right;
  min-width: rem(400px);
  position: relative;

  &__header {
    padding: rem(40px) rem(30px) rem(30px);

    span {
      max-width: 360px;
      display: inline-block;
    }
  }

  &__close {
    position: absolute;
    right: rem(10px);
    top: rem(10px);
  }

  &__footer {
    display: flex;
    padding: 0 30px 40px;
    justify-content: flex-end;
  }

  &__large {
    color: #fff;
    border-radius: rem(5px);
    margin: 0 -20px;

    &--primary {
      background-color: theme-color(primary);
      padding: rem(30px);
    }

    &--gray {
      padding: rem(30px);
      background-color: gray-color(150)
    }
  }
}
</style>
