<template>
  <div class="idea-list-container">
    <button class="button-link button-link--primary add-own">
      + idee toevoegen
    </button>
    <h4>Ideeen voor {{ category }}</h4>
    <transition-group
      tag="ul"
      name="fade-out-in"
      class="list-unstyled idea-list"
    >
      <li
        v-for="item in items[category]"
        :key="item"
        class="idea-list__item"
        @click="choose(item)"
      >
        <div>
          <span class="idea-list__title">
            {{ item }}
          </span>
          <div class="idea-list__meta">
            <span>
              <img src="~/assets/img/icon-love.svg" alt="">
              60x gebruikt
            </span>
            <span>
              <img src="~/assets/img/icon-user.svg" alt="">
              Toegevoegd door Gerrit
            </span>
          </div>
        </div>
        <div class="idea-list__action" :class="{ 'is-chosen' : chosen === item }">
          <button v-if="chosen !== item" class="button button--primary button--sm">
            toevoegen
          </button>
          <button v-if="chosen === item" class="button button--secondary button--sm">
            toegevoegd
          </button>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      items: {
        Beweging: [
          'Balletje hooghouden',
          'Hinkelen',
          'Ninja wandeling'
        ],
        Creatief: [
          'Post-it collage',
          'skribbl.io (online pictionary)',
          'Teken een collega na'
        ],
        Ontspanning: [
          'Puzzelen',
          'Rondje lopen',
          'Online Solitaire'
        ]
      },
      chosen: null
    }
  },

  // watch: {
  //   category (val) {
  //     // if category is changed, empty chosen val
  //     if (val) {
  //       this.chosen = null
  //     }
  //   }
  // },

  methods: {
    choose (item) {
      if (this.chosen === item) {
        this.chosen = ''
      } else {
        this.chosen = item
      }

      this.$emit('chosen', this.chosen)
    }
  }
}
</script>

<style lang="scss">
.idea-list {
  &__item {
      border-bottom: 1px solid white;
      padding: 10px 10px 10px 40px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      &:last-child { border: none; }

      &:hover {
        .idea-list__action {
          opacity: 1;
          transform: translate(0px, 0);
        }
      }
  }

  &__action {
    padding-right: rem(10px);
    transition: all .2s;
    opacity: 0;
    transform: translate(10px, 0);

    &.is-chosen {
      opacity: 1;
      transform: translate(0px, 0);
    }
  }

  &__meta {
    color: #828282;
    font-weight: 600;
    display: flex;
    margin-top: rem(3px);

    span {
      display: flex;
      margin-right: rem(10px);
    }

    img {
      margin-right: rem(3px);
    }
  }
}

.fade-out-in-enter-active,
.fade-out-in-leave-active {
  transition: opacity .5s;
}

.fade-out-in-enter-active {
  transition-delay: .1s;
}

.fade-out-in-leave-active {
  display: none;
}

.fade-out-in-enter,
.fade-out-in-leave-to {
  opacity: 0;
}

.add-own {
  margin: -3px 20px 0;
  padding: 0;
  float: right;
}
</style>
