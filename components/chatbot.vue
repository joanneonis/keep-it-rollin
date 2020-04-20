<template>
  <div class="chatbot container">
    <figure class="chatbot-icon">
      <img src="~/assets/img/chatbot-icon.svg" alt="Bobby">
    </figure>
    <div
      v-if="active.messages"
      class="chatbot-messages is--animating"
    >
      <ul
        :style="{'--item-count': active.messages.length }"
        class="list-unstyled chatbot-messages__list"
      >
        <li
          v-for="(message, i) in active.messages"
          :key="i"
          class="chatbot-messages__list__item chatbot-text-message"
          :class="{ 'skip-animation' : skipDelay }"
          :style="{'--item-index': i, '--item-delay': messageDelay(active.messages, i) }"
          v-html="$md.render(message)"
        />
        <li
          class="chatbot-messages__list__item chatbot-actions"
          :style="{'--item-index': active.messages.length + 1, '--item-delay': actionDelay(active.messages.length) }"
        >
          <button
            v-for="(action, i) in active.actions"
            :key="i"
            class="button button--sm"
            :class="action.type"
            @click="bindScope(action)"
          >
            {{ action.text }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      skipDelay: false,
      active: {
        messages: null,
        actions: null
      }
    }
  },

  mounted () {
    this.active = {
      messages: this.initMessages,
      actions: this.initActions
    }

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        if (!this.skipDelay) { console.log('skipping messages') }
        this.skipDelay = true
      }
    })
  },

  methods: {
    messageDelay (messages, i) {
      if (this.skipDelay) {
        if (i !== messages.length) { return i * 0.2 }
      }

      const message = i > 0 ? messages[i - 1] : messages[i]

      if (message.length < 20) {
        return i
      } else if (message.length < 100) {
        return i + 0.2
      } else if (message.length < 150) {
        return i + 0.5
      }

      return i + 0.8
    },

    actionDelay (messagesLength) {
      if (this.skipDelay) { return messagesLength * 0.2 + 0.2 }
      return messagesLength + 0.5
    },

    nextScene () {
      this.activeItems.messages = this.connectCalendarMessages
      this.activeItems.actions = this.connectCalendarActions
    },

    bindScope (inputAction) {
      console.log(inputAction)
      // inputAction.action.call(this)
    }
  }
}
</script>

<style lang="scss">
$chatbot-message-icon-size: 10px;
$chatbot-icon-size: 80px;

.chatbot-icon {
  border-radius: 100px;
  box-shadow: 1px 5px 16px 0 rgba(28,43,73,0.03);

  img {
    width: $chatbot-icon-size;
  }
}

.chatbot {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 20px;
  align-items: flex-start;
}

.chatbot-messages {
  width: calc(100% - #{$chatbot-icon-size});
}

@keyframes fadeUp {
  from { transform: translate(0, 20px); opacity: 0; }
  to { transform: translate(0, 0); opacity: 1; }
}

.chatbot-messages__list {
  padding: 20px;
  display: flex;
  flex-flow: column;
  align-items: flex-start;

  .is--animating &__item {
    transform: translate(0, 20px);
    opacity: 0;
    margin-bottom: rem(7px);
    animation: fadeUp .3s;
    animation-delay: calc(1s * var(--item-delay));
    animation-fill-mode: forwards;
  }
}

.chatbot-text-message {
  background: #FFFFFF;
  box-shadow: 1px 5px 16px 0 rgba(28,43,73,0.03);
  border-radius: 22px;
  padding: 10px 20px;
  position: relative;
  display: inline-block;
  max-width: 300px;
  color: theme-color(primary-dark);

  *:last-child {
    margin-bottom: 0;
  }

  &:after {
    content: '';
    position: absolute;
    background: white;
    transform: rotate(45deg);
    width: $chatbot-message-icon-size;
    height: $chatbot-message-icon-size;
    left: -4px;
    top: 18px;
  }
}

.chatbot-actions {
  margin-top: 7px;
}
</style>
