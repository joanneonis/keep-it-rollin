<template>
  <div class="idea-list-container">
    <button
      v-if="type === 'use'"
      class="button-link button-link--primary add-own"
      @click="triggerModal()"
    >
      + idee toevoegen
    </button>
    <h4 v-if="type === 'use'">
      Ideeen voor {{ category }}
    </h4>
    <div v-if="type !== 'use'" class="filter-bar">
      <h4>
        Boosters
      </h4>
      <ul
        v-if="type !== 'use'"
        class="list-unstyled idea-list-filters"
      >
        <li><span class="meta">Filters</span></li>
        <li
          class="button-link"
          :class="{ 'button-link--secondary' : category !== 'all', 'button-link--primary' : category === 'all' }"
          @click="category = 'all'"
        >
          Alle
        </li>
        <li
          v-for="(cat, key) in categories"
          :key="key"
          class="button-link"
          :class="{ 'button-link--secondary' : category !== cat, 'button-link--primary' : category === cat }"
          @click="category = cat"
        >
          {{ cat }}
        </li>
      </ul>
    </div>
    <transition-group
      tag="ul"
      name="fade-out-in"
      class="list-unstyled idea-list"
    >
      <li
        v-for="item in (category !== 'all' ? items[category] : allItems)"
        :key="`${item}-${category}`"
        class="idea-list__item"
        @click="choose(item)"
        @mouseover="handleHover(true, item)"
        @mouseleave="handleHover(false, item)"
      >
        <div>
          <span class="idea-list__title">
            {{ item }}
          </span>
          <p v-if="type !== 'use'" class="idea-list__description">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat ipsa dolore nobis assumenda, dolorem ab amet fugit, quas, dolor mollitia non laudantium rerum. Qui eveniet blanditiis sed sunt! Praesentium, nobis.
          </p>
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
          v-if="type === 'use'"
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
    },
    type: {
      type: String,
      default: 'use'
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

  computed: {
    categories () {
      return Object.keys(this.items)
    },
    allItems () {
      const allItems = []
      Object.keys(this.items).forEach((key) => {
        allItems.push(...this.items[key])
      })
      return allItems
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
      if (this.type !== 'use') { return }
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
      if (this.type !== 'use') { return }
      if (over && this.switching !== item) {
        this.hover = item
      } else {
        this.switching = null
        this.hover = null
      }
    },

    triggerModal () {
      this.$store.dispatch('modal/setActiveModal', 'createIdea')
    }
  }
}
</script>

<style lang="scss">
.idea-list {
  &__item {
    border-bottom: 1px solid white;
    padding: 10px 10px 10px 40px;
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

  &__title {
    font-weight: 700;
  }

  &__description {
    max-width: 680px;
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

.filter-bar {
    display: flex;
    justify-content: space-between;
    padding: 30px 40px 10px 40px;
}

.idea-list-filters {
  margin: -10px 0;
  align-items: center;
  display: flex;
  justify-content: flex-end;
}
</style>
