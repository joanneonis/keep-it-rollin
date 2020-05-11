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
        @mouseover="handleHover(true, item)"
        @mouseleave="handleHover(false, item)"
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
        <div
          class="idea-list__action"
          :class="{ 'is-chosen' : chosen === item }"
        >
          <button v-if="chosen !== item" class="button button--primary button--sm">
            toevoegen
          </button>
          <button v-if="hover === switching || (chosen === item && hover !== item)" class="button button--secondary button--sm">
            toegevoegd
          </button>
          <button v-if="hover !== switching && (chosen === item && hover === item)" class="button button--danger button--sm">
            verwijderen
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
      chosen: null,
      hover: null,
      switching: null
    }
  },

  watch: {
    category (val) {
      // if category is changed, empty chosen val
      if (val) {
        this.chosen = null
        this.switching = null
      }
    }
  },

  methods: {
    choose (item) {
      this.switching = item
      this.hover = item

      if (this.chosen === item) {
        this.chosen = null
        this.switching = null
      } else {
        this.chosen = item
      }

      this.$emit('chosen', this.chosen)
    },

    handleHover (over, item) {
      if (over && this.switching !== item) {
        this.hover = item
      } else {
        this.switching = null
        this.hover = null
      }
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
        background-color: rgba(white, .3);

        .idea-list__action {
          transition: all .2s;
          opacity: 1;
          transform: translate(0px, 0);
        }
      }
  }

  &__action {
    padding-right: rem(10px);
    opacity: 0;
    transform: translate(10px, 0);
    max-width: 150px;
    display: flex;

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