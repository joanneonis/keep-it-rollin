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
      this.$emit('action', 'cancelled')
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
  box-shadow: 0 2px 4px 0 rgba(10,13,33,0.06), 0 1px 23px 0 rgba(20,23,52,0.02);

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
